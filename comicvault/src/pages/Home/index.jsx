import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ComicContext } from '../../context/ComicContext';
import { catalogoComics } from '../../data/catalogoComics';
import SearchBar from '../../componentes/index/SearchBar';
import styles from './index.module.scss';

function Home() {
    const { user } = useContext(AuthContext);
    const { arbol } = useContext(ComicContext); 
    const [editorialFiltro, setEditorialFiltro] = useState(null);

    //Obtener las editoriales únicas usando el Árbol
    const editoriales = arbol && arbol.raiz 
        ? arbol.raiz.hijos.map(hijo => hijo.valor) 
        : [];

    //Filtrar los cómics
    const comicsFiltrados = editorialFiltro 
        ? catalogoComics.filter(c => c.editorial === editorialFiltro)
        : catalogoComics;

    return (
        <div className={styles.homeContainer}>
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h2>Explora el Catálogo</h2>
                    <p>Descubre, califica y guarda tus cómics favoritos.</p>
                    <div className={styles.searchContainer}>
                        <SearchBar />
                    </div>
                </header>

                {/* Botones de filtro por editorial */}
                <div className={styles.filters}>
                    <button 
                        className={`${styles.filterBtn} ${!editorialFiltro ? styles.active : ''}`}
                        onClick={() => setEditorialFiltro(null)}
                    >
                        Todas
                    </button>
                    {editoriales.map(ed => (
                        <button 
                            key={ed}
                            className={`${styles.filterBtn} ${editorialFiltro === ed ? styles.active : ''}`}
                            onClick={() => setEditorialFiltro(ed)}
                        >
                            {ed}
                        </button>
                    ))}
                </div>

                <div className={styles.grid}>
                    {comicsFiltrados.map(comic => (
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