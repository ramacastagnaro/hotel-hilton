import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '../../components/Admin/AdminLayout';

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalReservations: 0,
        totalRevenue: 0,
        totalRooms: 0
    });
    
    const [reservationsByStatus, setReservationsByStatus] = useState({
        confirmadas: 0,
        pendientes: 0,
        canceladas: 0
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Obtener estadísticas del backend
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:4000/api/admin/stats');
                
                if (!response.ok) {
                    throw new Error('Error al obtener estadísticas');
                }
                
                const data = await response.json();
                setStats({
                    totalUsers: data.totalUsers,
                    totalReservations: data.totalReservations,
                    totalRevenue: data.totalRevenue,
                    totalRooms: data.totalRooms
                });
                setReservationsByStatus(data.reservationsByStatus);
                setLoading(false);
                
            } catch (err) {
                console.error('Error al cargar estadísticas:', err);
                setError(err.message);
                setLoading(false);
            }
        };
        
        fetchStats();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                        <p className="text-gray-600">Cargando estadísticas...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }
    
    if (error) {
        return (
            <AdminLayout>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Helmet>
                <title>Dashboard - Panel de Administración</title>
            </Helmet>

            {/* Cards de estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Usuarios */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <i className="fas fa-users text-white text-2xl"></i>
                        </div>
                        <span className="text-blue-200 text-sm font-semibold">Total Usuarios</span>
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-2">{stats.totalUsers}</h3>
                    <p className="text-blue-200 text-sm">Usuarios registrados</p>
                </div>

                {/* Total Reservas */}
                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <i className="fas fa-clipboard-list text-white text-2xl"></i>
                        </div>
                        <span className="text-green-200 text-sm font-semibold">Total Reservas</span>
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-2">{stats.totalReservations}</h3>
                    <p className="text-green-200 text-sm">Reservas realizadas</p>
                </div>

                {/* Ingresos Totales */}
                <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <i className="fas fa-dollar-sign text-white text-2xl"></i>
                        </div>
                        <span className="text-yellow-200 text-sm font-semibold">Ingresos Totales</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{formatPrice(stats.totalRevenue)}</h3>
                    <p className="text-yellow-200 text-sm">Ganancias acumuladas</p>
                </div>

                {/* Habitaciones */}
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <i className="fas fa-bed text-white text-2xl"></i>
                        </div>
                        <span className="text-purple-200 text-sm font-semibold">Habitaciones</span>
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-2">{stats.totalRooms}</h3>
                    <p className="text-purple-200 text-sm">Tipos disponibles</p>
                </div>
            </div>

            {/* Estado de Reservas */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-xl mb-8 border border-cyan-700/30">
                <div className="flex items-center gap-3 mb-6">
                    <i className="fas fa-chart-pie text-white text-2xl"></i>
                    <h2 className="text-2xl font-bold text-white">Estado de Reservas</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Confirmadas */}
                    <div className="text-center">
                        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-5xl font-bold text-white">{reservationsByStatus.confirmadas}</span>
                        </div>
                        <p className="text-green-400 font-bold text-lg">Confirmadas</p>
                    </div>

                    {/* Pendientes */}
                    <div className="text-center">
                        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-5xl font-bold text-white">{reservationsByStatus.pendientes}</span>
                        </div>
                        <p className="text-yellow-400 font-bold text-lg">Pendientes</p>
                    </div>

                    {/* Canceladas */}
                    <div className="text-center">
                        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-5xl font-bold text-white">{reservationsByStatus.canceladas}</span>
                        </div>
                        <p className="text-red-400 font-bold text-lg">Canceladas</p>
                    </div>
                </div>
            </div>

        </AdminLayout>
    );
}

export default AdminDashboard;
