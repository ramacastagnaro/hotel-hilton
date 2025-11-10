-- Script simplificado para insertar reservas de prueba
-- Ejecutar en Supabase SQL Editor
-- NOTA: Usa UIDs genéricos de Firebase

-- Limpiar reservas anteriores (OPCIONAL - descomentar si quieres borrar)
-- DELETE FROM reservations;

-- Insertar 8 reservas de prueba con datos realistas
INSERT INTO reservations (
    room_id,
    firebase_uid,
    client_name,
    client_email,
    start_date,
    end_date,
    nights,
    total_price,
    status
) VALUES
-- 1. Check-in HOY - Habitación Clásica King
('clasica-king', 'test_user_001', 'Juan Pérez', 'juan.perez@hotel.com', CURRENT_DATE, CURRENT_DATE + 3, 3, 255000, 'confirmada'),
-- 2. Check-in HOY - Habitación Superior King con Vistas
('superior-king-vistas', 'test_user_002', 'María González', 'maria.gonzalez@hotel.com', CURRENT_DATE, CURRENT_DATE + 2, 2, 230000, 'confirmada'),
-- 3. OCUPADA AHORA - Suite Presidencial (entró hace 2 días)
('suite-presidencial', 'test_user_003', 'Ana Martínez', 'ana.martinez@hotel.com', CURRENT_DATE - 2, CURRENT_DATE + 3, 5, 1250000, 'confirmada'),
-- 4. OCUPADA AHORA - Junior Suite King (entró ayer)
('junior-suite-king', 'test_user_004', 'Diego Ramírez', 'diego.ramirez@hotel.com', CURRENT_DATE - 1, CURRENT_DATE + 2, 3, 315000, 'confirmada'),
-- 5. PENDIENTE - En 3 días
('clasica-doble', 'test_user_005', 'Laura Sánchez', 'laura.sanchez@hotel.com', CURRENT_DATE + 3, CURRENT_DATE + 6, 3, 315000, 'pendiente'),
-- 6. PENDIENTE - En 5 días
('clasica-doble', 'test_user_006', 'Carlos Rodríguez', 'carlos.rodriguez@hotel.com', CURRENT_DATE + 5, CURRENT_DATE + 8, 3, 285000, 'pendiente'),
-- 7. FUTURA CONFIRMADA - En 7 días
('clasica-king', 'test_user_007', 'Sofía López', 'sofia.lopez@hotel.com', CURRENT_DATE + 7, CURRENT_DATE + 10, 3, 285000, 'confirmada'),
-- 8. CANCELADA
('clasica-king', 'test_user_008', 'Luis Fernández', 'luis.fernandez@hotel.com', CURRENT_DATE + 10, CURRENT_DATE + 12, 2, 170000, 'cancelada');

-- Verificar las reservas insertadas
SELECT 
    reservation_id,
    client_name,
    room_id,
    start_date,
    end_date,
    nights,
    status,
    total_price
FROM reservations
ORDER BY start_date;

-- Ver estadísticas
SELECT 
    status,
    COUNT(*) as cantidad,
    SUM(total_price) as ingresos_totales
FROM reservations
GROUP BY status;