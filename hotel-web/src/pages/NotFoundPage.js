import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { buttonStyles } from '../utils/buttonStyles';

function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <Helmet>
        <title>Página no encontrada - Hotel Hilton</title>
        <meta name="description" content="La página que buscás no existe o cambió de dirección." />
      </Helmet>

      <div className="max-w-xl mx-auto text-center bg-white rounded-card shadow-card p-8 sm:p-12">
        <p className="text-6xl sm:text-7xl font-serif font-bold tracking-tight text-gold-500 mb-2">
          404
        </p>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-navy-900 mb-3">
          Página no encontrada
        </h1>
        <p className="text-navy-600 mb-8">
          La página que buscás no existe o cambió de dirección. Volvé al inicio para seguir
          explorando el hotel.
        </p>
        <Link to="/" className={buttonStyles({ variant: 'primary' })}>
          <i className="fas fa-home" aria-hidden="true"></i>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
