-- Script para ver la estructura de la tabla operators
-- Ejecutar en Supabase SQL Editor

-- Ver todas las columnas de la tabla operators
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'operators'
ORDER BY ordinal_position;

-- Ver algunos registros de ejemplo (si existen)
SELECT * FROM operators LIMIT 5;
