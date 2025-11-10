import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '../../components/Admin/AdminLayout';

function AdminLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterAction, setFilterAction] = useState('all');
    
    useEffect(() => {
        fetchLogs();
    }, []);
    
    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:4000/api/admin/logs');
            if (!response.ok) throw new Error('Error al obtener logs');
            
            const data = await response.json();
            setLogs(data);
            setError(null);
        } catch (err) {
            console.error('Error al cargar logs:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                        <p className="text-gray-600">Cargando logs del sistema...</p>
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
                        onClick={fetchLogs}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Reintentar
                    </button>
                </div>
            </AdminLayout>
        );
    }
    
    const filteredLogs = filterAction === 'all' 
        ? logs 
        : logs.filter(log => log.action === filterAction);
    
    const getActionColor = (action) => {
        switch (action) {
            case 'CREATE':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'UPDATE':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'DELETE':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'LOGIN':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };
    
    const getActionIcon = (action) => {
        switch (action) {
            case 'CREATE':
                return 'fa-plus-circle';
            case 'UPDATE':
                return 'fa-edit';
            case 'DELETE':
                return 'fa-trash';
            case 'LOGIN':
                return 'fa-sign-in-alt';
            default:
                return 'fa-info-circle';
        }
    };
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <AdminLayout>
            <Helmet>
                <title>Logs del Sistema - Panel Admin</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <i className="fas fa-clipboard-list text-blue-600"></i>
                            Logs del Sistema
                        </h1>
                        <p className="text-gray-600 mt-1">Registro de actividades del sistema</p>
                    </div>
                    <button
                        onClick={fetchLogs}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <i className="fas fa-sync-alt"></i>
                        Actualizar
                    </button>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700 font-semibold">Filtrar por acción:</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterAction('all')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    filterAction === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}>
                                Todas
                            </button>
                            <button
                                onClick={() => setFilterAction('CREATE')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    filterAction === 'CREATE'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}>
                                Crear
                            </button>
                            <button
                                onClick={() => setFilterAction('UPDATE')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    filterAction === 'UPDATE'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}>
                                Actualizar
                            </button>
                            <button
                                onClick={() => setFilterAction('DELETE')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    filterAction === 'DELETE'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}>
                                Eliminar
                            </button>
                            <button
                                onClick={() => setFilterAction('LOGIN')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    filterAction === 'LOGIN'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}>
                                Login
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de Logs */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acción
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Detalles
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha y Hora
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            <i className="fas fa-inbox text-4xl mb-2"></i>
                                            <p>No hay logs registrados</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <tr key={log.log_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                #{log.log_id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getActionColor(log.action)}`}>
                                                    <i className={`fas ${getActionIcon(log.action)}`}></i>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {log.user_id || 'Sistema'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                                                {log.details}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(log.created_at)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Creaciones</p>
                                <h3 className="text-3xl font-bold">{logs.filter(l => l.action === 'CREATE').length}</h3>
                            </div>
                            <i className="fas fa-plus-circle text-4xl text-green-200"></i>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Actualizaciones</p>
                                <h3 className="text-3xl font-bold">{logs.filter(l => l.action === 'UPDATE').length}</h3>
                            </div>
                            <i className="fas fa-edit text-4xl text-blue-200"></i>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm">Eliminaciones</p>
                                <h3 className="text-3xl font-bold">{logs.filter(l => l.action === 'DELETE').length}</h3>
                            </div>
                            <i className="fas fa-trash text-4xl text-red-200"></i>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Logins</p>
                                <h3 className="text-3xl font-bold">{logs.filter(l => l.action === 'LOGIN').length}</h3>
                            </div>
                            <i className="fas fa-sign-in-alt text-4xl text-purple-200"></i>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminLogs;
