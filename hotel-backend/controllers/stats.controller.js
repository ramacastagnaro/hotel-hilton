import * as statsService from '../services/stats.service.js';

export async function adminStats(req, res) {
  res.status(200).json(await statsService.getAdminStats());
}

export async function adminCharts(req, res) {
  res.status(200).json(await statsService.getAdminCharts());
}

export async function operatorStats(req, res) {
  res.status(200).json(await statsService.getOperatorStats());
}
