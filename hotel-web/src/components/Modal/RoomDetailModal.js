import Slider from 'react-slick';

function RoomDetailModal({ room, onClose }) {
    //config carrusel
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1, // Corregido: 'slidesToShow'
        slidesToScroll: 1, // Corregido: 'slidesToScroll'
        autoplay: true,
        autoplaySpeed: 4000,
    };

    return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full md:w-4/5 lg:w-3/5 max-h-[90vh] overflow-y-auto relative">
        
            <button
                onClick={onClose}
                className="sticky top-0 right-0 float-right m-4 text-gray-500 hover:text-gray-800 text-3xl z-20 bg-white rounded-full px-2">
                &times;
            </button>

            {room.images && room.images.length > 0 && (
                <div className="mb-6">
                    <Slider {...sliderSettings}>
                        {room.images.map((image, index) => (
                            <div key={index}>
                                <img
                                    src={image}
                                    alt={`${room.name} ${index + 1}`}
                                    className="w-full h-72 object-cover"
                                />
                            </div>
                            ))}
                    </Slider>
                </div>
            )}

            <div className="p-8 pt-0">
                <h2 className="text-3xl font-bold mb-2">{room.name}</h2>
                <p className="text-gray-600 text-base mb-6">{room.description}</p>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 border-b pb-2">Capacidad</h3>
                    <p className="text-gray-700"><i className="fas fa-users mr-2 text-blue-600"></i> Hasta {room.capacity} adultos</p>
                </div>

                {room.services && room.services.length > 0 && (
                    <div>
                        <h3 className="text-xl font-semibold mb-3 border-b pb-2">Servicios</h3>
                        <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 text-gray-700 text-sm">
                            {room.services.map(service => (
                                <li key={service.name}>
                                    <i className={`${service.icon} w-6 text-center mr-2 text-blue-600`}></i>
                                    {service.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    </div>
    );
}

export default RoomDetailModal;