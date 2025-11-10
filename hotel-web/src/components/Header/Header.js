import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase/config';

function Header() {
  const { currentUser } = useAuth();
  console.log('Usuario actual en Header:', currentUser);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [operatorData, setOperatorData] = useState(null);
  
  // Verificar si el usuario es operador/admin
  useEffect(() => {
    console.log('🔍 Verificando si es operador...', currentUser?.email);
    
    const checkOperator = async () => {
      if (currentUser?.email) {
        try {
          console.log('📡 Llamando a API de operadores...');
          const response = await fetch(`http://localhost:4000/api/admin/operators`);
          console.log('📡 Respuesta de API:', response.status);
          
          if (response.ok) {
            const operators = await response.json();
            console.log('📋 Operadores obtenidos:', operators);
            
            const operator = operators.find(op => op.email === currentUser.email);
            if (operator) {
              console.log('✅ Operador encontrado:', operator);
              setOperatorData(operator);
            } else {
              console.log('❌ No es operador:', currentUser.email);
            }
          } else {
            console.error('❌ Error en respuesta API:', response.status);
          }
        } catch (err) {
          console.error('❌ Error al verificar operador:', err);
        }
      } else {
        console.log('⚠️ No hay usuario logueado');
      }
    };
    
    checkOperator();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
      navigate('/');
      alert('Has cerrado sesión.');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert('Error al cerrar sesión.');
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="flex flex-col group">
          <span className="text-2xl font-bold tracking-tight text-gray-800 group-hover:text-blue-700 transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>
            Hotel Hilton
          </span>
          <span className="text-xs text-gray-500 tracking-widest uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Luxury & Comfort
          </span>
        </Link>
        <nav>
          {/* CORRECCIÓN: Añadido items-center para alinear verticalmente */}
          <ul className="flex items-center space-x-8">
            <li><Link to="/" className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 hover:scale-105 relative group">
              Inicio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link></li>
            <li><Link to="/habitaciones" className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 hover:scale-105 relative group">
              Habitaciones
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link></li>
            <li><Link to="/servicios" className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 hover:scale-105 relative group">
              Servicios
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link></li>
            <li><Link to="/contacto" className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 hover:scale-105 relative group">
              Contacto
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link></li>
            <li><Link to="/sobre-nosotros" className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 hover:scale-105 relative group">
              Sobre Nosotros
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link></li>
            {/* menu de user*/}
            <li className="relative">
              {currentUser ? (
                <>
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center focus:outline-none hover:opacity-80 transition-all duration-200"> {/* abre/cerrar menu */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center font-bold text-sm mr-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      {currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 hidden md:block">
                      {currentUser.email}
                    </span>
                    <i className={`fas fa-chevron-down ml-2 text-xs transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}></i>
                  </button>
                  {/* Menu despegable*/}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl py-2 z-10 border border-gray-100 animate-fadeIn">
                      <Link
                        to="/mi-cuenta"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 rounded-lg mx-2">
                        <span className="flex items-center">
                          <i className="fas fa-user mr-3 text-blue-600"></i>
                          <span className="font-medium">Mi Cuenta</span>
                        </span>
                      </Link>
                      
                      {/* Botón Panel Admin */}
                      {operatorData?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200 rounded-lg mx-2 mt-1">
                          <span className="flex items-center">
                            <i className="fas fa-shield-alt mr-3 text-red-600"></i>
                            <span className="font-medium">Panel Admin</span>
                          </span>
                        </Link>
                      )}
                      
                      {/* Botón Panel Operador */}
                      {operatorData?.role === 'operador' && (
                        <Link
                          to="/operador"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 rounded-lg mx-2 mt-1">
                          <span className="flex items-center">
                            <i className="fas fa-headset mr-3 text-green-600"></i>
                            <span className="font-medium">Panel Operador</span>
                          </span>
                        </Link>
                      )}
                      
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 rounded-lg mx-2 mt-1">
                        <i className="fas fa-sign-out-alt mr-3 text-red-600"></i>
                        <span className="font-medium">Cerrar Sesión</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" className="text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2.5 rounded-full font-bold transition-all duration-300 text-sm shadow-lg hover:shadow-xl hover:scale-105">
                  Iniciar Sesión
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;