//iconos SVG simples para cada caracteristica
const WifiIcon = () => (
  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-navy-700 to-navy-900 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M1.394 8.536a15 15 0 0121.212 0"></path></svg>
  </div>
);
const PoolIcon = () => (
  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-gold-500 to-gold-700 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.881 15.119A5.002 5.002 0 0012 17a5 5 0 004.119-1.881M17.881 12.119A5.002 5.002 0 0012 10a5 5 0 00-4.119 1.881"></path></svg>
  </div>
);
const RestaurantIcon = () => (
  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-navy-600 to-gold-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m16 0l-3-4m0 0l-3 4m3-4v4M6 15v4a2 2 0 002 2h1m-1-4l3-4m0 0l3 4m-3-4v4"></path></svg>
  </div>
);


function Features() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16 animate-fadeIn">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Nuestros Servicios <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-800 to-gold-500">Principales</span>
            </h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg max-w-2xl mx-auto">Comodidades pensadas para una estadía inolvidable.</p>
            <div className="w-24 h-1 bg-gradient-to-r from-navy-800 to-gold-500 mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center">
          
          <div className="feature-item p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100">
            <WifiIcon />
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800 group-hover:text-navy-700 transition-colors duration-300">Wi-Fi de Alta Velocidad</h3>
            <p className="text-gray-600 leading-relaxed">Conexión gratuita y confiable en todas las áreas del hotel para que no te pierdas de nada.</p>
          </div>

          <div className="feature-item p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100">
            <PoolIcon />
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800 group-hover:text-gold-700 transition-colors duration-300">Piscina Climatizada</h3>
            <p className="text-gray-600 leading-relaxed">Relajate en nuestra piscina con vistas panorámicas, ideal para cualquier momento del día.</p>
          </div>

          <div className="feature-item p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100">
            <RestaurantIcon />
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800 group-hover:text-navy-700 transition-colors duration-300">Restaurante Gourmet</h3>
            <p className="text-gray-600 leading-relaxed">Una experiencia culinaria única con los mejores ingredientes de la región.</p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Features;