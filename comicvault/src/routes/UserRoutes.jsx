// src/routes/UserRoutes.jsx
import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function UserRoutes() {
    const { isLogged, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <div className="loading">Cargando...</div>;
    }

    if (!isLogged) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default UserRoutes;