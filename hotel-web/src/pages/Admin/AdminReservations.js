import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '../../components/Admin/AdminLayout';
import { useCanMutate } from '../../hooks/useCanMutate';
import { getAdminReservations, updateStatus } from '../../services/reservationsService';
import { formatDate, formatPrice, statusColor } from '../../utils/format';
import { buttonStyles } from '../../utils/buttonStyles';

function AdminReservations() {
    const canMutate = useCanMutate();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Obtener reservas del backend
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                setLoading(true);
                const data = await getAdminReservations();
                setReservations(data);
                setLoading(false);
                
            } catch (err) {
                console.error('Error al cargar reservas:', err);
                setError(err.message);
                setLoading(false);
            }
        };
        
        fetchReservations();
    }, []);
    
    // Filtrar reservas (null-safe: campos opcionales pueden faltar)
    const filteredReservations = reservations.filter(reservation => {
        const clientName = (reservation.client_name || '').toLowerCase();
        const clientEmail = (reservation.client_email || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        const matchesSearch = clientName.includes(term) || clientEmail.includes(term);
        const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => `${statusColor(status)} text-white`;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmada':
                return 'fa-check-circle';
            case 'pendiente':
                return 'fa-clock';
            case 'cancelada':
                return 'fa-times-circle';
            case 'completada':
                return 'fa-flag-checkered';
            default:
                return 'fa-question-circle';
        }
    };

    const handleStatusChange = async (reservationId, newStatus) => {
        try {
            await updateStatus(reservationId, newStatus);

            // Actualizar estado local
            setReservations(reservations.map(r => 
                r.reservation_id === reservationId ? { ...r, status: newStatus } : r
            ));
        } catch (err) {
            console.error('Error al cambiar estado:', err);
            alert('Error al actualizar la reserva');
        }
    };

    const stats = {
        total: reservations.length,
        confirmadas: reservations.filter(r => r.status === 'confirmada').length,
        pendientes: reservations.filter(r => r.status === 'pendiente').length,
        canceladas: reservations.filter(r => r.status === 'cancelada').length
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <i className="fas fa-spinner fa-spin text-4xl text-white mb-4"></i>
                        <p className="text-white">Cargando reservas...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }
    
    if (error) {
        return (
            <AdminLayout>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Helmet>
                <title>Gestión de Reservas - Panel de Administración</title>
            </Helmet>

            {/* Header con filtros */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <i className="fas fa-clipboard-list text-white text-3xl"></i>
                    <h1 className="text-3xl font-bold text-white">Todas las Reservas ({stats.total})</h1>
                </div>
            </div>

            {/* Filtros por estado */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setFilterStatus('all')}
                    className={buttonStyles({ variant: filterStatus === 'all' ? 'primary' : 'secondary' })}>
                    Todas ({stats.total})
                </button>
                <button
                    onClick={() => setFilterStatus('confirmada')}
                    className={buttonStyles({ variant: filterStatus === 'confirmada' ? 'primary' : 'secondary' })}>
                    Confirmadas ({stats.confirmadas})
                </button>
                <button
                    onClick={() => setFilterStatus('pendiente')}
                    className={buttonStyles({ variant: filterStatus === 'pendiente' ? 'primary' : 'secondary' })}>
                    Pendientes ({stats.pendientes})
                </button>
                <button
                    onClick={() => setFilterStatus('cancelada')}
                    className={buttonStyles({ variant: filterStatus === 'cancelada' ? 'primary' : 'secondary' })}>
                    Canceladas ({stats.canceladas})
                </button>
            </div>

            {/* Lista de reservas */}
            <div className="space-y-4">
                {filteredReservations.map((reservation) => (
                    <div
                        key={reservation.reservation_id}
                        className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-xl border border-navy-500/30 hover:border-navy-400/50 transition-all duration-300">
                        <div className="flex items-center gap-6 p-6">
                            {/* Imagen de la habitación */}
                            <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                                <img
                                    src={reservation.image}
                                    alt={reservation.room_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Información de la reserva */}
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-white">{reservation.room_name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${getStatusBadge(reservation.status)}`}>
                                        <i className={`fas ${getStatusIcon(reservation.status)}`}></i>
                                        {(reservation.status || '').charAt(0).toUpperCase() + (reservation.status || '').slice(1)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Cliente</p>
                                        <p className="text-white font-semibold">{reservation.client_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Check-in - Check-out</p>
                                        <p className="text-white font-semibold">
                                            <i className="fas fa-calendar text-gold-400 mr-1"></i>
                                            {formatDate(reservation.start_date)} - {formatDate(reservation.end_date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Huéspedes / Noches</p>
                                        <p className="text-white font-semibold">
                                            <i className="fas fa-users text-green-400 mr-1"></i>
                                            {reservation.guests} • {reservation.nights} noches
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Total</p>
                                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                                            {formatPrice(reservation.total_price)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Botón de cambiar estado */}
                            {canMutate && (
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={() => handleStatusChange(reservation.reservation_id, 'confirmada')}
                                        className={buttonStyles({ variant: 'confirm' })}>
                                        <i className="fas fa-check"></i>
                                        <span>Confirmar</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredReservations.length === 0 && (
                <div className="text-center py-16">
                    <i className="fas fa-inbox text-gray-600 text-6xl mb-4"></i>
                    <h2 className="text-2xl font-bold text-gray-400">No hay reservas {filterStatus !== 'all' ? filterStatus + 's' : ''}</h2>
                </div>
            )}
        </AdminLayout>
    );
}

export default AdminReservations;
