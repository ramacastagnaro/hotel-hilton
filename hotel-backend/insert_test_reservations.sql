-- Script para insertar reservas de prueba con datos reales
-- Ejecutar en Supabase SQL Editor

-- Insertar reservas de prueba (asegúrate de tener usuarios en Firebase primero)
INSERT INTO reservations (
    firebase_uid,
    room_id,
    start_date,
    end_date,
    nights,
    guests,
    total_price,
    guest_name,
    guest_email,
    guest_phone,
    status,
    payment_status,
    payment_method,
    created_at
) VALUES
-- Reserva 1: Check-in hoy
(
    'user_firebase_uid_1',
    1, -- room_id de tu primera habitación
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '3 days',
    3,
    2,
    255000,
    'Juan Pérez',
    'juan.perez@email.com',
    '+54 11 1234-5678',
    'confirmada',
    'pagado',
    'mercadopago',
    NOW()
),
-- Reserva 2: Check-in hoy (Superior King)
(
    'res_' || gen_random_uuid()::text,
    'user_firebase_uid_2',
    'superior-king',
    'Tarifa con Desayuno',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '2 days',
    2,
    2,
    230000,
    'María González',
    'maria.gonzalez@email.com',
    '+54 11 2345-6789',
    'Argentina',
    'confirmada',
    'card',
    NOW()
),
-- Reserva 3: Pendiente (Clásica Doble)
(
    'res_' || gen_random_uuid()::text,
    'user_firebase_uid_3',
    'clasica-doble',
    'Tarifa Flexible',
    CURRENT_DATE + INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '8 days',
    3,
    3,
    285000,
    'Carlos Rodríguez',
    'carlos.rodriguez@email.com',
    '+54 11 3456-7890',
    'Argentina',
    'pendiente',
    'paypal',
    NOW()
),
-- Reserva 4: Ocupada actualmente (Suite Presidencial)
(
    'res_' || gen_random_uuid()::text,
    'user_firebase_uid_4',
    'suite-presidencial',
    'Tarifa Premium',
    CURRENT_DATE - INTERVAL '2 days',
    CURRENT_DATE + INTERVAL '3 days',
    5,
    2,
    1250000,
    'Ana Martínez',
    'ana.martinez@email.com',
    '+54 11 4567-8901',
    'Argentina',
    'confirmada',
    'card',
    NOW() - INTERVAL '3 days'
),
-- Reserva 5: Cancelada
(
    'res_' || gen_random_uuid()::text,
    'user_firebase_uid_5',
    'clasica-king',
    'Tarifa Flexible',
    CURRENT_DATE + INTERVAL '10 days',
    CURRENT_DATE + INTERVAL '12 days',
    2,
    2,
    170000,
    'Luis Fernández',
    'luis.fernandez@email.com',
    '+54 11 5678-9012',
    'Argentina',
    'cancelada',
    'mercadopago',
    NOW() - INTERVAL '1 day'
),
-- Reserva 6: Futura confirmada (Clásica King)
(
    'res_' || gen_random_uuid()::text,
    'user_firebase_uid_6',
    'clasica-king',
    'Tarifa con Desayuno',
    CURRENT_DATE + INTERVAL '7 days',
    CURRENT_DATE + INTERVAL '10 days',
    3,
    2,
    285000,
    'Sofía López',
    'sofia.lopez@email.com',
    '+54 11 6789-0123',
    'Argentina',
    'confirmada',
    'card',
    NOW()
),
-- Reserva 7: Ocupada actualmente (Superior King)
(
    'res_' || gen_random_uuid()::text,
    'user_firebase_uid_7',
    'superior-king',
    'Tarifa Flexible',
    CURRENT_DATE - INTERVAL '1 day',
    CURRENT_DATE + INTERVAL '2 days',
    3,
    2,
    315000,
    'Diego Ramírez',
    'diego.ramirez@email.com',
    '+54 11 7890-1234',
    'Argentina',
    'confirmada',
    'mercadopago',
    NOW() - INTERVAL '2 days'
),
-- Reserva 8: Pendiente (Clásica Doble)
(
    'res_' || gen_random_uuid()::text,
    'user_firebase_uid_8',
    'clasica-doble',
    'Tarifa con Desayuno',
    CURRENT_DATE + INTERVAL '3 days',
    CURRENT_DATE + INTERVAL '6 days',
    3,
    4,
    315000,
    'Laura Sánchez',
    'laura.sanchez@email.com',
    '+54 11 8901-2345',
    'Argentina',
    'pendiente',
    'paypal',
    NOW()
);

-- Verificar las reservas insertadas
SELECT 
    reservation_id,
    client_name,
    room_id,
    start_date,
    end_date,
    nights,
    total_price,
    status
FROM reservations
ORDER BY created_at DESC;
