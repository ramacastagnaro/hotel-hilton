-- Migration 5.2 — `rooms.status` column.
--
-- Supports the OperatorRooms toggle persistence: `PATCH /api/rooms/:id {status}`
-- now writes a real column instead of only local UI state.
--
-- Idempotent: safe to run more than once. Run in the Supabase SQL editor.

-- 1. Add the column when missing. Nullable on purpose so the ALTER never fails
--    on existing rows; the app already defaults a missing status to 'disponible'.
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'disponible';

-- 2. Backfill legacy rows into the canonical default.
UPDATE rooms
   SET status = 'disponible'
 WHERE status IS NULL;

-- 3. Enforce the canonical value set when it is safe. `disponible`, `ocupada`
--    and `mantenimiento` are exactly the values OperatorRooms renders.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'rooms_status_check'
  ) THEN
    RAISE NOTICE 'rooms_status_check already exists — skipping';
  ELSIF EXISTS (
    SELECT 1 FROM rooms
     WHERE status IS NOT NULL
       AND status NOT IN ('disponible', 'ocupada', 'mantenimiento')
  ) THEN
    RAISE NOTICE 'Skipped rooms_status_check: unexpected values present. Review manually.';
  ELSE
    ALTER TABLE rooms
      ADD CONSTRAINT rooms_status_check
      CHECK (status IN ('disponible', 'ocupada', 'mantenimiento'));
    RAISE NOTICE 'Added rooms_status_check';
  END IF;
END $$;

-- 4. Verify.
SELECT status, COUNT(*) AS rooms
  FROM rooms
 GROUP BY status
 ORDER BY rooms DESC;
