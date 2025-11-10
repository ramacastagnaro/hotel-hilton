import { Helmet } from 'react-helmet';

function AboutPage() {
    return (
        <div className="bg-white py-16">
            <div className="container mx-auto px-4">
                <Helmet>
                    <title>Sobre Nosotros - Hotel Hilton</title>
                </Helmet>

                <div className="text-center mb-12">
                    <h1 className='text-4xl font-bold text-gray-800'>Nuestra Historia</h1>
                    <p className="text-gray-600 mt-2">Pasion y dedicacion en cada detalle.</p>
                </div>

                <div className="md:flex md:items-center md:gap-12">

                    <div className="md:w-1/2 text-gl text-gray-700 leading-relaxed">
                        <p className="mb-6">
                            Fundado en 2010, el Hotel Hilton nació del sueño de crear un oasis de tranquilidad y lujo.
                            Lo que comenzó como un pequeño hotel familiar ha crecido hasta convertirse en un referente de hospitalidad, sin perder nunca el trato cercano y personal que nos caracteriza.
                        </p>
                        <p>
                            Nuestra misión es ofrecer a cada huésped una experiencia inolvidable, combinando comodidad, elegancia y un servicio excepcional.
                        </p>
                    </div>

                    <div className="md:w-1/2 mt-8 md:mt-0">
                        <img
                            src="/img/about-ar.jpg" //carpeta public>img
                            alt="Imagen del Hotel"
                            className="rounded-lg shadow-xl w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;