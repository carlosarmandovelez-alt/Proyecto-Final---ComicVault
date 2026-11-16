import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../componentes/shared/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ComicDetail from '../pages/ComicDetail';
import Profile from '../pages/Profile'; 
import UserRoutes from './UserRoutes';

function AppRoutes() {
    return (
        <Routes>
            {/* Rutas Públicas sin Layout (Login y Register no tienen Sidebar) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas con Layout (Sidebar) */}
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/comic/:id" element={<ComicDetail />} />

                {/* Rutas Privadas (Requieren Login) */}
                <Route element={<UserRoutes />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Route>

            {/* Redirección */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;