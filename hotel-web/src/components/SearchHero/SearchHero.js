import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
// Brand skin loaded AFTER the library CSS so the .rdr* overrides win.
import '../../styles/date-range.css';
import { useNavigate } from 'react-router-dom';
import { HOTEL } from '../../config/hotel';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { buttonStyles } from '../../utils/buttonStyles';

function SearchHero() {
    const navigate = useNavigate();
    const searchRef = useRef(null);
    // One month on phones, two on wider screens.
    const isDesktop = useMediaQuery('(min-width: 768px)');
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

    // Close the floating panels on outside click or Escape.
    useEffect(() => {
        if (!showCalendar && !showGuestSelector) return undefined;

        const closePanels = () => {
            setShowCalendar(false);
            setShowGuestSelector(false);
        };

        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                closePanels();
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') closePanels();
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showCalendar, showGuestSelector]);

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
            className="relative min-h-[85vh] sm:min-h-[75vh] bg-cover bg-center flex flex-col items-center justify-center text-white px-4 py-12"
            style={{ backgroundImage: `url(${HOTEL.heroImage})` }}>

            {/* Navy gradient overlay keeps the headline readable on any photo.
                NOTE: the hero asset itself should be replaced with an on-brand
                photo — point HOTEL.heroImage at it in src/config/hotel.js. */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-900/55 to-navy-950/85"></div>
            <div className="relative z-10 text-center mb-8 sm:mb-12 animate-fadeIn">
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif font-bold tracking-tight mb-4 sm:mb-6 drop-shadow-2xl">
                  Encuentra tu Estadía Perfecta
                </h1>
                <p className="text-base sm:text-xl md:text-2xl drop-shadow-lg font-light tracking-wide">Reserva las mejores habitaciones al mejor precio.</p>
            </div>

            <div ref={searchRef} className="relative max-w-5xl w-full">

                {/* Search Bar */}
                <div className="bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch md:items-center md:space-x-2 text-gray-800 border border-white/20 hover:shadow-3xl transition-all duration-300">
                    <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 px-4 py-3 w-full md:flex-grow-[2] hover:bg-gray-50 transition-all duration-200 rounded-lg">
                        <i className="fas fa-hotel text-navy-600 mr-3 text-xl" aria-hidden="true"></i>
                        <input
                            type="text"
                            value={HOTEL.name}
                            readOnly
                            aria-label="Hotel"
                            className="font-bold bg-transparent outline-none w-full font-serif text-base sm:text-lg text-gray-800"
                        />
                    </div>
                    {/* calendario / oculta huesp. */}
                    <button
                        type="button"
                        aria-expanded={showCalendar}
                        aria-haspopup="dialog"
                        onClick={() => { setShowCalendar(prev => !prev); setShowGuestSelector(false); }}
                        className="cursor-pointer px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200 w-full md:flex-grow text-center md:text-left hover:bg-gray-50 transition-all duration-200 rounded-lg group">
                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center justify-center md:justify-start gap-2">
                          <i className="fas fa-calendar-alt text-navy-600" aria-hidden="true"></i>
                          Entrada - Salida
                        </span>
                        <span className="block font-bold text-sm mt-2 text-gray-800">
                            {`${format(dates[0].startDate, "dd MMM yy", { locale: es })} - ${dates[0].endDate ? format(dates[0].endDate, "dd MMM yy", { locale: es }) : 'Seleccionar'}`}
                        </span>
                    </button>

                    {/* muestra sector huespedes / oculta el calendario */}
                    <button
                        type="button"
                        aria-expanded={showGuestSelector}
                        aria-haspopup="dialog"
                        onClick={() => { setShowGuestSelector(prev => !prev); setShowCalendar(false); }}
                        className="cursor-pointer px-4 py-3 w-full md:flex-grow text-center md:text-left hover:bg-gray-50 transition-all duration-200 rounded-lg group">
                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center justify-center md:justify-start gap-2">
                          <i className="fas fa-users text-navy-600" aria-hidden="true"></i>
                          Huéspedes
                        </span>
                        <span className="block font-bold text-sm mt-2 text-gray-800">{guestText}</span>
                    </button>

                    <button onClick={handleSearch} className={buttonStyles({ variant: 'accent', size: 'lg', className: 'w-full md:w-auto mt-4 md:mt-0' })}>
                        <i className="fas fa-search text-lg" aria-hidden="true"></i> 
                        <span>Buscar</span>
                    </button>
                </div>

                {/* Calendario flotante: anclado a la derecha para no salirse del
                    viewport por la izquierda; el ancho nunca supera la pantalla. */}
                {showCalendar && (
                    <div className="absolute top-full mt-4 left-0 right-0 md:left-auto md:right-0 w-full md:w-auto max-w-[calc(100vw-2rem)] z-20 shadow-2xl rounded-2xl overflow-hidden bg-white border border-gray-100 animate-fadeIn">
                        <div className="overflow-x-auto">
                            <DateRange
                                editableDateInputs={false}
                                showDateDisplay={false}
                                onChange={item => setDates([item.selection])}
                                moveRangeOnFirstSelection={false}
                                ranges={dates}
                                rangeColors={["#C9A24B"]}
                                locale={es}
                                months={isDesktop ? 2 : 1}
                                direction="horizontal"
                                minDate={new Date()}
                            />
                        </div>
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