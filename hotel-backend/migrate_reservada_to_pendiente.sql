-- Migration 5.5 — retire the dead-end `reservada` reservation status.
--
-- Spec RESV-1: new reservations are created with status `pendiente`. Existing
-- rows written by the old flow still carry `reservada`, which the lifecycle
-- state machine (reservations.service.js ALLOWED_TRANSITIONS) does not accept.
-- This data migration moves them to the actionable `pendiente` state so the
-- operator can confirm or cancel them.
--
-- Idempotent: re-running updates 0 rows. Run in the Supabase SQL editor.

-- 1. Show what will change (run this SELECT first if you want a dry run).
SELECT status, COUNT(*) AS rows
  FROM reservations
 GROUP BY status
 ORDER BY rows DESC;

-- 2. Migrate the legacy status.
UPDATE reservations
   SET status = 'pendiente'
 WHERE status = 'reservada';

-- 3. Verify no `reservada` row remains.
SELECT COUNT(*) AS remaining_reservada
  FROM reservations
 WHERE status = 'reservada';

SELECT status, COUNT(*) AS rows
  FROM reservations
 GROUP BY status
 ORDER BY rows DESC;
