import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '../../components/Admin/AdminLayout';
import { useCanMutate } from '../../hooks/useCanMutate';
import {
    createRoom,
    deleteRoom,
    getRooms,
    updateRoom,
} from '../../services/roomsService';
import { formatPrice } from '../../utils/format';
import { buttonStyles } from '../../utils/buttonStyles';

function AdminRooms() {
    const canMutate = useCanMutate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Estándar',
        description: '',
        price: '',
        capacity: '',
        image: ''
    });
    
    // Obtener habitaciones del backend
    useEffect(() => {
        fetchRooms();
    }, []);
    
    const fetchRooms = async () => {
        try {
            setLoading(true);
            const data = await getRooms();
            setRooms(data);
            setLoading(false);

        } catch (err) {
            console.error('Error al cargar habitaciones:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setFormData({
            name: room.name || '',
            category: room.category || 'Estándar',
            description: room.description || '',
            price: room.price || '',
            capacity: room.capacity || '',
            image: room.images?.[0] || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (roomId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta habitación?')) {
            try {
                await deleteRoom(roomId);

                setRooms(rooms.filter(r => r.room_id !== roomId));
                alert('Habitación eliminada correctamente');
            } catch (err) {
                console.error('Error al eliminar:', err);
                alert('Error al eliminar la habitación');
            }
        }
    };

    const handleNewRoom = () => {
        setEditingRoom(null);
        setFormData({
            name: '',
            category: 'Estándar',
            description: '',
            price: '',
            capacity: '',
            image: ''
        });
        setShowModal(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Preservar los datos existentes (JSONB) al editar: no se deben
            // destruir services/tariffs/images ni enviar tariffs como objeto.
            const roomData = {
                room_id: editingRoom ? editingRoom.room_id : `room-${Date.now()}`,
                name: formData.name,
                category: formData.category,
                description: formData.description,
                capacity: parseInt(formData.capacity) || 2,
                price: parseFloat(formData.price) || 0,
                images: formData.image ? [formData.image] : (editingRoom?.images || []),
                services: editingRoom?.services ?? [],
                tariffs: editingRoom?.tariffs ?? []
            };

            if (editingRoom) {
                await updateRoom(editingRoom.room_id, roomData);
            } else {
                await createRoom(roomData);
            }

            await fetchRooms();
            setShowModal(false);
            alert(editingRoom ? 'Habitación actualizada correctamente' : 'Habitación creada correctamente');
        } catch (err) {
            console.error('Error al guardar:', err);
            alert('Error al guardar la habitación');
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <i className="fas fa-spinner fa-spin text-4xl text-white mb-4"></i>
                        <p className="text-white">Cargando habitaciones...</p>
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
                        onClick={fetchRooms}
                        className={buttonStyles({ variant: 'destructive', className: 'mt-2' })}>
                        Reintentar
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Helmet>
                <title>Gestión de Habitaciones - Panel de Administración</title>
            </Helmet>

            {/* Header con botón de nueva habitación */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <i className="fas fa-bed text-white text-3xl"></i>
                    <h1 className="text-3xl font-bold text-white">Gestión de Habitaciones ({rooms.length})</h1>
                </div>
                {canMutate && (
                    <button
                        onClick={handleNewRoom}
                        className={buttonStyles({ variant: 'primary' })}>
                        <i className="fas fa-plus"></i>
                        <span>Nueva Habitación</span>
                    </button>
                )}
            </div>

            {/* Grid de habitaciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div
                        key={room.room_id}
                        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-xl border border-cyan-700/30 hover:border-cyan-500 transition-all duration-300 transform hover:scale-105">
                        {/* Imagen */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={room.images?.[0] || '/img/placeholder.jpg'}
                                alt={room.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4 px-3 py-1 bg-purple-600 text-white font-bold rounded-full text-sm">
                                {room.category}
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2">{room.name}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{room.description}</p>

                            {/* Precio */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-gray-500 text-xs">Precio por noche</p>
                                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                                        {formatPrice(room.price)}
                                    </p>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            {canMutate && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(room)}
                                        className={buttonStyles({ variant: 'secondary', className: 'flex-1' })}>
                                        <i className="fas fa-edit"></i>
                                        <span>Editar</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(room.room_id)}
                                        className={buttonStyles({ variant: 'destructive', className: 'flex-1' })}>
                                        <i className="fas fa-trash"></i>
                                        <span>Eliminar</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para crear/editar habitación */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-cyan-700/30 animate-fadeIn my-8">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {editingRoom ? 'Editar Habitación' : 'Nueva Habitación'}
                        </h2>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 font-semibold mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                        placeholder="Ej: Habitación Deluxe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 font-semibold mb-2">Categoría</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all">
                                        <option value="Estándar">Estándar</option>
                                        <option value="Superior">Superior</option>
                                        <option value="Deluxe">Deluxe</option>
                                        <option value="Junior Suite">Junior Suite</option>
                                        <option value="Suite">Suite</option>
                                        <option value="Suite Presidencial">Suite Presidencial</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 font-semibold mb-2">Descripción</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    rows="3"
                                    required
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Describe las características de la habitación..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 font-semibold mb-2">Precio (ARS)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        required
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                        placeholder="250000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 font-semibold mb-2">Capacidad</label>
                                    <input
                                        type="number"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                        required
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                        placeholder="2"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 font-semibold mb-2">URL de Imagen</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                    required
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="https://images.unsplash.com/photo..."
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className={buttonStyles({ variant: 'secondary', className: 'flex-1' })}>
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className={buttonStyles({ variant: 'primary', className: 'flex-1' })}>
                                    {editingRoom ? 'Guardar Cambios' : 'Crear Habitación'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default AdminRooms;
