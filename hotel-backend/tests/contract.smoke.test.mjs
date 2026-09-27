// Source-contract smoke test for refactor-hotel-crud.
//
// This is intentionally a STATIC source check, not a live integration test: it
// needs no database, no Supabase credentials and no network. It locks in the
// exact contract invariants this refactor established so a future edit cannot
// silently reintroduce the bugs we just removed (mass assignment, the dead-end
// `reservada` status, secret leakage, hardcoded API origins).
//
// Runs with the Node built-in test runner — no test framework was added:
//   npm test        (from hotel-backend/)
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

function read(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

function extract(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert.notEqual(start, -1, `marker not found: ${startMarker}`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `end marker not found for: ${startMarker}`);
  return source.slice(start, end);
}

function quotedItems(block) {
  return [...block.matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

function walkJsFiles(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = `${directory}/${entry.name}`;
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'build') continue;
      files.push(...walkJsFiles(fullPath));
    } else if (entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

test('rooms whitelist is exact and used for writes', () => {
  const source = read('../services/rooms.service.js');
  const fields = quotedItems(
    extract(source, 'const ROOM_FIELDS = [', '];')
  );

  assert.deepEqual(fields.sort(), [
    'capacity',
    'category',
    'description',
    'images',
    'name',
    'price',
    'room_id',
    'services',
    'status',
    'tariffs',
  ]);

  assert.match(source, /pickFields\(body, ROOM_FIELDS\)/);
  // No path may insert the raw request body (mass assignment).
  assert.doesNotMatch(source, /insert\(\[\s*body\s*\]\)/);
});

test('reservations lifecycle has no dead-end "reservada" status', () => {
  const source = read('../services/reservations.service.js');

  assert.match(source, /status:\s*'pendiente'/);

  const transitions = extract(
    source,
    'const ALLOWED_TRANSITIONS = {',
    '};'
  );
  assert.doesNotMatch(transitions, /reservada/);

  const keys = [...transitions.matchAll(/(\w+):\s*\[/g)].map((m) => m[1]);
  assert.deepEqual(keys.sort(), [
    'cancelada',
    'completada',
    'confirmada',
    'pendiente',
  ]);
  assert.match(transitions, /completada/);
});

test('logs service uses only the canonical columns', () => {
  const source = read('../services/logs.service.js');
  assert.match(
    source,
    /LOG_SELECT = 'log_id, event_type, description, user_email, created_at'/
  );
  // Legacy `action`/`details`/`user_id` shapes must not come back.
  assert.doesNotMatch(source, /\baction\b/);
  assert.doesNotMatch(source, /\bdetails\b/);
});

test('operators service never selects a secret column', () => {
  const source = read('../services/operators.service.js');
  const operatorSelect = extract(source, 'const OPERATOR_SELECT =', ';');

  assert.doesNotMatch(operatorSelect, /password_hash/);
  assert.doesNotMatch(operatorSelect, /firebase_uid/);
  assert.match(operatorSelect, /full_name/);
});

test('admin and operator surfaces are mounted behind the role guard', () => {
  const source = read('../index.js');
  assert.match(source, /'\/api\/admin',\s*requireAuth\('admin'\)/);
  assert.match(source, /'\/api\/operator',\s*requireAuth\('operador'\)/);
  // The broken plaintext login endpoint stays removed.
  assert.doesNotMatch(source, /operators\/login/);
});

test('no hardcoded API origin remains in the web client', () => {
  const webSrc = fileURLToPath(new URL('../../hotel-web/src', import.meta.url));
  const offenders = walkJsFiles(webSrc).filter((file) =>
    readFileSync(file, 'utf8').includes('http://localhost:4000')
  );

  assert.deepEqual(offenders, []);
});
