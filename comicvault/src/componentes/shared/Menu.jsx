// src/componentes/shared/Menu.jsx
import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Menu.module.scss';

function Menu() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    return (
        <nav className={styles.menu}>
            <div className={styles.brand}>
                <Link to="/">🦸‍♂️ ComicVault</Link>
            </div>

            <div className={styles.user}>
                <span>👤 {user?.displayName || user?.email}</span>
                <button className={styles.btnLogout} onClick={handleLogout}>
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
}

export default Menu;