// src/pages/Dashboard/index.jsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    return (
        <div style={{ padding: '40px', color: 'white', background: '#121212', minHeight: '100vh' }}>
            <h1>🦸‍♂️ ComicVault</h1>
            <p>Bienvenido, {user?.displayName || user?.email}</p>
            <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px 20px', background: '#F5C518', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Cerrar Sesión
            </button>
        </div>
    );
}

export default Dashboard;