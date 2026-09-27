// Payments domain service (Mercado Pago Checkout Pro).
//
// The module is split in two layers:
//   - PURE builders/mappers with no I/O, unit-tested in
//     `tests/payments.service.test.mjs` (no network, no database).
//   - I/O orchestration (Supabase + the Mercado Pago SDK) used by the
//     controller. The SDK client is created lazily so importing this module
//     never requires `MP_ACCESS_TOKEN` (tests import it with a dummy value).
import MercadoPagoConfig, { Payment, Preference } from 'mercadopago';
import { BACKEND_URL, FRONTEND_URL, MP_ACCESS_TOKEN } from '../config/env.js';
import { supabase } from '../lib/supabaseClient.js';
import { badRequest, notFound, serviceUnavailable } from '../utils/envelope.js';

// The `reservations_payment_status_check` constraint (migration 5.1) only
// accepts these two values, so the MP mapping can never emit anything else.
const PAYMENT_STATUS = {
  APPROVED: 'completado',
  PENDING: 'pendiente',
};

// ---------------------------------------------------------------------------
// Pure layer — no I/O, deterministic, unit-tested.
// ---------------------------------------------------------------------------

/**
 * Map a Mercado Pago payment status onto the local payment columns.
 * Only `approved` counts as settled; every other MP status (pending,
 * in_process, rejected, cancelled, refunded, charged_back, ...) stays pending.
 *
 * @param {string} mpStatus - `payment.status` returned by Mercado Pago.
 * @returns {{ payment_status: string, isApproved: boolean }}
 */
export function mapPaymentStatus(mpStatus) {
  const isApproved = String(mpStatus || '').toLowerCase() === 'approved';
  return {
    payment_status: isApproved ? PAYMENT_STATUS.APPROVED : PAYMENT_STATUS.PENDING,
    isApproved,
  };
}

/**
 * Build the Checkout Pro preference body for a reservation.
 *
 * The item splits the stored total as `unit_price × nights` so the MP receipt
 * shows the nightly rate; the product of the two equals `total_price`.
 *
 * @param {object} reservation - A `reservations` row.
 * @param {object} [options]
 * @param {string} [options.roomName] - Display name of the room.
 * @param {string} [options.frontendUrl] - Public frontend origin.
 * @param {string} [options.notificationUrl] - Public webhook URL (optional).
 * @returns {object} Mercado Pago preference body.
 */
export function buildPreferencePayload(
  reservation,
  { roomName, frontendUrl = FRONTEND_URL, notificationUrl } = {}
) {
  const reservationId = reservation?.reservation_id;
  const nights = Number(reservation?.nights);
  const total = Number(reservation?.total_price);

  if (reservationId === undefined || reservationId === null) {
    throw badRequest('La reserva no tiene identificador');
  }
  if (!Number.isFinite(nights) || nights < 1) {
    throw badRequest('La reserva no tiene una cantidad de noches válida');
  }
  if (!Number.isFinite(total) || total <= 0) {
    throw badRequest('La reserva no tiene un total válido');
  }

  const base = String(frontendUrl).replace(/\/+$/, '');
  const successUrl = `${base}/pago-exitoso`;

  const body = {
    items: [
      {
        id: String(reservationId),
        title: roomName || 'Habitación Hotel Hilton',
        description: `Reserva por ${nights} noche(s)`,
        quantity: nights,
        unit_price: Number((total / nights).toFixed(2)),
        currency_id: 'ARS',
      },
    ],
    external_reference: String(reservationId),
    back_urls: {
      success: successUrl,
      failure: successUrl,
      pending: successUrl,
    },
    auto_return: 'approved',
  };

  if (notificationUrl) body.notification_url = notificationUrl;

  return body;
}

/**
 * Extract the payment id from any notification shape Mercado Pago uses:
 * webhooks v2 (`data.id`), the legacy `id` field, or the query string.
 * Returns `null` when no usable id is present — the caller must ignore it.
 *
 * @param {{ body?: object, query?: object }} notification
 * @returns {string|null}
 */
export function extractPaymentId({ body, query } = {}) {
  const candidates = [body?.data?.id, body?.id, query?.['data.id'], query?.id];

  for (const candidate of candidates) {
    if (
      candidate !== undefined &&
      candidate !== null &&
      String(candidate).trim() !== ''
    ) {
      return String(candidate);
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// I/O layer.
// ---------------------------------------------------------------------------

const RESERVATION_WITH_ROOM =
  '*, rooms(name, category, images, capacity)';

let mpConfig = null;

function getClientConfig() {
  if (!MP_ACCESS_TOKEN) {
    throw serviceUnavailable(
      'Mercado Pago no está configurado (falta MP_ACCESS_TOKEN)'
    );
  }
  if (!mpConfig) {
    mpConfig = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
  }
  return mpConfig;
}

async function fetchReservation(reservationId) {
  const { data, error } = await supabase
    .from('reservations')
    .select(RESERVATION_WITH_ROOM)
    .eq('reservation_id', reservationId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw notFound('Reserva no encontrada');
  return data;
}

function decorateReservation(reservation) {
  const room = reservation.rooms || {};
  const images = Array.isArray(room.images) ? room.images : [];

  return {
    ...reservation,
    room_name: room.name || 'Habitación Hotel Hilton',
    room_category: room.category || null,
    image: images[0] || null,
    guests: room.capacity ?? null,
  };
}

/**
 * Create a Checkout Pro preference for a reservation and persist its id.
 * Returns the `init_point` the client must redirect the buyer to.
 */
export async function createPreference(reservationId, { notificationUrl } = {}) {
  const reservation = await fetchReservation(reservationId);

  const body = buildPreferencePayload(reservation, {
    roomName: reservation.rooms?.name,
    notificationUrl,
  });

  const preference = new Preference(getClientConfig());
  const created = await preference.create({ body });
  const preferenceId = created?.id ? String(created.id) : null;

  if (preferenceId) {
    const { error } = await supabase
      .from('reservations')
      .update({ mp_preference_id: preferenceId })
      .eq('reservation_id', reservation.reservation_id);
    if (error) throw error;
  }

  return {
    reservation_id: reservation.reservation_id,
    preference_id: preferenceId,
    init_point: created?.init_point || created?.sandbox_init_point || null,
  };
}

/** Read endpoint for the success page: the reservation with its payment state. */
export async function getPaymentStatus(reservationId) {
  const reservation = await fetchReservation(reservationId);
  return decorateReservation(reservation);
}

/**
 * Process a Mercado Pago notification.
 *
 * Robust and idempotent by design: every failure path resolves to a handled
 * result instead of throwing, so unknown, malformed or duplicate notifications
 * can never turn into a 500. Re-processing the same notification simply writes
 * the same values again.
 */
export async function processNotification({ body, query } = {}) {
  const paymentId = extractPaymentId({ body, query });
  if (!paymentId) return { handled: false, reason: 'sin payment id' };

  let payment;
  try {
    const client = new Payment(getClientConfig());
    payment = await client.get({ id: paymentId });
  } catch (error) {
    console.error(
      '❌ MP webhook: no se pudo obtener el pago',
      paymentId,
      error?.message || error
    );
    return { handled: false, reason: 'pago no disponible' };
  }

  const reservationId = payment?.external_reference;
  if (reservationId === undefined || reservationId === null) {
    return { handled: false, reason: 'sin external_reference' };
  }

  const { payment_status } = mapPaymentStatus(payment?.status);
  const update = { payment_status };
  const method = payment?.payment_method_id || payment?.payment_type_id;
  if (method) update.payment_method = method;

  try {
    const { data, error } = await supabase
      .from('reservations')
      .update(update)
      .eq('reservation_id', reservationId)
      .select('reservation_id, payment_status, payment_method');

    if (error) throw error;
    if (!data || data.length === 0) {
      return { handled: false, reason: 'reserva inexistente' };
    }

    return {
      handled: true,
      mp_status: payment?.status || null,
      reservation: data[0],
    };
  } catch (error) {
    console.error(
      '❌ MP webhook: no se pudo actualizar la reserva',
      reservationId,
      error?.message || error
    );
    return { handled: false, reason: 'error de persistencia' };
  }
}

/** Resolve the public webhook URL: explicit `BACKEND_URL`, else request origin. */
export function resolveNotificationUrl(req) {
  if (BACKEND_URL) return `${BACKEND_URL}/api/payments/webhook`;

  const host = req?.get?.('host');
  if (!host) return null;
  return `${req.protocol}://${host}/api/payments/webhook`;
}
