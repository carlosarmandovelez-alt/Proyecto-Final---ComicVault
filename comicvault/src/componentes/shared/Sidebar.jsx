import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ComicContext } from '../../context/ComicContext';
import TreeView from '../index/TreeView';
import styles from './Sidebar.module.scss';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true); 
    const { user, logout } = useContext(AuthContext);
    const { arbol } = useContext(ComicContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const isActive = (path) => location.pathname === path;

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
            {/* Botón de hamburguesa */}
            <button className={styles.toggleBtn} onClick={() => setIsOpen(!isOpen)}>
                ☰
            </button>

            <div className={styles.content}>
                {/* Logo */}
                <div className={styles.brand}>
                    <Link to="/">🦸‍♂️ ComicVault</Link>
                </div>

                {/* Navegación principal */}
                <nav className={styles.navLinks}>
                    <Link to="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>
                        🏠 Catálogo
                    </Link>
                    
                    {user && (
                        <>
                            <Link to="/dashboard" className={`${styles.link} ${isActive('/dashboard') ? styles.active : ''}`}>
                                📊 Mi Perfil
                            </Link>
                            <Link to="/profile" className={`${styles.link} ${isActive('/profile') ? styles.active : ''}`}>
                                ⚙️ Configuración
                            </Link>
                        </>
                    )}
                </nav>

                {/* Árbol de Exploración */}
                {arbol && (
                    <div className={styles.exploreSection}>
                        <h3 className={styles.sectionTitle}>🗂️ Explorar</h3>
                        <div className={styles.treeWrapper}>
                            <TreeView arbol={arbol} />
                        </div>
                    </div>
                )}

                {/* Usuario / Login */}
                <div className={styles.userSection}>
                    {user ? (
                        <>
                            <div className={styles.userInfo}>
                                {user.photoURL && (
                                    <img src={user.photoURL} alt="Avatar" className={styles.avatar} />
                                )}
                                <span className={styles.userName}>
                                    {user?.displayName || user?.email}
                                </span>
                            </div>
                            <button className={styles.btnLogout} onClick={handleLogout}>
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className={styles.btnLogin}>Iniciar Sesión</Link>
                    )}
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;