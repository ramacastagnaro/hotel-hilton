import * as logsService from '../services/logs.service.js';

export async function list(req, res) {
  res.status(200).json(await logsService.listLogs());
}

export async function create(req, res) {
  res.status(201).json(await logsService.createLog(req.body));
}
