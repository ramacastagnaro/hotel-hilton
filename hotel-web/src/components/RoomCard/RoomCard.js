import { Link } from 'react-router-dom';
import { HOTEL } from '../../config/hotel';
import { buttonStyles } from '../../utils/buttonStyles';

//Este componente recibe informacion de una habitacion a traves de 'props'
function RoomCard({ room }) {

  const startingPrice = room.tariffs && room.tariffs.length > 0 ? room.tariffs[0].price : 'N/A';


  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-500 group border border-gray-100">
      <div className="relative overflow-hidden">
        <img
          src={room.images?.[0] || HOTEL.fallbackImage}
          alt={room.name}
          loading="lazy"
          decoding="async"
          onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = HOTEL.fallbackImage; }}
          className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-blue-600 shadow-lg">
          ✨ Disponible
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{room.name}</h3>
        <p className="text-gray-600 mb-5 leading-relaxed line-clamp-2">{room.description}</p>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Desde</p>
            <span className="text-2xl font-bold bg-gradient-to-r from-navy-800 to-gold-500 bg-clip-text text-transparent">{`$${startingPrice}`}</span>
            <span className="text-sm text-gray-500">/noche</span>
          </div>
          {/* Este enlace más adelante nos llevará a la página de detalle de esta habitación */}
          <Link
            to={`/habitaciones/${room.room_id}`}
            className={buttonStyles({ variant: 'primary' })}>
            Ver Detalles
            <i className="fas fa-arrow-right text-sm"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;