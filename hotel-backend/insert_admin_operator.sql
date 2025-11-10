-- Script para insertar usuarios Admin y Operador en la tabla operators
-- Ejecutar en Supabase SQL Editor

-- NOTA: Los usuarios ya existen en tu base de datos:
-- 1. Admin Principal (admin@hotel.com)
-- 2. Operador de Recepción (operador@hotel.com)

-- Si quieres agregar MÁS usuarios, descomenta y modifica:

-- Insertar usuario Administrador adicional
-- INSERT INTO operators (
--     full_name,
--     email,
--     password_hash,
--     role
-- ) VALUES (
--     'Administrador Sistema',
--     'admin@thevannahhotel.com',
--     'admin123',
--     'admin'
-- ) ON CONFLICT (email) DO NOTHING;

-- Insertar usuario Operador adicional
-- INSERT INTO operators (
--     full_name,
--     email,
--     password_hash,
--     role
-- ) VALUES (
--     'Operador Hotel',
--     'operador@thevannahhotel.com',
--     'operador123',
--     'operador'
-- ) ON CONFLICT (email) DO NOTHING;

-- Verificar usuarios existentes
SELECT 
    operator_id,
    full_name,
    email,
    role,
    created_at
FROM operators
ORDER BY created_at DESC;
