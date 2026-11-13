// src/pages/Dashboard/index.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ComicContext } from '../../context/ComicContext';
import Menu from '../../componentes/shared/Menu';
import ComicCard from '../../componentes/index/ComicCard';
import ComicForm from '../../componentes/index/ComicForm';
import TreeView from '../../componentes/index/TreeView';
import GraphView from '../../componentes/index/GraphView';
import styles from './index.module.scss';

function Dashboard() {
    const { user } = useContext(AuthContext);
    const { 
        comics, 
        getUserComics, 
        addComic, 
        removeComic, 
        updateComic, 
        // Estructuras
        topComics, 
        historial, 
        marcarComoLeido, 
        deshacerUltimoLeido,
        deseos, 
        agregarADeseos, 
        leerSiguienteDeseo, 
        eliminarDeDeseos,
        arbol,
        grafo
    } = useContext(ComicContext);

    const [showForm, setShowForm] = useState(false);

    // ✅ Cargar cómics al iniciar
    useEffect(() => {
        if (user) {
            getUserComics(user.uid);
        }
    }, [user]);

    const handleAdd = async (comic, file) => {
        await addComic({ ...comic, userId: user.uid }, file);
        await getUserComics(user.uid);
        setShowForm(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar este cómic?')) {
            await removeComic(id);
            await getUserComics(user.uid);
        }
    };

    const handleRate = async (id, calificacion) => {
        await updateComic(id, { calificacion });
        await getUserComics(user.uid);
    };

    return (
        <div className={styles.dashboard}>
            <Menu />

            <main className={styles.content}>
                
                {/* HEADER */}
                <header className={styles.header}>
                    <div>
                        <h1>Mi Colección</h1>
                        <p>{comics.length} cómic(s) en tu colección</p>
                    </div>
                    <button 
                        className={styles.btnToggle} 
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? '✕ Cancelar' : '➕ Agregar Cómic'}
                    </button>
                </header>

                {/* FORMULARIO */}
                {showForm && (
                    <div className={styles.formContainer}>
                        <ComicForm onAdd={handleAdd} />
                    </div>
                )}

                {/* ========================================== */}
                {/* ESTRUCTURAS DE DATOS                       */}
                {/* ========================================== */}

                <div className={styles.structuresGrid}>
                    {/* 1. TOP 5 (MAX-HEAP) */}
                    {topComics && topComics.length > 0 && (
                        <div className={styles.topSection}>
                            <h2>🏆 Top 5 Mejores</h2>
                            <p className={styles.sectionSubtitle}>Generado con un Max-Heap</p>
                            <div className={styles.topGrid}>
                                {topComics.map((comic, index) => (
                                    <div key={comic.id} className={styles.topCard}>
                                        <span className={styles.rankBadge}>#{index + 1}</span>
                                        <h3>{comic.titulo}</h3>
                                        <p>⭐ {comic.calificacion} / 5</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 2. LISTA DE DESEOS (COLA) */}
                    <div className={styles.queueSection}>
                        <div className={styles.queueHeader}>
                            <div>
                                <h2>📚 Lista de Deseos</h2>
                                <p className={styles.sectionSubtitle}>FIFO: Primero en entrar, primero en salir</p>
                            </div>
                            {deseos.length > 0 && (
                                <button className={styles.btnNext} onClick={leerSiguienteDeseo}>
                                    ▶ Leer Siguiente
                                </button>
                            )}
                        </div>

                        {deseos.length === 0 ? (
                            <p className={styles.queueEmpty}>No tienes cómics en tu lista de deseos.</p>
                        ) : (
                            <ul className={styles.queueList}>
                                {deseos.map((comic, index) => (
                                    <li key={comic.id} className={styles.queueItem}>
                                        <span className={styles.queuePos}>{index + 1}º</span>
                                        <span className={styles.queueTitle}>{comic.titulo}</span>
                                        <button className={styles.btnRemove} onClick={() => eliminarDeDeseos(comic.id)}>✕</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* 3. ÁRBOL N-ARIO (EXPLORADOR) */}
                {arbol && (
                    <div className={styles.treeSection}>
                        <div className={styles.treeHeader}>
                            <h2>🗂️ Explorador de Colección</h2>
                            <p className={styles.sectionSubtitle}>Organizado por Editorial → Autor → Cómic (Árbol N-ario)</p>
                        </div>
                        <TreeView arbol={arbol} />
                    </div>
                )}

                {/* 4. HISTORIAL DE LEÍDOS (PILA) */}
                {historial && historial.length > 0 && (
                    <div className={styles.stackSection}>
                        <div className={styles.stackHeader}>
                            <div>
                                <h2>🕒 Historial Reciente</h2>
                                <p className={styles.sectionSubtitle}>Últimos leídos (Pila - LIFO)</p>
                            </div>
                            <button className={styles.btnUndo} onClick={deshacerUltimoLeido}>
                                ↩ Deshacer
                            </button>
                        </div>
                        <ul className={styles.stackList}>
                            {historial.map((comic, index) => (
                                <li key={`${comic.id}-${index}`} className={styles.stackItem}>
                                    <span className={styles.stackPosition}>#{historial.length - index}</span>
                                    <span className={styles.stackTitle}>{comic.titulo}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 5. GRAFO (CONEXIONES) */}
                {grafo && (
                    <div className={styles.graphSection}>
                        <div className={styles.graphHeader}>
                            <h2>🕸️ Red de Conexiones</h2>
                            <p className={styles.sectionSubtitle}>Relaciones por Autor o Editorial (Grafo)</p>
                        </div>
                        <GraphView grafo={grafo} />
                    </div>
                )}

                {/* ========================================== */}
                {/* LISTA COMPLETA DE CÓMICS                   */}
                {/* ========================================== */}
                <h2 className={styles.allComicsTitle}>Todos mis Cómics</h2>
                {comics.length === 0 ? (
                    <div className={styles.empty}>
                        <p>📚 No tienes cómics en tu colección</p>
                        <p>Agrega tu primer cómic con el botón de arriba</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {comics.map(comic => (
                            <ComicCard
                                key={comic.id}
                                comic={comic}
                                onDelete={handleDelete}
                                onRate={handleRate}
                                onRead={marcarComoLeido}
                                onWishlist={agregarADeseos}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;