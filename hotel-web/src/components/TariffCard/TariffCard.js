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
        <div className="flex flex-col h-full border border-surface-200 bg-white rounded-card p-6 shadow-card hover:shadow-float transition-shadow duration-300">
            {/* Columna Izquierda: Nombre y Beneficios */}
            <div>
                <h3 className="text-xl font-bold text-navy-900">{tariff.name}</h3>
                <ul className="list-none text-sm text-navy-600 mt-3 space-y-2">
                    {/* Mapeamos la lista de beneficios para mostrarlos */}
                    {(tariff.benefits || []).map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <i className="fas fa-check-circle text-success mt-0.5" aria-hidden="true"></i>
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Columna Derecha: Precio y Botón (anclados abajo para igualar alturas) */}
            <div className="mt-auto pt-5 flex items-end justify-between gap-4">
                <div>
                    <p className="text-2xl font-extrabold text-navy-800">${tariff.price}</p>
                    <p className="text-sm text-navy-500">por noche</p>
                </div>
                <button
                    onClick={handleSelectTarrif}
                    className={buttonStyles({ variant: 'accent', size: 'lg' })}>
                    Elegir
                </button>
            </div>
        </div>
    );
}

export default TariffCard;