import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { auth } from '../firebase/config';
import { setAuthTokenProvider } from '../services/apiClient';
import { getCurrentOperator } from '../services/operatorsService';

// Crear el contexto sin valor por defecto
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    // Rol resuelto por el backend (`/api/auth/me`): 'admin' | 'operador' | 'demo'
    // o `null` cuando la cuenta no es operador/administrador.
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cada request de apiClient debe viajar con el ID token de Firebase
    // cuando hay una sesión activa (Authorization: Bearer <idToken>).
    useEffect(() => {
        setAuthTokenProvider(async () => {
            const user = auth.currentUser;
            if (!user) return null;
            return user.getIdToken();
        });
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (!user) {
                setRole(null);
                setLoading(false);
                return;
            }

            // Resolver la autorización vía `/api/auth/me` (endpoint disponible
            // para cualquier sesión Firebase). Un usuario sin fila en
            // `operators` recibe 403 y queda con rol `null` — sin bucle ni crash.
            try {
                const operator = await getCurrentOperator();
                setRole(operator?.role || null);
            } catch (err) {
                console.warn(
                    'No se pudo resolver el rol del usuario:',
                    err?.message
                );
                setRole(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Cerrar sesión de verdad: termina la sesión en Firebase y limpia el estado.
    const logout = useCallback(async () => {
        await signOut(auth);
        localStorage.removeItem('operator');
        setCurrentUser(null);
        setRole(null);
    }, []);

    const isDemo = role === 'demo';

    return (
        <AuthContext.Provider
            value={{ currentUser, role, isDemo, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
