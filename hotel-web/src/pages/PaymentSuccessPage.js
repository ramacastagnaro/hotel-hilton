import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { getPaymentStatus } from '../services/paymentsService';
import { buttonStyles } from '../utils/buttonStyles';
import { formatDate, formatPrice } from '../utils/format';
import { generateConfirmationCode } from '../utils/ticketCode';

// Bounds the status lookup so a stalled request can never leave the page
// spinning forever.
const FETCH_TIMEOUT_MS = 10000;

function PaymentSuccessPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const initialReservation = location.state?.reservation || null;
  const [reservationData, setReservationData] = useState(initialReservation);
  const [loading, setLoading] = useState(!initialReservation);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  // Mercado Pago appends `external_reference` (our reservation id) to the
  // back_url; we accept a plain `reservation_id` too for direct links.
  const reservationId =
    searchParams.get('reservation_id') ||
    searchParams.get('external_reference');

  useEffect(() => {
    if (reservationData) {
      setLoading(false);
      return undefined;
    }
    if (!reservationId) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    (async () => {
      try {
        const data = await getPaymentStatus(reservationId, {
          signal: controller.signal,
        });
        if (active) setReservationData(data);
      } catch (err) {
        if (!active) return;
        setError(
          err?.name === 'AbortError'
            ? 'La consulta tardó demasiado. Vuelve a intentarlo.'
            : 'No encontramos los datos de esta reserva.'
        );
      } finally {
        clearTimeout(timer);
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [reservationData, reservationId]);

  const handleDownloadPDF = async () => {
    setDownloadError(null);
    setDownloading(true);
    try {
      // jsPDF is heavy (~130 kB gzip): load it only when the ticket is
      // actually requested so the main bundle stays lean.
      const { downloadTicketPdf } = await import('../utils/ticketPdf');
      await downloadTicketPdf(reservationData);
    } catch (err) {
      setDownloadError('No pudimos generar el PDF. Intenta nuevamente.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-br from-navy-50 via-surface-50 to-gold-50 flex items-center justify-center px-4 py-10">
        <Helmet>
          <title>Confirmando pago - Hotel Hilton</title>
        </Helmet>
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-card p-8 text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-navy-700"></i>
          <p className="mt-4 text-sm text-navy-700">
            Estamos confirmando tu pago…
          </p>
        </div>
      </div>
    );
  }

  if (!reservationData) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-br from-navy-50 via-surface-50 to-gold-50 flex items-center justify-center px-4 py-10">
        <Helmet>
          <title>Pago - Hotel Hilton</title>
        </Helmet>
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-card p-6 text-center">
          <div className="w-14 h-14 mx-auto bg-danger-light rounded-full flex items-center justify-center">
            <i className="fas fa-circle-info text-2xl text-danger"></i>
          </div>
          <h1 className="mt-4 text-xl font-serif font-bold tracking-tight text-navy-900">
            No encontramos tu reserva
          </h1>
          <p className="mt-2 text-sm text-navy-700">
            {error ||
              'Accede desde el enlace de confirmación de Mercado Pago o revisa tus reservas en tu perfil.'}
          </p>
          <div className="mt-5 space-y-3">
            <Link
              to="/perfil"
              className={buttonStyles({ variant: 'primary', className: 'w-full' })}
            >
              <i className="fas fa-user-circle"></i>
              <span>Ir al Panel de Usuario</span>
            </Link>
            <Link
              to="/"
              className={buttonStyles({ variant: 'secondary', className: 'w-full' })}
            >
              <i className="fas fa-home"></i>
              <span>Volver al Inicio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-navy-50 via-surface-50 to-gold-50 flex items-center justify-center px-4 py-10">
      <Helmet>
        <title>¡Pago Exitoso! - Hotel Hilton</title>
      </Helmet>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-card p-6 animate-fadeIn">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-success rounded-full flex items-center justify-center shadow-sm">
            <i className="fas fa-check text-white text-2xl"></i>
          </div>
        </div>

        <h1 className="text-2xl font-serif font-bold tracking-tight text-center text-navy-900">
          ¡Pago Exitoso!
        </h1>
        <p className="text-center text-sm text-navy-700 mt-1 mb-5">
          Tu reserva ha sido confirmada
        </p>

        <div className="bg-gradient-to-r from-navy-50 to-gold-50 rounded-xl p-4 mb-5 border border-navy-100">
          <p className="text-xs text-navy-700 text-center mb-1">
            Número de Confirmación
          </p>
          <p className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-navy-800 to-gold-500">
            {generateConfirmationCode(reservationData)}
          </p>
        </div>

        <div className="mb-5">
          <div className="flex justify-between items-center py-2 border-b border-surface-200">
            <span className="text-sm text-navy-700">Habitación:</span>
            <span className="text-sm font-semibold text-navy-900 text-right">
              {reservationData.room_name || 'Habitación Estándar'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-surface-200">
            <span className="text-sm text-navy-700">Check-in:</span>
            <span className="text-sm font-semibold text-navy-900">
              {formatDate(reservationData.start_date)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-surface-200">
            <span className="text-sm text-navy-700">Check-out:</span>
            <span className="text-sm font-semibold text-navy-900">
              {formatDate(reservationData.end_date)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-navy-700">Total:</span>
            <span className="text-xl font-bold text-navy-800">
              {formatPrice(reservationData.total_price)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className={buttonStyles({ variant: 'primary', className: 'w-full' })}
          >
            <i className={downloading ? 'fas fa-spinner fa-spin' : 'fas fa-file-pdf'}></i>
            <span>{downloading ? 'Generando PDF…' : 'Descargar Ticket PDF'}</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/perfil"
              className={buttonStyles({ variant: 'confirm', className: 'w-full' })}
            >
              <i className="fas fa-user-circle"></i>
              <span>Ir al Panel de Usuario</span>
            </Link>
            <Link
              to="/"
              className={buttonStyles({ variant: 'secondary', className: 'w-full' })}
            >
              <i className="fas fa-home"></i>
              <span>Volver al Inicio</span>
            </Link>
          </div>
        </div>

        {downloadError && (
          <p role="alert" className="mt-3 text-xs text-danger text-center">
            {downloadError}
          </p>
        )}

        <div className="mt-5 p-3 bg-surface-100 rounded-lg border border-surface-200">
          <p className="text-xs text-navy-700 text-center">
            <i className="fas fa-info-circle text-navy-600 mr-1"></i>
            Hemos enviado un correo de confirmación a tu email
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
