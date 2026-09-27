-- Migration 5.4 — reconcile `operators` to the canonical `firebase_uid` column.
--
-- Background (spec OPER-2/OPER-3, design "Schema Dependencies" #1):
--   create_operators_and_logs.sql defines `firebase_uid`, but the live table
--   drifted and some scripts stored the Firebase UID inside `password_hash`
--   (see sync_firebase_operators.sql). The backend now writes `firebase_uid`
--   on INSERT, so the column must exist and existing rows must be migrated.
--
-- This migration is NON-DESTRUCTIVE:
--   * it never DROPs a column and never deletes a row;
--   * it COPYs the legacy `password_hash` value into `firebase_uid`;
--   * it keeps the legacy column so nothing can be locked out or lost.
--
-- Idempotent: safe to run more than once. Run in the Supabase SQL editor.

-- 1. Ensure the canonical column exists. Added NULLABLE on purpose: an existing
--    row with no UID must not fail the ALTER (that is exactly the lockout this
--    migration is designed to avoid).
ALTER TABLE operators
  ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(255);

-- 2. Migrate the legacy UID stored in `password_hash` into `firebase_uid`.
--    Dynamic SQL guards against the legacy column not existing at all.
DO $$
DECLARE
  copied INTEGER;
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_name = 'operators' AND column_name = 'password_hash'
  ) THEN
    EXECUTE $copy$
      UPDATE operators
         SET firebase_uid = password_hash
       WHERE firebase_uid IS NULL
         AND password_hash IS NOT NULL
         AND password_hash <> ''
    $copy$;
    GET DIAGNOSTICS copied = ROW_COUNT;
    RAISE NOTICE 'operators.firebase_uid backfilled from password_hash: % row(s)', copied;
  ELSE
    RAISE NOTICE 'No operators.password_hash column found — nothing to backfill';
  END IF;
END $$;

-- 3. The backend reads `full_name`, but the create script used `name`. Make
--    sure `full_name` exists and holds the legacy value when it is empty.
ALTER TABLE operators
  ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

DO $$
DECLARE
  copied INTEGER;
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_name = 'operators' AND column_name = 'name'
  ) THEN
    EXECUTE $copy$
      UPDATE operators
         SET full_name = name
       WHERE full_name IS NULL AND name IS NOT NULL
    $copy$;
    GET DIAGNOSTICS copied = ROW_COUNT;
    RAISE NOTICE 'operators.full_name backfilled from name: % row(s)', copied;
  END IF;
END $$;

-- 4. Support the role lookup (`findOperatorByEmail` filters by email; the UID is
--    also looked up). Uniqueness is added only when the data allows it.
CREATE INDEX IF NOT EXISTS idx_operators_firebase_uid
  ON operators (firebase_uid);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'operators_firebase_uid_key'
  ) THEN
    RAISE NOTICE 'operators_firebase_uid_key already exists — skipping';
  ELSIF EXISTS (
    SELECT firebase_uid
      FROM operators
     WHERE firebase_uid IS NOT NULL
     GROUP BY firebase_uid
    HAVING COUNT(*) > 1
  ) THEN
    RAISE NOTICE 'Skipped operators_firebase_uid_key: duplicate UIDs present. Resolve manually.';
  ELSE
    CREATE UNIQUE INDEX operators_firebase_uid_key
      ON operators (firebase_uid)
      WHERE firebase_uid IS NOT NULL;
    RAISE NOTICE 'Added unique index operators_firebase_uid_key';
  END IF;
END $$;

-- 5. Verify: report any operator that still has no UID. Those rows cannot be
--    matched by UID until a UID is set, so surface them explicitly.
SELECT
  COUNT(*)                                         AS total_operators,
  COUNT(*) FILTER (WHERE firebase_uid IS NOT NULL) AS with_firebase_uid,
  COUNT(*) FILTER (WHERE firebase_uid IS NULL)     AS without_firebase_uid
FROM operators;

SELECT operator_id, full_name, email, role,
       (firebase_uid IS NOT NULL) AS has_firebase_uid
  FROM operators
 ORDER BY operator_id;

-- NOTE: `password_hash` is intentionally NOT dropped here. Once you have
-- confirmed every operator has a `firebase_uid`, you may drop it manually.
-- Keeping it means the migration can never lock anyone out.
