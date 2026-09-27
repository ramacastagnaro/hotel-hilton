import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'; //LOGIN
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import PasswordResetModal from '../components/Modal/PasswordReset';
import { auth } from '../firebase/config';
import { loginOperator } from '../services/operatorsService';
import { buttonStyles } from '../utils/buttonStyles';

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [demoLoading, setDemoLoading] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false); // Corregido nombre de estado

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Authentication always happens in Firebase first. Operators and
            // admins are Firebase users; their ID token is then exchanged for
            // an operator profile (and role) via the backend.
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Usuario inició sesión:', userCredential.user);

            try {
                const idToken = await userCredential.user.getIdToken();
                const operator = await loginOperator({ idToken });
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
                } else {
                    navigate('/');
                }
                return;
            } catch (operatorErr) {
                // 403/404 => the signed-in user is not an operator/admin.
                if (operatorErr.status !== 403 && operatorErr.status !== 404) {
                    throw operatorErr;
                }
                console.warn('El usuario no es operador/admin:', operatorErr.message);
            }

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

    const handleDemoLogin = async () => {
        setError('');
        setDemoLoading(true);

        // Credenciales de la cuenta demo desde el entorno (nunca hardcodeadas).
        // Son PÚBLICAS: CRA las inlinea en el bundle; se acepta porque el rol
        // demo es de solo lectura.
        const demoEmail = process.env.REACT_APP_DEMO_EMAIL;
        const demoPassword = process.env.REACT_APP_DEMO_PASSWORD;

        try {
            if (!demoEmail || !demoPassword) {
                setError('La demo no está configurada en este entorno.');
                return;
            }

            const userCredential = await signInWithEmailAndPassword(
                auth,
                demoEmail,
                demoPassword
            );

            try {
                const idToken = await userCredential.user.getIdToken();
                const operator = await loginOperator({ idToken });
                localStorage.setItem('operator', JSON.stringify(operator));

                // El rol demo entra al panel de administración en solo lectura.
                navigate(operator.role === 'operador' ? '/operador' : '/admin');
                return;
            } catch (operatorErr) {
                // 403/404 => la cuenta existe en Firebase pero todavía no tiene
                // fila en `operators` (demo sin provisionar). No es un crash.
                if (operatorErr.status !== 403 && operatorErr.status !== 404) {
                    throw operatorErr;
                }
                console.warn('La cuenta demo no es operador:', operatorErr.message);
                setError(
                    'La cuenta demo todavía no está habilitada. Contactá al administrador.'
                );
            }
        } catch (err) {
            console.error('Error de login demo:', err.code, err.message);
            if (
                err.code === 'auth/user-not-found' ||
                err.code === 'auth/wrong-password' ||
                err.code === 'auth/invalid-credential'
            ) {
                setError('La cuenta demo no está disponible o las credenciales no son válidas.');
            } else {
                setError('No se pudo iniciar la demo. Inténtalo de nuevo.');
            }
        } finally {
            setDemoLoading(false);
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
        <div className="min-h-screen bg-gradient-to-br from-navy-50 via-surface-50 to-gold-50 flex items-center justify-center p-4 py-12">
            <Helmet>
                <title>Iniciar Sesión - Hotel Hilton</title>
            </Helmet>
            <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-2xl border border-white/20 animate-fadeIn">
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-block p-3 bg-navy-800 rounded-2xl mb-4 shadow-lg">
                        <i className="fas fa-user text-gold-400 text-3xl" aria-hidden="true"></i>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-navy-800 to-gold-500 mb-2">Bienvenido</h1>
                    <p className="text-gray-600">Inicia sesión para continuar</p>
                </div>
                {error && <p role="alert" className="bg-danger-light border border-danger/30 text-danger p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                    <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
                    {error}
                </p>}
                
                <form onSubmit={handleEmailSubmit} className="space-y-5 sm:space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
                        <div className="relative">
                            <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true"></i>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border-2 border-gray-200 rounded-xl shadow-sm pl-12 pr-4 py-3 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all duration-200"
                                placeholder="tu@correo.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                        <div className="relative">
                            <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true"></i>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full border-2 border-gray-200 rounded-xl shadow-sm pl-12 pr-4 py-3 focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all duration-200"
                                placeholder="Tu contraseña"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className={buttonStyles({ variant: 'primary', size: 'lg', className: 'w-full' })}>
                            <span>Ingresar</span>
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>

                    <div className="flex items-center justify-center text-right text-sm mt-2">
                        <button type="button" onClick={() => setShowResetModal(true)} className={buttonStyles({ variant: 'ghost', size: 'sm' })}>
                            <i className="fas fa-key text-xs"></i>
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                </form>

                {/* Acceso demo de solo lectura */}
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={handleDemoLogin}
                        disabled={demoLoading}
                        className={buttonStyles({ variant: 'secondary', size: 'lg', className: 'w-full gap-2' })}>
                        {demoLoading ? (
                            <>
                                <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
                                <span>Ingresando…</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-eye" aria-hidden="true"></i>
                                <span>Entrar como demo</span>
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-2">
                        Acceso de solo lectura para recorrer los paneles.
                    </p>
                </div>

                <div className="my-6 sm:my-8 flex items-center justify-center">
                    <span className="bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px flex-grow"></span>
                    <span className="px-4 text-sm text-gray-500 font-semibold">O continuar con</span>
                    <span className="bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px flex-grow"></span>
                </div>
                

                <button onClick={handleGoogleSignIn} className={buttonStyles({ variant: 'secondary', size: 'lg', className: 'w-full gap-3 shadow-sm hover:shadow-md' })}>
                    <img src="/img/integrations-logo-google.webp" alt="Google" className="h-6 w-6"/>
                    <span>Continuar con Google</span>
                </button>

                <p className="text-center text-sm text-gray-600 mt-6 sm:mt-8">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/registrar" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-navy-800 to-gold-500 transition-all duration-200">
                        Regístrate aquí
                    </Link>
                </p>
            </div>

            {showResetModal && <PasswordResetModal onClose={() => setShowResetModal(false)} />} 

        </div>
    );
}

export default LoginPage;