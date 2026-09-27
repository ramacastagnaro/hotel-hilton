// System logs domain service. All calls route through the shared apiClient.
import { apiClient } from './apiClient';

export const getLogs = () => apiClient.get('/api/admin/logs');

export const createLog = (log) => apiClient.post('/api/logs', log);
