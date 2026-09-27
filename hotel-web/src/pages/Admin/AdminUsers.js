import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '../../components/Admin/AdminLayout';
import { useCanMutate } from '../../hooks/useCanMutate';
import {
    createOperator,
    deleteOperator,
    getOperators,
    updateOperator,
} from '../../services/operatorsService';
import { buttonStyles } from '../../utils/buttonStyles';

function AdminUsers() {
    const canMutate = useCanMutate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false); // BTN-4: disable submit while the request is in flight
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'operador'
    });
    
    // Obtener usuarios del backend
    useEffect(() => {
        fetchUsers();
    }, []);
    
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getOperators();
            setUsers(data);
            setLoading(false);

        } catch (err) {
            console.error('Error al cargar usuarios:', err);
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
                        <p className="text-white">Cargando usuarios...</p>
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
                        onClick={fetchUsers}
                        className={buttonStyles({ variant: 'destructive', className: 'mt-2' })}>
                        Reintentar
                    </button>
                </div>
            </AdminLayout>
        );
    }

    const getRoleBadgeColor = (role) => {
        switch ((role || '').toLowerCase()) {
            case 'admin':
                return 'bg-red-600 text-white';
            case 'operador':
                return 'bg-navy-600 text-white';
            case 'demo':
                return 'bg-gold-500 text-navy-950';
            default:
                return 'bg-blue-600 text-white';
        }
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getAvatarColor = (id) => {
        const colors = [
            'from-blue-500 to-blue-700',
            'from-navy-500 to-navy-700',
            'from-red-500 to-red-700',
            'from-green-500 to-green-700',
            'from-yellow-500 to-yellow-700'
        ];
        return colors[id % colors.length];
    };

    const handleNewUser = () => {
        setEditingUser(null);
        setFormData({
            full_name: '',
            email: '',
            password: '',
            role: 'operador'
        });
        setShowModal(true);
    };
    
    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            full_name: user.full_name,
            email: user.email,
            password: '',
            role: user.role
        });
        setShowModal(true);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSaving) return; // BTN-4: guard against re-entry while saving

        // Validar contraseña para nuevos usuarios
        if (!editingUser && formData.password.length < 6) {
            alert('❌ La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        setIsSaving(true);
        try {
            if (editingUser) {
                // Actualizar usuario existente
                await updateOperator(editingUser.operator_id, formData);

                alert('Usuario actualizado correctamente');
            } else {
                // Crear nuevo usuario
                await createOperator(formData);

                alert('✅ Usuario creado correctamente en Firebase y Supabase.\n\nEl usuario ya puede iniciar sesión.');
            }
            
            setShowModal(false);
            fetchUsers(); // Recargar lista
            
        } catch (err) {
            console.error('Error al guardar usuario:', err);
            alert('Error al guardar usuario: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDelete = async (operatorId) => {
        if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
        
        try {
            await deleteOperator(operatorId);

            alert('Usuario eliminado correctamente');
            fetchUsers(); // Recargar lista
            
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            alert('Error al eliminar usuario: ' + err.message);
        }
    };

    return (
        <AdminLayout>
            <Helmet>
                <title>Gestión de Usuarios - Panel de Administración</title>
            </Helmet>

            {/* Header con botón de nuevo usuario */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <i className="fas fa-users text-white text-3xl"></i>
                    <h1 className="text-3xl font-bold text-white">Gestión de Usuarios ({users.length})</h1>
                </div>
                {canMutate && (
                    <button
                        onClick={handleNewUser}
                        className={buttonStyles({ variant: 'primary' })}>
                        <i className="fas fa-plus"></i>
                        <span>Nuevo Usuario</span>
                    </button>
                )}
            </div>

            {/* Lista de usuarios */}
            <div className="space-y-4">
                {users.map((user) => (
                    <div
                        key={user.operator_id}
                        className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl border border-cyan-700/30 hover:border-cyan-500/50 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            {/* Info del usuario */}
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className={`w-16 h-16 bg-gradient-to-br ${getAvatarColor(user.operator_id)} rounded-full flex items-center justify-center shadow-lg`}>
                                    <span className="text-white font-bold text-xl">{getInitials(user.full_name)}</span>
                                </div>

                                {/* Detalles */}
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-white font-bold text-lg">{user.full_name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm">{user.email}</p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        <i className="fas fa-id-badge text-gray-600 mr-2"></i>
                                        ID: {user.operator_id}
                                    </p>
                                </div>
                            </div>

                            {/* Información adicional y acciones */}
                            <div className="flex items-center gap-6">
                                {/* Fecha de registro */}
                                <div className="text-right">
                                    <p className="text-gray-400 text-sm">Registrado:</p>
                                    <p className="text-white font-semibold text-sm">{new Date(user.created_at).toLocaleString('es-AR')}</p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        Rol: {user.role}
                                    </p>
                                </div>

                                {/* Botones de acción */}
                                {canMutate && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className={buttonStyles({ variant: 'secondary' })}>
                                            <i className="fas fa-edit"></i>
                                            <span>Editar</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.operator_id)}
                                            className={buttonStyles({ variant: 'destructive' })}>
                                            <i className="fas fa-trash"></i>
                                            <span>Eliminar</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para crear/editar usuario */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-cyan-700/30 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 font-semibold mb-2">Nombre Completo</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                    placeholder="Ej: Juan Pérez"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                    placeholder="usuario@email.com"
                                    required
                                />
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="block text-gray-300 font-semibold mb-2">Contraseña (mínimo 6 caracteres)</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                        placeholder="Mínimo 6 caracteres"
                                        minLength={6}
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-300 font-semibold mb-2">Rol</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all">
                                    <option value="operador">Operador</option>
                                    <option value="admin">Admin</option>
                                    <option value="demo">Demo (solo lectura)</option>
                                </select>
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
                                    disabled={isSaving}
                                    className={buttonStyles({ variant: 'primary', className: 'flex-1' })}>
                                    {isSaving ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i> Guardando...
                                        </>
                                    ) : (
                                        editingUser ? 'Guardar' : 'Crear'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default AdminUsers;
