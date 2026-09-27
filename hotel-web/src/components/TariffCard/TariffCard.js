import { useNavigate } from 'react-router-dom';
import { buttonStyles } from '../../utils/buttonStyles';

// Este componente recibe la información de una tarifa a través de 'props'
function TariffCard({ room, tariff, checkInDate, checkOutDate, nights, totalPrice }) {
    const navigate = useNavigate();

    const handleSelectTarrif = () =>{
        // Calcular el precio total basado en la tarifa seleccionada
        const calculatedTotal = tariff.price * nights;
        
        navigate('/reservar', {
            state: {
                room,
                tariff,
                dates: [{
                    startDate: checkInDate,
                    endDate: checkOutDate
                }],
                nights,
                totalPrice: calculatedTotal
            }
        });
    };

    return (
        <div className="border rounded-lg p-6 md:flex md:justify-between md:items-center mb-4 shadow-sm hover:shadow-lg transition-shadow duration-300">
        {/* Columna Izquierda: Nombre y Beneficios */}
            <div className="md:w-2/3">
                <h3 className="text-xl font-bold text-gray-800">{tariff.name}</h3>
                <ul className="list-none text-sm text-gray-600 mt-2 space-y-1">
                {/* Mapeamos la lista de beneficios para mostrarlos */}
                {tariff.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                        <i className="fas fa-check-circle text-green-500 mr-2"></i>
                        {benefit}
                    </li>
                ))}
            </ul>
        </div>

        {/* Columna Derecha: Precio y Botón */}
        <div className="text-left md:text-right mt-4 md:mt-0">
                <p className="text-2xl font-extrabold text-blue-600">${tariff.price}</p>
                <p className="text-sm text-gray-500">por noche</p>
                <button
                    onClick={handleSelectTarrif}
                    className={buttonStyles({ variant: 'primary', size: 'lg', className: 'mt-3' })}>
                    Elegir
                </button>
            </div>
        </div>
    );
}

export default TariffCard;