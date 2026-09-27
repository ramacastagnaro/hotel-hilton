// Unit tests for the payments service PURE layer.
//
// Runs with the Node built-in test runner (no framework added):
//   npm test        (from hotel-backend/)
//
// Only the deterministic builders/mappers are exercised — no Mercado Pago API
// call, no database, no network. The Supabase client throws at import when its
// credentials are missing, so dummy values are set BEFORE the module graph is
// loaded through the dynamic import.
import assert from 'node:assert/strict';
import test from 'node:test';

process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321';
process.env.SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_KEY || 'test-service-key';
process.env.MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'test-token';

const { buildPreferencePayload, extractPaymentId, mapPaymentStatus } =
  await import('../services/payments.service.js');

const RESERVATION = {
  reservation_id: 54,
  nights: 3,
  total_price: 300000,
};

test('buildPreferencePayload splits unit_price × nights into the stored total', () => {
  const body = buildPreferencePayload(RESERVATION, {
    roomName: 'Suite Presidencial',
    frontendUrl: 'https://hotel-hilton.vercel.app',
  });

  assert.equal(body.items.length, 1);
  const [item] = body.items;
  assert.equal(item.title, 'Suite Presidencial');
  assert.equal(item.quantity, 3);
  assert.equal(item.unit_price, 100000);
  assert.equal(item.quantity * item.unit_price, RESERVATION.total_price);
  assert.equal(item.currency_id, 'ARS');
});

test('buildPreferencePayload links the reservation and the back_urls', () => {
  const body = buildPreferencePayload(RESERVATION, {
    frontendUrl: 'https://hotel-hilton.vercel.app/',
  });

  assert.equal(body.external_reference, '54');
  assert.equal(
    body.back_urls.success,
    'https://hotel-hilton.vercel.app/pago-exitoso'
  );
  assert.equal(body.back_urls.failure, body.back_urls.success);
  assert.equal(body.back_urls.pending, body.back_urls.success);
  assert.equal(body.auto_return, 'approved');
});

test('buildPreferencePayload falls back to a generic room name', () => {
  const body = buildPreferencePayload(RESERVATION);
  assert.match(body.items[0].title, /Habitación/);
});

test('buildPreferencePayload omits notification_url unless provided', () => {
  assert.equal(
    'notification_url' in buildPreferencePayload(RESERVATION),
    false
  );
  assert.equal(
    buildPreferencePayload(RESERVATION, {
      notificationUrl: 'https://api.test/api/payments/webhook',
    }).notification_url,
    'https://api.test/api/payments/webhook'
  );
});

test('buildPreferencePayload rejects an unusable reservation', () => {
  assert.throws(() => buildPreferencePayload({ nights: 2, total_price: 100 }));
  assert.throws(() =>
    buildPreferencePayload({ reservation_id: 1, nights: 0, total_price: 100 })
  );
  assert.throws(() =>
    buildPreferencePayload({ reservation_id: 1, nights: 2, total_price: 0 })
  );
});

test('mapPaymentStatus settles only approved payments', () => {
  assert.deepEqual(mapPaymentStatus('approved'), {
    payment_status: 'completado',
    isApproved: true,
  });
  assert.deepEqual(mapPaymentStatus('APPROVED'), {
    payment_status: 'completado',
    isApproved: true,
  });

  for (const status of [
    'pending',
    'in_process',
    'rejected',
    'cancelled',
    'refunded',
    'charged_back',
    undefined,
    null,
  ]) {
    assert.deepEqual(mapPaymentStatus(status), {
      payment_status: 'pendiente',
      isApproved: false,
    });
  }
});

test('extractPaymentId understands every notification shape', () => {
  assert.equal(extractPaymentId({ body: { data: { id: 123 } } }), '123');
  assert.equal(extractPaymentId({ body: { id: '456' } }), '456');
  assert.equal(extractPaymentId({ query: { 'data.id': 789 } }), '789');
  assert.equal(extractPaymentId({ query: { id: 'abc' } }), 'abc');
});

test('extractPaymentId returns null when there is no id', () => {
  assert.equal(extractPaymentId({}), null);
  assert.equal(extractPaymentId(), null);
  assert.equal(extractPaymentId({ body: { type: 'payment' } }), null);
  assert.equal(extractPaymentId({ query: { id: '   ' } }), null);
});
