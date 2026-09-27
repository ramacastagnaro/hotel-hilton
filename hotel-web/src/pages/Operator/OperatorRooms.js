import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import OperatorLayout from '../../components/Operator/OperatorLayout';
import { getRooms, setRoomStatus } from '../../services/roomsService';
import { formatPrice } from '../../utils/format';
import { buttonStyles } from '../../utils/buttonStyles';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function OperatorRooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Obtener habitaciones del backend
    useEffect(() => {
        fetchRooms();
    }, []);
    
    const fetchRooms = async () => {
        try {
            setLoading(true);
            const data = await getRooms();
            // Agregar posiciones ficticias para el mapa y status por defecto
            const roomsWithPositions = data.map((room, index) => ({
                ...room,
                status: room.status || 'disponible', // Si no tiene status, es disponible
                position: [-24.7859 + (index * 0.0001), -65.4117 + (index * 0.0001)]
            }));
            setRooms(roomsWithPositions);
            setError(null);
        } catch (err) {
            console.error('Error al cargar habitaciones:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return (
            <OperatorLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-white text-xl">Cargando habitaciones...</div>
                </div>
            </OperatorLayout>
        );
    }
    
    if (error) {
        return (
            <OperatorLayout>
                <div className="bg-red-500 text-white p-4 rounded">
                    Error: {error}
                    <button 
                        onClick={fetchRooms}
                        className={buttonStyles({ variant: 'destructive', className: 'mt-2' })}>
                        Reintentar
                    </button>
                </div>
            </OperatorLayout>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'disponible':
                return 'bg-green-600';
            case 'ocupada':
                return 'bg-red-600';
            case 'mantenimiento':
                return 'bg-yellow-600';
            default:
                return 'bg-gray-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'disponible':
                return 'fa-door-open';
            case 'ocupada':
                return 'fa-door-closed';
            case 'mantenimiento':
                return 'fa-tools';
            default:
                return 'fa-question';
        }
    };

    const toggleRoomStatus = async (roomId) => {
        const room = rooms.find(r => r.room_id === roomId);
        if (!room) return;

        let newStatus;
        if (room.status === 'disponible') {
            newStatus = 'mantenimiento';
        } else if (room.status === 'mantenimiento') {
            newStatus = 'disponible';
        } else {
            return; // No cambiar si está ocupada
        }

        try {
            // Persistir el cambio en el backend antes de reflejarlo en la UI
            await setRoomStatus(roomId, newStatus);
            setRooms(rooms.map(r =>
                r.room_id === roomId ? { ...r, status: newStatus } : r
            ));
        } catch (err) {
            console.error('Error al actualizar el estado de la habitación:', err);
            alert('No se pudo actualizar el estado de la habitación');
        }
    };

    const filteredRooms = filterStatus === 'all' 
        ? rooms 
        : rooms.filter(r => r.status === filterStatus);

    return (
        <OperatorLayout>
            <Helmet>
                <title>Consultar Habitaciones - Panel de Operador</title>
            </Helmet>

            <div className="flex items-center gap-3 mb-8">
                <i className="fas fa-map-marked-alt text-white text-3xl"></i>
                <h1 className="text-3xl font-bold text-white">Mapa de Habitaciones</h1>
            </div>

            {/* Filtros */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setFilterStatus('all')}
                    className={buttonStyles({ variant: filterStatus === 'all' ? 'primary' : 'secondary' })}>
                    Todas ({rooms.length})
                </button>
                <button
                    onClick={() => setFilterStatus('disponible')}
                    className={buttonStyles({ variant: filterStatus === 'disponible' ? 'primary' : 'secondary' })}>
                    Disponibles ({rooms.filter(r => r.status === 'disponible').length})
                </button>
                <button
                    onClick={() => setFilterStatus('ocupada')}
                    className={buttonStyles({ variant: filterStatus === 'ocupada' ? 'primary' : 'secondary' })}>
                    Ocupadas ({rooms.filter(r => r.status === 'ocupada').length})
                </button>
                <button
                    onClick={() => setFilterStatus('mantenimiento')}
                    className={buttonStyles({ variant: filterStatus === 'mantenimiento' ? 'primary' : 'secondary' })}>
                    Mantenimiento ({rooms.filter(r => r.status === 'mantenimiento').length})
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mapa */}
                <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-2xl p-6 shadow-xl border border-emerald-700/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <i className="fas fa-map text-emerald-400"></i>
                        Ubicación de Habitaciones
                    </h2>
                    <div className="h-96 rounded-xl overflow-hidden">
                        <MapContainer
                            center={[-24.7859, -65.4117]}
                            zoom={16}
                            style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {filteredRooms.map((room) => (
                                <Marker
                                    key={room.room_id}
                                    position={room.position}
                                    eventHandlers={{
                                        click: () => setSelectedRoom(room)
                                    }}>
                                    <Popup>
                                        <div className="text-center">
                                            <h3 className="font-bold">{room.name || 'Habitación'}</h3>
                                            <p className="text-sm">{room.category || 'Categoría'}</p>
                                            <p className={`text-xs font-bold ${room.status === 'disponible' ? 'text-green-600' : room.status === 'ocupada' ? 'text-red-600' : 'text-yellow-600'}`}>
                                                {room.status ? room.status.toUpperCase() : 'DISPONIBLE'}
                                            </p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>

                {/* Lista de Habitaciones */}
                <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-2xl p-6 shadow-xl border border-emerald-700/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <i className="fas fa-list text-emerald-400"></i>
                        Lista de Habitaciones
                    </h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {filteredRooms.map((room) => (
                            <div
                                key={room.room_id}
                                onClick={() => setSelectedRoom(room)}
                                className={`bg-emerald-900/50 rounded-xl p-4 border transition-all duration-300 cursor-pointer ${
                                    selectedRoom?.room_id === room.room_id
                                        ? 'border-emerald-500 shadow-lg'
                                        : 'border-emerald-700/30 hover:border-emerald-500/50'
                                }`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 ${getStatusColor(room.status || 'disponible')} rounded-full flex items-center justify-center`}>
                                            <i className={`fas ${getStatusIcon(room.status || 'disponible')} text-white text-xl`}></i>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold">{room.name || 'Habitación'}</h3>
                                            <p className="text-gray-400 text-sm">{room.category || 'Categoría'}</p>
                                            <p className="text-emerald-400 text-sm font-bold">
                                                {room.price ? formatPrice(room.price) : 'Consultar'}/noche
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className={`px-3 py-1 ${getStatusColor(room.status || 'disponible')} text-white text-xs font-bold rounded-full text-center`}>
                                            {room.status || 'disponible'}
                                        </span>
                                        {room.status !== 'ocupada' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleRoomStatus(room.room_id);
                                                }}
                                                className={buttonStyles({ variant: 'secondary', size: 'sm' })}>
                                                {room.status === 'disponible' ? 'Cerrar' : 'Abrir'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detalles de la habitación seleccionada */}
            {selectedRoom && (
                <div className="mt-6 bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-2xl p-6 shadow-xl border border-emerald-700/30 animate-fadeIn">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <i className="fas fa-info-circle text-emerald-400"></i>
                            Detalles - Habitación {selectedRoom.number}
                        </h2>
                        <button
                            onClick={() => setSelectedRoom(null)}
                            aria-label="Cerrar"
                            className="text-gray-400 hover:text-white transition-colors">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-gray-400 text-sm">Número</p>
                            <p className="text-white font-bold text-lg">{selectedRoom.number}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Piso</p>
                            <p className="text-white font-bold text-lg">{selectedRoom.floor}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Tipo</p>
                            <p className="text-white font-bold text-lg">{selectedRoom.type}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Estado</p>
                            <span className={`inline-block px-3 py-1 ${getStatusColor(selectedRoom.status)} text-white text-sm font-bold rounded-full`}>
                                {selectedRoom.status}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </OperatorLayout>
    );
}

export default OperatorRooms;
