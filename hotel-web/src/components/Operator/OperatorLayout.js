import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { buttonStyles } from '../../utils/buttonStyles';

function OperatorLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, isDemo } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const menuItems = [
        { path: '/operador', icon: 'fas fa-tachometer-alt', label: 'Panel de Control', exact: true },
        { path: '/operador/habitaciones', icon: 'fas fa-map-marked-alt', label: 'Consultar Habitaciones' },
        { path: '/operador/reservas', icon: 'fas fa-clipboard-list', label: 'Gestionar Reservas' },
        { path: '/operador/pagos', icon: 'fas fa-credit-card', label: 'Procesar Pagos' },
    ];

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const handleLogout = async () => {
        // Cerrar la sesión real de Firebase antes de salir del panel.
        try {
            await logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900">
            {/* Overlay del drawer mobile */}
            {isMobileSidebarOpen && (
                <button
                    type="button"
                    aria-label="Cerrar menú"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-emerald-800 via-emerald-900 to-emerald-950 shadow-2xl transition-transform duration-300 z-50 lg:transition-all ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                {/* Header del Sidebar */}
                <div className="p-6 border-b border-emerald-700/30">
                    <div className="flex items-center justify-between">
                        {isSidebarOpen && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <i className="fas fa-user-tie text-white text-xl"></i>
                                </div>
                                <div>
                                    <h1 className="text-white font-bold text-lg">HOTEL HILTON</h1>
                                    <p className="text-emerald-400 text-xs">Panel de Operador</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            aria-label="Alternar menú"
                            className="hidden lg:inline-flex text-gray-400 hover:text-white transition-colors">
                            <i className={`fas ${isSidebarOpen ? 'fa-bars' : 'fa-bars'}`}></i>
                        </button>
                        <button
                            onClick={() => setIsMobileSidebarOpen(false)}
                            aria-label="Cerrar menú"
                            className="lg:hidden text-gray-400 hover:text-white transition-colors">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>

                {/* Menú de navegación */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive(item.path, item.exact)
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/50'
                                    : 'text-gray-400 hover:bg-emerald-800 hover:text-white'
                            }`}>
                            <i className={`${item.icon} text-xl w-6 text-center`}></i>
                            {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Botón de cerrar sesión */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-700/30">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-emerald-800 hover:text-emerald-400 transition-all duration-200">
                        <i className="fas fa-sign-out-alt text-xl w-6 text-center"></i>
                        {isSidebarOpen && <span className="font-medium">Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* Contenido principal */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                {/* Aviso de solo lectura (rol demo) */}
                {isDemo && (
                    <div
                        role="status"
                        className="bg-gold-500 text-navy-950 text-center text-sm font-semibold py-2 px-4">
                        Estás en modo demo: solo lectura.
                    </div>
                )}
                {/* Header superior */}
                <header className="bg-emerald-800/50 backdrop-blur-md border-b border-emerald-700/30 sticky top-0 z-30">
                    <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                type="button"
                                onClick={() => setIsMobileSidebarOpen(true)}
                                aria-label="Abrir menú"
                                className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 transition-colors shrink-0">
                                <i className="fas fa-bars text-xl" aria-hidden="true"></i>
                            </button>
                            <div className="min-w-0">
                                <h2 className="text-lg sm:text-2xl font-bold text-white truncate">
                                    {menuItems.find(item => isActive(item.path, item.exact))?.label || 'Panel de Operador'}
                                </h2>
                                <p className="text-gray-400 text-sm hidden sm:block">Gestiona las operaciones del hotel</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                            <button
                                onClick={() => window.location.reload()}
                                aria-label="Actualizar"
                                className={buttonStyles({ variant: 'accent' })}>
                                <i className="fas fa-sync-alt" aria-hidden="true"></i>
                                <span className="hidden sm:inline">Actualizar</span>
                            </button>
                            <button aria-label="Notificaciones" className="inline-flex items-center justify-center w-10 h-10 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                                <i className="fas fa-bell" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Contenido */}
                <main className="p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default OperatorLayout;
