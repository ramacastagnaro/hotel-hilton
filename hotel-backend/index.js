import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
// ⚠️ IMPORTANTE: Ahora importamos el objeto 'supabase' en lugar de la función 'query'
import { supabase } from './db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Inicializar Firebase Admin
try {
    const serviceAccount = JSON.parse(
        readFileSync('./firebase-admin-key.json', 'utf8')
    );
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    
    console.log('✅ Firebase Admin inicializado correctamente');
} catch (err) {
    console.error('⚠️ No se pudo inicializar Firebase Admin:', err.message);
    console.error('   Asegúrate de tener el archivo firebase-admin-key.json');
}

// --- Configuración (Middleware) ---
app.use(cors()); // Permite que tu frontend (puerto 3000) hable con este backend
app.use(express.json()); // Permite al servidor leer JSON de las peticiones POST/PUT

// --- API para TU PARTE (Flujo de Cliente) ---

// 1. GET: Obtener TODAS las habitaciones
app.get('/api/rooms', async (req, res) => {
    try {
        // 🚀 Consulta simple: Los datos ya están en JSONB, no necesitamos JOIN
        const { data: rooms, error } = await supabase
            .from('rooms')
            .select('*')
            .order('category', { ascending: true })
            .order('price', { ascending: true });

        if (error) throw error;
        
        console.log(`✅ ${rooms.length} habitaciones obtenidas correctamente`);
        res.status(200).json(rooms);

    } catch (err) {
        console.error('❌ Error al obtener habitaciones:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 2. GET: Obtener UNA habitación por ID
app.get('/api/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // 🚀 Consulta simple con filtro por room_id
        const { data: room, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('room_id', id)
            .maybeSingle(); // Devuelve null si no encuentra, en lugar de error

        if (error) throw error; 

        if (!room) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }
        
        console.log(`✅ Habitación ${id} obtenida correctamente`);
        res.status(200).json(room);
        
    } catch (err) {
        console.error(`❌ Error al obtener habitación ${req.params.id}:`, err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 3. POST: Crear una nueva habitación
app.post('/api/rooms', async (req, res) => {
    try {
        const roomData = req.body;
        
        const { data, error } = await supabase
            .from('rooms')
            .insert([roomData])
            .select();
        
        if (error) throw error;
        
        console.log('✅ Habitación creada:', data[0].room_id);
        res.status(201).json(data[0]);
        
    } catch (err) {
        console.error('❌ Error al crear habitación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 4. PUT: Actualizar una habitación
app.put('/api/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const roomData = req.body;
        
        const { data, error } = await supabase
            .from('rooms')
            .update(roomData)
            .eq('room_id', id)
            .select();
        
        if (error) throw error;
        
        console.log(`✅ Habitación ${id} actualizada`);
        res.status(200).json(data[0]);
        
    } catch (err) {
        console.error('❌ Error al actualizar habitación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 5. DELETE: Eliminar una habitación
app.delete('/api/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { error } = await supabase
            .from('rooms')
            .delete()
            .eq('room_id', id);
        
        if (error) throw error;
        
        console.log(`✅ Habitación ${id} eliminada`);
        res.status(200).json({ message: 'Habitación eliminada correctamente' });
        
    } catch (err) {
        console.error('❌ Error al eliminar habitación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 6. GET: Obtener TODAS las reservas
app.get('/api/reservations', async (req, res) => {
    try {
        const { data: reservations, error } = await supabase
            .from('reservations')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        console.log(`✅ Reservas obtenidas: ${reservations.length}`);
        res.status(200).json(reservations);
        
    } catch (err) {
        console.error('❌ Error al obtener reservas:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 4. POST: Crear una NUEVA reserva
app.post('/api/reservations', async (req, res) => {
    try {
        // Obtenemos los datos que nos envía el frontend
        const {
            room,
            formData,
            nights,
            totalPrice,
            startDate,
            endDate,
            firebaseUID
        } = req.body;

        // Preparamos el objeto para la inserción
        const clientName = `${formData.firstName} ${formData.lastName}`;
        const newReservation = {
            room_id: room.room_id,
            firebase_uid: firebaseUID,
            client_name: clientName,
            client_email: formData.email,
            start_date: startDate,
            end_date: endDate,
            nights: nights,
            total_price: totalPrice,
            status: 'reservada'
        };

        // 🚀 NUEVA SINTAXIS SUPABASE para INSERT
        // .insert() toma un objeto o array de objetos y .select() para devolver la fila creada
        const { data: result, error } = await supabase
            .from('reservations')
            .insert([newReservation])
            .select('*'); // Supabase devuelve un array, aunque insertemos uno

        if (error) throw error;

        // Éxito: Enviamos un '201 Created' y la nueva reserva
        const createdReservation = result[0];
        console.log('Reserva creada:', createdReservation);
        res.status(201).json(createdReservation);

    } catch (err) {
        console.error('Error al crear la reserva:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 4. GET: Obtener reservas de un usuario por firebase_uid
app.get('/api/reservations/user/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        
        // 🚀 Consulta para obtener reservas del usuario con info de la habitación
        const { data: reservations, error } = await supabase
            .from('reservations')
            .select(`
                *,
                rooms (
                    name,
                    category,
                    images
                )
            `)
            .eq('firebase_uid', uid)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Formatear los datos para incluir room_name
        const formattedReservations = reservations.map(reservation => ({
            ...reservation,
            room_name: reservation.rooms?.name || 'Habitación no disponible'
        }));

        console.log(`✅ ${formattedReservations.length} reservas obtenidas para usuario ${uid}`);
        res.status(200).json(formattedReservations);

    } catch (err) {
        console.error(`❌ Error al obtener reservas del usuario:`, err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ========================================
// ENDPOINTS PARA PANEL DE ADMINISTRACIÓN
// ========================================

// 5. GET: Obtener estadísticas del dashboard
app.get('/api/admin/stats', async (req, res) => {
    try {
        // Contar usuarios (desde Firebase, por ahora retornamos mock)
        const totalUsers = 12; // TODO: Integrar con Firebase Admin SDK
        
        // Contar reservas
        const { count: totalReservations, error: reservationsError } = await supabase
            .from('reservations')
            .select('*', { count: 'exact', head: true });
        
        if (reservationsError) throw reservationsError;
        
        // Calcular ingresos totales
        const { data: reservations, error: revenueError } = await supabase
            .from('reservations')
            .select('total_price');
        
        if (revenueError) throw revenueError;
        
        const totalRevenue = reservations.reduce((sum, r) => sum + (r.total_price || 0), 0);
        
        // Contar habitaciones
        const { count: totalRooms, error: roomsError } = await supabase
            .from('rooms')
            .select('*', { count: 'exact', head: true });
        
        if (roomsError) throw roomsError;
        
        // Reservas por estado
        const { data: reservationsByStatus, error: statusError } = await supabase
            .from('reservations')
            .select('status');
        
        if (statusError) throw statusError;
        
        const statusCount = reservationsByStatus.reduce((acc, r) => {
            acc[r.status] = (acc[r.status] || 0) + 1;
            return acc;
        }, {});
        
        res.status(200).json({
            totalUsers,
            totalReservations,
            totalRevenue,
            totalRooms,
            reservationsByStatus: {
                confirmadas: statusCount['confirmada'] || 0,
                pendientes: statusCount['pendiente'] || statusCount['reservada'] || 0,
                canceladas: statusCount['cancelada'] || 0
            }
        });
        
    } catch (err) {
        console.error('❌ Error al obtener estadísticas:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 6. GET: Obtener todas las reservas (Admin - Solo lectura)
app.get('/api/admin/reservations', async (req, res) => {
    try {
        const { data: reservations, error } = await supabase
            .from('reservations')
            .select(`
                *,
                rooms (
                    name,
                    category
                )
            `)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        console.log(`✅ ${reservations.length} reservas obtenidas para admin (solo lectura)`);
        res.status(200).json(reservations);
        
    } catch (err) {
        console.error('❌ Error al obtener reservas:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 9. POST: Crear una nueva habitación (Admin)
app.post('/api/admin/rooms', async (req, res) => {
    try {
        const newRoom = req.body;
        
        const { data, error } = await supabase
            .from('rooms')
            .insert([newRoom])
            .select();
        
        if (error) throw error;
        
        console.log('✅ Nueva habitación creada:', data[0].room_id);
        res.status(201).json(data[0]);
        
    } catch (err) {
        console.error('❌ Error al crear habitación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 10. PUT: Actualizar una habitación (Admin)
app.put('/api/admin/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRoom = req.body;
        
        const { data, error } = await supabase
            .from('rooms')
            .update(updatedRoom)
            .eq('room_id', id)
            .select();
        
        if (error) throw error;
        
        console.log(`✅ Habitación ${id} actualizada`);
        res.status(200).json(data[0]);
        
    } catch (err) {
        console.error('❌ Error al actualizar habitación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 11. DELETE: Eliminar una habitación (Admin)
app.delete('/api/admin/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { error } = await supabase
            .from('rooms')
            .delete()
            .eq('room_id', id);
        
        if (error) throw error;
        
        console.log(`✅ Habitación ${id} eliminada`);
        res.status(200).json({ message: 'Habitación eliminada exitosamente' });
        
    } catch (err) {
        console.error('❌ Error al eliminar habitación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ========================================
// ENDPOINTS PARA PANEL DE OPERADOR
// ========================================

// 12. GET: Obtener todas las reservas (Operador)
app.get('/api/operator/reservations', async (req, res) => {
    try {
        const { data: reservations, error } = await supabase
            .from('reservations')
            .select(`
                *,
                rooms (
                    name,
                    category,
                    images
                )
            `)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        console.log(`✅ ${reservations.length} reservas obtenidas para operador`);
        res.status(200).json(reservations);
        
    } catch (err) {
        console.error('❌ Error al obtener reservas:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 13. PUT: Actualizar estado de una reserva (Operador)
app.put('/api/operator/reservations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const { data, error } = await supabase
            .from('reservations')
            .update({ status })
            .eq('reservation_id', id)
            .select();
        
        if (error) throw error;
        
        console.log(`✅ Reserva ${id} actualizada a estado: ${status}`);
        res.status(200).json(data[0]);
        
    } catch (err) {
        console.error('❌ Error al actualizar reserva:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 14. PUT: Actualizar estado de una reserva
app.put('/api/reservations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const { data, error } = await supabase
            .from('reservations')
            .update({ status })
            .eq('reservation_id', id)
            .select();
        
        if (error) throw error;
        
        console.log(`✅ Reserva ${id} actualizada a estado: ${status}`);
        res.status(200).json(data[0]);
        
    } catch (err) {
        console.error('❌ Error al actualizar reserva:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 15. DELETE: Cancelar una reserva
app.delete('/api/reservations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabase
            .from('reservations')
            .update({ status: 'cancelada' })
            .eq('reservation_id', id)
            .select();
        
        if (error) throw error;
        
        console.log(`✅ Reserva ${id} cancelada`);
        res.status(200).json(data[0]);
        
    } catch (err) {
        console.error('❌ Error al cancelar reserva:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 16. DELETE: Cancelar/Eliminar una reserva (Operador) - LEGACY
app.delete('/api/operator/reservations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // En lugar de eliminar, mejor cambiar el estado a "cancelada"
        const { data, error } = await supabase
            .from('reservations')
            .update({ status: 'cancelada' })
            .eq('reservation_id', id)
            .select();
        
        if (error) throw error;
        
        console.log(`✅ Reserva ${id} cancelada`);
        res.status(200).json(data[0]);
        
    } catch (err) {
        console.error('❌ Error al cancelar reserva:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 15. GET: Obtener estadísticas para operador
app.get('/api/operator/stats', async (req, res) => {
    try {
        // Reservas de hoy
        const today = new Date().toISOString().split('T')[0];
        const { data: todayReservations, error: todayError } = await supabase
            .from('reservations')
            .select('*')
            .gte('start_date', today)
            .lte('start_date', today);
        
        if (todayError) throw todayError;
        
        // Reservas pendientes
        const { data: pendingReservations, error: pendingError } = await supabase
            .from('reservations')
            .select('*')
            .in('status', ['pendiente', 'reservada']);
        
        if (pendingError) throw pendingError;
        
        // Habitaciones ocupadas hoy
        const { data: occupiedRooms, error: occupiedError } = await supabase
            .from('reservations')
            .select('room_id')
            .lte('start_date', today)
            .gte('end_date', today)
            .eq('status', 'confirmada');
        
        if (occupiedError) throw occupiedError;
        
        // Total de habitaciones
        const { count: totalRooms, error: roomsError } = await supabase
            .from('rooms')
            .select('*', { count: 'exact', head: true });
        
        if (roomsError) throw roomsError;
        
        const occupiedCount = occupiedRooms?.length || 0;
        const availableRooms = (totalRooms || 0) - occupiedCount;
        
        res.status(200).json({
            reservasHoy: todayReservations?.length || 0,
            habitacionesDisponibles: availableRooms,
            habitacionesOcupadas: occupiedCount,
            pagosPendientes: pendingReservations?.length || 0
        });
        
    } catch (err) {
        console.error('❌ Error al obtener estadísticas de operador:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 16. GET: Obtener datos para gráficos (Admin)
app.get('/api/admin/charts', async (req, res) => {
    try {
        // Reservas por mes (últimos 6 meses)
        const { data: reservations, error: resError } = await supabase
            .from('reservations')
            .select('created_at, total_price, status')
            .gte('created_at', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString());
        
        if (resError) throw resError;
        
        // Agrupar por mes
        const monthlyData = {};
        reservations.forEach(res => {
            const month = new Date(res.created_at).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' });
            if (!monthlyData[month]) {
                monthlyData[month] = { count: 0, revenue: 0 };
            }
            monthlyData[month].count++;
            monthlyData[month].revenue += res.total_price || 0;
        });
        
        // Reservas por estado
        const statusCount = reservations.reduce((acc, r) => {
            acc[r.status] = (acc[r.status] || 0) + 1;
            return acc;
        }, {});
        
        // Habitaciones más reservadas
        const { data: roomStats, error: roomError } = await supabase
            .from('reservations')
            .select('room_id, rooms(name)')
            .not('room_id', 'is', null);
        
        if (roomError) throw roomError;
        
        const roomCount = {};
        roomStats.forEach(r => {
            const roomName = r.rooms?.name || 'Desconocida';
            roomCount[roomName] = (roomCount[roomName] || 0) + 1;
        });
        
        res.status(200).json({
            monthlyReservations: Object.keys(monthlyData).map(month => ({
                month,
                count: monthlyData[month].count,
                revenue: monthlyData[month].revenue
            })),
            reservationsByStatus: statusCount,
            topRooms: Object.entries(roomCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }))
        });
        
    } catch (err) {
        console.error('❌ Error al obtener datos de gráficos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 17. GET: Obtener todos los operadores/admins
app.get('/api/admin/operators', async (req, res) => {
    try {
        const { data: operators, error } = await supabase
            .from('operators')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        console.log(`✅ ${operators.length} operadores obtenidos`);
        res.status(200).json(operators);
        
    } catch (err) {
        console.error('❌ Error al obtener operadores:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 17b. POST: Crear nuevo operador/admin
app.post('/api/admin/operators', async (req, res) => {
    try {
        console.log('📥 Recibiendo solicitud para crear operador:', req.body);
        const { full_name, email, password, role } = req.body;
        
        let firebaseUID = null;
        
        // PASO 1: Crear usuario en Firebase Authentication
        try {
            console.log('🔥 Intentando crear usuario en Firebase...');
            const firebaseUser = await admin.auth().createUser({
                email: email,
                password: password,
                displayName: full_name
            });
            
            firebaseUID = firebaseUser.uid;
            console.log(`✅ Usuario creado en Firebase: ${email} (UID: ${firebaseUID})`);
            
        } catch (firebaseError) {
            console.error('❌ Error al crear usuario en Firebase:', firebaseError);
            console.error('   Código:', firebaseError.code);
            console.error('   Mensaje:', firebaseError.message);
            // Si Firebase falla, devolvemos error
            return res.status(500).json({ 
                error: 'Error al crear usuario en Firebase: ' + firebaseError.message 
            });
        }
        
        // PASO 2: Guardar en Supabase con el UID de Firebase
        console.log('💾 Guardando en Supabase...');
        const { data, error } = await supabase
            .from('operators')
            .insert([{
                full_name,
                email,
                password_hash: firebaseUID, // Guardamos el UID de Firebase
                role
            }])
            .select();
        
        if (error) {
            console.error('❌ Error de Supabase:', error);
            // Si Supabase falla, eliminamos el usuario de Firebase
            console.log('🔄 Eliminando usuario de Firebase por error en Supabase...');
            await admin.auth().deleteUser(firebaseUID);
            throw error;
        }
        
        console.log(`✅ Operador creado en Supabase: ${email}`);
        console.log('✅ Usuario creado exitosamente en ambos sistemas');
        
        res.status(201).json({
            ...data[0],
            message: 'Usuario creado correctamente en Firebase y Supabase'
        });
        
    } catch (err) {
        console.error('❌ Error al crear operador:', err);
        console.error('   Stack:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor: ' + err.message });
    }
});

// 17c. PUT: Actualizar operador/admin
app.put('/api/admin/operators/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, role } = req.body;
        
        const { data, error } = await supabase
            .from('operators')
            .update({ full_name, email, role })
            .eq('operator_id', id)
            .select();
        
        if (error) throw error;
        
        console.log(`✅ Operador actualizado: ${id}`);
        res.status(200).json(data[0]);
        
    } catch (err) {
        console.error('❌ Error al actualizar operador:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 17d. DELETE: Eliminar operador/admin
app.delete('/api/admin/operators/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ Intentando eliminar operador ID: ${id}`);
        
        // PASO 1: Obtener el UID de Firebase del operador
        const { data: operator, error: fetchError } = await supabase
            .from('operators')
            .select('password_hash, email')
            .eq('operator_id', id)
            .single();
        
        if (fetchError) {
            console.error('❌ Error al obtener operador:', fetchError);
            throw fetchError;
        }
        
        console.log(`📋 Operador encontrado: ${operator.email}`);
        
        // PASO 2: Eliminar de Supabase
        console.log('💾 Eliminando de Supabase...');
        const { error } = await supabase
            .from('operators')
            .delete()
            .eq('operator_id', id);
        
        if (error) {
            console.error('❌ Error al eliminar de Supabase:', error);
            throw error;
        }
        
        console.log('✅ Eliminado de Supabase');
        
        // PASO 3: Eliminar de Firebase (si tiene UID)
        if (operator?.password_hash) {
            try {
                console.log(`🔥 Eliminando de Firebase (UID: ${operator.password_hash})...`);
                await admin.auth().deleteUser(operator.password_hash);
                console.log(`✅ Usuario eliminado de Firebase: ${operator.email}`);
            } catch (firebaseError) {
                console.error('⚠️ No se pudo eliminar de Firebase:', firebaseError.message);
            }
        }
        
        console.log(`✅ Operador eliminado completamente: ${id}`);
        res.status(200).json({ message: 'Operador eliminado correctamente' });
        
    } catch (err) {
        console.error('❌ Error al eliminar operador:', err);
        console.error('   Stack:', err.stack);
        res.status(500).json({ error: 'Error interno del servidor: ' + err.message });
    }
});

// 18. GET: Obtener logs del sistema
app.get('/api/admin/logs', async (req, res) => {
    try {
        const { data: logs, error } = await supabase
            .from('system_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
        
        if (error) throw error;
        
        console.log(`✅ ${logs.length} logs obtenidos`);
        res.status(200).json(logs);
        
    } catch (err) {
        console.error('❌ Error al obtener logs:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 19. POST: Verificar login de operador (alternativo a Firebase)
app.post('/api/operators/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Buscar operador por email
        const { data: operator, error } = await supabase
            .from('operators')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error || !operator) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        
        // Comparar contraseña (en texto plano por ahora)
        if (operator.password_hash !== password) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        
        // Login exitoso
        res.status(200).json({
            operator_id: operator.operator_id,
            full_name: operator.full_name,
            email: operator.email,
            role: operator.role
        });
        
    } catch (err) {
        console.error('❌ Error en login de operador:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 20. POST: Crear log del sistema
app.post('/api/logs', async (req, res) => {
    try {
        const { event_type, description, user_email } = req.body;
        
        const { data, error } = await supabase
            .from('system_logs')
            .insert([{
                event_type,
                description,
                user_email
            }])
            .select();
        
        if (error) throw error;
        
        res.status(201).json(data[0]);
        
    } catch (err) {
        console.error('❌ Error al crear log:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// --- Endpoint de prueba ---
app.get('/', async (req, res) => {
    try {
        // 🚀 Prueba simple: Contar habitaciones en la BD
        const { count, error } = await supabase
            .from('rooms')
            .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        
        res.send(`✅ ¡Conexión a Supabase exitosa! Habitaciones en la BD: ${count}`); 
        
    } catch (err) {
        console.error('❌ Error al conectar a la BD:', err);
        res.status(500).send('Error al conectar con la base de datos Supabase');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
});