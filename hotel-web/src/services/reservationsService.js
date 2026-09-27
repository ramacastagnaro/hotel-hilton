// Reservations domain service. All calls route through the shared apiClient.
import { apiClient } from './apiClient';

export const getReservations = () => apiClient.get('/api/reservations');

export const getAdminReservations = () => apiClient.get('/api/admin/reservations');

export const getUserReservations = (uid) => apiClient.get(`/api/reservations/user/${uid}`);

export const createReservation = (reservation) => apiClient.post('/api/reservations', reservation);

export const updateStatus = (reservationId, status) =>
  apiClient.put(`/api/reservations/${reservationId}`, { status });

export const cancelReservation = (reservationId) =>
  apiClient.del(`/api/reservations/${reservationId}`);

export const updatePayment = (reservationId, payment) =>
  apiClient.patch(`/api/reservations/${reservationId}`, payment);
