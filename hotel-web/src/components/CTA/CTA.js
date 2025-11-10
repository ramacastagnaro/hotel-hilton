import { Link } from 'react-router-dom';

function CTA(){
    return(
        <section className='relative bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 text-white py-20 overflow-hidden'>
            {/* Efectos de fondo */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
            </div>
            
            <div className='container mx-auto px-4 py-12 text-center relative z-10'>
                <div className="animate-fadeIn">
                    <h2 className='text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg'>
                        La Habitacion Perfecta te Espera!
                    </h2>
                    <p className='text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed text-blue-100'>
                        Explora nuestra variedad de habitaciones diseñadas para tu maximo confort. Encuentra el espacio ideal para tu proxima visita.
                    </p>
                    <Link
                        to='/habitaciones' //link de pag de habitaciones ...
                        className="inline-flex items-center gap-3 bg-white text-blue-700 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:bg-gray-50">
                        <span>Explorar Habitaciones</span>
                        <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </section>
        );
}

export default CTA;