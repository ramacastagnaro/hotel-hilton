-- Script para crear tablas de operadores y logs del sistema
-- Ejecutar en Supabase SQL Editor

-- 1. Crear tabla de operadores/administradores
CREATE TABLE IF NOT EXISTS operators (
    operator_id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'operador')),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- 2. Crear tabla de logs del sistema
CREATE TABLE IF NOT EXISTS system_logs (
    log_id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    user_id VARCHAR(255),
    user_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Insertar usuarios Admin y Operador de ejemplo
-- IMPORTANTE: Reemplazar los firebase_uid con los UIDs reales de Firebase Authentication

INSERT INTO operators (firebase_uid, email, name, role, location) VALUES
('admin_firebase_uid_123', 'admin@thevannahhotel.com', 'admin', 'admin', 'Admin VIP'),
('operador_firebase_uid_456', 'operador@thevannahhotel.com', 'operador', 'operador', 'Operador Hotel')
ON CONFLICT (email) DO NOTHING;

-- 4. Insertar logs de ejemplo
INSERT INTO system_logs (event_type, description, user_email, created_at) VALUES
('sistema_iniciado', 'Aplicación iniciada correctamente', NULL, NOW()),
('login_admin', 'Acceso al panel de admin', 'admin@thevannahhotel.com', NOW() - INTERVAL '2 hours'),
('reserva_confirmada', 'Reserva #123 confirmada', 'juan.perez@hotel.com', NOW() - INTERVAL '1 hour'),
('usuario_creado', 'Nuevo usuario registrado', 'maria.gonzalez@hotel.com', NOW() - INTERVAL '30 minutes');

-- 5. Verificar datos insertados
SELECT * FROM operators ORDER BY created_at DESC;
SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 10;
