import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserReservations } from '../services/reservationsService';
import { buttonStyles } from '../utils/buttonStyles';
import { formatDate, formatPrice } from '../utils/format';

const TABS = [
    { id: 'reservations', label: 'Mis Reservas', icon: 'fas fa-calendar-check' },
    { id: 'profile', label: 'Mi Perfil', icon: 'fas fa-user' },
    { id: 'security', label: 'Seguridad', icon: 'fas fa-lock' },
];

// Single account dashboard: reservations, personal data and password change.
// Replaces the old AccountPage (change-password only) and UserProfilePage.
function AccountDashboardPage() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('reservations');
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Security tab state (change password)
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState('');
    const [pwLoading, setPwLoading] = useState(false);

    // Redirect to login when there is no authenticated user.
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    // Load the signed-in user's reservations.
    useEffect(() => {
        const fetchReservations = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);
                const data = await getUserReservations(currentUser.uid);
                setReservations(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error al cargar reservas:', err);
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

    // Password change with an explicit current-password field and a real
    // re-authentication step (no prompt() fallback).
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPwError('');
        setPwSuccess('');

        if (!currentPassword) {
            setPwError('Ingresá tu contraseña actual.');
            return;
        }
        if (newPassword.length < 6) {
            setPwError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwError('Las nuevas contraseñas no coinciden.');
            return;
        }

        setPwLoading(true);
        try {
            await updatePassword(currentUser, newPassword);
            setPwSuccess('¡Contraseña actualizada con éxito!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            // Firebase requires a recent login for sensitive operations.
            if (err?.code === 'auth/requires-recent-login') {
                try {
                    const credential = EmailAuthProvider.credential(
                        currentUser.email,
                        currentPassword
                    );
                    await reauthenticateWithCredential(currentUser, credential);
                    await updatePassword(currentUser, newPassword);
                    setPwSuccess('¡Contraseña actualizada con éxito!');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                } catch (reauthError) {
                    console.error('Error de re-autenticación:', reauthError);
                    setPwError(
                        'La contraseña actual es incorrecta o la sesión no pudo renovarse.'
                    );
                }
            } else {
                console.error('Error al cambiar contraseña:', err);
                setPwError('Ocurrió un error al intentar cambiar la contraseña.');
            }
        } finally {
            setPwLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-gold-100 text-gold-800', text: 'Pendiente', icon: 'fas fa-clock' },
            confirmed: { color: 'bg-success-light text-success', text: 'Confirmada', icon: 'fas fa-check-circle' },
            cancelled: { color: 'bg-danger-light text-danger', text: 'Cancelada', icon: 'fas fa-times-circle' },
            completed: { color: 'bg-navy-100 text-navy-800', text: 'Completada', icon: 'fas fa-flag-checkered' },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${config.color} flex items-center gap-2 w-fit`}>
                <i className={config.icon} aria-hidden="true"></i>
                {config.text}
            </span>
        );
    };

    if (!currentUser) {
        return null;
    }

    return (
        <div className="min-h-screen bg-surface-50 py-6 sm:py-8">
            <Helmet>
                <title>Mi Cuenta - Hotel Hilton</title>
            </Helmet>

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Profile header */}
                <div className="bg-white rounded-card shadow-card p-5 sm:p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            {currentUser.photoURL ? (
                                <img
                                    src={currentUser.photoURL}
                                    alt="Foto de perfil"
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-navy-100 shadow-card object-cover"
                                />
                            ) : (
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-white text-3xl font-bold shadow-card">
                                    {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-success rounded-full border-2 border-white"></div>
                        </div>

                        {/* User info */}
                        <div className="flex-grow text-center md:text-left min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900 mb-2 break-words">
                                {currentUser.displayName || 'Usuario'}
                            </h1>
                            <p className="text-navy-700 flex items-center gap-2 justify-center md:justify-start break-all">
                                <i className="fas fa-envelope" aria-hidden="true"></i>
                                {currentUser.email}
                            </p>
                            {currentUser.metadata?.creationTime && (
                                <p className="text-sm text-navy-500 mt-2">
                                    Miembro desde {new Date(currentUser.metadata.creationTime).toLocaleDateString('es-AR')}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleLogout}
                            className={buttonStyles({ variant: 'destructive', size: 'lg', className: 'w-full md:w-auto' })}>
                            <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-card shadow-card overflow-hidden">
                    <nav
                        aria-label="Secciones de la cuenta"
                        className="grid grid-cols-3 border-b border-surface-200">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                aria-current={activeTab === tab.id ? 'page' : undefined}
                                className={buttonStyles({
                                    variant: activeTab === tab.id ? 'primary' : 'ghost',
                                    className: 'flex-1 !rounded-none py-3.5 sm:py-4 text-xs sm:text-sm flex-col sm:flex-row whitespace-nowrap',
                                })}>
                                <i className={`${tab.icon} text-base`} aria-hidden="true"></i>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Tab content */}
                    <div className="p-4 sm:p-6">
                        {/* Mis Reservas */}
                        {activeTab === 'reservations' && (
                            <div>
                                <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-navy-900 mb-6 flex items-center gap-2">
                                    <i className="fas fa-list text-gold-600" aria-hidden="true"></i>
                                    Historial de Reservas
                                </h2>

                                {loading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-700 mx-auto mb-4"></div>
                                        <p className="text-navy-600">Cargando reservas...</p>
                                    </div>
                                ) : reservations.length === 0 ? (
                                    <div className="text-center py-12 bg-surface-50 rounded-xl">
                                        <i className="fas fa-inbox text-navy-300 text-6xl mb-4" aria-hidden="true"></i>
                                        <h3 className="text-xl font-bold text-navy-800 mb-2">No tienes reservas aún</h3>
                                        <p className="text-navy-600 mb-6">¡Explora nuestras habitaciones y hacé tu primera reserva!</p>
                                        <button
                                            onClick={() => navigate('/habitaciones')}
                                            className={buttonStyles({ variant: 'primary', size: 'lg' })}>
                                            Ver Habitaciones
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reservations.map((reservation) => (
                                            <div
                                                key={reservation.reservation_id}
                                                className="bg-white rounded-xl p-5 sm:p-6 shadow-card hover:shadow-float transition-all duration-300 border border-surface-200">
                                                <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                                                    <div className="min-w-0">
                                                        <h3 className="text-lg sm:text-xl font-bold text-navy-900 mb-1 break-words">
                                                            {reservation.room_name || 'Habitación'}
                                                        </h3>
                                                        <p className="text-sm text-navy-500 break-all">
                                                            Código: {reservation.reservation_id}
                                                        </p>
                                                    </div>
                                                    {getStatusBadge(reservation.status)}
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                                    <div className="flex items-center gap-2 text-navy-700">
                                                        <i className="fas fa-calendar-alt text-gold-600" aria-hidden="true"></i>
                                                        <div>
                                                            <p className="text-xs text-navy-500">Check-in</p>
                                                            <p className="font-semibold">{formatDate(reservation.start_date)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-navy-700">
                                                        <i className="fas fa-calendar-check text-gold-600" aria-hidden="true"></i>
                                                        <div>
                                                            <p className="text-xs text-navy-500">Check-out</p>
                                                            <p className="font-semibold">{formatDate(reservation.end_date)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-navy-700">
                                                        <i className="fas fa-moon text-gold-600" aria-hidden="true"></i>
                                                        <div>
                                                            <p className="text-xs text-navy-500">Noches</p>
                                                            <p className="font-semibold">{reservation.nights || 1}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-surface-200">
                                                    <div>
                                                        <p className="text-sm text-navy-500">Total pagado</p>
                                                        <p className="text-xl sm:text-2xl font-bold text-success">
                                                            {formatPrice(reservation.total_price)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mi Perfil */}
                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-navy-900 mb-6 flex items-center gap-2">
                                    <i className="fas fa-user-circle text-gold-600" aria-hidden="true"></i>
                                    Información Personal
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="bg-surface-50 rounded-xl p-5 sm:p-6">
                                        <label className="text-sm text-navy-500 mb-2 block">Nombre Completo</label>
                                        <p className="text-lg font-semibold text-navy-900 break-words">
                                            {currentUser.displayName || 'No especificado'}
                                        </p>
                                    </div>

                                    <div className="bg-surface-50 rounded-xl p-5 sm:p-6">
                                        <label className="text-sm text-navy-500 mb-2 block">Correo Electrónico</label>
                                        <p className="text-lg font-semibold text-navy-900 break-all">{currentUser.email}</p>
                                    </div>

                                    <div className="bg-surface-50 rounded-xl p-5 sm:p-6">
                                        <label className="text-sm text-navy-500 mb-2 block">Estado de la cuenta</label>
                                        <p className={`text-lg font-semibold flex items-center gap-2 ${currentUser.emailVerified ? 'text-success' : 'text-gold-700'}`}>
                                            <i className={`fas ${currentUser.emailVerified ? 'fa-check-circle' : 'fa-exclamation-circle'}`} aria-hidden="true"></i>
                                            {currentUser.emailVerified ? 'Verificada' : 'No verificada'}
                                        </p>
                                    </div>

                                    <div className="bg-surface-50 rounded-xl p-5 sm:p-6">
                                        <label className="text-sm text-navy-500 mb-2 block">Miembro desde</label>
                                        <p className="text-lg font-semibold text-navy-900">
                                            {currentUser.metadata?.creationTime
                                                ? new Date(currentUser.metadata.creationTime).toLocaleDateString('es-AR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })
                                                : 'No disponible'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 p-5 sm:p-6 bg-navy-50 rounded-xl border border-navy-100">
                                    <h3 className="font-bold text-navy-900 mb-2 flex items-center gap-2">
                                        <i className="fas fa-info-circle text-navy-600" aria-hidden="true"></i>
                                        Información
                                    </h3>
                                    <p className="text-navy-700 text-sm">
                                        Podés cambiar tu contraseña desde la pestaña <strong>Seguridad</strong>. Para actualizar otros datos de tu cuenta, contactá con nuestro equipo de soporte.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Seguridad */}
                        {activeTab === 'security' && (
                            <div className="max-w-xl">
                                <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-navy-900 mb-2 flex items-center gap-2">
                                    <i className="fas fa-lock text-gold-600" aria-hidden="true"></i>
                                    Cambiar Contraseña
                                </h2>
                                <p className="text-navy-600 mb-6 text-sm">
                                    Por seguridad, confirmá tu contraseña actual antes de establecer una nueva.
                                </p>

                                {pwError && (
                                    <p role="alert" className="bg-danger-light text-danger p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                                        <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
                                        {pwError}
                                    </p>
                                )}
                                {pwSuccess && (
                                    <p role="status" className="bg-success-light text-success p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                                        <i className="fas fa-check-circle" aria-hidden="true"></i>
                                        {pwSuccess}
                                    </p>
                                )}

                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-sm font-medium text-navy-700 mb-1">
                                            Contraseña actual
                                        </label>
                                        <input
                                            type="password"
                                            id="currentPassword"
                                            autoComplete="current-password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                            className="w-full border border-surface-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                                            placeholder="Tu contraseña actual"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-navy-700 mb-1">
                                            Nueva contraseña
                                        </label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            autoComplete="new-password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className="w-full border border-surface-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                                            placeholder="Mínimo 6 caracteres"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-navy-700 mb-1">
                                            Confirmar nueva contraseña
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            autoComplete="new-password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full border border-surface-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                                            placeholder="Repetí la nueva contraseña"
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={pwLoading}
                                            className={buttonStyles({ variant: 'primary', size: 'lg', className: 'w-full sm:w-auto' })}>
                                            {pwLoading ? (
                                                <>
                                                    <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
                                                    Actualizando…
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-key" aria-hidden="true"></i>
                                                    Actualizar Contraseña
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountDashboardPage;
