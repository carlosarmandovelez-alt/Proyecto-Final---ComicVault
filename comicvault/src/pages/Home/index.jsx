// src/pages/Home/index.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { catalogoComics } from '../../data/catalogoComics';
import Menu from '../../componentes/shared/Menu'; // ✅ Importar Menu
import styles from './index.module.scss';

function Home() {
    const { user } = useContext(AuthContext);

    return (
        <div className={styles.homeContainer}>
            <Menu /> {/* ✅ Usar el menú global */}

            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h2>Explora el Catálogo</h2>
                    <p>Descubre, califica y guarda tus cómics favoritos.</p>
                </header>

                <div className={styles.grid}>
                    {catalogoComics.map(comic => (
                        <Link to={`/comic/${comic.id}`} key={comic.id} className={styles.cardLink}>
                            <div className={styles.card}>
                                <img src={comic.imagenUrl} alt={comic.titulo} />
                                <div className={styles.cardInfo}>
                                    <h3>{comic.titulo}</h3>
                                    <p>{comic.autor}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Home;