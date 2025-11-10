-- Actualizar precios de habitaciones con valores realistas para Argentina (2025)
-- Precios en pesos argentinos (ARS)
-- Ejecuta esto en el SQL Editor de Supabase

-- Habitación Clásica King (Estándar) - La más económica
UPDATE rooms SET price = 85000 WHERE room_id = 'clasica-king';
UPDATE rooms SET tariffs = '[
  {"id": "t1_ck", "name": "Tarifa Flexible", "price": 85000, "benefits": ["Cancelación gratuita", "Paga en el hotel"]},
  {"id": "t2_ck", "name": "Tarifa con Desayuno", "price": 95000, "benefits": ["Desayuno Buffet incluido"]}
]'::jsonb WHERE room_id = 'clasica-king';

-- Habitación Clásica Doble (Estándar) - Similar a King pero más capacidad
UPDATE rooms SET price = 95000 WHERE room_id = 'clasica-doble';
UPDATE rooms SET tariffs = '[
  {"id": "t1_cd", "name": "Tarifa Flexible", "price": 95000, "benefits": ["Cancelación gratuita", "Paga en el hotel"]},
  {"id": "t2_cd", "name": "Tarifa con Desayuno", "price": 105000, "benefits": ["Desayuno Buffet incluido"]}
]'::jsonb WHERE room_id = 'clasica-doble';

-- Superior King con Vistas (Superior) - Más cara que estándar
UPDATE rooms SET price = 135000 WHERE room_id = 'superior-king-vistas';
UPDATE rooms SET tariffs = '[
  {"id": "t1_skv", "name": "Tarifa Flexible", "price": 135000, "benefits": ["Cancelación gratuita", "Desayuno incluido"]},
  {"id": "t2_skv", "name": "Tarifa No Reembolsable", "price": 120000, "benefits": ["Desayuno incluido", "Ahorra 15%"]}
]'::jsonb WHERE room_id = 'superior-king-vistas';

-- Junior Suite King (Suite Junior) - Más lujosa
UPDATE rooms SET price = 185000 WHERE room_id = 'junior-suite-king';
UPDATE rooms SET tariffs = '[
  {"id": "t1_jsk", "name": "Estadía de Lujo", "price": 185000, "benefits": ["Acceso al Spa", "Cancelación gratuita", "Desayuno incluido"]},
  {"id": "t2_jsk", "name": "Paquete Romántico", "price": 210000, "benefits": ["Cena romántica", "Champagne", "Spa incluido"]}
]'::jsonb WHERE room_id = 'junior-suite-king';

-- Suite Presidencial (La más cara y lujosa)
UPDATE rooms SET price = 350000 WHERE room_id = 'suite-presidencial';
UPDATE rooms SET tariffs = '[
  {"id": "t1_sp", "name": "Experiencia Presidencial", "price": 350000, "benefits": ["Todos los servicios incluidos", "Check-in privado", "Mayordomo personal", "Traslado incluido"]},
  {"id": "t2_sp", "name": "Paquete VIP Completo", "price": 420000, "benefits": ["Todo incluido", "Suite + Spa + Cena gourmet", "Excursiones privadas"]}
]'::jsonb WHERE room_id = 'suite-presidencial';

-- Verificar los cambios
SELECT room_id, name, price, category FROM rooms ORDER BY price ASC;
