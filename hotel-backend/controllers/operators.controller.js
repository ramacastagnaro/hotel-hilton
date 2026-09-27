import * as operatorsService from '../services/operators.service.js';

export async function list(req, res) {
  res.status(200).json(await operatorsService.listOperators());
}

export async function create(req, res) {
  res.status(201).json(await operatorsService.createOperator(req.body));
}

export async function update(req, res) {
  res
    .status(200)
    .json(await operatorsService.updateOperator(req.params.id, req.body));
}

export async function remove(req, res) {
  res
    .status(200)
    .json(await operatorsService.deleteOperator(req.params.id));
}
