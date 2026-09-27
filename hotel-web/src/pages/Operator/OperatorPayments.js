import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import OperatorLayout from '../../components/Operator/OperatorLayout';
import { useCanMutate } from '../../hooks/useCanMutate';
import { getReservations, updatePayment } from '../../services/reservationsService';
import { formatPrice } from '../../utils/format';
import { buttonStyles } from '../../utils/buttonStyles';

function OperatorPayments() {
    const canMutate = useCanMutate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    
    // Obtener pagos del backend (usando reservas)
    useEffect(() => {
        fetchPayments();
    }, []);
    
    const fetchPayments = async () => {
        try {
            setLoading(true);
            const data = await getReservations();
            // Convertir reservas a formato de pagos
            const paymentsData = data.map(reservation => ({
                id: reservation.reservation_id,
                reservation_code: `RES${String(reservation.reservation_id).padStart(3, '0')}`,
                client_name: reservation.client_name || 'Cliente',
                room_number: reservation.room_id,
                amount: reservation.total_price,
                status: reservation.payment_status || 'pendiente',
                method: reservation.payment_method || 'Pendiente',
                date: reservation.created_at
            }));
            setPayments(paymentsData);
            setError(null);
        } catch (err) {
            console.error('Error al cargar pagos:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return (
            <OperatorLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-white text-xl">Cargando pagos...</div>
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
                        onClick={fetchPayments}
                        className={buttonStyles({ variant: 'destructive', className: 'mt-2' })}>
                        Reintentar
                    </button>
                </div>
            </OperatorLayout>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completado':
                return 'bg-green-600';
            case 'pendiente':
                return 'bg-yellow-600';
            case 'rechazado':
                return 'bg-red-600';
            default:
                return 'bg-gray-600';
        }
    };

    const handleProcessPayment = (payment) => {
        setSelectedPayment(payment);
        setShowProcessModal(true);
    };

    const confirmPayment = async () => {
        if (!paymentMethod) {
            alert('Por favor selecciona un método de pago');
            return;
        }

        try {
            // Persistir el pago en el backend para que sobreviva a una recarga
            await updatePayment(selectedPayment.id, {
                payment_status: 'completado',
                payment_method: paymentMethod
            });

            setPayments(payments.map(p =>
                p.id === selectedPayment.id
                    ? { ...p, status: 'completado', method: paymentMethod }
                    : p
            ));

            setShowProcessModal(false);
            setPaymentMethod('');
            setSelectedPayment(null);
            alert('¡Pago procesado exitosamente!');
        } catch (err) {
            console.error('Error al procesar el pago:', err);
            alert('No se pudo procesar el pago. Inténtalo de nuevo.');
        }
    };

    const totalPendiente = payments
        .filter(p => p.status === 'pendiente')
        .reduce((sum, p) => sum + p.amount, 0);

    const totalCompletado = payments
        .filter(p => p.status === 'completado')
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <OperatorLayout>
            <Helmet>
                <title>Procesar Pagos - Panel de Operador</title>
            </Helmet>

            <div className="flex items-center gap-3 mb-8">
                <i className="fas fa-credit-card text-white text-3xl"></i>
                <h1 className="text-3xl font-bold text-white">Procesar Pagos</h1>
            </div>

            {/* Resumen de Pagos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <i className="fas fa-clock text-white text-2xl"></i>
                        <h3 className="text-white font-bold text-lg">Pagos Pendientes</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{formatPrice(totalPendiente)}</p>
                    <p className="text-yellow-200 text-sm mt-2">
                        {payments.filter(p => p.status === 'pendiente').length} transacciones
                    </p>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <i className="fas fa-check-circle text-white text-2xl"></i>
                        <h3 className="text-white font-bold text-lg">Pagos Completados</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{formatPrice(totalCompletado)}</p>
                    <p className="text-green-200 text-sm mt-2">
                        {payments.filter(p => p.status === 'completado').length} transacciones
                    </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <i className="fas fa-dollar-sign text-white text-2xl"></i>
                        <h3 className="text-white font-bold text-lg">Total Procesado</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{formatPrice(totalCompletado + totalPendiente)}</p>
                    <p className="text-emerald-200 text-sm mt-2">
                        {payments.length} transacciones totales
                    </p>
                </div>
            </div>

            {/* Lista de Pagos */}
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-2xl p-6 shadow-xl border border-emerald-700/30">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <i className="fas fa-list text-emerald-400"></i>
                    Transacciones
                </h2>

                <div className="space-y-4">
                    {payments.map((payment) => (
                        <div
                            key={payment.id}
                            className="bg-emerald-900/50 rounded-xl p-5 border border-emerald-700/30 hover:border-emerald-500/50 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 ${getStatusColor(payment.status)} rounded-full flex items-center justify-center`}>
                                        <i className={`fas ${payment.status === 'completado' ? 'fa-check' : 'fa-clock'} text-white text-xl`}></i>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">{payment.reservation_code}</h3>
                                        <p className="text-gray-400 text-sm">{payment.client_name} • Habitación {payment.room_number}</p>
                                        <p className="text-gray-500 text-xs">{payment.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-gray-400 text-sm">Monto</p>
                                        <p className="text-2xl font-bold text-white">{formatPrice(payment.amount)}</p>
                                        <p className="text-gray-400 text-xs">{payment.method}</p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <span className={`px-4 py-2 ${getStatusColor(payment.status)} text-white text-sm font-bold rounded-lg text-center`}>
                                            {payment.status}
                                        </span>
                                        {canMutate && payment.status === 'pendiente' && (
                                            <button
                                                onClick={() => handleProcessPayment(payment)}
                                                className={buttonStyles({ variant: 'confirm' })}>
                                                <i className="fas fa-credit-card"></i>
                                                <span>Procesar</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de Procesar Pago */}
            {showProcessModal && selectedPayment && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-emerald-700/30 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <i className="fas fa-credit-card text-emerald-400"></i>
                            Procesar Pago
                        </h2>

                        {/* Información del Pago */}
                        <div className="bg-emerald-900/50 rounded-xl p-4 border border-emerald-700/30 mb-6">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Reserva:</span>
                                    <span className="text-white font-bold">{selectedPayment.reservation_code}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Cliente:</span>
                                    <span className="text-white font-bold">{selectedPayment.client_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Habitación:</span>
                                    <span className="text-white font-bold">#{selectedPayment.room_number}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-emerald-700/30">
                                    <span className="text-gray-400 text-lg">Monto Total:</span>
                                    <span className="text-emerald-400 font-bold text-2xl">
                                        {formatPrice(selectedPayment.amount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Método de Pago */}
                        <div className="mb-6">
                            <label className="block text-white font-bold mb-3">Método de Pago</label>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setPaymentMethod('Efectivo')}
                                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                                        paymentMethod === 'Efectivo'
                                            ? 'border-emerald-500 bg-emerald-600/30'
                                            : 'border-emerald-700/30 hover:border-emerald-600/50'
                                    }`}>
                                    <i className="fas fa-money-bill-wave text-green-400 text-xl"></i>
                                    <span className="text-white font-semibold">Efectivo</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('Tarjeta de Crédito')}
                                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                                        paymentMethod === 'Tarjeta de Crédito'
                                            ? 'border-emerald-500 bg-emerald-600/30'
                                            : 'border-emerald-700/30 hover:border-emerald-600/50'
                                    }`}>
                                    <i className="fas fa-credit-card text-blue-400 text-xl"></i>
                                    <span className="text-white font-semibold">Tarjeta de Crédito</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('Tarjeta de Débito')}
                                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                                        paymentMethod === 'Tarjeta de Débito'
                                            ? 'border-emerald-500 bg-emerald-600/30'
                                            : 'border-emerald-700/30 hover:border-emerald-600/50'
                                    }`}>
                                    <i className="fas fa-credit-card text-gold-400 text-xl"></i>
                                    <span className="text-white font-semibold">Tarjeta de Débito</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('Transferencia')}
                                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                                        paymentMethod === 'Transferencia'
                                            ? 'border-emerald-500 bg-emerald-600/30'
                                            : 'border-emerald-700/30 hover:border-emerald-600/50'
                                    }`}>
                                    <i className="fas fa-exchange-alt text-yellow-400 text-xl"></i>
                                    <span className="text-white font-semibold">Transferencia</span>
                                </button>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowProcessModal(false);
                                    setPaymentMethod('');
                                    setSelectedPayment(null);
                                }}
                                className={buttonStyles({ variant: 'secondary', className: 'flex-1' })}>
                                Cancelar
                            </button>
                            <button
                                onClick={confirmPayment}
                                className={buttonStyles({ variant: 'confirm', className: 'flex-1' })}>
                                Confirmar Pago
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </OperatorLayout>
    );
}

export default OperatorPayments;
