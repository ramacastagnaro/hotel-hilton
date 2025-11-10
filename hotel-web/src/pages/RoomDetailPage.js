// pages de detalles de habitaciones
import { differenceInDays } from 'date-fns';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import RoomDetailModal from '../components/Modal/RoomDetailModal';
import TariffCard from '../components/TariffCard/TariffCard';

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
                const response = await fetch(`http://localhost:4000/api/rooms/${id}`);
                
                if (!response.ok) {
                    throw new Error('Habitación no encontrada');
                }
                
                const data = await response.json();
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
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Cargando habitación...</p>
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
                    <div className="text-center bg-red-50 p-8 rounded-lg">
                        <i className="fas fa-exclamation-circle text-red-600 text-5xl mb-4"></i>
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Habitación no encontrada</h2>
                        <p className="text-gray-600 mb-4">{error || 'La habitación que buscas no existe'}</p>
                        <a 
                            href="/habitaciones"
                            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Ver todas las habitaciones
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 py-8">
            <Helmet>
                <title>{`${room.name} - Hotel Hilton`}</title>
            </Helmet>

            <div className="lg:flex lg:gap-8">
                {/* --- Columna Principal (2/3 del ancho) --- */}
                <div className="lg:w-2/3">
                    {/* Contenedor de la Imagen Principal */}
                    <div className="mb-8">
                        <img src={room.images[0]} alt={room.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
                    </div>
                    {/* Contenedor de la Información y Tarifas */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{room.name}</h1>
                        <p className="text-lg text-gray-600 mb-4">{room.description}</p>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-blue-600 hover:text-blue-800 font-semibold mb-6 text-sm">
                            Ver más detalles de la habitación →
                        </button>

                        <div className="border-t pt-6">
                            <h2 className="text-2xl font-bold mb-4">Elige tu tarifa</h2>

                            <div className="space-y-4">
                                {room.tariffs.map(tariff => (
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
                        </div>
                    </div>
                </div>

                {/* --- Columna Lateral (Sidebar - 1/3 del ancho) --- */}
                <div className="lg:w-1/3 mt-8 lg:mt-0">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Selecciona tus fechas</h3>
                        
                        {/* Selector de Check-in */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <i className="fas fa-calendar-check text-blue-600 mr-2"></i>
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
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Selector de Check-out */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <i className="fas fa-calendar-times text-blue-600 mr-2"></i>
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
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Resumen de la reserva */}
                        <div className="border-t pt-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Precio por noche:</span>
                                <span className="font-semibold text-gray-800">
                                    ${room.price.toLocaleString('es-AR')}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Noches:</span>
                                <span className="font-semibold text-gray-800">{nights}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t">
                                <span className="text-lg font-bold text-gray-800">Total:</span>
                                <span className="text-2xl font-bold text-green-600">
                                    ${totalPrice.toLocaleString('es-AR')}
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-4 text-center">
                            <i className="fas fa-info-circle mr-1"></i>
                            Selecciona una tarifa abajo para continuar
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