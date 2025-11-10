-- Script para insertar habitaciones con estructura JSONB en Supabase
-- Ejecuta esto en el SQL Editor de Supabase

-- Insertamos los datos en la tabla 'rooms' con JSONB
INSERT INTO rooms (room_id, name, category, description, capacity, images, services, tariffs, price)
VALUES
(
    'clasica-king',
    'Habitación Clásica King',
    'Estándar',
    'Nuestra habitación Clásica ofrece un espacio elegante y funcional con una cama King Size para un descanso perfecto.',
    2,
    ARRAY['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
    '[
      {"name": "30m²", "icon": "fas fa-ruler-combined"},
      {"name": "WiFi", "icon": "fas fa-wifi"},
      {"name": "Smart TV", "icon": "fas fa-tv"}
    ]'::jsonb,
    '[
      {"id": "t1_ck", "name": "Tarifa Flexible", "price": 150, "benefits": ["Cancelación gratuita", "Paga en el hotel"]},
      {"id": "t2_ck", "name": "Tarifa con Desayuno", "price": 175, "benefits": ["Desayuno Buffet incluido"]}
    ]'::jsonb,
    150.00
),
(
    'clasica-doble',
    'Habitación Clásica Doble',
    'Estándar',
    'Ideal para amigos o familia, equipada con dos camas dobles y todas las comodidades esenciales.',
    4,
    ARRAY['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    '[
      {"name": "35m²", "icon": "fas fa-ruler-combined"},
      {"name": "WiFi", "icon": "fas fa-wifi"},
      {"name": "Smart TV", "icon": "fas fa-tv"}
    ]'::jsonb,
    '[
      {"id": "t1_cd", "name": "Tarifa Flexible", "price": 160, "benefits": ["Cancelación gratuita", "Paga en el hotel"]}
    ]'::jsonb,
    160.00
),
(
    'superior-king-vistas',
    'Superior King con Vistas',
    'Superior',
    'Disfruta de vistas panorámicas de la ciudad desde esta habitación superior.',
    2,
    ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
    '[
      {"name": "38m²", "icon": "fas fa-ruler-combined"},
      {"name": "Vistas a la ciudad", "icon": "fas fa-city"},
      {"name": "Cafetera", "icon": "fas fa-coffee"}
    ]'::jsonb,
    '[
      {"id": "t1_skv", "name": "Tarifa Flexible", "price": 210, "benefits": ["Cancelación gratuita", "Desayuno incluido"]},
      {"id": "t2_skv", "name": "Tarifa No Reembolsable", "price": 190, "benefits": ["Desayuno incluido"]}
    ]'::jsonb,
    210.00
),
(
    'junior-suite-king',
    'Junior Suite King',
    'Junior Suite',
    'Un espacio generoso con una sala de estar integrada y una cama King Size.',
    3,
    ARRAY['https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
    '[
      {"name": "55m²", "icon": "fas fa-ruler-combined"},
      {"name": "Sala de estar", "icon": "fas fa-couch"},
      {"name": "Bañera", "icon": "fas fa-hot-tub"}
    ]'::jsonb,
    '[
      {"id": "t1_jsk", "name": "Estadía de Lujo", "price": 290, "benefits": ["Acceso al Spa", "Cancelación gratuita"]}
    ]'::jsonb,
    290.00
),
(
    'suite-presidencial',
    'Suite Presidencial',
    'Suite Presidencial',
    'El máximo lujo y exclusividad. Más de 100m² con sala de estar y comedor.',
    4,
    ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'],
    '[
      {"name": "120m²", "icon": "fas fa-ruler-combined"},
      {"name": "Comedor privado", "icon": "fas fa-utensils"},
      {"name": "Jacuzzi doble", "icon": "fas fa-hot-tub"}
    ]'::jsonb,
    '[
      {"id": "t1_sp", "name": "Experiencia Presidencial", "price": 850, "benefits": ["Todos los servicios incluidos", "Check-in privado"]}
    ]'::jsonb,
    850.00
)
ON CONFLICT (room_id) DO NOTHING;

-- Verificar que se insertaron correctamente
SELECT 'Habitaciones insertadas:' as mensaje, COUNT(*) as total FROM rooms;
SELECT * FROM rooms ORDER BY price;
