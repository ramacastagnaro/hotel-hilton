import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { buttonStyles } from '../../utils/buttonStyles';

function AdminLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { path: '/admin', icon: 'fas fa-chart-line', label: 'Resumen', exact: true },
        { path: '/admin/usuarios', icon: 'fas fa-users', label: 'Usuarios' },
        { path: '/admin/reservas', icon: 'fas fa-clipboard-list', label: 'Reservas' },
        { path: '/admin/habitaciones', icon: 'fas fa-bed', label: 'Habitaciones' },
        { path: '/admin/estadisticas', icon: 'fas fa-chart-bar', label: 'Gráficos y Estadísticas' },
        { path: '/admin/logs', icon: 'fas fa-file-alt', label: 'Logs del Sistema' },
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
        <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900">
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 shadow-2xl transition-all duration-300 z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                {/* Header del Sidebar */}
                    <div className="p-6 border-b border-navy-500/30">
                    <div className="flex items-center justify-between">
                        {isSidebarOpen && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <i className="fas fa-hotel text-navy-950 text-xl"></i>
                                </div>
                                <div>
                                    <h1 className="text-white font-bold text-lg">HOTEL HILTON</h1>
                                    <p className="text-gold-400 text-xs">Panel de Administrador</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            aria-label="Alternar menú"
                            className="text-gray-400 hover:text-white transition-colors">
                            <i className={`fas ${isSidebarOpen ? 'fa-bars' : 'fa-bars'}`}></i>
                        </button>
                    </div>
                </div>

                {/* Menú de navegación */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive(item.path, item.exact)
                                    ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/40'
                                    : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                            }`}>
                            <i className={`${item.icon} text-xl w-6 text-center`}></i>
                            {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Botón de cerrar sesión */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-navy-500/30">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-slate-800 hover:text-gold-400 transition-all duration-200">
                        <i className="fas fa-sign-out-alt text-xl w-6 text-center"></i>
                        {isSidebarOpen && <span className="font-medium">Volver</span>}
                    </button>
                </div>
            </aside>

            {/* Contenido principal */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Header superior */}
                <header className="bg-slate-800/50 backdrop-blur-md border-b border-navy-500/30 sticky top-0 z-40">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {menuItems.find(item => isActive(item.path, item.exact))?.label || 'Panel de Administración'}
                            </h2>
                            <p className="text-gray-400 text-sm">Gestiona tu hotel desde aquí</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => window.location.reload()}
                                className={buttonStyles({ variant: 'accent' })}>
                                <i className="fas fa-sync-alt"></i>
                                <span>Actualizar</span>
                            </button>
                            <button aria-label="Notificaciones" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                                <i className="fas fa-bell"></i>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Contenido */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
