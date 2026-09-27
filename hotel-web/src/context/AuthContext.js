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

// Crear el contexto sin valor por defecto
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Cerrar sesión de verdad: termina la sesión en Firebase y limpia el estado.
    const logout = useCallback(async () => {
        await signOut(auth);
        localStorage.removeItem('operator');
        setCurrentUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, loading, logout }}>
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
