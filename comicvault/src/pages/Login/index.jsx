// src/pages/Login/index.jsx
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './index.module.scss';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
            navigate('/', { replace: true });
        } catch (err) {
            setError('Credenciales incorrectas. Verifica tu email y contraseña.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>🦸‍♂️ ComicVault</h1>
                <p className={styles.subtitle}>Tu colección de cómics</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.inputGroup}>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            required
                        />
                    </div>

                    <button type="submit" className={styles.btnPrimary}>
                        Iniciar Sesión
                    </button>
                </form>

                <p className={styles.link}>
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;