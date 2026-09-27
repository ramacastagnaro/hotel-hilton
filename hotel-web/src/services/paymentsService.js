// Payments service (Mercado Pago). All calls route through the shared apiClient.
import { apiClient } from './apiClient';

export const createPaymentPreference = (reservationId) =>
  apiClient.post('/api/payments/preference', { reservation_id: reservationId });

export const getPaymentStatus = (reservationId, options) =>
  apiClient.get(
    `/api/payments/status?reservation_id=${encodeURIComponent(reservationId)}`,
    options
  );
