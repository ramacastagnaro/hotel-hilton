import emailjs from '@emailjs/browser';
import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import Map from '../components/Map/Map';

function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [isSending, setIsSending] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // --- 3. useRef para el formulario (requerido por EmailJS) ---
    // useRef nos da una referencia directa al elemento <form> en el DOM.
    const form = useRef();

    // Estado para el mapa (eliminado statusMessage duplicado)
    const [showFullMap, setShowFullMap] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSending(true);
        setStatusMessage('');
        setIsError(false);

        // emailjs.sendForm
        emailjs.sendForm(
            'service_dbuswek',
            'template_uukyim2',
            form.current,
            '2pNvQ3qqGkHqzK-P3'
        )
        .then((result) => {
            console.log('Email enviado OK:', result.text);
            setStatusMessage('¡Gracias por tu mensaje! Te responderemos pronto.');
            setIsError(false);
            setFormData({ name: '', email: '', message: '' }); // Limpia el formulario
        }, (error) => {
            console.error('Error al enviar Email:', error.text);
            setStatusMessage('Ocurrió un error al enviar tu mensaje. Inténtalo de nuevo.');
            setIsError(true);
        })
        .finally(() => {
            setIsSending(false);
        });
    };

    return (
        <div className="container mx-auto p-4 py-12">
        <Helmet>
            <title>Contacto - Hotel Hilton</title>
        </Helmet>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-12">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Contáctanos</h1>
            <p className="text-center text-gray-600 mb-8">
            ¿Tienes alguna duda? Escríbenos y te responderemos a la brevedad.
            </p>

            {statusMessage && (
                <p className={`p-3 rounded-md mb-4 text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {statusMessage}
                </p>
            )}

            <form ref={form} onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nombre</label>
                <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleChange}
                required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Correo Electrónico</label>
                <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
                required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Mensaje</label>
                <textarea
                id="message"
                name="message"
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.message}
                onChange={handleChange}
                required
                ></textarea>
            </div>
            <div className="text-center">
                <button
                type="submit"
                className={`bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300 ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSending}
                >
                {isSending ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
            </div>
            </form>

        </div>

        {/* --- UBICACIÓN --- */}
            <div className="max-w-4xl mx-auto mt-12">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Nuestra Ubicación</h2>

                {/* Mini-mapa con botón */}
                {!showFullMap && (
                    <div className="relative h-64 rounded-lg shadow-lg overflow-hidden mb-6">
                        <Map smallMap={true} /> {/* Le pasamos una prop para que el mapa sepa si es pequeño */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                            <button
                                onClick={() => setShowFullMap(true)}
                                className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2">
                                📍 Ver ubicación en el mapa
                            </button>
                        </div>
                    </div>
                )}
                {/* Mapa completo (se muestra al hacer clic en el botón) */}
                {showFullMap && (
                    <div className="h-[60vh] rounded-lg shadow-lg overflow-hidden">
                        <Map />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ContactPage;