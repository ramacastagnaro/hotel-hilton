import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useNavigate } from 'react-router-dom';
import { HOTEL } from '../../config/hotel';
import { buttonStyles } from '../../utils/buttonStyles';

function SearchHero() {
    const navigate = useNavigate();
    const [showCalendar, setShowCalendar] = useState(false);
    const [showGuestSelector, setShowGuestSelector] = useState(false);
    const [dates, setDates] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ]);
    const [guests, setGuests] = useState({
        adults: 2,
        rooms: 1,
    });

    const handleGuestChange = (type, operation) => {
        setGuests(prev => {
            const newValue = operation === 'increase' ? prev[type] + 1 : prev[type] - 1;
            // Asegura mínimos (1 adulto, 1 habitación)
            if (type === 'adults' && newValue < 1) return prev;
            if (type === 'rooms' && newValue < 1) return prev;
            return { ...prev, [type]: newValue };
        });
    };

    const handleSearch = () => {
        let finalDates = dates;
        // Si no se seleccionó fecha de salida, asigna 1 noche por defecto
        if (!dates[0].endDate) {
            const nextDay = new Date(dates[0].startDate);
            nextDay.setDate(dates[0].startDate.getDate() + 1);
            finalDates = [{ ...dates[0], endDate: nextDay }];
            // Actualiza el estado también para consistencia visual si el usuario reabre el calendario
            setDates(finalDates);
        }
        navigate('/habitaciones', { state: { dates: finalDates, guests } });
        setShowCalendar(false); // Cerramos menús al buscar
        setShowGuestSelector(false);
    };

    const guestText = `${guests.adults} Adultos, ${guests.rooms} Hab.`;

    return (
        <div
            className="relative h-[75vh] bg-cover bg-center flex flex-col items-center justify-center text-white px-4"
            style={{ backgroundImage: `url('/img/hero-background.jpg')` }}>

            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10 text-center mb-12 animate-fadeIn">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl">
                  Encuentra tu Estadía Perfecta
                </h1>
                <p className="text-xl md:text-2xl drop-shadow-lg font-light tracking-wide">Reserva las mejores habitaciones al mejor precio.</p>
            </div>

            <div className="relative max-w-5xl w-full">

                {/* Search Bar */}
                <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch md:items-center md:space-x-2 text-gray-800 border border-white/20 hover:shadow-3xl transition-all duration-300">
                    <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 px-4 py-4 md:py-3 w-full md:flex-grow-[2] hover:bg-gray-50 transition-all duration-200 rounded-lg">
                        <i className="fas fa-hotel text-blue-600 mr-3 text-xl"></i>
                        {/* --- MODIFICACIÓN AQUÍ --- */}
                        <input
                            type="text"
                            value={HOTEL.name}
                            readOnly
                            className="font-bold bg-transparent outline-none w-full font-serif text-lg text-gray-800" // <-- Añadido font-serif y text-lg
                        />
                    </div>
                    {/* calendario / oculta huesp. */}
                    <div className="cursor-pointer px-4 py-4 md:py-3 border-b md:border-b-0 md:border-r border-gray-200 w-full md:flex-grow text-center md:text-left hover:bg-gray-50 transition-all duration-200 rounded-lg group" onClick={() => { setShowCalendar(!showCalendar); setShowGuestSelector(false); }}>
                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center justify-center md:justify-start gap-2">
                          <i className="fas fa-calendar-alt text-blue-600"></i>
                          Entrada - Salida
                        </span>
                        <p className="font-bold text-sm mt-2 text-gray-800">
                            {`${format(dates[0].startDate, "dd MMM yy", { locale: es })} - ${dates[0].endDate ? format(dates[0].endDate, "dd MMM yy", { locale: es }) : 'Seleccionar'}`}
                        </p>
                    </div>

                    {/* muestra sector huespedes / oculta el calendario */}
                    <div className='cursor-pointer px-4 py-4 md:py-3 w-full md:flex-grow text-center md:text-left hover:bg-gray-50 transition-all duration-200 rounded-lg group' onClick={() => { setShowGuestSelector(!showGuestSelector); setShowCalendar(false); }}>
                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center justify-center md:justify-start gap-2">
                          <i className="fas fa-users text-blue-600"></i>
                          Huéspedes
                        </span>
                        <p className="font-bold text-sm mt-2 text-gray-800">{guestText}</p>
                    </div>

                    <button onClick={handleSearch} className={buttonStyles({ variant: 'accent', size: 'lg', className: 'w-full md:w-auto mt-4 md:mt-0' })}>
                        <i className="fas fa-search text-lg"></i> 
                        <span>Buscar</span>
                    </button>
                </div>

                {/* Calendario flotante */}
                {showCalendar && (
                    <div className="absolute top-full mt-4 w-auto left-1/2 md:left-auto md:right-1/2 transform -translate-x-1/2 md:translate-x-0 z-20 shadow-2xl rounded-2xl overflow-hidden bg-white border border-gray-100 animate-fadeIn">
                        <DateRange
                            editableDateInputs={true}
                            onChange={item => setDates([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={dates}
                            rangeColors={["#3b82f6"]}
                            locale={es}
                            months={2}
                            direction="horizontal"
                            minDate={new Date()}
                        />
                    </div>
                )}

                {/* Nuevo menu flotante */}
                {showGuestSelector && (
                    <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-xs bg-white rounded-2xl shadow-2xl p-6 z-20 text-gray-800 border border-gray-100 animate-fadeIn">
                        <div className="flex justify-between items-center mb-5">
                            <span className="font-bold text-gray-700">Adultos</span>
                            <div className="flex items-center gap-4">
                                <button disabled={guests.adults <= 1} onClick={() => handleGuestChange('adults', 'decrease')} aria-label="Quitar un adulto" className={buttonStyles({ variant: 'secondary', size: 'sm', className: 'w-10 h-10 !p-0 !rounded-full' })}>-</button>
                                <span className="font-bold text-lg min-w-[30px] text-center">{guests.adults}</span>
                                <button onClick={() => handleGuestChange('adults', 'increase')} aria-label="Agregar un adulto" className={buttonStyles({ variant: 'secondary', size: 'sm', className: 'w-10 h-10 !p-0 !rounded-full' })}>+</button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-700">Habitaciones</span>
                            <div className="flex items-center gap-4">
                                <button disabled={guests.rooms <= 1} onClick={() => handleGuestChange('rooms', 'decrease')} aria-label="Quitar una habitación" className={buttonStyles({ variant: 'secondary', size: 'sm', className: 'w-10 h-10 !p-0 !rounded-full' })}>-</button>
                                <span className="font-bold text-lg min-w-[30px] text-center">{guests.rooms}</span>
                                <button onClick={() => handleGuestChange('rooms', 'increase')} aria-label="Agregar una habitación" className={buttonStyles({ variant: 'secondary', size: 'sm', className: 'w-10 h-10 !p-0 !rounded-full' })}>+</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchHero;