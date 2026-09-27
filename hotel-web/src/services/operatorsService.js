// Operators domain service. All calls route through the shared apiClient.
import { apiClient } from './apiClient';

export const getOperators = () => apiClient.get('/api/admin/operators');

export const createOperator = (operator) => apiClient.post('/api/admin/operators', operator);

export const updateOperator = (operatorId, operator) =>
  apiClient.put(`/api/admin/operators/${operatorId}`, operator);

export const deleteOperator = (operatorId) =>
  apiClient.del(`/api/admin/operators/${operatorId}`);

// Legacy operator credential login. The backend endpoint is removed in a later
// work unit in favour of Firebase ID-token verification; routing it here keeps
// the call-site free of hardcoded origins until that migration lands.
export const loginOperator = (credentials) => apiClient.post('/api/operators/login', credentials);
