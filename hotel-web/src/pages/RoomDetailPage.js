// pages de detalles de habitaciones
import { differenceInDays } from 'date-fns';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import RoomDetailModal from '../components/Modal/RoomDetailModal';
import TariffCard from '../components/TariffCard/TariffCard';
import { getRoom } from '../services/roomsService';
import { buttonStyles } from '../utils/buttonStyles';

function RoomDetailPage() {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Estados para fechas y cálculo
    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
    const [nights, setNights] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);

    // Calcular noches y precio total cuando cambien las fechas o la habitación
    useEffect(() => {
        if (checkInDate && checkOutDate && room) {
            const calculatedNights = differenceInDays(checkOutDate, checkInDate);
            setNights(calculatedNights > 0 ? calculatedNights : 1);
            setTotalPrice(room.price * (calculatedNights > 0 ? calculatedNights : 1));
        }
    }, [checkInDate, checkOutDate, room]);

    // Obtener habitación desde el backend
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                setLoading(true);
                const data = await getRoom(id);
                console.log('✅ Habitación obtenida:', data);
                setRoom(data);
            } catch (err) {
                console.error('❌ Error al cargar habitación:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [id]);

    // Mostrar loading
    if (loading) {
        return (
            <div className="container mx-auto p-4 py-8">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-navy-700 mx-auto mb-4"></div>
                        <p className="text-navy-600 text-lg">Cargando habitación...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Mostrar error
    if (error || !room) {
        return (
            <div className="container mx-auto p-4 py-8">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center bg-danger-light p-8 rounded-card max-w-md">
                        <i className="fas fa-exclamation-circle text-danger text-5xl mb-4" aria-hidden="true"></i>
                        <h2 className="text-2xl font-bold text-danger mb-2">Habitación no encontrada</h2>
                        <p className="text-navy-600 mb-4">{error || 'La habitación que buscás no existe'}</p>
                        <Link
                            to="/habitaciones"
                            className={buttonStyles({ variant: 'primary' })}>
                            Ver todas las habitaciones
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const tariffs = Array.isArray(room.tariffs) ? room.tariffs : [];

    return (
        <div className="container mx-auto p-4 py-8">
            <Helmet>
                <title>{`${room.name} - Hotel Hilton`}</title>
            </Helmet>

            <div className="lg:flex lg:gap-8">
                {/* --- Columna Principal (2/3 del ancho) --- */}
                <div className="lg:w-2/3">
                    {/* Contenedor de la Imagen Principal */}
                    <div className="mb-6 sm:mb-8">
                        <img src={room.images?.[0]} alt={room.name} className="w-full h-56 sm:h-80 lg:h-auto object-cover rounded-card shadow-card" />
                    </div>
                    {/* Contenedor de la Información y Tarifas */}
                    <div className="bg-white p-5 sm:p-8 rounded-card shadow-card">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mb-2">{room.name}</h1>
                        <p className="text-base sm:text-lg text-navy-600 mb-4">{room.description}</p>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className={buttonStyles({ variant: 'ghost', size: 'sm', className: 'mb-6' })}>
                            Ver más detalles de la habitación →
                        </button>

                        <div className="border-t border-surface-200 pt-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-navy-900 mb-4">Elige tu tarifa</h2>

                            {tariffs.length === 0 ? (
                                <div className="rounded-card border border-dashed border-surface-200 bg-surface-50 p-8 text-center">
                                    <i className="fas fa-ban text-navy-300 text-4xl mb-3" aria-hidden="true"></i>
                                    <h3 className="text-lg font-bold text-navy-800 mb-1">Sin tarifas disponibles</h3>
                                    <p className="text-navy-600 text-sm mb-5">
                                        Esta habitación no tiene tarifas configuradas por el momento. Volvé a intentarlo más tarde o consultá otras opciones.
                                    </p>
                                    <Link
                                        to="/habitaciones"
                                        className={buttonStyles({ variant: 'secondary' })}>
                                        Ver otras habitaciones
                                    </Link>
                                </div>
                            ) : (
                                <div className={tariffs.length > 1 ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'}>
                                    {tariffs.map(tariff => (
                                        <TariffCard
                                            key={tariff.id}
                                            room={room}
                                            tariff={tariff}
                                            checkInDate={checkInDate}
                                            checkOutDate={checkOutDate}
                                            nights={nights}
                                            totalPrice={totalPrice}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Columna Lateral (Sidebar - 1/3 del ancho) --- */}
                <div className="lg:w-1/3 mt-6 lg:mt-0">
                    <div className="bg-white p-5 sm:p-6 rounded-card shadow-card lg:sticky lg:top-24">
                        <h3 className="text-xl font-bold mb-4 text-navy-900">Selecciona tus fechas</h3>
                        
                        {/* Selector de Check-in */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-navy-700 mb-2">
                                <i className="fas fa-calendar-check text-gold-600 mr-2" aria-hidden="true"></i>
                                Check-in
                            </label>
                            <DatePicker
                                selected={checkInDate}
                                onChange={(date) => setCheckInDate(date)}
                                selectsStart
                                startDate={checkInDate}
                                endDate={checkOutDate}
                                minDate={new Date()}
                                dateFormat="dd/MM/yyyy"
                                className="w-full border border-surface-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                            />
                        </div>

                        {/* Selector de Check-out */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-navy-700 mb-2">
                                <i className="fas fa-calendar-times text-gold-600 mr-2" aria-hidden="true"></i>
                                Check-out
                            </label>
                            <DatePicker
                                selected={checkOutDate}
                                onChange={(date) => setCheckOutDate(date)}
                                selectsEnd
                                startDate={checkInDate}
                                endDate={checkOutDate}
                                minDate={checkInDate}
                                dateFormat="dd/MM/yyyy"
                                className="w-full border border-surface-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                            />
                        </div>

                        {/* Resumen de la reserva */}
                        <div className="border-t border-surface-200 pt-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-navy-600">Precio por noche:</span>
                                <span className="font-semibold text-navy-900">
                                    ${room.price.toLocaleString('es-AR')}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-navy-600">Noches:</span>
                                <span className="font-semibold text-navy-900">{nights}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-surface-200">
                                <span className="text-lg font-bold text-navy-900">Total:</span>
                                <span className="text-2xl font-bold text-navy-800">
                                    ${totalPrice.toLocaleString('es-AR')}
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-navy-500 mt-4 text-center">
                            <i className="fas fa-info-circle mr-1" aria-hidden="true"></i>
                            {tariffs.length > 0
                                ? 'Seleccioná una tarifa para continuar'
                                : 'No hay tarifas disponibles para seleccionar'}
                        </p>
                    </div>
                </div>

            </div>

            {isModalOpen && (
                <RoomDetailModal
                    room={room}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}

export default RoomDetailPage;