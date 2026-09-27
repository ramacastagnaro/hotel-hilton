# Smoke checklist — refactor-hotel-crud

Evidence captured while applying batch 3. Commands were run from the repo root
unless noted. "Pending (user DB)" means the check needs the live Supabase project
or a browser session and was deliberately not faked.

## Environment used

- Node `v22.20.0`, Windows.
- `hotel-backend/.env` present with `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`.
- `hotel-web/.env` present with `REACT_APP_API_URL` + Firebase + EmailJS keys.
- `hotel-backend/firebase-admin-key.json` present.
- Port `4000` was free before and after every probe; no server was left running.

## Build / static checks

| Check | Command | Result |
|-------|---------|--------|
| Backend syntax | `node --check` over 25 backend `.js` files | `checked=25 failures=0` |
| Backend syntax (test) | `node --check tests/contract.smoke.test.mjs` | OK |
| Backend contract test | `npm test` (hotel-backend) | `tests 6 / pass 6 / fail 0` |
| Web unit test | `npx react-scripts test --watchAll=false` (hotel-web) | `Test Suites: 1 passed`, `Tests: 6 passed` |
| Web production build | `npx react-scripts build` (hotel-web) | `Compiled successfully` |
| No hardcoded origin | contract test "no hardcoded API origin remains in the web client" | pass (0 offenders) |

## API probe (bounded boot: start → probe → stop)

Booted `node index.js` with `REQUIRE_AUTH` unset (default OFF), probed, then
stopped. Boot log confirmed Firebase Admin + Supabase initialized.

| Area | Request | Result | Verdict |
|------|---------|--------|---------|
| config | `GET /` | 200 (56 bytes) | OK |
| rooms CRUD | `GET /api/rooms` | 200 (3168 bytes) | OK |
| reservations | `GET /api/reservations` | 200 (17035 bytes) | OK |
| charts | `GET /api/admin/charts` | 200, all canonical keys present | OK |
| charts | `GET /api/admin/stats` | 200 (164 bytes) | OK |
| operators | `GET /api/admin/operators` | 200 (551 bytes), no `password_hash`, no `firebase_uid` | OK (OPER-1) |
| logs | `GET /api/admin/logs` | **500** — `column system_logs.event_type does not exist` (PG `42703`) | Blocked by migration 5.3 |
| auth | `GET /api/admin/operators` with `REQUIRE_AUTH=true`, no token | **401** | OK (AUTH-1) |
| auth | `GET /api/rooms` with `REQUIRE_AUTH=true`, no token | 200 | OK (public route stays public) |

Charts payload observed:

```json
{
  "reservationsByStatus": { "confirmada": 17, "pendiente": 11, "completada": 1, "cancelada": 1 },
  "totalUsers": 11,
  "totalRooms": 5,
  "totalReservations": 30
}
```

`monthlyReservations` was empty on this dataset: the chart window looks back 180
days and the seeded reservations are dated 2025. This is a data-window artifact,
not a contract defect.

## Checklist per work area

### 1. config (CFG-1, CFG-2, CFG-3, ACFG-1)
- [x] Zero `http://localhost:4000` literals in `hotel-web/src` (contract test).
- [x] `hotel-web/.env` and `hotel-web/.env.example` define `REACT_APP_API_URL`,
      `REACT_APP_FIREBASE_*`, `REACT_APP_EMAILJS_*`.
- [x] `hotel-web/src/data/roomsData.js` deleted, build passes.
- [ ] Pending (browser): load `/` and confirm the public site renders from
      env-driven config with the browser console free of `ConfigError`.

### 2. rooms CRUD (ROOM-1..ROOM-5)
- [x] `GET /api/rooms` returns 200.
- [x] Whitelist + no-mass-assignment guarded by the contract test.
- [ ] Pending (live mutation): create/update a room and confirm omitted
      `services`/`tariffs`/`images` survive the partial update.
- [ ] Pending (live mutation): `PUT`/`DELETE` of a non-existent `room_id` returns 404.

### 3. reservations lifecycle (RESV-1..RESV-5)
- [x] `GET /api/reservations` returns 200.
- [x] `reservada` is absent from the transition table and new rows default to
      `pendiente` (contract test).
- [ ] Pending (live mutation): drive one reservation `pendiente → confirmada → completada`.
- [x] Pending (user DB): `migrate_reservada_to_pendiente.sql` (5.5) must run so
      legacy `reservada` rows become actionable.

### 4. payments reload-persist (PAY-1..PAY-3)
- [ ] Pending (user DB): `migrate_reservations_payment.sql` (5.1) adds
      `payment_status` + `payment_method`.
- [ ] Pending (live mutation): confirm a payment, reload, confirm it still reads
      `completado`.
- [x] Client reads canonical `client_name`, not `guest_name` (batch 2).

### 5. charts non-zero (CHART-1..CHART-3)
- [x] `/api/admin/charts` and `/api/admin/stats` return the canonical keys.
- [x] `totalUsers` is a real count (11), not the mock `12`.
- [x] `reservationsByStatus` includes `completada` (1).
- [x] Hardcoded `[16,5,7,5]` payment-method mock removed.

### 6. operators no-secret (OPER-1, OPER-2, OPER-3)
- [x] `GET /api/admin/operators` body contains no `password_hash` and no `firebase_uid`.
- [x] `/api/operators/login` removed; login verifies a Firebase ID token.
- [ ] Pending (user DB): `reconcile_operators_firebase_uid.sql` (5.4) backfills
      `firebase_uid` from the legacy `password_hash` so no operator is locked out
      once `REQUIRE_AUTH=true`.

### 7. auth 401 + client redirect (AUTH-1..AUTH-5)
- [x] With `REQUIRE_AUTH=true`, `GET /api/admin/operators` without a token → 401.
- [x] Public routes stay reachable (200) with auth enabled.
- [x] `REQUIRE_AUTH` defaults OFF (passthrough) — confirmed in the boot log.
- [ ] Pending (browser): navigate to `/admin` while signed out and confirm the
      redirect; sign in and confirm layout logout ends the session.

### 8. logs (Admin Logs surface)
- [ ] Pending (user DB): `reconcile_system_logs.sql` (5.3) must run. Until then
      `GET /api/admin/logs` fails with `42703: column system_logs.event_type does
      not exist`, because the live table still has the legacy
      `action`/`details`/`user_id` shape.
- [ ] Pending (after 5.3): Admin → Logs renders rows without throwing.

## How to close the pending items

1. Run `MIGRATIONS.md` scripts 5.1–5.5 in the Supabase SQL editor, in order.
2. Re-run this checklist's API probes.
3. Walk the browser items above with a real signed-in admin and operator.
