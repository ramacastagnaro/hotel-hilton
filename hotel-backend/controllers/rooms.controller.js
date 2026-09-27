import * as roomsService from '../services/rooms.service.js';

export async function list(req, res) {
  res.status(200).json(await roomsService.listRooms());
}

export async function getOne(req, res) {
  res.status(200).json(await roomsService.getRoom(req.params.id));
}

export async function create(req, res) {
  res.status(201).json(await roomsService.createRoom(req.body));
}

export async function update(req, res) {
  res.status(200).json(await roomsService.updateRoom(req.params.id, req.body));
}

export async function remove(req, res) {
  res.status(200).json(await roomsService.deleteRoom(req.params.id));
}
