// Rooms domain service. Owns whitelisting, JSONB preservation and honest
// status codes (400 bad input, 404 missing row).
import { supabase } from '../lib/supabaseClient.js';
import { badRequest, notFound } from '../utils/envelope.js';
import { pickFields, requireFields } from '../utils/validate.js';

// Only these columns may ever be written. Unknown keys are dropped.
const ROOM_FIELDS = [
  'room_id',
  'name',
  'category',
  'description',
  'price',
  'capacity',
  'images',
  'services',
  'tariffs',
  'status',
];

// Guarantee the JSONB collections are arrays so consumers such as
// `room.tariffs.map` (RoomDetailPage) can never crash on legacy/object data.
function normalizeRoom(room) {
  if (!room) return room;

  return {
    ...room,
    images: Array.isArray(room.images) ? room.images : [],
    services: Array.isArray(room.services) ? room.services : [],
    tariffs: Array.isArray(room.tariffs) ? room.tariffs : [],
  };
}

export async function listRooms() {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('category', { ascending: true })
    .order('price', { ascending: true });

  if (error) throw error;
  return data.map(normalizeRoom);
}

export async function getRoom(roomId) {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('room_id', roomId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw notFound('Habitación no encontrada');
  return normalizeRoom(data);
}

export async function createRoom(body) {
  const payload = pickFields(body, ROOM_FIELDS);
  requireFields(payload, ['name', 'category', 'price']);

  const { data, error } = await supabase
    .from('rooms')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return normalizeRoom(data);
}

export async function updateRoom(roomId, body) {
  const payload = pickFields(body, ROOM_FIELDS);
  // The primary key is used for the WHERE clause, never rewritten.
  delete payload.room_id;

  if (Object.keys(payload).length === 0) {
    throw badRequest('No hay campos válidos para actualizar');
  }

  // Partial updates only touch the fields sent, so omitted JSONB columns
  // (services/tariffs/images) are preserved.
  const { data, error } = await supabase
    .from('rooms')
    .update(payload)
    .eq('room_id', roomId)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw notFound('Habitación no encontrada');
  return normalizeRoom(data[0]);
}

export async function deleteRoom(roomId) {
  const { data, error } = await supabase
    .from('rooms')
    .delete()
    .eq('room_id', roomId)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw notFound('Habitación no encontrada');
  return { message: 'Habitación eliminada correctamente' };
}
