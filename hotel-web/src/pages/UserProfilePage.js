import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function UserProfilePage() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('reservations');
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    // Obtener reservas del usuario
    useEffect(() => {
        const fetchReservations = async () => {
            if (!currentUser) return;
            
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:4000/api/reservations/user/${currentUser.uid}`);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Reservas obtenidas:', data);
                    setReservations(data);
                } else {
                    console.log('No se encontraron reservas');
                    setReservations([]);
                }
            } catch (err) {
                console.error('❌ Error al cargar reservas:', err);
                setReservations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente', icon: 'fas fa-clock' },
            confirmed: { color: 'bg-green-100 text-green-800', text: 'Confirmada', icon: 'fas fa-check-circle' },
            cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelada', icon: 'fas fa-times-circle' },
            completed: { color: 'bg-blue-100 text-blue-800', text: 'Completada', icon: 'fas fa-flag-checkered' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color} flex items-center gap-2 w-fit`}>
                <i className={config.icon}></i>
                {config.text}
            </span>
        );
    };

    if (!currentUser) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <Helmet>
                <title>Mi Perfil - Hotel Hilton</title>
            </Helmet>

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header del perfil */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            {currentUser.photoURL ? (
                                <img 
                                    src={currentUser.photoURL} 
                                    alt="Avatar" 
                                    className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                    {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>

                        {/* Info del usuario */}
                        <div className="flex-grow text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {currentUser.displayName || 'Usuario'}
                            </h1>
                            <p className="text-gray-600 flex items-center gap-2 justify-center md:justify-start">
                                <i className="fas fa-envelope"></i>
                                {currentUser.email}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Miembro desde {new Date(currentUser.metadata.creationTime).toLocaleDateString('es-AR')}
                            </p>
                        </div>

                        {/* Botón de cerrar sesión */}
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                            <i className="fas fa-sign-out-alt"></i>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {/* Tabs de navegación */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('reservations')}
                            className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                                activeTab === 'reservations'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}>
                            <i className="fas fa-calendar-check"></i>
                            Mis Reservas
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                                activeTab === 'profile'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}>
                            <i className="fas fa-user"></i>
                            Mi Perfil
                        </button>
                    </div>

                    {/* Contenido de las tabs */}
                    <div className="p-6">
                        {activeTab === 'reservations' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <i className="fas fa-list text-blue-600"></i>
                                    Historial de Reservas
                                </h2>

                                {loading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Cargando reservas...</p>
                                    </div>
                                ) : reservations.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                                        <i className="fas fa-inbox text-gray-400 text-6xl mb-4"></i>
                                        <h3 className="text-xl font-bold text-gray-700 mb-2">No tienes reservas aún</h3>
                                        <p className="text-gray-500 mb-6">¡Explora nuestras habitaciones y haz tu primera reserva!</p>
                                        <button
                                            onClick={() => navigate('/habitaciones')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                                            Ver Habitaciones
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reservations.map((reservation) => (
                                            <div
                                                key={reservation.reservation_id}
                                                className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
                                                <div className="flex flex-col lg:flex-row gap-6">
                                                    {/* Info de la reserva */}
                                                    <div className="flex-grow">
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div>
                                                                <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                                    {reservation.room_name || 'Habitación'}
                                                                </h3>
                                                                <p className="text-sm text-gray-500">
                                                                    Código: {reservation.reservation_id}
                                                                </p>
                                                            </div>
                                                            {getStatusBadge(reservation.status)}
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                            <div className="flex items-center gap-2 text-gray-700">
                                                                <i className="fas fa-calendar-alt text-blue-600"></i>
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Check-in</p>
                                                                    <p className="font-semibold">{formatDate(reservation.start_date)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-700">
                                                                <i className="fas fa-calendar-check text-blue-600"></i>
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Check-out</p>
                                                                    <p className="font-semibold">{formatDate(reservation.end_date)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-700">
                                                                <i className="fas fa-moon text-blue-600"></i>
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Noches</p>
                                                                    <p className="font-semibold">{reservation.nights || 1}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                                            <div>
                                                                <p className="text-sm text-gray-500">Total pagado</p>
                                                                <p className="text-2xl font-bold text-green-600">
                                                                    {formatPrice(reservation.total_price)}
                                                                </p>
                                                            </div>
                                                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2">
                                                                <i className="fas fa-eye"></i>
                                                                Ver Detalles
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <i className="fas fa-user-circle text-blue-600"></i>
                                    Información Personal
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <label className="text-sm text-gray-500 mb-2 block">Nombre Completo</label>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {currentUser.displayName || 'No especificado'}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <label className="text-sm text-gray-500 mb-2 block">Correo Electrónico</label>
                                        <p className="text-lg font-semibold text-gray-800">{currentUser.email}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <label className="text-sm text-gray-500 mb-2 block">Estado de la cuenta</label>
                                        <p className="text-lg font-semibold text-green-600 flex items-center gap-2">
                                            <i className="fas fa-check-circle"></i>
                                            {currentUser.emailVerified ? 'Verificada' : 'No verificada'}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <label className="text-sm text-gray-500 mb-2 block">Miembro desde</label>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {new Date(currentUser.metadata.creationTime).toLocaleDateString('es-AR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <i className="fas fa-info-circle text-blue-600"></i>
                                        Información
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Para actualizar tu información personal o cambiar tu contraseña, por favor contacta con nuestro equipo de soporte.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfilePage;
