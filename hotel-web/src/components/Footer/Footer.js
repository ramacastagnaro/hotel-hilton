function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-6 py-12">
        {/* Sección principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 font-serif">
              Hotel Hilton
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              Tu destino de lujo y confort. Ofrecemos experiencias inolvidables con servicios de primera clase.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <i className="fab fa-facebook-f text-white text-lg"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-700 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <i className="fab fa-instagram text-white text-lg"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-700 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-300 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <i className="fab fa-twitter text-white text-lg"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-700 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <i className="fab fa-linkedin-in text-white text-lg"></i>
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
                <i className="fas fa-chevron-right text-xs"></i> Inicio
              </a></li>
              <li><a href="/habitaciones" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
                <i className="fas fa-chevron-right text-xs"></i> Habitaciones
              </a></li>
              <li><a href="/servicios" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
                <i className="fas fa-chevron-right text-xs"></i> Servicios
              </a></li>
              <li><a href="/sobre-nosotros" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
                <i className="fas fa-chevron-right text-xs"></i> Sobre Nosotros
              </a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contacto</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt text-blue-400 mt-1"></i>
                <span>Av. Arenales 742, Salta, Argentina</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-phone text-blue-400"></i>
                <span>+54 387 431-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-envelope text-blue-400"></i>
                <span>HiltonHoteles@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; 2025 Hotel Hilton. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">Política de Privacidad</a>
              <a href="/" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">Términos y Condiciones</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;