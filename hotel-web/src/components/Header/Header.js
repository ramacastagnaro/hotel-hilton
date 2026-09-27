import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { buttonStyles } from '../../utils/buttonStyles';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/habitaciones', label: 'Habitaciones' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/contacto', label: 'Contacto' },
  { to: '/sobre-nosotros', label: 'Sobre Nosotros' },
];

function Header() {
  const { currentUser, role, isDemo, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Autorización resuelta vía `/api/auth/me` en el AuthContext: ya no se llama
  // al endpoint admin-only `/api/admin/operators` para detectar el rol.
  const isAdmin = role === 'admin';
  const isOperator = role === 'operador';

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsMobileNavOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenus();
      navigate('/');
      alert('Has cerrado sesión.');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert('Error al cerrar sesión.');
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
        <Link to="/" className="flex flex-col group" onClick={closeMenus}>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-800 group-hover:text-navy-700 transition-colors duration-300 font-serif">
            Hotel Hilton
          </span>
          <span className="text-xs text-gray-500 tracking-widest uppercase font-sans">
            Luxury &amp; Comfort
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:block">
          <ul className="flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-gray-700 hover:text-navy-700 font-semibold transition-all duration-200 hover:scale-105 relative group">
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            ))}
            {/* menu de user*/}
            <li className="relative">
              {currentUser ? (
                <>
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menú de usuario" aria-expanded={isMenuOpen} className="flex items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 hover:opacity-80 transition-all duration-200"> {/* abre/cerrar menu */}
                    <div className="w-10 h-10 rounded-full bg-navy-800 text-white flex items-center justify-center font-bold text-sm mr-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      {currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 hidden xl:block">
                      {currentUser.email}
                    </span>
                    <i className={`fas fa-chevron-down ml-2 text-xs transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`} aria-hidden="true"></i>
                  </button>
                  {/* Menu despegable*/}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl py-2 z-10 border border-gray-100 animate-fadeIn">
                      <Link
                        to="/mi-cuenta"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-surface-100 transition-all duration-200 rounded-lg mx-2">
                        <span className="flex items-center">
                          <i className="fas fa-user mr-3 text-navy-600" aria-hidden="true"></i>
                          <span className="font-medium">Mi Cuenta</span>
                        </span>
                      </Link>
                      
                      {/* Aviso de sesión demo (solo lectura) */}
                      {isDemo && (
                        <div className="mx-2 mt-1 px-4 py-2 rounded-lg bg-gold-50 border border-gold-200 text-xs font-semibold text-navy-800 flex items-center gap-2">
                          <i className="fas fa-eye text-gold-600" aria-hidden="true"></i>
                          <span>Modo demo · solo lectura</span>
                        </div>
                      )}

                      {/* Botón Panel Admin */}
                      {(isAdmin || isDemo) && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-surface-100 transition-all duration-200 rounded-lg mx-2 mt-1">
                          <span className="flex items-center">
                            <i className="fas fa-shield-alt mr-3 text-navy-600" aria-hidden="true"></i>
                            <span className="font-medium">Panel Admin</span>
                          </span>
                        </Link>
                      )}
                      
                      {/* Botón Panel Operador */}
                      {(isOperator || isDemo) && (
                        <Link
                          to="/operador"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-surface-100 transition-all duration-200 rounded-lg mx-2 mt-1">
                          <span className="flex items-center">
                            <i className="fas fa-headset mr-3 text-navy-600" aria-hidden="true"></i>
                            <span className="font-medium">Panel Operador</span>
                          </span>
                        </Link>
                      )}
                      
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-3 text-sm text-gray-700 hover:bg-surface-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-inset transition-all duration-200 rounded-lg mx-2 mt-1">
                        <i className="fas fa-sign-out-alt mr-3 text-danger" aria-hidden="true"></i>
                        <span className="font-medium">Cerrar Sesión</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" className={buttonStyles({ variant: 'accent', className: 'rounded-full px-6 py-2.5 font-bold' })}>
                  Iniciar Sesión
                </Link>
              )}
            </li>
          </ul>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setIsMobileNavOpen((open) => !open)}
          aria-label={isMobileNavOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMobileNavOpen}
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-navy-800 hover:bg-surface-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 transition-colors">
          <i className={`fas ${isMobileNavOpen ? 'fa-times' : 'fa-bars'} text-xl`} aria-hidden="true"></i>
        </button>
      </div>

      {/* Mobile drawer */}
      {isMobileNavOpen && (
        <nav className="lg:hidden border-t border-gray-100 bg-white animate-fadeIn">
          <ul className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={closeMenus}
                  className="block px-4 py-3 rounded-lg text-gray-700 font-semibold hover:bg-surface-100 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t border-gray-100">
              {currentUser ? (
                <>
                  {isDemo && (
                    <div className="mb-2 px-4 py-2 rounded-lg bg-gold-50 border border-gold-200 text-xs font-semibold text-navy-800 flex items-center gap-2">
                      <i className="fas fa-eye text-gold-600" aria-hidden="true"></i>
                      <span>Modo demo · solo lectura</span>
                    </div>
                  )}
                  <Link
                    to="/mi-cuenta"
                    onClick={closeMenus}
                    className="block px-4 py-3 rounded-lg text-gray-700 font-semibold hover:bg-surface-100 transition-colors">
                    <i className="fas fa-user mr-3 text-navy-600" aria-hidden="true"></i>
                    Mi Cuenta
                  </Link>
                  {(isAdmin || isDemo) && (
                    <Link
                      to="/admin"
                      onClick={closeMenus}
                      className="block px-4 py-3 rounded-lg text-gray-700 font-semibold hover:bg-surface-100 transition-colors">
                      <i className="fas fa-shield-alt mr-3 text-navy-600" aria-hidden="true"></i>
                      Panel Admin
                    </Link>
                  )}
                  {(isOperator || isDemo) && (
                    <Link
                      to="/operador"
                      onClick={closeMenus}
                      className="block px-4 py-3 rounded-lg text-gray-700 font-semibold hover:bg-surface-100 transition-colors">
                      <i className="fas fa-headset mr-3 text-navy-600" aria-hidden="true"></i>
                      Panel Operador
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg text-gray-700 font-semibold hover:bg-surface-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-inset transition-colors">
                    <i className="fas fa-sign-out-alt mr-3 text-danger" aria-hidden="true"></i>
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={closeMenus} className={buttonStyles({ variant: 'accent', className: 'w-full' })}>
                  Iniciar Sesión
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;