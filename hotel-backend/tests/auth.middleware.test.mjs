// Unit tests for the role-aware `requireAuth` guard.
//
// Runs with the Node built-in test runner (no framework added):
//   npm test        (from hotel-backend/)
//
// The guard is exercised through its dependency-injection seam so the tests need
// no Firebase token, no Supabase connection and no network. The Supabase client
// throws at import when its credentials are missing, so dummy values are set
// BEFORE the middleware module graph is loaded via dynamic import.
import assert from 'node:assert/strict';
import test from 'node:test';

process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321';
process.env.SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_KEY || 'test-service-key';

const { requireAuth } = await import('../middleware/auth.middleware.js');

const ADMIN_GUARD = { roles: ['admin'], readOnlyRoles: ['demo'] };
const OPERATOR_GUARD = { roles: ['operador'], readOnlyRoles: ['demo'] };

const DEMO = { operator_id: 1, email: 'demo@hotel.test', role: 'demo' };
const ADMIN = { operator_id: 2, email: 'admin@hotel.test', role: 'admin' };
const OPERATOR = { operator_id: 3, email: 'op@hotel.test', role: 'operador' };

const TOKEN = 'valid-token';

function makeRes() {
  const res = { statusCode: 200, body: undefined };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.body = payload;
    return res;
  };
  return res;
}

// Build the injected collaborators for a guard. `operator` is the row returned
// by `findOperatorByEmail`; pass `null` to simulate an authenticated user with
// no operators row.
function makeDeps(operator) {
  return {
    enforce: true,
    verify: async (value) => {
      if (value !== TOKEN) {
        const err = new Error('invalid token');
        err.status = 401;
        throw err;
      }
      return {
        uid: `uid-${operator ? operator.role : 'none'}`,
        email: operator ? operator.email : 'nobody@hotel.test',
      };
    },
    findOperator: async (email) =>
      operator && operator.email === email ? operator : null,
  };
}

async function invoke(middleware, { method = 'GET', token } = {}) {
  const req = {
    method,
    headers: token ? { authorization: `Bearer ${token}` } : {},
  };
  const res = makeRes();
  let nextCalled = false;
  await middleware(req, res, () => {
    nextCalled = true;
  });
  return { req, res, nextCalled };
}

test('demo GET is allowed through to next', async () => {
  const mw = requireAuth(ADMIN_GUARD, makeDeps(DEMO));
  const { nextCalled, res, req } = await invoke(mw, { method: 'GET', token: TOKEN });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, 200);
  assert.equal(req.role, 'demo');
});

test('demo HEAD is allowed through to next', async () => {
  const mw = requireAuth(ADMIN_GUARD, makeDeps(DEMO));
  const { nextCalled } = await invoke(mw, { method: 'HEAD', token: TOKEN });
  assert.equal(nextCalled, true);
});

test('demo POST is rejected with 403 and never reaches next', async () => {
  const mw = requireAuth(ADMIN_GUARD, makeDeps(DEMO));
  const { nextCalled, res } = await invoke(mw, { method: 'POST', token: TOKEN });

  assert.equal(res.statusCode, 403);
  assert.equal(res.body.error, 'Rol de solo lectura');
  assert.equal(nextCalled, false);
});

test('demo DELETE on the operator surface is rejected with 403', async () => {
  const mw = requireAuth(OPERATOR_GUARD, makeDeps(DEMO));
  const { nextCalled, res } = await invoke(mw, { method: 'DELETE', token: TOKEN });

  assert.equal(res.statusCode, 403);
  assert.equal(nextCalled, false);
});

test('missing token with REQUIRE_AUTH=true returns 401', async () => {
  const mw = requireAuth(ADMIN_GUARD, makeDeps(ADMIN));
  const { nextCalled, res } = await invoke(mw, { method: 'GET' });

  assert.equal(res.statusCode, 401);
  assert.match(res.body.error, /Token/);
  assert.equal(nextCalled, false);
});

test('admin POST is allowed through to next', async () => {
  const mw = requireAuth(ADMIN_GUARD, makeDeps(ADMIN));
  const { nextCalled, res } = await invoke(mw, { method: 'POST', token: TOKEN });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, 200);
});

test('operator is rejected from the admin surface with 403', async () => {
  const mw = requireAuth(ADMIN_GUARD, makeDeps(OPERATOR));
  const { nextCalled, res } = await invoke(mw, { method: 'GET', token: TOKEN });

  assert.equal(res.statusCode, 403);
  assert.equal(res.body.error, 'Permisos insuficientes');
  assert.equal(nextCalled, false);
});

test('authenticated email without an operators row gets 403, no crash', async () => {
  const mw = requireAuth(ADMIN_GUARD, makeDeps(null));
  const { nextCalled, res } = await invoke(mw, { method: 'GET', token: TOKEN });

  assert.equal(res.statusCode, 403);
  assert.equal(nextCalled, false);
});

test('REQUIRE_AUTH=false is a warn-only passthrough', async () => {
  const mw = requireAuth(ADMIN_GUARD, { enforce: false });
  const { nextCalled } = await invoke(mw, { method: 'POST' });

  assert.equal(nextCalled, true);
});
