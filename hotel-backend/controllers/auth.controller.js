// Operator session resolution.
//
// The previous `/api/operators/login` compared a plaintext password against a
// stored Firebase UID. That endpoint is gone: operators now authenticate with
// Firebase on the client and this handler verifies the resulting ID token
// (spec OPER-2) before returning the operator profile + role.
import { extractBearerToken, verifyIdToken } from '../lib/firebaseAdmin.js';
import { findOperatorByEmail } from '../services/operators.service.js';
import { forbidden, unauthorized } from '../utils/envelope.js';

async function resolveOperatorSession(req) {
  const idToken = extractBearerToken(req) || req.body?.idToken;

  if (!idToken) throw unauthorized('Token de autenticación requerido');

  let decoded;
  try {
    decoded = await verifyIdToken(idToken);
  } catch (err) {
    // Re-throw infrastructure errors (e.g. 503 Firebase not ready) untouched.
    if (err.status) throw err;
    throw unauthorized('Token de Firebase inválido o expirado');
  }

  const operator = await findOperatorByEmail(decoded.email);
  if (!operator) throw forbidden('El usuario no es operador ni administrador');

  return operator;
}

export async function operatorLogin(req, res) {
  res.status(200).json(await resolveOperatorSession(req));
}

export async function me(req, res) {
  res.status(200).json(await resolveOperatorSession(req));
}
