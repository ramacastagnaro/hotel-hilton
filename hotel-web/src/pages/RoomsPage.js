import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import RoomCard from '../components/RoomCard/RoomCard';
import { getRooms } from '../services/roomsService';
import { buttonStyles } from '../utils/buttonStyles';

function RoomsPage() {
  const location = useLocation();
  const searchData = location.state;
  console.log('Datos de búsqueda recibidos:', searchData);

  const [rooms, setRooms] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener habitaciones desde el backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await getRooms();
        console.log('✅ Habitaciones obtenidas del backend:', data);
        setRooms(data);
        setFilteredRooms(data);
      } catch (err) {
        console.error('❌ Error al cargar habitaciones:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const categories = ['all', ...new Set(rooms.map(room => room.category))];

  useEffect(() => {
    let currentRooms = [...rooms];

    if (searchData?.guests) {
      const totalGuests = searchData.guests.adults + searchData.guests.children;
      currentRooms = currentRooms.filter(room => room.capacity >= totalGuests);
    }

    if (categoryFilter !== 'all') {
      currentRooms = currentRooms.filter(room => room.category === categoryFilter);
    }

    if (searchTerm.trim() !== '') {
      currentRooms = currentRooms.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRooms(currentRooms);

  }, [categoryFilter, searchTerm, searchData, rooms]);

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="container mx-auto p-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando habitaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="container mx-auto p-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-red-50 p-8 rounded-lg">
            <i className="fas fa-exclamation-circle text-red-600 text-5xl mb-4"></i>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error al cargar habitaciones</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className={buttonStyles({ variant: 'primary', className: 'mt-4' })}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <Helmet>
        <title>Resultados de Búsqueda - Hotel Hilton</title>
      </Helmet>

      {/* --- INICIO CORRECCIÓN: Se añade sección de filtros --- */}
      <div className="mb-8 p-6 bg-gray-100 rounded-lg shadow sticky top-[75px] z-40">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Filtrar Resultados</h2>
          <div className="flex flex-col md:flex-row gap-4">
               {/* Input de búsqueda */}
              <div className="flex-grow">
                  <label htmlFor="search" className="sr-only">Buscar por nombre</label>
                  <input
                      type="text"
                      id="search"
                      placeholder="Buscar por nombre..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
              </div>
               {/* Botones de categoría */}
              <div className="flex flex-wrap gap-2 items-center">
                  <span className='text-sm font-medium text-gray-600 mr-2'>Categoría:</span>
                  {categories.map(category => (
                      <button key={category} onClick={() => handleCategoryChange(category)}
                          className={buttonStyles({
                              variant: categoryFilter === category ? 'primary' : 'secondary',
                              size: 'sm',
                              className: 'shadow-sm',
                          })}>
                          {category === 'all' ? 'Todas' : category}
                      </button>
                  ))}
              </div>
          </div>
      </div>
      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl font-bold text-gray-800">Resultados de Búsqueda</h1>
        <p className="text-gray-600 mt-2">
          {filteredRooms.length} {filteredRooms.length === 1 ? 'habitación encontrada' : 'habitaciones encontradas'} para tu selección.
        </p>
      </div>
      
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map(room => (
            <RoomCard key={room.room_id} room={room} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-700">No se encontraron resultados</h2>
          <p className="text-gray-500 mt-2">Intenta modificar tus filtros o búsqueda.</p>
        </div>
      )}
    </div>
  );
}

export default RoomsPage;