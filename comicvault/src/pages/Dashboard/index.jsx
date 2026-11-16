// src/pages/Dashboard/index.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ComicContext } from '../../context/ComicContext';
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

    if (!user) {
        return <div style={{ padding: '40px', color: 'white' }}>Cargando perfil...</div>;
    }

    // ✅ Cómics que el usuario ha leído O calificado
    const misComics = catalogoComics
        .map(comic => {
            const interaccion = userComics.find(uc => uc.comicId === comic.id);
            // Incluir si tiene leido: true O calificación > 0
            if (interaccion && (interaccion.leido || interaccion.calificacion > 0)) {
                return { ...comic, ...interaccion };
            }
            return null;
        })
        .filter(c => c !== null);

    // ===== PESTAÑA 1: MI PERFIL (ESTILO LETTERBOXD) =====
    const tabPerfil = (
        <div className={styles.tabContentWrapper}>
            
            {/* ✅ TARJETA DE PERFIL */}
            <div className={styles.profileHeader}>
                <div className={styles.profileAvatar}>
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" />
                    ) : (
                        <span>{user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}</span>
                    )}
                </div>
                <div className={styles.profileInfo}>
                    <h2>{user.displayName || 'Usuario Anónimo'}</h2>
                    <p className={styles.profileEmail}>{user.email}</p>
                    <div className={styles.profileStats}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{misComics.length}</span>
                            <span className={styles.statLabel}>Leídos</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{deseos.length}</span>
                            <span className={styles.statLabel}>Deseos</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {topComics.length > 0 ? topComics[0].calificacion : '0'}
                            </span>
                            <span className={styles.statLabel}>Mejor Nota</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ TOP 5 DESTACADO */}
            {topComics && topComics.length > 0 && (
                <div className={styles.topSectionLetterboxd}>
                    <div className={styles.sectionHeader}>
                        <h2>🏆 Mi Top 5</h2>
                        <p className={styles.sectionSubtitle}>Mis cómics favoritos (Max-Heap)</p>
                    </div>
                    <div className={styles.topGridLetterboxd}>
                        {topComics.map((comic, index) => (
                            <div key={comic.id} className={styles.topCardLetterboxd}>
                                <div className={styles.rankNumber}>#{index + 1}</div>
                                <img src={comic.imagenUrl} alt={comic.titulo} className={styles.topCover} />
                                <div className={styles.topInfo}>
                                    <h3>{comic.titulo}</h3>
                                    <p>{comic.autor}</p>
                                    <div className={styles.topStars}>
                                        {'⭐'.repeat(comic.calificacion)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ESTRUCTURAS: COLA Y PILA */}
            <div className={styles.structuresGrid}>
                {/* Lista de Deseos (Cola) */}
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

                {/* Historial (Pila) */}
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
                            enColeccion={true} // ✅ AQUÍ LE DECIMOS QUE ES DE LA COLECCIÓN
                            onDelete={() => {}}
                            onRate={() => {}} // Deshabilitamos el cambio de nota desde aquí
                            onRead={() => {}}
                            onWishlist={() => {}}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className={styles.dashboard}>
            <main className={styles.content}>
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