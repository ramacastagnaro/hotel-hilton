// Statistics domain service. All calls route through the shared apiClient.
import { apiClient } from './apiClient';

export const getAdminStats = () => apiClient.get('/api/admin/stats');

export const getAdminCharts = () => apiClient.get('/api/admin/charts');

export const getOperatorStats = () => apiClient.get('/api/operator/stats');
