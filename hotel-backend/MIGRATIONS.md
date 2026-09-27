# Database migrations

This project has **no migration tooling**. There is no ORM, no migration runner,
and no CI step that touches the database. Schema changes are plain SQL scripts
that a human runs by hand.

## How to apply

1. Open the Supabase dashboard for this project.
2. Go to **SQL Editor**.
3. Run the scripts below **in order**, one at a time, pasting the full file and
   clicking **Run**.
4. Check the output of each script's final `SELECT` before moving to the next.

Database: Supabase (PostgreSQL). No local database is required.

## Scripts (run in this order)

| # | File | What it does | Unlocks |
|---|------|--------------|---------|
| 1 | `migrate_reservations_payment.sql` | Adds `reservations.payment_status` + `payment_method` + `mp_preference_id`, backfills `pendiente` | PAY-1, PAY-2, Mercado Pago checkout |
| 2 | `migrate_rooms_status.sql` | Adds `rooms.status` (`disponible`/`ocupada`/`mantenimiento`) | OperatorRooms toggle persistence |
| 3 | `reconcile_system_logs.sql` | Reconciles `system_logs` to `(log_id, event_type, description, user_email, created_at)` | Admin/operator log listing |
| 4 | `reconcile_operators_firebase_uid.sql` | Ensures `operators.firebase_uid` and copies the legacy `password_hash` UID into it | OPER-3 (no lockout) |
| 5 | `migrate_reservada_to_pendiente.sql` | `UPDATE reservations SET status='pendiente' WHERE status='reservada'` | RESV-1 data |
| 6 | `migrate_add_demo_role.sql` | Widens `operators.role` `CHECK` to `('admin','operador','demo')` | DEMO-1 (read-only demo role) |

Order matters:

- Run 1 and 2 before starting the backend against the live database, otherwise
  the payment and room-status PATCH endpoints will fail on a missing column.
- Run 4 before enabling `REQUIRE_AUTH=true`, otherwise role resolution can fail
  for operators whose UID is still stored in `password_hash`.
- Run 5 before relying on the reservation lifecycle, otherwise legacy
  `reservada` rows cannot be confirmed or cancelled.
- Run 6 before provisioning the `demo` operator, otherwise the `operators.role`
  `CHECK` rejects the new role value.

## Idempotency

Every script is safe to re-run:

- Columns are added with `ADD COLUMN IF NOT EXISTS`.
- Tables are created with `CREATE TABLE IF NOT EXISTS`.
- `UPDATE` backfills are guarded (`WHERE payment_status IS NULL`,
  `WHERE status IS NULL`, `WHERE status = 'reservada'`), so a second run
  changes 0 rows.
- `CHECK` constraints and indexes are added only when they do not already exist,
  and each script reports via `RAISE NOTICE` when it skips one.
- Legacy data is **never dropped**: `reconcile_operators_firebase_uid.sql` and
  `reconcile_system_logs.sql` copy old columns into the canonical ones and leave
  the old columns in place. Dropping them is a manual, optional follow-up.

## Non-goals

- These scripts do **not** touch Firebase Authentication. Operator users still
  live in Firebase; only the Supabase mirror is reconciled.
- These scripts do **not** seed or delete business data.
- These scripts are **not** run automatically by the app or by any test. The
  backend only reads and writes tables; it never migrates them.

## After running

Verify with the app:

- Admin → Logs renders rows without throwing.
- Admin → Operators renders and no `password_hash` is present in any API
  response.
- Operator → Rooms "Abrir/Cerrar" persists across a reload.
- Operator → Payments "Confirmar" shows `completado` after a reload.
- Operator → Reservations can move a reservation `pendiente → confirmada → completada`.
- A `demo` operator reaches `/api/admin` and `/api/operator` reads (200) but
  every `POST`/`PUT`/`PATCH`/`DELETE` returns 403.
- `POST /api/payments/preference` returns an `init_point` and the reservation
  row shows a non-null `mp_preference_id`.
- After a real (or MP test) payment, `GET /api/payments/status?reservation_id=…`
  reports `payment_status = 'completado'`.
