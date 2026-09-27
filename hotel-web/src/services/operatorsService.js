// Operators domain service. All calls route through the shared apiClient.
import { apiClient } from './apiClient';

export const getOperators = () => apiClient.get('/api/admin/operators');

export const createOperator = (operator) => apiClient.post('/api/admin/operators', operator);

export const updateOperator = (operatorId, operator) =>
  apiClient.put(`/api/admin/operators/${operatorId}`, operator);

export const deleteOperator = (operatorId) =>
  apiClient.del(`/api/admin/operators/${operatorId}`);

// Operator session resolution. Operators authenticate with Firebase on the
// client; this endpoint verifies the resulting ID token and returns the
// operator profile + role. The old `/api/operators/login` endpoint is gone.
export const loginOperator = (payload) =>
  apiClient.post('/api/auth/operator-login', payload);

export const getCurrentOperator = () => apiClient.get('/api/auth/me');
