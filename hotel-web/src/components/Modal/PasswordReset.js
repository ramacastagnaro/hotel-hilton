import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../../firebase/config';

function PasswordReset({ onClose }){
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Limpia mensajes previos
        setError(false);

        try{
            await sendPasswordResetEmail(auth, email);
            setMessage('¡Correo enviado! Revisa tu bandeja de entrada (y spam) para las instrucciones.');
            setError(false);
            setEmail('');
        } catch(err){
            console.error("Error al enviar email de reseteo:", err.code, err.message);
            setError(true);
            if (err.code === 'auth/user-not-found') {
                setMessage('No se encontró ninguna cuenta con ese correo electrónico.');

            }else if (err.code === 'auth/invalid-email'){
                setMessage('El formato del correo electrónico no es válido.');
            }else{
                setMessage('Ocurrió un error al intentar restablecer la contraseña.');
            }
        }
    };

    return (
        //Fondo oscuro semitransparente
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Restablecer Contraseña</h2>
                <p className="text-center text-sm text-gray-600 mb-6">Ingresa tu correo electrónico y te enviaremos las instrucciones para crear una nueva contraseña.</p>

                {message && (
                    <p className={`p-3 rounded-md mb-4 text-sm ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}> {message} </p>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                        <input
                            type="email"
                            name="resetEmail"
                            id="resetEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="tu@correo.com"
                        />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                            Enviar Instrucciones
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PasswordReset;