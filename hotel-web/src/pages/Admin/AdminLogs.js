import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '../../components/Admin/AdminLayout';
import { getLogs } from '../../services/logsService';

// Canonical system_logs contract read by this page:
// { log_id, event_type, description, user_email, created_at }
//
// `event_type` is free-form, so the filters and badges group entries by keyword
// instead of matching a single hardcoded value.
const EVENT_FILTERS = [
  { id: 'all', label: 'Todas', keywords: [] },
  {
    id: 'create',
    label: 'Creación',
    keywords: ['crea', 'create', 'registr', 'nuevo'],
  },
  {
    id: 'update',
    label: 'Actualización',
    keywords: ['actualiz', 'update', 'modific', 'edit'],
  },
  {
    id: 'delete',
    label: 'Eliminación',
    keywords: ['elimin', 'delete', 'borr'],
  },
  {
    id: 'login',
    label: 'Login',
    keywords: ['login', 'acceso', 'sesion', 'sesión'],
  },
];

const EVENT_STYLES = {
  create: {
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: 'fa-plus-circle',
  },
  update: {
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: 'fa-edit',
  },
  delete: {
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: 'fa-trash',
  },
  login: {
    color: 'bg-gold-100 text-gold-800 border-gold-300',
    icon: 'fa-sign-in-alt',
  },
  other: {
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: 'fa-info-circle',
  },
};

const getEventGroup = (eventType) => {
  const value = (eventType || '').toLowerCase();
  const group = EVENT_FILTERS.find(
    (filter) =>
      filter.id !== 'all' &&
      filter.keywords.some((keyword) => value.includes(keyword))
  );
  return group ? group.id : 'other';
};

const matchesFilter = (eventType, filterId) => {
  if (filterId === 'all') return true;
  const filter = EVENT_FILTERS.find((item) => item.id === filterId);
  if (!filter) return true;
  const value = (eventType || '').toLowerCase();
  return filter.keywords.some((keyword) => value.includes(keyword));
};

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEvent, setFilterEvent] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getLogs();
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
            <i className="fas fa-spinner fa-spin text-4xl text-gold-400 mb-4"></i>
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
          <p>
            <strong>Error:</strong> {error}
          </p>
          <button
            onClick={fetchLogs}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Reintentar
          </button>
        </div>
      </AdminLayout>
    );
  }

  const filteredLogs = logs.filter((log) =>
    matchesFilter(log.event_type, filterEvent)
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const countByGroup = (group) =>
    logs.filter((log) => getEventGroup(log.event_type) === group).length;

  const statsCards = [
    {
      group: 'create',
      label: 'Creaciones',
      gradient: 'from-green-500 to-green-700',
      text: 'text-green-100',
      iconText: 'text-green-200',
      icon: 'fa-plus-circle',
    },
    {
      group: 'update',
      label: 'Actualizaciones',
      gradient: 'from-navy-600 to-navy-800',
      text: 'text-navy-100',
      iconText: 'text-navy-200',
      icon: 'fa-edit',
    },
    {
      group: 'delete',
      label: 'Eliminaciones',
      gradient: 'from-red-500 to-red-700',
      text: 'text-red-100',
      iconText: 'text-red-200',
      icon: 'fa-trash',
    },
    {
      group: 'login',
      label: 'Logins',
      gradient: 'from-gold-500 to-gold-700',
      text: 'text-navy-900',
      iconText: 'text-navy-900',
      icon: 'fa-sign-in-alt',
    },
  ];

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
              <i className="fas fa-clipboard-list text-gold-400"></i>
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
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-gray-700 font-semibold">Filtrar por tipo de evento:</span>
            <div className="flex gap-2 flex-wrap">
              {EVENT_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterEvent(filter.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filterEvent === filter.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}>
                  {filter.label}
                </button>
              ))}
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
                    Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
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
                  filteredLogs.map((log) => {
                    const style = EVENT_STYLES[getEventGroup(log.event_type)];
                    return (
                      <tr key={log.log_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{log.log_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${style.color}`}>
                            <i className={`fas ${style.icon}`}></i>
                            {log.event_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.user_email || 'Sistema'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                          {log.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(log.created_at)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statsCards.map((card) => (
            <div
              key={card.group}
              className={`bg-gradient-to-br ${card.gradient} rounded-xl p-6 text-white shadow-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${card.text} text-sm`}>{card.label}</p>
                  <h3 className="text-3xl font-bold">{countByGroup(card.group)}</h3>
                </div>
                <i className={`fas ${card.icon} text-4xl ${card.iconText}`}></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminLogs;
