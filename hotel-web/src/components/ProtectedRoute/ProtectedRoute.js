import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Client-side route guard for the admin and operator panels (spec AUTH-3).
// Unauthenticated visitors are redirected to the login page, remembering where
// they came from so the login flow can send them back.
function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <i className="fas fa-spinner fa-spin text-4xl text-white"></i>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;
