import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Helmet } from 'react-helmet';
import AdminLayout from '../../components/Admin/AdminLayout';
import { CHART_COLORS } from '../../config/charts';
import { getAdminCharts } from '../../services/statsService';
import { formatPrice } from '../../utils/format';

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// The API and this page share one canonical contract:
// { monthlyReservations, reservationsByStatus, topRooms, totalUsers,
//   totalRooms, totalReservations, totalRevenue }
// Only these fields are read below.
const EMPTY_CHARTS = {
    monthlyReservations: [],
    reservationsByStatus: {},
    topRooms: [],
    totalUsers: 0,
    totalRooms: 0,
    totalReservations: 0,
    totalRevenue: 0,
};

function AdminStats() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState(EMPTY_CHARTS);

    useEffect(() => {
        fetchChartData();
    }, []);

    const fetchChartData = async () => {
        try {
            setLoading(true);
            const data = await getAdminCharts();
            setChartData({ ...EMPTY_CHARTS, ...data });
            setLoading(false);

        } catch (err) {
            console.error('Error al cargar gráficos:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <i className="fas fa-spinner fa-spin text-4xl text-white mb-4"></i>
                        <p className="text-white">Cargando gráficos...</p>
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
                    <button 
                        onClick={fetchChartData}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Reintentar
                    </button>
                </div>
            </AdminLayout>
        );
    }

    const {
        monthlyReservations = [],
        reservationsByStatus = {},
        topRooms = [],
    } = chartData;

    // Ingresos mensuales (del backend)
    const monthlyRevenueData = {
        labels: monthlyReservations.map(item => item.month),
        datasets: [
            {
                label: 'Ingresos',
                data: monthlyReservations.map(item => item.revenue || 0),
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                borderColor: CHART_COLORS.greenBorder,
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }
        ]
    };

    // Reservas por mes (del backend)
    const monthlyReservationsData = {
        labels: monthlyReservations.map(item => item.month),
        datasets: [
            {
                label: 'Reservas',
                data: monthlyReservations.map(item => item.count || 0),
                backgroundColor: CHART_COLORS.blue,
                borderColor: CHART_COLORS.blueBorder,
                borderWidth: 2
            }
        ]
    };

    // Reservas por estado (del backend — incluye completada)
    const reservationsByStatusData = {
        labels: ['Confirmadas', 'Pendientes', 'Completadas', 'Canceladas'],
        datasets: [
            {
                label: 'Reservas por Estado',
                data: [
                    reservationsByStatus.confirmada || 0,
                    reservationsByStatus.pendiente || 0,
                    reservationsByStatus.completada || 0,
                    reservationsByStatus.cancelada || 0
                ],
                backgroundColor: [
                    CHART_COLORS.green,
                    CHART_COLORS.yellow,
                    CHART_COLORS.blue,
                    CHART_COLORS.red
                ],
                borderColor: [
                    CHART_COLORS.greenBorder,
                    CHART_COLORS.yellowBorder,
                    CHART_COLORS.blueBorder,
                    CHART_COLORS.redBorder
                ],
                borderWidth: 2
            }
        ]
    };

    // Habitaciones más reservadas (del backend)
    const topRoomsData = {
        labels: topRooms.map(item => item.name),
        datasets: [
            {
                label: 'Reservas por Habitación',
                data: topRooms.map(item => item.count || 0),
                backgroundColor: [
                    CHART_COLORS.yellow,
                    CHART_COLORS.green,
                    CHART_COLORS.purple,
                    CHART_COLORS.red,
                    CHART_COLORS.blue
                ],
                borderColor: [
                    CHART_COLORS.yellowBorder,
                    CHART_COLORS.greenBorder,
                    CHART_COLORS.purpleBorder,
                    CHART_COLORS.redBorder,
                    CHART_COLORS.blueBorder
                ],
                borderWidth: 2
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#fff',
                    font: {
                        size: 12
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: { color: '#fff' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
                ticks: { color: '#fff' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#fff',
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    return (
        <AdminLayout>
            <Helmet>
                <title>Gráficos y Estadísticas - Panel de Administración</title>
            </Helmet>

            <div className="flex items-center gap-3 mb-8">
                <i className="fas fa-chart-bar text-white text-3xl"></i>
                <h1 className="text-3xl font-bold text-white">Gráficos y Estadísticas</h1>
            </div>

            {/* Gráficos principales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Ingresos Mensuales */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl border border-cyan-700/30">
                    <div className="flex items-center gap-3 mb-4">
                        <i className="fas fa-dollar-sign text-green-400 text-xl"></i>
                        <h2 className="text-xl font-bold text-white">Ingresos Mensuales</h2>
                    </div>
                    <div className="h-64">
                        <Line data={monthlyRevenueData} options={chartOptions} />
                    </div>
                </div>

                {/* Reservas por Mes */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl border border-cyan-700/30">
                    <div className="flex items-center gap-3 mb-4">
                        <i className="fas fa-calendar-check text-blue-400 text-xl"></i>
                        <h2 className="text-xl font-bold text-white">Reservas por Mes</h2>
                    </div>
                    <div className="h-64">
                        <Bar data={monthlyReservationsData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Segunda fila de gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Reservas por Estado */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl border border-cyan-700/30">
                    <div className="flex items-center gap-3 mb-4">
                        <i className="fas fa-chart-pie text-purple-400 text-xl"></i>
                        <h2 className="text-xl font-bold text-white">Reservas por Estado</h2>
                    </div>
                    <div className="h-64">
                        <Pie data={reservationsByStatusData} options={pieOptions} />
                    </div>
                </div>

                {/* Habitaciones Más Reservadas */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl border border-cyan-700/30">
                    <div className="flex items-center gap-3 mb-4">
                        <i className="fas fa-bed text-yellow-400 text-xl"></i>
                        <h2 className="text-xl font-bold text-white">Habitaciones Más Reservadas</h2>
                    </div>
                    <div className="h-64">
                        <Pie data={topRoomsData} options={pieOptions} />
                    </div>
                </div>
            </div>

            {/* Cards de estadísticas rápidas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <i className="fas fa-users text-white text-2xl"></i>
                    </div>
                    <p className="text-blue-200 text-sm">Total Usuarios</p>
                    <h3 className="text-4xl font-bold text-white">{chartData.totalUsers}</h3>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <i className="fas fa-dollar-sign text-white text-2xl"></i>
                    </div>
                    <p className="text-green-200 text-sm">Ingresos Totales</p>
                    <h3 className="text-2xl font-bold text-white">{formatPrice(chartData.totalRevenue)}</h3>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <i className="fas fa-clipboard-list text-white text-2xl"></i>
                    </div>
                    <p className="text-purple-200 text-sm">Reservas Confirmadas</p>
                    <h3 className="text-4xl font-bold text-white">{reservationsByStatus.confirmada || 0}</h3>
                </div>

                <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <i className="fas fa-calendar-check text-white text-2xl"></i>
                    </div>
                    <p className="text-yellow-200 text-sm">Total Reservas</p>
                    <h3 className="text-4xl font-bold text-white">{chartData.totalReservations}</h3>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminStats;
