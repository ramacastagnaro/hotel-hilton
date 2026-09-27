// Statistics domain service. The chart payload is the single canonical
// contract consumed by the admin dashboard and honouring `completada`.
import { supabase } from '../lib/supabaseClient.js';

const CANONICAL_STATUSES = ['confirmada', 'pendiente', 'completada', 'cancelada'];

function emptyStatusCounts() {
  return CANONICAL_STATUSES.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});
}

function buildStatusCounts(rows) {
  const counts = emptyStatusCounts();

  for (const row of rows || []) {
    // Legacy rows used `reservada`; treat them as `pendiente`.
    const status = row.status === 'reservada' ? 'pendiente' : row.status;
    if (Object.prototype.hasOwnProperty.call(counts, status)) {
      counts[status] += 1;
    }
  }

  return counts;
}

async function countRooms() {
  const { count, error } = await supabase
    .from('rooms')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
}

export async function getAdminStats() {
  const { data: reservations, error } = await supabase
    .from('reservations')
    .select('status, total_price, firebase_uid');

  if (error) throw error;

  const rows = reservations || [];
  const totalRevenue = rows.reduce(
    (sum, reservation) => sum + (Number(reservation.total_price) || 0),
    0
  );
  const totalUsers = new Set(
    rows.map((row) => row.firebase_uid).filter(Boolean)
  ).size;

  return {
    totalUsers,
    totalReservations: rows.length,
    totalRevenue,
    totalRooms: await countRooms(),
    reservationsByStatus: buildStatusCounts(rows),
  };
}

export async function getAdminCharts() {
  const since = new Date(
    Date.now() - 180 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: recentReservations, error: recentError } = await supabase
    .from('reservations')
    .select('created_at, total_price, status')
    .gte('created_at', since);

  if (recentError) throw recentError;

  const { data: allReservations, error: allError } = await supabase
    .from('reservations')
    .select('status, total_price, firebase_uid');

  if (allError) throw allError;

  const { data: roomStats, error: roomError } = await supabase
    .from('reservations')
    .select('room_id, rooms(name)')
    .not('room_id', 'is', null);

  if (roomError) throw roomError;

  // Group recent reservations by month (count + revenue).
  const monthlyData = {};
  for (const reservation of recentReservations || []) {
    const month = new Date(reservation.created_at).toLocaleDateString('es-AR', {
      month: 'short',
      year: 'numeric',
    });
    if (!monthlyData[month]) {
      monthlyData[month] = { count: 0, revenue: 0 };
    }
    monthlyData[month].count += 1;
    monthlyData[month].revenue += Number(reservation.total_price) || 0;
  }

  // Most-booked rooms, top 5.
  const roomCount = {};
  for (const row of roomStats || []) {
    const roomName = row.rooms?.name || 'Desconocida';
    roomCount[roomName] = (roomCount[roomName] || 0) + 1;
  }

  const rows = allReservations || [];

  return {
    monthlyReservations: Object.keys(monthlyData).map((month) => ({
      month,
      count: monthlyData[month].count,
      revenue: monthlyData[month].revenue,
    })),
    reservationsByStatus: buildStatusCounts(rows),
    topRooms: Object.entries(roomCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })),
    totalUsers: new Set(rows.map((row) => row.firebase_uid).filter(Boolean))
      .size,
    totalRooms: await countRooms(),
    totalReservations: rows.length,
    totalRevenue: rows.reduce(
      (sum, row) => sum + (Number(row.total_price) || 0),
      0
    ),
  };
}

export async function getOperatorStats() {
  const today = new Date().toISOString().split('T')[0];

  const { data: todayReservations, error: todayError } = await supabase
    .from('reservations')
    .select('reservation_id')
    .eq('start_date', today);

  if (todayError) throw todayError;

  const { data: pendingReservations, error: pendingError } = await supabase
    .from('reservations')
    .select('reservation_id')
    .in('status', ['pendiente', 'reservada']);

  if (pendingError) throw pendingError;

  const { data: occupiedRooms, error: occupiedError } = await supabase
    .from('reservations')
    .select('room_id')
    .lte('start_date', today)
    .gte('end_date', today)
    .eq('status', 'confirmada');

  if (occupiedError) throw occupiedError;

  const totalRooms = await countRooms();
  const occupiedCount = occupiedRooms?.length || 0;

  return {
    reservasHoy: todayReservations?.length || 0,
    habitacionesDisponibles: totalRooms - occupiedCount,
    habitacionesOcupadas: occupiedCount,
    pagosPendientes: pendingReservations?.length || 0,
  };
}
