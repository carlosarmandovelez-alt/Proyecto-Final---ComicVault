// src/componentes/shared/Menu.jsx
import { useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Menu.module.scss';

function Menu() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // Para saber en qué página estamos

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={styles.menu}>
            <div className={styles.brand}>
                <Link to="/">🦸‍♂️ ComicVault</Link>
            </div>

            <div className={styles.navLinks}>
                <Link to="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>
                    🏠 Catálogo
                </Link>
                <Link to="/explore" className={`${styles.link} ${isActive('/explore') ? styles.active : ''}`}>
                    🗂️ Explorar
                </Link>
                {user && (
                    <Link to="/dashboard" className={`${styles.link} ${isActive('/dashboard') ? styles.active : ''}`}>
                        👤 Mi Perfil
                    </Link>
                )}
            </div>

            <div className={styles.user}>
                {user ? (
                    <>
                        <span className={styles.userName}>👤 {user?.displayName || user?.email}</span>
                        <button className={styles.btnLogout} onClick={handleLogout}>Salir</button>
                    </>
                ) : (
                    <Link to="/login" className={styles.btnLogin}>Iniciar Sesión</Link>
                )}
            </div>
        </nav>
    );
}

export default Menu;