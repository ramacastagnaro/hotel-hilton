import { useAuth } from '../context/AuthContext';

// Whether the current session is allowed to perform mutations.
//
// The read-only `demo` role must never mutate data; every other role
// ('admin', 'operador') can. Pages use this flag to hide or disable their
// create/edit/delete affordances so the UI matches the backend's 403 gate.
export function useCanMutate() {
    const { role } = useAuth();
    return role !== 'demo';
}

export default useCanMutate;
