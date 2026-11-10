// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ComicDetail from '../pages/ComicDetail';
import UserRoutes from './UserRoutes';

function AppRoutes() {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas privadas */}
            <Route path="/" element={<UserRoutes />}>
                <Route index element={<Dashboard />} />
                <Route path="comic/:id" element={<ComicDetail />} />
            </Route>

            {/* Redirección */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default AppRoutes;