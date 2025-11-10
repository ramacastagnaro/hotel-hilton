-- Script para sincronizar usuarios de Firebase con tabla operators
-- Ejecutar en Supabase SQL Editor

-- PASO 1: Ve a Firebase Console > Authentication > Users
-- Copia los UIDs de los usuarios admin@hotel.com y operador@hotel.com

-- PASO 2: Actualiza los registros con los UIDs de Firebase
-- Reemplaza 'UID_DE_FIREBASE_ADMIN' y 'UID_DE_FIREBASE_OPERADOR' con los UIDs reales

-- Actualizar Admin
UPDATE operators 
SET password_hash = 'u6vGDLmDIgciFvloD9sIvNqOBqo1'
WHERE email = 'admin@hotel.com';

-- Actualizar Operador
UPDATE operators 
SET password_hash = 'buvac3TCmeeU78Fb2IMCdD9U9AJ2'
WHERE email = 'operador@hotel.com';

-- Verificar actualización
SELECT 
    operator_id,
    full_name,
    email,
    password_hash as firebase_uid,
    role
FROM operators
ORDER BY operator_id;

-- NOTA: Estamos usando password_hash para guardar el UID de Firebase
-- porque no tienes una columna firebase_uid separada
