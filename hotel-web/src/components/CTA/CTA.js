import { Link } from 'react-router-dom';

function CTA(){
    return(
        <section className='relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white py-16 sm:py-20 overflow-hidden'>
            {/* Efectos de fondo */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gold-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-navy-400 rounded-full blur-3xl"></div>
            </div>
            
            <div className='container mx-auto px-4 py-8 sm:py-12 text-center relative z-10'>
                <div className="animate-fadeIn">
                    <h2 className='text-3xl sm:text-4xl md:text-6xl font-extrabold mb-5 sm:mb-6 drop-shadow-lg'>
                        La Habitación Perfecta te Espera
                    </h2>
                    <p className='text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed text-navy-100'>
                        Explorá nuestra variedad de habitaciones diseñadas para tu máximo confort. Encontrá el espacio ideal para tu próxima visita.
                    </p>
                    <Link
                        to='/habitaciones'
                        className="inline-flex items-center gap-3 bg-gold-500 text-navy-950 font-bold py-3.5 px-8 sm:py-4 sm:px-10 rounded-full text-base sm:text-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:bg-gold-400">
                        <span>Explorar Habitaciones</span>
                        <i className="fas fa-arrow-right" aria-hidden="true"></i>
                    </Link>
                </div>
            </div>
        </section>
        );
}

export default CTA;