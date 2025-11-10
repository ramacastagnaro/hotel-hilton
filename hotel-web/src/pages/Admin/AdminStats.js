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

function AdminStats() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState(null);
    
    useEffect(() => {
        fetchChartData();
    }, []);
    
    const fetchChartData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:4000/api/admin/charts');
            
            if (!response.ok) {
                throw new Error('Error al obtener datos de gráficos');
            }
            
            const data = await response.json();
            setChartData(data);
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
    
    if (error || !chartData) {
        return (
            <AdminLayout>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p><strong>Error:</strong> {error || 'No hay datos disponibles'}</p>
                    <button 
                        onClick={fetchChartData}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Reintentar
                    </button>
                </div>
            </AdminLayout>
        );
    }

    // Datos para el gráfico de distribución de usuarios (del backend)
    const usersDistributionData = {
        labels: ['Usuario', 'Operadores', 'Administradores'],
        datasets: [
            {
                label: 'Distribución de Usuarios',
                data: [
                    chartData?.userDistribution?.usuarios || 0,
                    chartData?.userDistribution?.operadores || 0,
                    chartData?.userDistribution?.admins || 0
                ],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)', // Azul
                    'rgba(168, 85, 247, 0.8)', // Púrpura
                    'rgba(239, 68, 68, 0.8)'   // Rojo
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 2
            }
        ]
    };

    // Datos para el gráfico de ingresos mensuales (del backend)
    const monthlyRevenueData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
            {
                label: 'Ingresos 2025',
                data: chartData?.monthlyRevenue || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }
        ]
    };

    // Datos para el gráfico de ingresos anuales (del backend)
    const annualRevenueData = {
        labels: ['2023', '2024', '2025'],
        datasets: [
            {
                label: 'Ingresos Anuales',
                data: chartData?.annualRevenue || [0, 0, 0],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2
            }
        ]
    };

    // Datos para el gráfico de reservas por tipo de habitación (del backend)
    const roomTypeReservationsData = {
        labels: chartData?.roomTypeReservations?.map(r => r.room_type) || ['Habitación Estándar', 'Habitación Deluxe', 'Habitación Familiar', 'Suite VIP'],
        datasets: [
            {
                label: 'Reservas por Tipo',
                data: chartData?.roomTypeReservations?.map(r => r.count) || [0, 0, 0, 0],
                backgroundColor: [
                    'rgba(251, 191, 36, 0.8)',  // Amarillo
                    'rgba(34, 197, 94, 0.8)',   // Verde
                    'rgba(168, 85, 247, 0.8)',  // Púrpura
                    'rgba(239, 68, 68, 0.8)'    // Rojo
                ],
                borderColor: [
                    'rgba(251, 191, 36, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 2
            }
        ]
    };

    // Datos para el gráfico de métodos de pago
    const paymentMethodsData = {
        labels: ['MercadoPago', 'Credit card', 'Crédito del Operador', 'Paypal'],
        datasets: [
            {
                label: 'Métodos de Pago',
                data: [16, 5, 7, 5],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(251, 191, 36, 1)',
                    'rgba(239, 68, 68, 1)'
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

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(price);
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
                {/* Distribución de Usuarios */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl border border-cyan-700/30">
                    <div className="flex items-center gap-3 mb-4">
                        <i className="fas fa-users text-purple-400 text-xl"></i>
                        <h2 className="text-xl font-bold text-white">Distribución de Usuarios</h2>
                    </div>
                    <div className="h-64">
                        <Pie data={usersDistributionData} options={pieOptions} />
                    </div>
                </div>

                {/* Ingresos Mensuales 2025 */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl border border-cyan-700/30">
                    <div className="flex items-center gap-3 mb-4">
                        <i className="fas fa-dollar-sign text-green-400 text-xl"></i>
                        <h2 className="text-xl font-bold text-white">Ingresos Mensuales 2025</h2>
                    </div>
                    <div className="h-64">
                        <Line data={monthlyRevenueData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Segunda fila de gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Ingresos Anuales */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl border border-cyan-700/30">
                    <div className="flex items-center gap-3 mb-4">
                        <i className="fas fa-chart-line text-blue-400 text-xl"></i>
                        <h2 className="text-xl font-bold text-white">Ingresos Anuales</h2>
                    </div>
                    <div className="h-64">
                        <Bar data={annualRevenueData} options={chartOptions} />
                    </div>
                </div>

                {/* Reservas por Tipo de Habitación */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl border border-cyan-700/30">
                    <div className="flex items-center gap-3 mb-4">
                        <i className="fas fa-bed text-yellow-400 text-xl"></i>
                        <h2 className="text-xl font-bold text-white">Reservas por Tipo de Habitación</h2>
                    </div>
                    <div className="h-64">
                        <Pie data={roomTypeReservationsData} options={pieOptions} />
                    </div>
                </div>
            </div>

            {/* Tercera fila */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Métodos de Pago Más Usados */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl border border-cyan-700/30">
                    <div className="flex items-center gap-3 mb-4">
                        <i className="fas fa-credit-card text-green-400 text-xl"></i>
                        <h2 className="text-xl font-bold text-white">Métodos de Pago Más Usados</h2>
                    </div>
                    <div className="h-64">
                        <Pie data={paymentMethodsData} options={pieOptions} />
                    </div>
                </div>

                {/* Cards de estadísticas rápidas */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <i className="fas fa-users text-white text-2xl"></i>
                        </div>
                        <p className="text-blue-200 text-sm">Total Usuarios</p>
                        <h3 className="text-4xl font-bold text-white">{chartData?.totalUsers || 0}</h3>
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <i className="fas fa-dollar-sign text-white text-2xl"></i>
                        </div>
                        <p className="text-green-200 text-sm">Ingresos Totales</p>
                        <h3 className="text-2xl font-bold text-white">{formatPrice(chartData?.totalRevenue || 0)}</h3>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <i className="fas fa-clipboard-list text-white text-2xl"></i>
                        </div>
                        <p className="text-purple-200 text-sm">Reservas Confirmadas</p>
                        <h3 className="text-4xl font-bold text-white">{chartData?.confirmedReservations || 0}</h3>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <i className="fas fa-calendar-check text-white text-2xl"></i>
                        </div>
                        <p className="text-yellow-200 text-sm">Total Reservas</p>
                        <h3 className="text-4xl font-bold text-white">{chartData?.totalReservations || 0}</h3>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminStats;
