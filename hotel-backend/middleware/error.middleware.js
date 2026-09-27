// Uniform error envelope. Express 5 forwards rejected async handlers here.
import { HttpError } from '../utils/envelope.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Recurso no encontrado' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError || typeof err?.status === 'number') {
    const status = err.status;
    if (status >= 500) {
      console.error('❌ Error interno:', err);
    }
    return res.status(status).json({ error: err.message });
  }

  console.error('❌ Error interno:', err);
  return res.status(500).json({ error: 'Error interno del servidor' });
}
