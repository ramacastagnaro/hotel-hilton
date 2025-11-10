-- Actualizar las imágenes de las habitaciones con URLs de Unsplash
-- Ejecuta esto en el SQL Editor de Supabase

UPDATE rooms SET images = ARRAY['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'] WHERE room_id = 'clasica-king';

UPDATE rooms SET images = ARRAY['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'] WHERE room_id = 'clasica-doble';

UPDATE rooms SET images = ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'] WHERE room_id = 'superior-king-vistas';

UPDATE rooms SET images = ARRAY['https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'] WHERE room_id = 'junior-suite-king';

UPDATE rooms SET images = ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'] WHERE room_id = 'suite-presidencial';

-- Verificar que se actualizaron
SELECT room_id, name, images FROM rooms;
