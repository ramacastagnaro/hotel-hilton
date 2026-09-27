// Firebase Admin auth guard.
//
// Rollout switch (spec AUTH-5): while REQUIRE_AUTH is not 'true' the middleware
// is a warn-only passthrough, so the API stays reachable and nobody is locked
// out by default.
import { REQUIRE_AUTH } from '../config/env.js';
import { extractBearerToken, verifyIdToken } from '../lib/firebaseAdmin.js';
import { findOperatorByEmail } from '../services/operators.service.js';

/**
 * @param {string} [role] - When set, the resolved operator role must match.
 */
export function requireAuth(role) {
  return async (req, res, next) => {
    if (!REQUIRE_AUTH) {
      console.warn(
        '[auth] REQUIRE_AUTH desactivado: se omite la verificación de token'
      );
      return next();
    }

    const token = extractBearerToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ error: 'Token de autenticación requerido' });
    }

    let decoded;
    try {
      decoded = await verifyIdToken(token);
    } catch (err) {
      if (err.status === 503) {
        return res.status(503).json({ error: err.message });
      }
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    req.user = { uid: decoded.uid, email: decoded.email };

    if (role) {
      let operator;
      try {
        operator = await findOperatorByEmail(decoded.email);
      } catch (err) {
        return next(err);
      }

      if (!operator) {
        return res.status(403).json({ error: 'Usuario no autorizado' });
      }

      req.role = operator.role;

      if (operator.role !== role) {
        return res.status(403).json({ error: 'Permisos insuficientes' });
      }
    }

    return next();
  };
}
