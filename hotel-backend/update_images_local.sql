-- Actualizar las imágenes de las habitaciones con las rutas locales
-- Ejecuta esto en el SQL Editor de Supabase

-- Habitación Clásica King
UPDATE rooms SET images = ARRAY['/img/hab/king/k1.jpg', '/img/hab/king/k2.jpg', '/img/hab/king/k3.jpg', '/img/hab/king/k4.jpg'] WHERE room_id = 'clasica-king';

-- Habitación Clásica Doble (usa las mismas imágenes de king por ahora)
UPDATE rooms SET images = ARRAY['/img/hab/king/k2.jpg', '/img/hab/king/k3.jpg'] WHERE room_id = 'clasica-doble';

-- Superior King con Vistas
UPDATE rooms SET images = ARRAY['/img/hab/sup/sup1.png', '/img/hab/sup/s1.jpg', '/img/hab/sup/s2.jpg', '/img/hab/sup/s3.jpg'] WHERE room_id = 'superior-king-vistas';

-- Junior Suite King
UPDATE rooms SET images = ARRAY['/img/hab/jun-suit/sj1.png', '/img/hab/jun-suit/sj2.png', '/img/hab/jun-suit/sj3.png', '/img/hab/jun-suit/sj4.png'] WHERE room_id = 'junior-suite-king';

-- Suite Presidencial
UPDATE rooms SET images = ARRAY['/img/hab/presi/p1.png', '/img/hab/presi/p2.png', '/img/hab/presi/p3.png', '/img/hab/presi/p4.png'] WHERE room_id = 'suite-presidencial';

-- Verificar que se actualizaron
SELECT room_id, name, images FROM rooms ORDER BY price;
