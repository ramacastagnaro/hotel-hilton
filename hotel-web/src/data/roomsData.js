/*Data para pages de detalles de habitaciones */
export const roomsData = [
  // --- Categoria Estandar ---
  {
    id: 'clasica-king',
    name: 'Habitación Clásica King',
    category: 'Estándar',
    description: 'Nuestra habitación Clásica ofrece un espacio elegante y funcional con una cama King Size para un descanso perfecto.',
    images: [
      '/img/hab/king/k1.jpg',
      '/img/hab/king/k2.jpg',
      '/img/hab/king/k3.jpg',
      '/img/hab/king/k4.jpg'
    ],
    capacity: 2,
    services: [
      { name: '30m²', icon: 'fas fa-ruler-combined' },
      { name: 'WiFi', icon: 'fas fa-wifi' },
      { name: 'Smart TV', icon: 'fas fa-tv' },
      { name: 'Climatización', icon: 'fas fa-snowflake' },
      { name: 'Caja de seguridad', icon: 'fas fa-box-open' },
      { name: 'Baño privado', icon: 'fas fa-bath' },
    ],
    tariffs: [
      { id: 't1_ck', name: 'Tarifa Flexible', price: 150, benefits: ['Cancelación gratuita', 'Paga en el hotel'] },
      { id: 't2_ck', name: 'Tarifa con Desayuno', price: 175, benefits: ['Desayuno Buffet incluido', 'Cancelación gratuita'] }
    ]
  },

  {
    id: 'clasica-doble',
    name: 'Habitación Clásica Doble',
    category: 'Estándar',
    description: 'Ideal para amigos o familia, equipada con dos camas dobles y todas las comodidades esenciales.',
    images: [
      '/img/hab/king/k2.jpg',
      '/img/hab/king/k3.jpg',
      '/img/hab/king/k1.jpg',
      '/img/hab/king/k4.jpg'
    ],
    capacity: 4,
    services: [
      { name: '35m²', icon: 'fas fa-ruler-combined' },
      { name: 'WiFi', icon: 'fas fa-wifi' },
      { name: 'Smart TV', icon: 'fas fa-tv' },
      { name: 'Climatización', icon: 'fas fa-snowflake' },
      { name: 'Caja de seguridad', icon: 'fas fa-box-open' },
      { name: 'Baño privado', icon: 'fas fa-bath' },
    ],
    tariffs: [
      { id: 't1_cd', name: 'Tarifa Flexible', price: 160, benefits: ['Cancelación gratuita', 'Paga en el hotel'] }
    ]
  },

  // --- Categoría Superior ---
  {
    id: 'superior-king-vistas',
    name: 'Superior King con Vistas',
    category: 'Superior',
    description: 'Disfruta de vistas panorámicas de la ciudad desde esta habitación superior, con una cama King Size y un espacio de trabajo.',
    images: [
      '/img/hab/sup/s1.jpg',
      '/img/hab/sup/s2.jpg',
      '/img/hab/sup/s3.jpg',
      '/img/hab/sup/sup1.png'
    ],
    capacity: 2,
    services: [
      { name: '38m²', icon: 'fas fa-ruler-combined' },
      { name: 'Vistas a la ciudad', icon: 'fas fa-city' },
      { name: 'WiFi', icon: 'fas fa-wifi' },
      { name: 'Escritorio de trabajo', icon: 'fas fa-briefcase' },
      { name: 'Cafetera', icon: 'fas fa-coffee' },
      { name: 'Minibar (con cargo)', icon: 'fas fa-glass-martini-alt' },
    ],
    tariffs: [
      { id: 't1_skv', name: 'Tarifa Flexible', price: 210, benefits: ['Cancelación gratuita', 'Desayuno incluido'] },
      { id: 't2_skv', name: 'Tarifa No Reembolsable', price: 190, benefits: ['Desayuno incluido', 'Pago por adelantado'] }
    ]
  },
  
  // --- Categoría Junior Suite ---
  {
    id: 'junior-suite-king',
    name: 'Junior Suite King',
    category: 'Junior Suite',
    description: 'Un espacio generoso con una sala de estar integrada y una cama King Size. Lujo y confort en cada detalle.',
    images: [
      '/img/hab/jun-suit/sj1.png',
      '/img/hab/jun-suit/sj2.png',
      '/img/hab/jun-suit/sj3.png',
      '/img/hab/jun-suit/sj4.png',
      '/img/hab/jun-suit/sjBanos.png',
      '/img/hab/jun-suit/sjBanos2.png'
    ],
    capacity: 3,
    services: [
      { name: '55m²', icon: 'fas fa-ruler-combined' },
      { name: 'Sala de estar', icon: 'fas fa-couch' },
      { name: 'WiFi Premium', icon: 'fas fa-wifi' },
      { name: 'Bañera de hidromasaje', icon: 'fas fa-hot-tub' },
      { name: 'Room service 24 hs.', icon: 'fas fa-concierge-bell' },
      { name: 'Cafetera Nespresso', icon: 'fas fa-coffee' },
    ],
    tariffs: [
      { id: 't1_jsk', name: 'Estadía de Lujo', price: 290, benefits: ['Desayuno Buffet', 'Acceso al Spa', 'Cancelación gratuita'] },
      { id: 't2_jsk', name: 'Estadía Romántica', price: 320, benefits: ['Desayuno en la habitación', 'Botella de champagne', 'Late check-out'] }
    ]
  },

  // --- Categoría Suite Presidencial ---
  {
    id: 'suite-presidencial',
    name: 'Suite Presidencial',
    category: 'Suite Presidencial',
    description: 'El máximo lujo y exclusividad. Más de 100m² con sala de estar, comedor y las mejores vistas de la ciudad.',
    images: [
      '/img/hab/presi/p1.png',
      '/img/hab/presi/p2.png',
      '/img/hab/presi/p3.png',
      '/img/hab/presi/p4.png'
    ],
    capacity: 4,
    services: [
      { name: '120m²', icon: 'fas fa-ruler-combined' },
      { name: 'Comedor privado', icon: 'fas fa-utensils' },
      { name: 'Jacuzzi doble', icon: 'fas fa-hot-tub' },
      { name: 'Servicios VIP', icon: 'fas fa-star' },
      { name: 'Chofer privado', icon: 'fas fa-car' },
      { name: 'Check-in en la suite', icon: 'fas fa-door-open' },
    ],
    tariffs: [
      { id: 't1_sp', name: 'Experiencia Presidencial', price: 850, benefits: ['Todos los servicios incluidos', 'Chofer privado', 'Check-in privado'] }
    ]
  },
];