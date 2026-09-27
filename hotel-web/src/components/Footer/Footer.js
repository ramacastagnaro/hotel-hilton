import { HOTEL } from '../../config/hotel';

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {/* Sección principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="col-span-1 sm:col-span-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600 mb-4 font-serif">
              {HOTEL.name}
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              {HOTEL.description}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a href={HOTEL.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-700 hover:bg-navy-700 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <i className="fab fa-facebook-f text-white text-lg" aria-hidden="true"></i>
              </a>
              <a href={HOTEL.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-700 hover:bg-navy-700 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <i className="fab fa-instagram text-white text-lg" aria-hidden="true"></i>
              </a>
              <a href={HOTEL.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-700 hover:bg-navy-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <i className="fab fa-twitter text-white text-lg" aria-hidden="true"></i>
              </a>
              <a href={HOTEL.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-700 hover:bg-navy-800 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <i className="fab fa-linkedin-in text-white text-lg" aria-hidden="true"></i>
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-gold-400 transition-colors duration-200 flex items-center gap-2">
                <i className="fas fa-chevron-right text-xs" aria-hidden="true"></i> Inicio
              </a></li>
              <li><a href="/habitaciones" className="text-gray-400 hover:text-gold-400 transition-colors duration-200 flex items-center gap-2">
                <i className="fas fa-chevron-right text-xs" aria-hidden="true"></i> Habitaciones
              </a></li>
              <li><a href="/servicios" className="text-gray-400 hover:text-gold-400 transition-colors duration-200 flex items-center gap-2">
                <i className="fas fa-chevron-right text-xs" aria-hidden="true"></i> Servicios
              </a></li>
              <li><a href="/sobre-nosotros" className="text-gray-400 hover:text-gold-400 transition-colors duration-200 flex items-center gap-2">
                <i className="fas fa-chevron-right text-xs" aria-hidden="true"></i> Sobre Nosotros
              </a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contacto</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt text-gold-500 mt-1" aria-hidden="true"></i>
                <span>{HOTEL.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-phone text-gold-500" aria-hidden="true"></i>
                <span>{HOTEL.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-envelope text-gold-500" aria-hidden="true"></i>
                <span className="break-all">{HOTEL.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; 2025 Hotel Hilton. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
              <a href="/" className="text-gray-400 hover:text-gold-400 transition-colors duration-200">Política de Privacidad</a>
              <a href="/" className="text-gray-400 hover:text-gold-400 transition-colors duration-200">Términos y Condiciones</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;