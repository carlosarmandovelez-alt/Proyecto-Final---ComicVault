// src/pages/Dashboard/index.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ComicContext } from '../../context/ComicContext';
import Menu from '../../componentes/shared/Menu';
import Tabs from '../../componentes/shared/Tabs';
import ComicCard from '../../componentes/index/ComicCard';
import styles from './index.module.scss';

function Dashboard() {
    const { user } = useContext(AuthContext);
    const { 
        catalogoComics, 
        userComics, 
        getUserComics, 
        topComics, 
        historial, 
        marcarComoLeido, 
        deshacerUltimoLeido,
        deseos, 
        agregarADeseos, 
        leerSiguienteDeseo, 
        eliminarDeDeseos
    } = useContext(ComicContext);

    useEffect(() => {
        if (user) {
            getUserComics(user.uid);
        }
    }, [user]);

    // Cómics que el usuario ha leído/calificado
    const misComics = catalogoComics
        .map(comic => {
            const interaccion = userComics.find(uc => uc.comicId === comic.id);
            return interaccion ? { ...comic, ...interaccion } : null;
        })
        .filter(c => c !== null);

    // ===== PESTAÑA 1: MI PERFIL =====
    const tabPerfil = (
        <div className={styles.tabContentWrapper}>
            {topComics && topComics.length > 0 && (
                <div className={styles.topSection}>
                    <h2>🏆 Top 5 Personal</h2>
                    <p className={styles.sectionSubtitle}>Basado en tus calificaciones (Max-Heap)</p>
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

            <div className={styles.structuresGrid}>
                {/* Cola */}
                <div className={styles.queueSection}>
                    <div className={styles.queueHeader}>
                        <div>
                            <h2>📚 Lista de Deseos</h2>
                            <p className={styles.sectionSubtitle}>FIFO</p>
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

                {/* Pila */}
                <div className={styles.stackSection}>
                    <div className={styles.stackHeader}>
                        <div>
                            <h2>🕒 Historial Reciente</h2>
                            <p className={styles.sectionSubtitle}>LIFO</p>
                        </div>
                        {historial.length > 0 && (
                            <button className={styles.btnUndo} onClick={deshacerUltimoLeido}>
                                ↩ Deshacer
                            </button>
                        )}
                    </div>
                    {historial.length === 0 ? (
                        <p className={styles.queueEmpty}>Aún no has marcado cómics como leídos.</p>
                    ) : (
                        <ul className={styles.stackList}>
                            {historial.map((comic, index) => (
                                <li key={`${comic.id}-${index}`} className={styles.stackItem}>
                                    <span className={styles.stackPosition}>#{historial.length - index}</span>
                                    <span className={styles.stackTitle}>{comic.titulo}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );

    // ===== PESTAÑA 2: MI COLECCIÓN =====
    const tabColeccion = (
        <div className={styles.tabContentWrapper}>
            <h2 className={styles.allComicsTitle}>Mis Cómics</h2>
            {misComics.length === 0 ? (
                <div className={styles.empty}>
                    <p>📚 Aún no has calificado ningún cómic</p>
                    <p>Ve al Catálogo para explorar y calificar cómics</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {misComics.map(comic => (
                        <ComicCard
                            key={comic.id}
                            comic={comic}
                            onDelete={() => {}}
                            onRate={() => {}}
                            onRead={marcarComoLeido}
                            onWishlist={agregarADeseos}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className={styles.dashboard}>
            <Menu />
            <main className={styles.content}>
                <header className={styles.header}>
                    <div>
                        <h1>Mi Perfil</h1>
                        <p>Bienvenido de nuevo, {user?.displayName || user?.email}</p>
                    </div>
                </header>

                <Tabs 
                    tabs={[
                        { label: '📊 Mi Perfil', content: tabPerfil },
                        { label: '📚 Mi Colección', content: tabColeccion }
                    ]}
                />
            </main>
        </div>
    );
}

export default Dashboard;