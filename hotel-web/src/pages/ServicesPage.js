import { Helmet } from 'react-helmet';
import Slider from 'react-slick';

//Datos de ejemplo para los servicios
const servicesData = [
    {
        id: 1,
        title: 'Piscina y Solárium',
        description: 'Relájate en nuestra piscina climatizada con vistas panorámicas y disfruta del sol en nuestro espacioso solárium.',
        images:['/img/imag-serv/pys.jpg', '/img/imag-serv/pys2.jpg']
    },
    {
        id: 2,
        title: 'Restaurante Gourmet',
        description: 'Una experiencia culinaria inolvidable con platos regionales e internacionales preparados por nuestros chefs expertos.',
        images: ['/img/imag-serv/rest.jpg', '/img/imag-serv/rest2.jpg', '/img/imag-serv/rest3.jpg']
    },
    {
        id: 3,
        title: 'Wi-Fi de Alta Velocidad',
        description: 'Mantente siempre conectado con nuestro servicio de internet de alta velocidad gratuito, disponible en todas las áreas del hotel.',
        images: ['/img/imag-serv/w1.jpg', '/img/imag-serv/w2.jpg']
    },
    {
        id: 4,
        title: 'Gimnasio Moderno',
        description: 'Nuestro gimnasio está equipado con la última tecnología para que no interrumpas tu rutina de ejercicios durante tu estadía.',
        images: ['/img/imag-serv/gym1.jpg', '/img/imag-serv/gym2.jpg']
    },
    {
        id: 5,
        title: 'Servicio a la Habitación 24/7',
        description: 'Disfruta de nuestra deliciosa comida y bebidas en la comodidad de tu habitación, a cualquier hora del día o de la noche.',
        images: ['/img/imag-serv/servicio1.jpg', '/img/imag-serv/servicio2.jpg']
    },
    {
        id: 6,
        title: 'Estacionamiento Privado',
        description: 'Ofrecemos estacionamiento seguro y privado para todos nuestros huéspedes, para tu total tranquilidad.',
        images: ['/img/imag-serv/parking.jpg', '/img/imag-serv/parking2.jpg']
    }
];

function ServicesPage() {
    //config carrusel
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="container mx-auto p-4 py-12">
            <Helmet>
                <title>Nuestros Servicios - Hotel Hilton</title>
            </Helmet>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">Servicios Exclusivos</h1>
                <p className="text-gray-600 mt-2">Todo lo que necesitas para una experiencia perfecta.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicesData.map(service => (
                    <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                        
                        <Slider {...sliderSettings}>
                            {service.images.map((image, index) => (
                                <div key={index}>
                                    <img src={image} alt={`${service.title} ${index + 1}`} className="w-full h-56 object-cover" />
                                </div>
                            ))}
                        </Slider>

                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{service.title}</h3>
                            <p className="text-gray-600">{service.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ServicesPage;