import { Helmet } from 'react-helmet';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Page Components
import AboutPage from './pages/AboutPage';
import AccountPage from './pages/AccountPage';
import BookingPage from './pages/BookingPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoomDetailPage from './pages/RoomDetailPage';
import RoomsPage from './pages/RoomsPage';
import ServicesPage from './pages/ServicesPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import UserProfilePage from './pages/UserProfilePage';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminRooms from './pages/Admin/AdminRooms';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminReservations from './pages/Admin/AdminReservations';
import AdminStats from './pages/Admin/AdminStats';
import AdminLogs from './pages/Admin/AdminLogs';

// Operator Pages
import OperatorDashboard from './pages/Operator/OperatorDashboard';
import OperatorRooms from './pages/Operator/OperatorRooms';
import OperatorReservations from './pages/Operator/OperatorReservations';
import OperatorPayments from './pages/Operator/OperatorPayments';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas del Panel de Administración (sin Header/Footer, protegidas) */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/habitaciones" element={<ProtectedRoute><AdminRooms /></ProtectedRoute>} />
        <Route path="/admin/usuarios" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/reservas" element={<ProtectedRoute><AdminReservations /></ProtectedRoute>} />
        <Route path="/admin/estadisticas" element={<ProtectedRoute><AdminStats /></ProtectedRoute>} />
        <Route path="/admin/logs" element={<ProtectedRoute><AdminLogs /></ProtectedRoute>} />

        {/* Rutas del Panel de Operador (sin Header/Footer, protegidas) */}
        <Route path="/operador" element={<ProtectedRoute><OperatorDashboard /></ProtectedRoute>} />
        <Route path="/operador/habitaciones" element={<ProtectedRoute><OperatorRooms /></ProtectedRoute>} />
        <Route path="/operador/reservas" element={<ProtectedRoute><OperatorReservations /></ProtectedRoute>} />
        <Route path="/operador/pagos" element={<ProtectedRoute><OperatorPayments /></ProtectedRoute>} />
        
        {/* Rutas públicas (con Header/Footer) */}
        <Route path="/*" element={
          <div className="flex flex-col min-h-screen bg-gray-100">
            <Helmet>
              <title>Hotel Hilton - Tu escapada de lujo</title>
              <meta name="description" content="Disfruta de una experiencia única en Hotel Hilton" />
            </Helmet>
            
            <Header />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/habitaciones" element={<RoomsPage />} />
                <Route path="/habitaciones/:id" element={<RoomDetailPage />}/>
                <Route path="/reservar" element={<BookingPage />} />
                <Route path="/pago-exitoso" element={<PaymentSuccessPage />} />
                <Route path="/contacto" element={<ContactPage />} />
                <Route path="/servicios" element={<ServicesPage />} />
                <Route path="/sobre-nosotros" element={<AboutPage />}/>
                <Route path="/registrar" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/mi-cuenta" element={<AccountPage />} />
                <Route path="/perfil" element={<UserProfilePage />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;