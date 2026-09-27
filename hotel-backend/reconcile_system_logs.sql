-- Migration 5.3 — reconcile `system_logs` to one canonical shape.
--
-- Two legacy scripts disagree about this table:
--   create_system_logs_table.sql  -> (log_id, action, user_id, details, created_at)
--   create_operators_and_logs.sql -> (log_id, event_type, description, user_id, user_email, created_at)
-- The backend (logs.service.js) reads/writes the second shape, so this is the
-- canonical one: (log_id, event_type, description, user_email, created_at).
--
-- Idempotent and non-destructive: canonical columns are added when missing and
-- legacy columns are COPIED, never dropped. Run in the Supabase SQL editor.

-- 1. Create the canonical table if it does not exist at all.
CREATE TABLE IF NOT EXISTS system_logs (
    log_id SERIAL PRIMARY KEY,
    event_type VARCHAR(100),
    description TEXT,
    user_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Add the canonical columns to a table created by either legacy script.
ALTER TABLE system_logs ADD COLUMN IF NOT EXISTS event_type VARCHAR(100);
ALTER TABLE system_logs ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE system_logs ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);
ALTER TABLE system_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- 3. Copy legacy data into the canonical columns when the legacy columns exist.
--    Dynamic SQL is used so a missing legacy column cannot break parsing.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_name = 'system_logs' AND column_name = 'action'
  ) THEN
    EXECUTE $copy$
      UPDATE system_logs
         SET event_type = action
       WHERE event_type IS NULL AND action IS NOT NULL
    $copy$;
    RAISE NOTICE 'Copied system_logs.action -> event_type';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_name = 'system_logs' AND column_name = 'details'
  ) THEN
    EXECUTE $copy$
      UPDATE system_logs
         SET description = details
       WHERE description IS NULL AND details IS NOT NULL
    $copy$;
    RAISE NOTICE 'Copied system_logs.details -> description';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_name = 'system_logs' AND column_name = 'user_id'
  ) THEN
    -- user_id held an email in the legacy shape, and a Firebase UID in the
    -- other. Only email-shaped values become user_email; UID-shaped values are
    -- left untouched in user_id so nothing is lost.
    EXECUTE $copy$
      UPDATE system_logs
         SET user_email = user_id
       WHERE user_email IS NULL AND user_id IS NOT NULL AND user_id LIKE '%@%'
    $copy$;
    RAISE NOTICE 'Copied email-shaped system_logs.user_id -> user_email';
  END IF;
END $$;

-- 4. Fill remaining gaps so the canonical contract holds for old rows.
UPDATE system_logs SET event_type = 'evento' WHERE event_type IS NULL;
UPDATE system_logs SET description = '' WHERE description IS NULL;

-- 5. Verify: no canonical column should still be null.
SELECT
  COUNT(*)                                                  AS total_rows,
  COUNT(*) FILTER (WHERE event_type IS NULL)                AS null_event_type,
  COUNT(*) FILTER (WHERE description IS NULL)               AS null_description,
  COUNT(*) FILTER (WHERE user_email IS NOT NULL)            AS with_user_email
FROM system_logs;

SELECT log_id, event_type, description, user_email, created_at
  FROM system_logs
 ORDER BY created_at DESC NULLS LAST
 LIMIT 10;

-- NOTE: legacy columns (`action`, `details`, `user_id`) are intentionally kept.
-- Once you have verified the copy, you may drop them manually — this migration
-- never destroys data.
