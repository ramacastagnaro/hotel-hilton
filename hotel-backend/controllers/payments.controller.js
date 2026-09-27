import * as paymentsService from '../services/payments.service.js';
import { requireFields } from '../utils/validate.js';

export async function createPreference(req, res) {
  const reservationId =
    req.body?.reservation_id ?? req.body?.reservationId ?? req.body?.id;

  requireFields({ reservation_id: reservationId }, ['reservation_id']);

  const result = await paymentsService.createPreference(reservationId, {
    notificationUrl: paymentsService.resolveNotificationUrl(req),
  });

  res.status(201).json(result);
}

export async function webhook(req, res) {
  // Always 200: Mercado Pago must not receive a 5xx for an unknown, malformed
  // or duplicate notification (see the service for the idempotency contract).
  const result = await paymentsService.processNotification({
    body: req.body,
    query: req.query,
  });

  res.status(200).json({ received: true, ...result });
}

export async function status(req, res) {
  const reservationId =
    req.query?.reservation_id ?? req.query?.external_reference;

  requireFields({ reservation_id: reservationId }, ['reservation_id']);

  res.status(200).json(await paymentsService.getPaymentStatus(reservationId));
}
