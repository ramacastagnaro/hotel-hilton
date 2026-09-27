import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'; //LOGIN
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import PasswordResetModal from '../components/Modal/PasswordReset';
import { auth } from '../firebase/config';
import { loginOperator } from '../services/operatorsService';

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showResetModal, setShowResetModal] = useState(false); // Corregido nombre de estado

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Primero intentar login de operador/admin
            if (email.includes('@hotel.com')) {
                try {
                    const operator = await loginOperator({ email, password });
                    console.log('Operador/Admin inició sesión:', operator);

                    // Guardar datos en localStorage
                    localStorage.setItem('operator', JSON.stringify(operator));

                    // Redirigir según rol
                    if (operator.role === 'admin') {
                        alert('¡Bienvenido Administrador!');
                        navigate('/admin');
                    } else if (operator.role === 'operador') {
                        alert('¡Bienvenido Operador!');
                        navigate('/operador');
                    }
                    return;
                } catch (operatorErr) {
                    // Si el login de operador falla, continuamos con Firebase
                    console.warn('Login de operador no disponible, usando Firebase:', operatorErr.message);
                }
            }
            
            // Si no es operador, usar Firebase normal
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Usuario inició sesión:', userCredential.user);
            alert('¡Inicio de sesión exitoso!');
            navigate('/');
            
        } catch (err) {
            console.error("Error de login:", err.code, err.message);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('Correo electrónico o contraseña incorrectos.');
            } else if (err.code === 'auth/invalid-email') {
                setError('El formato del correo electrónico no es válido.');
            } else {
                setError('Ocurrió un error al iniciar sesión. Inténtalo de nuevo.');
            }
        }
    };

    const handleGoogleSignIn = async () => {
        setError(''); // Limpia errores previos
        const provider = new GoogleAuthProvider();

        try {
            // signInWithPopup abre la ventana emergente de Google
            const result = await signInWithPopup(auth, provider);
            console.log('Usuario inició sesión (Google):', result.user);
            alert('¡Inicio de sesión con Google exitoso!');
            navigate('/');
        } catch (err) {
            console.error("Error de login (Google):", err.code, err.message);
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Has cerrado la ventana de inicio de sesión de Google.');
            } else {
                setError('Ocurrió un error al iniciar sesión con Google. Inténtalo de nuevo.');
            }
        }
    };

    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 py-12">
            <Helmet>
                <title>Iniciar Sesión - Hotel Hilton</title>
            </Helmet>
            <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-white/20 animate-fadeIn">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
                        <i className="fas fa-user text-white text-3xl"></i>
                    </div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">Bienvenido</h1>
                    <p className="text-gray-600">Inicia sesión para continuar</p>
                </div>
                {error && <p className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                </p>}
                
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
                        <div className="relative">
                            <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border-2 border-gray-200 rounded-xl shadow-sm pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" //inputs con styles
                                placeholder="tu@correo.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                        <div className="relative">
                            <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full border-2 border-gray-200 rounded-xl shadow-sm pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Tu contraseña"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2">
                            <span>Ingresar</span>
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>

                    <div className="flex items-center justify-center text-right text-sm mt-2">
                        <button type="button" onClick={() => setShowResetModal(true)} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center gap-2">
                            <i className="fas fa-key text-xs"></i>
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                </form>

                <div className="my-8 flex items-center justify-center">
                    <span className="bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px flex-grow"></span>
                    <span className="px-4 text-sm text-gray-500 font-semibold">O continuar con</span>
                    <span className="bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px flex-grow"></span>
                </div>
                

                <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 text-gray-700 font-semibold py-4 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"> {/* Corregido hover:bg-gray-50 */}
                    <img src="/img/integrations-logo-google.webp" alt="Google Logo" className="h-6 w-6"/>
                    <span>Continuar con Google</span>
                </button>

                <p className="text-center text-sm text-gray-600 mt-8">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/registrar" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                        Regístrate aquí
                    </Link>
                </p>
            </div>

            {showResetModal && <PasswordResetModal onClose={() => setShowResetModal(false)} />} 

        </div>
    );
}

export default LoginPage;