import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Client-side route guard for the admin and operator panels.
// Unauthenticated visitors are redirected to the login page, remembering where
// they came from so the login flow can send them back.
//
// When `allow` is provided it also enforces AUTHORIZATION: the resolved role
// must be in the allow-list, otherwise the visitor is sent home. The public
// site is not wrapped by this guard, so it is never blocked.
function ProtectedRoute({ children, allow }) {
    const { currentUser, role, loading } = useAuth();
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

    if (allow && allow.length > 0 && !allow.includes(role)) {
        // Authenticated but unauthorized (e.g. a Firebase user with no
        // operators row, or a role outside the allow-list): a defined outcome,
        // never a redirect loop back into the guarded route.
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
