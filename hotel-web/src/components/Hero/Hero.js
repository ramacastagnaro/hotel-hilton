import { Link } from 'react-router-dom';

function Hero() {
    //url de img >> cambiar luego
    const imageUrl = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2070&q=80';

    return(
        //contenedor principal con fondo
        <div className="relative h-[60vh] bg-cover bg-center flex itmes-center justify-center text-white" 
        style={{ backgroundImage: `url(${imageUrl})` }}>
        
        {/* capa oscura semitransaparente para resaltar txt */}
        <div className="absolute inset-0 bg black opacity-50"></div>

        {/* contenido de texto posicionado encima de la capa oscura */}
        <div className="relative z-10 text-center p-4">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
                Bienvenido a Hotel Hilton
            </h1>
            <p className="text-xl md:text-2xl mb-8">
                Tu escapada de lujo te espera.
            </p>
            
            <Link
                to='/habitaciones'
                className="bg-blue-600 hover:bg-blue-700 text-white font-blod py-3 px-8 rounded-lg text-lg duration-300 ease-in-out transform hover:scale-105">
                    Ver Habitaciones
            </Link>
        </div>
    </div>
    );
}

export default Hero;