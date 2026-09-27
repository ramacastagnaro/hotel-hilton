
// Datos de ejemplo para los testimonios
const testimonialsData = [
    {
        id: 1,
        name: 'Ana García',
        location: 'Buenos Aires, Argentina',
        // Puedes usar una imagen genérica de avatar si quieres, o dejarlo sin imagen
        // avatarUrl: '/img/avatars/ana.jpg',
        quote: '¡Una experiencia inolvidable! La atención al detalle y la amabilidad del personal hicieron nuestra estadía perfecta. Las vistas desde la habitación eran impresionantes.'
    },
    {
        id: 2,
        name: 'Carlos Fernández',
        location: 'Santiago, Chile',
        quote: 'El hotel superó nuestras expectativas. Las instalaciones son modernas, la comida deliciosa y la ubicación es inmejorable. Definitivamente volveremos.'
    },
    {
        id: 3,
        name: 'Sofia Rossi',
        location: 'São Paulo, Brasil',
        quote: 'Perfecto para un viaje de negocios. El Wi-Fi era excelente, la habitación cómoda y el servicio a la habitación rápido y eficiente. Muy recomendable.'
    }
];

function Testimonials() {
    return (
        <section className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 sm:mb-16 animate-fadeIn">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-gray-800 mb-4">
                        Lo que dicen nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-800 to-gold-500">Huéspedes</span>
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">Experiencias reales de quienes confiaron en nosotros</p>
                    <div className="w-24 h-1 bg-gradient-to-r from-navy-800 to-gold-500 mx-auto mt-4 rounded-full"></div>
                </div>
                
                {/* Usamos grid para las columnas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {testimonialsData.map((testimonial, index) => (
                        <div key={testimonial.id} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl flex flex-col transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 group" style={{animationDelay: `${index * 0.1}s`}}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-navy-700 to-navy-900 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-xl">{testimonial.name[0]}</span>
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className="fas fa-star text-gold-500 text-sm" aria-hidden="true"></i>
                                    ))}
                                </div>
                            </div>
                            <i className="fas fa-quote-left text-navy-500 text-3xl mb-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300" aria-hidden="true"></i>
                            <p className="text-gray-700 italic mb-6 flex-grow leading-relaxed">"{testimonial.quote}"</p>
                            
                            {/* Nombre y ubicación */}
                            <div className="mt-auto border-t border-gray-100 pt-4">
                                <p className="font-bold text-gray-800 text-lg">{testimonial.name}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                    <i className="fas fa-map-marker-alt text-gold-600" aria-hidden="true"></i>
                                    {testimonial.location}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;