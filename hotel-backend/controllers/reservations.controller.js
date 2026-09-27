import * as reservationsService from '../services/reservations.service.js';

export async function list(req, res) {
  res.status(200).json(await reservationsService.listReservations());
}

export async function listByUser(req, res) {
  res
    .status(200)
    .json(await reservationsService.listReservationsForUser(req.params.uid));
}

export async function create(req, res) {
  res.status(201).json(await reservationsService.createReservation(req.body));
}

export async function updateStatus(req, res) {
  res
    .status(200)
    .json(
      await reservationsService.updateReservationStatus(
        req.params.id,
        req.body?.status
      )
    );
}

export async function cancel(req, res) {
  res
    .status(200)
    .json(await reservationsService.cancelReservation(req.params.id));
}

export async function updatePayment(req, res) {
  res
    .status(200)
    .json(await reservationsService.updatePayment(req.params.id, req.body));
}
