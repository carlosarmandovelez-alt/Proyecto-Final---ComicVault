import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function UserRoutes() {
    const { isLogged, isLoading } = useContext(AuthContext);

    // mientras carga la autenticación, no redirigir
    if (isLoading) {
        return <div style={{ padding: '40px', color: 'white' }}>Cargando...</div>;
    }

    // si no está logueado, redirigir al login
    if (!isLogged) {
        return <Navigate to="/login" replace />;
    }

    // si está logueado, renderizar el Dashboard
    return <Outlet />;
}

export default UserRoutes;