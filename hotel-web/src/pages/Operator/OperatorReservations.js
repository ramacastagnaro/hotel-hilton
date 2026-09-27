import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import OperatorLayout from '../../components/Operator/OperatorLayout';
import { useCanMutate } from '../../hooks/useCanMutate';
import {
    cancelReservation,
    getReservations,
    updateStatus,
} from '../../services/reservationsService';
import { buttonStyles } from '../../utils/buttonStyles';
import { formatDate, formatPrice, statusColor } from '../../utils/format';

function OperatorReservations() {
    const canMutate = useCanMutate();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    // Obtener reservas del backend
    useEffect(() => {
        fetchReservations();
    }, []);
    
    const fetchReservations = async () => {
        try {
            setLoading(true);
            const data = await getReservations();
            setReservations(data);
            setError(null);
        } catch (err) {
            console.error('Error al cargar reservas:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return (
            <OperatorLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-white text-xl">Cargando reservas...</div>
                </div>
            </OperatorLayout>
        );
    }
    
    if (error) {
        return (
            <OperatorLayout>
                <div className="bg-red-500 text-white p-4 rounded">
                    Error: {error}
                    <button 
                        onClick={fetchReservations}
                        className={buttonStyles({ variant: 'destructive', className: 'mt-2' })}>
                        Reintentar
                    </button>
                </div>
            </OperatorLayout>
        );
    }

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'pagado':
                return 'bg-green-600';
            case 'pendiente':
                return 'bg-yellow-600';
            case 'reembolsado':
                return 'bg-blue-600';
            default:
                return 'bg-gray-600';
        }
    };

    const handleLiberate = async (reservationId) => {
        if (window.confirm('¿Estás seguro de que deseas liberar esta reserva?')) {
            try {
                await cancelReservation(reservationId);

                // Actualizar estado local
                setReservations(reservations.map(r =>
                    r.reservation_id === reservationId ? { ...r, status: 'cancelada' } : r
                ));
            } catch (err) {
                console.error('Error al liberar reserva:', err);
                alert('Error al liberar la reserva');
            }
        }
    };

    const handleConfirm = async (reservationId) => {
        try {
            // "Confirmar" siempre avanza a confirmada; nunca es un toggle invertido
            await updateStatus(reservationId, 'confirmada');

            // Actualizar estado local
            setReservations(reservations.map(r =>
                r.reservation_id === reservationId ? { ...r, status: 'confirmada' } : r
            ));
        } catch (err) {
            console.error('Error al confirmar reserva:', err);
            alert('Error al confirmar la reserva');
        }
    };

    const handleComplete = async (reservationId) => {
        try {
            await updateStatus(reservationId, 'completada');

            // Actualizar estado local
            setReservations(reservations.map(r =>
                r.reservation_id === reservationId ? { ...r, status: 'completada' } : r
            ));
        } catch (err) {
            console.error('Error al completar reserva:', err);
            alert('Error al completar la reserva');
        }
    };

    const handleViewDetails = (reservation) => {
        setSelectedReservation(reservation);
        setShowModal(true);
    };

    return (
        <OperatorLayout>
            <Helmet>
                <title>Gestionar Reservas - Panel de Operador</title>
            </Helmet>

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <i className="fas fa-clipboard-list text-white text-3xl"></i>
                    <h1 className="text-3xl font-bold text-white">Gestión de Reservas</h1>
                </div>
            </div>

            {/* Lista de reservas */}
            <div className="space-y-4">
                {reservations.map((reservation) => (
                    <div
                        key={reservation.reservation_id}
                        className="bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-2xl p-6 shadow-xl border border-emerald-700/30 hover:border-emerald-500/50 transition-all duration-300">
                        <div className="flex items-start justify-between">
                            {/* Información principal */}
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-3">
                                    <h3 className="text-xl font-bold text-white">
                                        {reservation.reservation_code}
                                    </h3>
                                    <span className={`px-3 py-1 ${statusColor(reservation.status)} text-white text-xs font-bold rounded-full`}>
                                        {reservation.status}
                                    </span>
                                    <span className={`px-3 py-1 ${getPaymentStatusColor(reservation.payment_status)} text-white text-xs font-bold rounded-full`}>
                                        {reservation.payment_status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-400">Cliente</p>
                                        <p className="text-white font-semibold">{reservation.client_name}</p>
                                        <p className="text-gray-400 text-xs">{reservation.client_email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Habitación</p>
                                        <p className="text-white font-semibold">#{reservation.room_number}</p>
                                        <p className="text-gray-400 text-xs">{reservation.room_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Fechas</p>
                                        <p className="text-white font-semibold">
                                            {formatDate(reservation.start_date)}
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            hasta {formatDate(reservation.end_date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Total</p>
                                        <p className="text-2xl font-bold text-emerald-400">
                                            {formatPrice(reservation.total_price)}
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            {reservation.nights} noches • {reservation.guests} huéspedes
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex flex-col gap-2 ml-4">
                                <button
                                    onClick={() => handleViewDetails(reservation)}
                                    className={buttonStyles({ variant: 'primary', size: 'sm' })}>
                                    <i className="fas fa-eye"></i>
                                    <span>Ver</span>
                                </button>
                                {canMutate && (
                                    <>
                                        {reservation.status === 'pendiente' && (
                                            <button
                                                onClick={() => handleConfirm(reservation.reservation_id)}
                                                className={buttonStyles({ variant: 'confirm', size: 'sm' })}>
                                                <i className="fas fa-check"></i>
                                                <span>Confirmar</span>
                                            </button>
                                        )}
                                        {reservation.status === 'confirmada' && (
                                            <button
                                                onClick={() => handleComplete(reservation.reservation_id)}
                                                className={buttonStyles({ variant: 'primary', size: 'sm' })}>
                                                <i className="fas fa-check-double"></i>
                                                <span>Completar</span>
                                            </button>
                                        )}
                                        {reservation.status !== 'cancelada' && reservation.status !== 'completada' && (
                                            <button
                                                onClick={() => handleLiberate(reservation.reservation_id)}
                                                className={buttonStyles({ variant: 'destructive', size: 'sm' })}>
                                                <i className="fas fa-times"></i>
                                                <span>Liberar</span>
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de detalles */}
            {showModal && selectedReservation && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-emerald-700/30 animate-fadeIn">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                Detalles de Reserva - {selectedReservation.reservation_code}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                aria-label="Cerrar"
                                className="text-gray-400 hover:text-white transition-colors">
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Información del Cliente */}
                            <div className="bg-emerald-900/50 rounded-xl p-4 border border-emerald-700/30">
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                    <i className="fas fa-user text-emerald-400"></i>
                                    Información del Cliente
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-400">Nombre</p>
                                        <p className="text-white font-semibold">{selectedReservation.client_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Email</p>
                                        <p className="text-white font-semibold">{selectedReservation.client_email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Teléfono</p>
                                        <p className="text-white font-semibold">{selectedReservation.client_phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Huéspedes</p>
                                        <p className="text-white font-semibold">{selectedReservation.guests} personas</p>
                                    </div>
                                </div>
                            </div>

                            {/* Información de la Reserva */}
                            <div className="bg-emerald-900/50 rounded-xl p-4 border border-emerald-700/30">
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                    <i className="fas fa-bed text-emerald-400"></i>
                                    Información de la Reserva
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-400">Habitación</p>
                                        <p className="text-white font-semibold">#{selectedReservation.room_number} - {selectedReservation.room_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Check-in</p>
                                        <p className="text-white font-semibold">{formatDate(selectedReservation.start_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Check-out</p>
                                        <p className="text-white font-semibold">{formatDate(selectedReservation.end_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Noches</p>
                                        <p className="text-white font-semibold">{selectedReservation.nights} noches</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Estado</p>
                                        <span className={`inline-block px-3 py-1 ${statusColor(selectedReservation.status)} text-white text-xs font-bold rounded-full`}>
                                            {selectedReservation.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Pago</p>
                                        <span className={`inline-block px-3 py-1 ${getPaymentStatusColor(selectedReservation.payment_status)} text-white text-xs font-bold rounded-full`}>
                                            {selectedReservation.payment_status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-white font-bold text-lg">Total</span>
                                    <span className="text-white font-bold text-3xl">
                                        {formatPrice(selectedReservation.total_price)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            className={buttonStyles({ variant: 'secondary', size: 'lg', className: 'w-full mt-6' })}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </OperatorLayout>
    );
}

export default OperatorReservations;
