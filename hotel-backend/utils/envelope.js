// Uniform HTTP error envelope helpers.
//
// Every controller/service throws an `HttpError` (or an error carrying a
// `status`); `middleware/error.middleware.js` converts it into the canonical
// `{ "error": message }` JSON body with the matching status code.

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export const badRequest = (message = 'Solicitud inválida') =>
  new HttpError(400, message);

export const unauthorized = (message = 'No autorizado') =>
  new HttpError(401, message);

export const forbidden = (message = 'Permisos insuficientes') =>
  new HttpError(403, message);

export const notFound = (message = 'Recurso no encontrado') =>
  new HttpError(404, message);

export const serviceUnavailable = (message = 'Servicio no disponible') =>
  new HttpError(503, message);
