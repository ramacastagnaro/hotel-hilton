import { createUserWithEmailAndPassword } from 'firebase/auth'; //Firebase
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config'; //configuracion 'auth'
import { buttonStyles } from '../utils/buttonStyles';

function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(''); //msj de error

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError(''); //limpiar msj de error
        
        if(password !== confirmPassword){
            setError('La contraseña no coincide');
            return;
        }

        if(password.length < 6){
            setError('La contraseña debe tener al menos 6 caracteres.');
        }

        try{
            //Llamamos a Firebase para crear el user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Usuario registrado:', userCredential.user);
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            navigate('/login'); // Redirigimos al usuario a la página de Login
        
        } catch (err) {
            //Manejo Errores de Firebase
            console.error("Error de registro:", err.code, err.message);
            if (err.code === 'auth/email-already-in-use') {
                setError('El correo electrónico ya está registrado.');
            } else if (err.code === 'auth/invalid-email') {
                setError('El formato del correo electrónico no es válido.');
            } else {
                setError('Ocurrió un error durante el registro. Inténtalo de nuevo.');
            }
        }
    };

    return(
        <div className='min-h-screen bg-gradient-to-br from-navy-50 via-surface-50 to-gold-50 flex items-center justify-center p-4 py-12'>
            <Helmet>
                <title>Registro - Hotel Hilton</title>
            </Helmet>
            <div className='w-full max-w-md bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-white/20 animate-fadeIn'>
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-navy-800 rounded-2xl mb-4 shadow-lg">
                        <i className="fas fa-user-plus text-gold-400 text-3xl"></i>
                    </div>
                    <h1 className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-navy-800 to-gold-500 mb-2'>Crear Cuenta</h1>
                    <p className="text-gray-600">Únete a nuestra comunidad</p>
                </div>

                {error && <p className='bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-center gap-2'>
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                </p>}
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div>
                        <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-2'>Correo Electrónico</label>
                        <div className="relative">
                            <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border-2 border-gray-200 rounded-xl shadow-sm pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Contraseña</label>
                        <div className="relative">
                            <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full border-2 border-gray-200 rounded-xl shadow-sm pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Repite tu contraseña"
                            />
                        </div>
                    </div>
                    <div className="pt-2">
                        <button
                            type="submit"
                            className={buttonStyles({ variant: 'primary', size: 'lg', className: 'w-full' })}>
                            <span>Registrarse</span>
                            <i className="fas fa-user-check"></i>
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-600 mt-8">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-navy-800 to-gold-500 transition-all duration-200">
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;