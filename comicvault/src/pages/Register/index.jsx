// src/pages/Register/index.jsx
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './index.module.scss'; // Usa los mismos estilos que Login

function Register() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            await register(email, password, nombre);
            navigate('/', { replace: true });
        } catch (err) {
            setError('Error al registrar. El email puede estar en uso.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>📝 Registrarse</h1>
                <p className={styles.subtitle}>Crea tu cuenta en ComicVault</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.inputGroup}>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Tu nombre"
                            required
                        />
                    </div>

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
                            placeholder="Mínimo 6 caracteres"
                            required
                        />
                    </div>

                    <button type="submit" className={styles.btnPrimary}>
                        Crear Cuenta
                    </button>
                </form>

                <p className={styles.link}>
                    ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;