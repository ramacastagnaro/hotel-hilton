-- Script para crear tabla system_logs
-- Ejecutar en Supabase SQL Editor

-- Crear tabla de logs del sistema
CREATE TABLE IF NOT EXISTS system_logs (
    log_id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    user_id VARCHAR(255),
    details TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar logs de ejemplo
INSERT INTO system_logs (action, user_id, details, created_at) VALUES
('CREATE', 'admin@hotel.com', 'Creó habitación Clásica King', NOW() - INTERVAL '5 hours'),
('UPDATE', 'admin@hotel.com', 'Actualizó precios de habitaciones', NOW() - INTERVAL '4 hours'),
('DELETE', 'admin@hotel.com', 'Eliminó reserva cancelada #123', NOW() - INTERVAL '3 hours'),
('LOGIN', 'operador@hotel.com', 'Inicio de sesión exitoso', NOW() - INTERVAL '2 hours'),
('CREATE', 'operador@hotel.com', 'Creó nueva reserva para Juan Pérez', NOW() - INTERVAL '1 hour'),
('UPDATE', 'operador@hotel.com', 'Actualizó estado de habitación 101', NOW() - INTERVAL '30 minutes'),
('LOGIN', 'admin@hotel.com', 'Inicio de sesión exitoso', NOW() - INTERVAL '15 minutes'),
('CREATE', 'admin@hotel.com', 'Creó nuevo operador: María González', NOW() - INTERVAL '10 minutes'),
('DELETE', 'admin@hotel.com', 'Eliminó operador inactivo', NOW() - INTERVAL '5 minutes'),
('UPDATE', 'operador@hotel.com', 'Actualizó información de reserva #456', NOW());

-- Verificar logs insertados
SELECT 
    log_id,
    action,
    user_id,
    details,
    created_at
FROM system_logs
ORDER BY created_at DESC;

-- Ver estadísticas por acción
SELECT 
    action,
    COUNT(*) as cantidad
FROM system_logs
GROUP BY action
ORDER BY cantidad DESC;
