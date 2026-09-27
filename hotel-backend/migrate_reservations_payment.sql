-- Migration 5.1 — payment tracking columns on `reservations`.
--
-- Supports PAY-1/PAY-2: the operator "confirm payment" action persists
-- `payment_status` + `payment_method` so the value survives a reload.
--
-- Idempotent: safe to run more than once. Run in the Supabase SQL editor.

-- 1. Add the columns when they are missing. Nullable on purpose: existing rows
--    must not fail the ALTER, and the app already tolerates a NULL status.
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pendiente';

ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100);

-- 2. Backfill legacy rows into the canonical default.
UPDATE reservations
   SET payment_status = 'pendiente'
 WHERE payment_status IS NULL;

-- 3. Enforce the canonical value set, but only when it is safe to do so.
--    If live data holds a foreign value we skip the constraint instead of
--    failing the whole migration, and report why.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reservations_payment_status_check'
  ) THEN
    RAISE NOTICE 'reservations_payment_status_check already exists — skipping';
  ELSIF EXISTS (
    SELECT 1 FROM reservations
     WHERE payment_status IS NOT NULL
       AND payment_status NOT IN ('pendiente', 'completado')
  ) THEN
    RAISE NOTICE 'Skipped reservations_payment_status_check: unexpected values present. Review manually.';
  ELSE
    ALTER TABLE reservations
      ADD CONSTRAINT reservations_payment_status_check
      CHECK (payment_status IN ('pendiente', 'completado'));
    RAISE NOTICE 'Added reservations_payment_status_check';
  END IF;
END $$;

-- 4. Verify.
SELECT payment_status, payment_method, COUNT(*) AS rows
  FROM reservations
 GROUP BY payment_status, payment_method
 ORDER BY rows DESC;
