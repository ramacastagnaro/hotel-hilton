import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { buttonStyles } from '../utils/buttonStyles';

function PaymentSuccessPage() {
    const location = useLocation();
    const [reservationData, setReservationData] = useState(null);

    useEffect(() => {
        // Obtenemos los datos de la reserva del state de navegación
        if (location.state && location.state.reservation) {
            setReservationData(location.state.reservation);
        }
    }, [location]);

    // Función para generar un código de confirmación único
    const generateConfirmationCode = () => {
        if (reservationData && reservationData.reservation_id) {
            return `D${String(reservationData.reservation_id).padStart(3, '0')}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        }
        return 'D054N6YCW'; // Código por defecto
    };

    // Función para formatear el precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Función para descargar el PDF
    const handleDownloadPDF = () => {
        // Crear contenido del PDF como texto
        const confirmationCode = generateConfirmationCode();
        const pdfContent = `
═══════════════════════════════════════
        HOTEL HILTON
    COMPROBANTE DE RESERVA
═══════════════════════════════════════

Código de Confirmación: ${confirmationCode}

DETALLES DE LA RESERVA:
───────────────────────────────────────
Habitación: ${reservationData.room_name || 'N/A'}
Check-in: ${formatDate(reservationData.start_date)}
Check-out: ${formatDate(reservationData.end_date)}
Noches: ${reservationData.nights}

TOTAL PAGADO: ${formatPrice(reservationData.total_price)}

═══════════════════════════════════════
Gracias por elegirnos
Hotel Hilton - Tu escapada de lujo
═══════════════════════════════════════
        `;

        // Crear un Blob con el contenido
        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        
        // Crear un enlace temporal y hacer clic en él
        const link = document.createElement('a');
        link.href = url;
        link.download = `Reserva-${confirmationCode}.txt`;
        document.body.appendChild(link);
        link.click();
        
        // Limpiar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    if (!reservationData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-gray-600">Cargando información de la reserva...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-50 via-surface-50 to-gold-50 flex items-center justify-center p-4 py-12">
            <Helmet>
                <title>¡Pago Exitoso! - Hotel Hilton</title>
            </Helmet>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-fadeIn">
                {/* Icono de éxito */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-scaleIn">
                        <i className="fas fa-check text-white text-4xl"></i>
                    </div>
                </div>

                {/* Título */}
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    ¡Pago Exitoso!
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Tu reserva ha sido confirmada
                </p>

                {/* Número de confirmación */}
                <div className="bg-gradient-to-r from-navy-50 to-gold-50 rounded-2xl p-6 mb-6 border border-navy-100">
                    <p className="text-sm text-gray-600 text-center mb-2">
                        Número de Confirmación
                    </p>
                    <p className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-navy-800 to-gold-500">
                        {generateConfirmationCode()}
                    </p>
                </div>

                {/* Detalles de la reserva */}
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Habitación:</span>
                        <span className="text-gray-800 font-semibold">
                            {reservationData.room_name || 'Habitación Estándar'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Check-in:</span>
                        <span className="text-gray-800 font-semibold">
                            {formatDate(reservationData.start_date)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Check-out:</span>
                        <span className="text-gray-800 font-semibold">
                            {formatDate(reservationData.end_date)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-3">
                        <span className="text-gray-600 font-medium">Total:</span>
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                            {formatPrice(reservationData.total_price)}
                        </span>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-3">
                    <button 
                        onClick={handleDownloadPDF}
                        className={buttonStyles({ variant: 'primary', size: 'lg', className: 'w-full' })}>
                        <i className="fas fa-file-pdf"></i>
                        <span>Descargar Ticket PDF</span>
                    </button>

                    <Link
                        to="/perfil"
                        className={buttonStyles({ variant: 'confirm', size: 'lg', className: 'w-full' })}>
                        <i className="fas fa-user-circle"></i>
                        <span>Ir al Panel de Usuario</span>
                    </Link>

                    <Link
                        to="/"
                        className={buttonStyles({ variant: 'secondary', size: 'lg', className: 'w-full' })}>
                        <i className="fas fa-home"></i>
                        <span>Volver al Inicio</span>
                    </Link>
                </div>

                {/* Mensaje adicional */}
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-gray-600 text-center">
                        <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                        Hemos enviado un correo de confirmación a tu email
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccessPage;
