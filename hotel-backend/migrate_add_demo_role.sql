-- Migration 5.6 — extend the operators.role CHECK constraint to allow 'demo'.
--
-- Idempotent / re-runnable: it drops the constraint if present and recreates it
-- with the wider value set. Existing rows only ever hold 'admin'/'operador', both
-- of which satisfy the new constraint, so NO data is lost. Re-running the script
-- leaves the schema in the same state.
--
-- Run in the Supabase SQL Editor. The app never migrates its own schema.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'operators_role_check'
  ) THEN
    ALTER TABLE operators DROP CONSTRAINT operators_role_check;
    RAISE NOTICE 'Dropped existing operators_role_check';
  END IF;

  ALTER TABLE operators
    ADD CONSTRAINT operators_role_check
    CHECK (role IN ('admin', 'operador', 'demo'));

  RAISE NOTICE 'operators_role_check now allows (admin, operador, demo)';
END $$;

-- Verify: should print CHECK ((role = ANY (ARRAY['admin','operador','demo'])))
SELECT pg_get_constraintdef(oid) AS operators_role_check
FROM pg_constraint
WHERE conname = 'operators_role_check';
