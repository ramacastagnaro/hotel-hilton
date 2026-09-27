// Firebase Admin auth guard.
//
// Rollout switch (spec AUTH-5): while REQUIRE_AUTH is not 'true' the middleware
// is a warn-only passthrough, so the API stays reachable and nobody is locked
// out by default.
import { REQUIRE_AUTH } from '../config/env.js';
import { extractBearerToken, verifyIdToken } from '../lib/firebaseAdmin.js';
import { findOperatorByEmail } from '../services/operators.service.js';

/**
 * Role-aware auth guard.
 *
 * @param {object} [options]
 * @param {string[]} [options.roles] - Roles allowed full access.
 * @param {string[]} [options.readOnlyRoles] - Roles allowed to read only
 *   (`GET`/`HEAD`); any other method is rejected with 403.
 * @param {object} [deps] - Test seam. Overrides the auth collaborators so unit
 *   tests can drive the guard without a live Firebase/Supabase. Defaults to the
 *   real implementations in production.
 */
export function requireAuth(
  { roles = [], readOnlyRoles = [] } = {},
  deps = {}
) {
  const {
    verify = verifyIdToken,
    findOperator = findOperatorByEmail,
    enforce = REQUIRE_AUTH,
  } = deps;
  const allowed = [...roles, ...readOnlyRoles];

  return async (req, res, next) => {
    if (!enforce) {
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
      decoded = await verify(token);
    } catch (err) {
      if (err.status === 503) {
        return res.status(503).json({ error: err.message });
      }
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    req.user = { uid: decoded.uid, email: decoded.email };

    if (allowed.length) {
      let operator;
      try {
        operator = await findOperator(decoded.email);
      } catch (err) {
        return next(err);
      }

      if (!operator) {
        return res.status(403).json({ error: 'Usuario no autorizado' });
      }

      req.role = operator.role;

      if (!allowed.includes(operator.role)) {
        return res.status(403).json({ error: 'Permisos insuficientes' });
      }

      // Read-only roles (demo) may only observe: reject any state-changing
      // method even though the role itself is allowed to reach the surface.
      if (
        readOnlyRoles.includes(operator.role) &&
        !['GET', 'HEAD'].includes(req.method)
      ) {
        return res.status(403).json({ error: 'Rol de solo lectura' });
      }
    }

    return next();
  };
}
