// Hotel business data. Kept out of the components so it is defined once and
// consumed by Footer, SearchHero and Map.

export const HOTEL = {
  name: 'Hotel Hilton',
  tagline: 'Luxury & Comfort',
  description:
    'Tu destino de lujo y confort. Ofrecemos experiencias inolvidables con servicios de primera clase.',
  address: 'Av. Arenales 742, Salta, Argentina',
  phone: '+54 387 431-0000',
  email: 'HiltonHoteles@gmail.com',
  // Hero background photo. Swap this for an on-brand asset when one is available.
  heroImage: '/img/hero-background.jpg',
  // Shown when a room/gallery image is missing or fails to load.
  fallbackImage: '/img/logo-hilton.png',
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  map: {
    center: [-24.782, -65.423],
    zoom: 13,
    smallZoom: 10,
    popup: 'Hotel Hilton. ¡Tu próxima estadía!',
  },
};

// Payment methods offered during booking. Shared by the booking page and the
// operator payment flow so labels stay consistent.
export const PAYMENT_METHODS = [
  { id: 'mercadopago', label: 'Mercado Pago', description: 'Paga de forma segura con Mercado Pago' },
  { id: 'paypal', label: 'PayPal', description: 'Paga con tu cuenta de PayPal' },
  { id: 'card', label: 'Tarjeta de Crédito/Débito', description: 'Visa, Mastercard, American Express' },
];

export default HOTEL;
