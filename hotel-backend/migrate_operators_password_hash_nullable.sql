-- Migration 5.7 — relax the legacy `operators.password_hash` NOT NULL constraint.
--
-- Background: the refactored backend stores the Firebase UID in `firebase_uid`
-- and no longer writes `password_hash` (the old custom login was removed in
-- favour of Firebase Auth). The legacy column still carried a NOT NULL
-- constraint, so creating an operator failed with:
--
--   code 23502: null value in column "password_hash" of relation "operators"
--   violates not-null constraint
--
-- This migration is NON-DESTRUCTIVE: it keeps the column and whatever data it
-- holds, and only drops the NOT NULL requirement. Re-running it is a no-op.
--
-- Idempotent: safe to run more than once. Run in the Supabase SQL editor.

-- 1. Drop the NOT NULL constraint when it is still in place.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM information_schema.columns
     WHERE table_name = 'operators'
       AND column_name = 'password_hash'
       AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE operators ALTER COLUMN password_hash DROP NOT NULL;
    RAISE NOTICE 'operators.password_hash NOT NULL dropped';
  ELSE
    RAISE NOTICE 'operators.password_hash is already nullable (or missing) — skipping';
  END IF;
END $$;

-- 2. Verify: is_nullable should read YES.
SELECT column_name, is_nullable, data_type
  FROM information_schema.columns
 WHERE table_name = 'operators'
 ORDER BY ordinal_position;
