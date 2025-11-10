import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AccountPage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (newPassword !== confirmPassword) {
            setError('Las nuevas contraseñas no coinciden.');
            return;
        }
        if (newPassword.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        try {
            await updatePassword(currentUser, newPassword);
            setSuccessMessage('¡Contraseña actualizada con éxito!');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            if (error.code === 'auth/requires-recent-login') {
                setError('Por seguridad, debes volver a ingresar tu contraseña actual.');
                const currentPassword = prompt('Ingresa tu contraseña actual:');
                if (currentPassword) {
                    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
                    try {
                        await reauthenticateWithCredential(currentUser, credential);
                        await updatePassword(currentUser, newPassword);
                        setSuccessMessage('¡Contraseña actualizada con éxito!');
                        setNewPassword('');
                        setConfirmPassword('');
                    } catch (reauthError) {
                        console.error("Error de re-autenticación:", reauthError);
                        setError('La contraseña actual es incorrecta o ocurrió un error.');
                    }
                } else {
                    setError('Se requiere la contraseña actual para continuar.');
                }
            } else {
                setError('Ocurrió un error al intentar cambiar la contraseña.');
            }
        }
    };


    if (!currentUser) {
        return null;
    }

    return (
        <div className="container mx-auto p-4 py-12">
            <Helmet>
                <title>Mi Cuenta - Hotel Hilton</title>
            </Helmet>
            <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Mi Cuenta</h1>

                {/* --- Sección de Información --- */}
                <div className="space-y-4 mb-8 pb-6 border-b">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Correo Electrónico</p>
                        <p className="text-lg text-gray-800">{currentUser.email}</p>
                    </div>
                    {/* Podríamos añadir el nombre si lo tenemos: currentUser.displayName */}
                </div>

                {/* --- Sección para Cambiar Contraseña --- */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Cambiar Contraseña</h2>
                
                {/* Mostramos mensajes de éxito o error */}
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                {successMessage && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm">{successMessage}</p>}

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Repite la nueva contraseña"
                        />
                    </div>
                    <div className="text-right pt-2">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Actualizar Contraseña
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default AccountPage;