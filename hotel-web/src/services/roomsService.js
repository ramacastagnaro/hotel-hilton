// Rooms domain service. All calls route through the shared apiClient.
import { apiClient } from './apiClient';

export const getRooms = () => apiClient.get('/api/rooms');

export const getRoom = (roomId) => apiClient.get(`/api/rooms/${roomId}`);

export const createRoom = (room) => apiClient.post('/api/rooms', room);

export const updateRoom = (roomId, room) => apiClient.put(`/api/rooms/${roomId}`, room);

export const setRoomStatus = (roomId, status) => apiClient.patch(`/api/rooms/${roomId}`, { status });

export const deleteRoom = (roomId) => apiClient.del(`/api/rooms/${roomId}`);
