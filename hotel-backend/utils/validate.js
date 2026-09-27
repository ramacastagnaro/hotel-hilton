// Input whitelisting and validation helpers.
import { badRequest } from './envelope.js';

/**
 * Return a new object containing only the allowed keys that are actually
 * present in `source`. Unknown keys are dropped (no mass assignment) and
 * omitted keys stay omitted, so a partial update never overwrites JSONB
 * columns the client did not send.
 */
export function pickFields(source, allowed) {
  const result = {};
  if (!source || typeof source !== 'object') return result;

  for (const key of allowed) {
    if (
      Object.prototype.hasOwnProperty.call(source, key) &&
      source[key] !== undefined
    ) {
      result[key] = source[key];
    }
  }

  return result;
}

/**
 * Throw a 400 when any required field is null, undefined or an empty string.
 */
export function requireFields(source, required) {
  const missing = required.filter((key) => {
    const value = source?.[key];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    throw badRequest(`Faltan campos obligatorios: ${missing.join(', ')}`);
  }
}
