// Reservations domain service. Owns the lifecycle state machine, the
// server-side price recalculation and the canonical list contract.
import { supabase } from '../lib/supabaseClient.js';
import { badRequest, notFound } from '../utils/envelope.js';
import { requireFields } from '../utils/validate.js';

const RESERVATION_WITH_ROOM = `
  *,
  rooms (
    name,
    category,
    images,
    capacity
  )
`;

// Lifecycle: pending -> confirmed -> completed, with cancellation allowed from
// any active state and one reactivation path (cancelada -> pendiente).
const ALLOWED_TRANSITIONS = {
  pendiente: ['confirmada', 'cancelada'],
  confirmada: ['completada', 'cancelada'],
  completada: [],
  cancelada: ['pendiente'],
};

const PAYMENT_FIELDS = ['payment_status', 'payment_method'];

function decorateReservation(reservation) {
  const room = reservation.rooms || {};
  const images = Array.isArray(room.images) ? room.images : [];

  return {
    ...reservation,
    room_name: room.name || 'Habitación no disponible',
    room_category: room.category || null,
    image: images[0] || null,
    guests: room.capacity ?? null,
  };
}

function resolveTariffPrice(roomRow, tariff) {
  if (tariff?.id && Array.isArray(roomRow.tariffs)) {
    const match = roomRow.tariffs.find((item) => item.id === tariff.id);
    if (match?.price !== undefined && match?.price !== null) {
      return Number(match.price);
    }
  }
  if (tariff?.price !== undefined && tariff?.price !== null) {
    return Number(tariff.price);
  }
  return Number(roomRow.price) || 0;
}

async function fetchReservation(reservationId) {
  const { data, error } = await supabase
    .from('reservations')
    .select('reservation_id, status')
    .eq('reservation_id', reservationId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw notFound('Reserva no encontrada');
  return data;
}

export async function listReservations() {
  const { data, error } = await supabase
    .from('reservations')
    .select(RESERVATION_WITH_ROOM)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(decorateReservation);
}

export async function listReservationsForUser(uid) {
  const { data, error } = await supabase
    .from('reservations')
    .select(RESERVATION_WITH_ROOM)
    .eq('firebase_uid', uid)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(decorateReservation);
}

export async function createReservation(body) {
  const {
    room,
    tariff,
    formData,
    nights,
    startDate,
    endDate,
    firebaseUID,
  } = body || {};

  if (!room?.room_id) throw badRequest('Falta la habitación de la reserva');
  if (!formData) throw badRequest('Faltan los datos del cliente');
  requireFields(formData, ['firstName', 'lastName', 'email']);

  const { data: roomRow, error: roomError } = await supabase
    .from('rooms')
    .select('room_id, price, capacity, tariffs')
    .eq('room_id', room.room_id)
    .maybeSingle();

  if (roomError) throw roomError;
  if (!roomRow) throw notFound('Habitación no encontrada');

  let resolvedNights = Number(nights);
  if (!Number.isFinite(resolvedNights) || resolvedNights < 1) {
    if (startDate && endDate) {
      const diff = new Date(endDate) - new Date(startDate);
      resolvedNights = Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
    } else {
      resolvedNights = 1;
    }
  }

  // The client-provided total is never trusted: recompute from the room tariff.
  const rate = resolveTariffPrice(roomRow, tariff);
  const computedTotal = Number((rate * resolvedNights).toFixed(2));

  const newReservation = {
    room_id: roomRow.room_id,
    firebase_uid: firebaseUID || null,
    client_name: `${formData.firstName} ${formData.lastName}`.trim(),
    client_email: formData.email,
    start_date: startDate || null,
    end_date: endDate || null,
    nights: resolvedNights,
    total_price: computedTotal,
    status: 'pendiente',
  };

  const { data, error } = await supabase
    .from('reservations')
    .insert([newReservation])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateReservationStatus(reservationId, status) {
  const VALID_STATUSES = Object.keys(ALLOWED_TRANSITIONS);
  if (!VALID_STATUSES.includes(status)) {
    throw badRequest(`Estado inválido: ${status}`);
  }

  const current = await fetchReservation(reservationId);

  // Idempotent: re-applying the current status is a no-op, not an error.
  if (current.status === status) {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('reservation_id', reservationId)
      .single();
    if (error) throw error;
    return data;
  }

  const allowed = ALLOWED_TRANSITIONS[current.status] || [];
  if (!allowed.includes(status)) {
    throw badRequest(
      `Transición no permitida: ${current.status} → ${status}`
    );
  }

  const { data, error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('reservation_id', reservationId)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw notFound('Reserva no encontrada');
  return data[0];
}

export async function cancelReservation(reservationId) {
  const current = await fetchReservation(reservationId);

  if (current.status === 'cancelada') {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('reservation_id', reservationId)
      .single();
    if (error) throw error;
    return data;
  }

  if (current.status === 'completada') {
    throw badRequest('No se puede cancelar una reserva completada');
  }

  const { data, error } = await supabase
    .from('reservations')
    .update({ status: 'cancelada' })
    .eq('reservation_id', reservationId)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw notFound('Reserva no encontrada');
  return data[0];
}

export async function updatePayment(reservationId, body) {
  const payment = {};
  for (const field of PAYMENT_FIELDS) {
    if (body?.[field] !== undefined) payment[field] = body[field];
  }

  if (Object.keys(payment).length === 0) {
    throw badRequest('No hay campos de pago válidos para actualizar');
  }

  const { data, error } = await supabase
    .from('reservations')
    .update(payment)
    .eq('reservation_id', reservationId)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw notFound('Reserva no encontrada');
  return data[0];
}
