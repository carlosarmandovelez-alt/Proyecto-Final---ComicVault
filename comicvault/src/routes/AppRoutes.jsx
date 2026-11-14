// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Explore from '../pages/Explore'; // ✅ Nueva página
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ComicDetail from '../pages/ComicDetail';
import UserRoutes from './UserRoutes';

function AppRoutes() {
    return (
        <Routes>
            {/* Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/comic/:id" element={<ComicDetail />} />

            {/* Privadas */}
            <Route path="/dashboard" element={<UserRoutes />}>
                <Route index element={<Dashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;