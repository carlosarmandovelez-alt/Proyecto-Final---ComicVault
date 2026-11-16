import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ComicContext } from '../../context/ComicContext';
import StarRating from '../../componentes/index/StarRating';
import styles from './index.module.scss';

function ComicDetail() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const { 
        catalogoComics, 
        userComics, 
        saveInteraction, 
        getAllInteractions, 
        grafo,
        marcarComoLeido,
        agregarADeseos
    } = useContext(ComicContext);

    const [comic, setComic] = useState(null);
    const [calificacion, setCalificacion] = useState(0);
    const [resena, setResena] = useState('');
    const [promedioGlobal, setPromedioGlobal] = useState(0);
    const [totalCalificaciones, setTotalCalificaciones] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [recomendaciones, setRecomendaciones] = useState([]);
    const [todasLasResenas, setTodasLasResenas] = useState([]);
    
    //Estados para feedback visual
    const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
    const [isMarkedAsRead, setIsMarkedAsRead] = useState(false);

    //Función para cargar estadísticas y reseñas
    const cargarEstadisticasYResenas = async () => {
        const todas = await getAllInteractions();
        const delComic = todas.filter(t => t.comicId === id && t.calificacion > 0);
        
        if (delComic.length > 0) {
            const suma = delComic.reduce((acc, curr) => acc + curr.calificacion, 0);
            setPromedioGlobal(suma / delComic.length);
            setTotalCalificaciones(delComic.length);
        } else {
            setPromedioGlobal(0);
            setTotalCalificaciones(0);
        }

        const resenasComunidad = delComic.filter(t => t.resena && t.resena.trim() !== '');
        setTodasLasResenas(resenasComunidad);
    };

    useEffect(() => {
        const comicEncontrado = catalogoComics.find(c => c.id === id);
        if (comicEncontrado) setComic(comicEncontrado);

        if (user) {
            const interaccion = userComics.find(uc => uc.comicId === id);
            if (interaccion) {
                setCalificacion(interaccion.calificacion || 0);
                setResena(interaccion.resena || '');
                if (interaccion.leido) setIsMarkedAsRead(true);
            }
        }

        cargarEstadisticasYResenas();

        if (grafo) {
            const vecinosOrdenados = grafo.getNeighborsSorted(id);
            const comicsRecomendados = vecinosOrdenados
                .map(vecino => {
                    const comicData = catalogoComics.find(c => c.id === vecino.id);
                    return comicData ? { ...comicData, razon: vecino.razon } : null;
                })
                .filter(c => c !== null)
                .slice(0, 4);
            setRecomendaciones(comicsRecomendados);
        }
    }, [id, user, userComics, catalogoComics, grafo]);

    const handleSave = async () => {
        if (!user) {
            alert('Debes iniciar sesión para calificar.');
            return;
        }
        setIsSaving(true);
        
        await saveInteraction(user.uid, id, { 
            calificacion, 
            resena,
            userName: user.displayName || user.email 
        });
        
        //Si califica o reseña, automáticamente se marca como leído
        if (calificacion > 0 || resena.trim() !== '') {
            await marcarComoLeido(comic);
            setIsMarkedAsRead(true);
        }

        await cargarEstadisticasYResenas();

        setIsSaving(false);
        alert('¡Guardado con éxito!');
    };

    const handleLeido = async () => {
        if (!user) return alert('Inicia sesión primero');
        await marcarComoLeido(comic);
        setIsMarkedAsRead(true);
        setTimeout(() => setIsMarkedAsRead(false), 3000);
    };

    const handleDeseos = async () => {
        if (!user) return alert('Inicia sesión primero');
        const exito = await agregarADeseos(comic);
        if (exito) {
            setIsAddedToWishlist(true);
            setTimeout(() => setIsAddedToWishlist(false), 3000);
        }
    };

    if (!comic) return <p className={styles.loading}>Cargando cómic...</p>;

    return (
        <div className={styles.detailContainer}>
            <main className={styles.mainContent}>
                <div className={styles.comicInfo}>
                    <img src={comic.imagenUrl} alt={comic.titulo} className={styles.cover} />
                    <div className={styles.infoText}>
                        <h1>{comic.titulo}</h1>
                        <p className={styles.author}>👨‍💻 {comic.autor}</p>
                        <p className={styles.editorial}>🏢 {comic.editorial} ({comic.anio})</p>
                        
                        <div className={styles.globalRating}>
                            <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
                            <span className={styles.average}>{promedioGlobal.toFixed(1)} / 5</span>
                            <span className={styles.count}>({totalCalificaciones} calificaciones)</span>
                        </div>

                        <p className={styles.sinopsis}>{comic.sinopsis}</p>

                        <div className={styles.actionButtons}>
                            <button 
                                onClick={handleLeido} 
                                className={`${styles.btnRead} ${isMarkedAsRead ? styles.btnSuccess : ''}`}
                                disabled={isMarkedAsRead}
                            >
                                {isMarkedAsRead ? '✅ Leído' : '📖 Marcar como Leído'}
                            </button>
                            <button 
                                onClick={handleDeseos} 
                                className={`${styles.btnWishlist} ${isAddedToWishlist ? styles.btnSuccess : ''}`}
                                disabled={isAddedToWishlist}
                            >
                                {isAddedToWishlist ? '✅ Añadido' : '⭐ Añadir a Deseos'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.interactionSection}>
                    <h2>Tu Opinión</h2>
                    {user ? (
                        <div className={styles.form}>
                            <div className={styles.ratingInput}>
                                <p>Tu calificación:</p>
                                <StarRating rating={calificacion} onChange={setCalificacion} />
                            </div>
                            <div className={styles.reviewInput}>
                                <p>Tu reseña:</p>
                                <textarea
                                    value={resena}
                                    onChange={(e) => setResena(e.target.value)}
                                    placeholder="¿Qué te pareció este cómic?"
                                    rows="4"
                                />
                            </div>
                            <button onClick={handleSave} disabled={isSaving} className={styles.btnSave}>
                                {isSaving ? 'Guardando...' : 'Guardar Reseña'}
                            </button>
                            <p className={styles.hint}>Al guardar, se añadirá automáticamente a tu historial de leídos.</p>
                        </div>
                    ) : (
                        <p className={styles.loginPrompt}>
                            <Link to="/login">Inicia sesión</Link> para calificar y reseñar este cómic.
                        </p>
                    )}
                </div>

                {todasLasResenas.length > 0 && (
                    <div className={styles.communityReviews}>
                        <h2>💬 Reseñas de la Comunidad</h2>
                        <div className={styles.reviewsList}>
                            {todasLasResenas.map((review, index) => (
                                <div key={index} className={styles.reviewCard}>
                                    <div className={styles.reviewHeader}>
                                        <span className={styles.reviewStars}>
                                            {'⭐'.repeat(review.calificacion)}
                                        </span>
                                        <span className={styles.reviewUser}>
                                            {review.userId === user?.uid ? 'Tú' : (review.userName || 'Usuario')}
                                        </span>
                                    </div>
                                    <p className={styles.reviewText}>"{review.resena}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {recomendaciones.length > 0 && (
                    <div className={styles.recommendationsSection}>
                        <h2>🕸️ Cómics Relacionados</h2>
                        <p className={styles.recSubtitle}>Basado en conexiones por Autor, Franquicia o Editorial (Grafo)</p>
                        
                        <div className={styles.recGrid}>
                            {recomendaciones.map(rec => (
                                <Link to={`/comic/${rec.id}`} key={rec.id} className={styles.recCard}>
                                    <img src={rec.imagenUrl} alt={rec.titulo} />
                                    <h4>{rec.titulo}</h4>
                                    <p className={styles.recAuthor}>{rec.autor}</p>
                                    <span className={styles.recReason}>
                                        🔗 {rec.razon}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default ComicDetail;