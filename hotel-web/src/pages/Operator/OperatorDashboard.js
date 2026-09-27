import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import OperatorLayout from '../../components/Operator/OperatorLayout';
import { getOperatorStats } from '../../services/statsService';

function OperatorDashboard() {
    const [stats, setStats] = useState({
        reservasHoy: 0,
        habitacionesDisponibles: 0,
        habitacionesOcupadas: 0,
        pagosPendientes: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener estadísticas del backend
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getOperatorStats();
                setStats(data);
                setLoading(false);
                
            } catch (err) {
                console.error('Error al cargar estadísticas:', err);
                setError(err.message);
                setLoading(false);
            }
        };
        
        fetchStats();
    }, []);

    if (loading) {
        return (
            <OperatorLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <i className="fas fa-spinner fa-spin text-4xl text-white mb-4"></i>
                        <p className="text-white">Cargando estadísticas...</p>
                    </div>
                </div>
            </OperatorLayout>
        );
    }
    
    if (error) {
        return (
            <OperatorLayout>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            </OperatorLayout>
        );
    }

    return (
        <OperatorLayout>
            <Helmet>
                <title>Panel de Operador - Hotel Hilton</title>
            </Helmet>

            {/* Cards de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Reservas Hoy */}
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <i className="fas fa-calendar-check text-white text-2xl"></i>
                        </div>
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-2">{stats.reservasHoy}</h3>
                    <p className="text-emerald-200 text-sm">Reservas para hoy</p>
                </div>

                {/* Habitaciones Disponibles */}
                <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <i className="fas fa-door-open text-white text-2xl"></i>
                        </div>
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-2">{stats.habitacionesDisponibles}</h3>
                    <p className="text-teal-200 text-sm">Habitaciones disponibles</p>
                </div>

                {/* Habitaciones Ocupadas */}
                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <i className="fas fa-bed text-white text-2xl"></i>
                        </div>
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-2">{stats.habitacionesOcupadas}</h3>
                    <p className="text-green-200 text-sm">Habitaciones ocupadas</p>
                </div>

                {/* Pagos Pendientes */}
                <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <i className="fas fa-dollar-sign text-white text-2xl"></i>
                        </div>
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-2">{stats.pagosPendientes}</h3>
                    <p className="text-yellow-200 text-sm">Pagos pendientes</p>
                </div>
            </div>

            {/* Mensaje informativo */}
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-2xl p-8 shadow-xl border border-emerald-700/30">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <i className="fas fa-info-circle text-white text-2xl"></i>
                        <h2 className="text-2xl font-bold text-white">Panel Operativo</h2>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-white text-lg">
                        Bienvenido al panel de operador. Aquí puedes gestionar las reservas y ver las estadísticas operativas en tiempo real.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <a href="/operador/reservas" className="bg-emerald-700 hover:bg-emerald-600 p-4 rounded-lg text-white text-center transition-colors">
                            <i className="fas fa-clipboard-list text-2xl mb-2"></i>
                            <p className="font-semibold">Gestionar Reservas</p>
                        </a>
                        <a href="/operador/habitaciones" className="bg-emerald-700 hover:bg-emerald-600 p-4 rounded-lg text-white text-center transition-colors">
                            <i className="fas fa-bed text-2xl mb-2"></i>
                            <p className="font-semibold">Ver Habitaciones</p>
                        </a>
                        <a href="/operador/pagos" className="bg-emerald-700 hover:bg-emerald-600 p-4 rounded-lg text-white text-center transition-colors">
                            <i className="fas fa-dollar-sign text-2xl mb-2"></i>
                            <p className="font-semibold">Gestionar Pagos</p>
                        </a>
                    </div>
                </div>
            </div>
        </OperatorLayout>
    );
}

export default OperatorDashboard;
