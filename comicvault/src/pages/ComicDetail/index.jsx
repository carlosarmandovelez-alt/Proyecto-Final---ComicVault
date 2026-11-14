// src/pages/ComicDetail/index.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ComicContext } from '../../context/ComicContext';
import StarRating from '../../componentes/index/StarRating';
import Menu from '../../componentes/shared/Menu';
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
    
    // ✅ Estado para recomendaciones (Ahora incluye la razón)
    const [recomendaciones, setRecomendaciones] = useState([]);

    useEffect(() => {
        const comicEncontrado = catalogoComics.find(c => c.id === id);
        if (comicEncontrado) setComic(comicEncontrado);

        if (user) {
            const interaccion = userComics.find(uc => uc.comicId === id);
            if (interaccion) {
                setCalificacion(interaccion.calificacion || 0);
                setResena(interaccion.resena || '');
            }
        }

        const calcularPromedio = async () => {
            const todas = await getAllInteractions();
            const delComic = todas.filter(t => t.comicId === id && t.calificacion > 0);
            if (delComic.length > 0) {
                const suma = delComic.reduce((acc, curr) => acc + curr.calificacion, 0);
                setPromedioGlobal(suma / delComic.length);
                setTotalCalificaciones(delComic.length);
            }
        };
        calcularPromedio();

        // ✅ Calcular recomendaciones usando el Grafo Ponderado
        if (grafo) {
            const vecinosOrdenados = grafo.getNeighborsSorted(id);
            
            // Obtenemos el objeto completo del cómic y la razón de la conexión
            const comicsRecomendados = vecinosOrdenados
                .map(vecino => {
                    const comicData = catalogoComics.find(c => c.id === vecino.id);
                    return comicData ? { ...comicData, razon: vecino.razon } : null;
                })
                .filter(c => c !== null)
                .slice(0, 4); // Tomar los 4 mejores
                
            setRecomendaciones(comicsRecomendados);
        }

    }, [id, user, userComics, catalogoComics, grafo]);

    const handleSave = async () => {
        if (!user) {
            alert('Debes iniciar sesión para calificar.');
            return;
        }
        setIsSaving(true);
        await saveInteraction(user.uid, id, { calificacion, resena });
        setIsSaving(false);
        alert('¡Guardado con éxito!');
    };

    const handleLeido = () => {
        if (!user) return alert('Inicia sesión primero');
        marcarComoLeido(comic);
        alert('Añadido al historial (Pila)');
    };

    const handleDeseos = () => {
        if (!user) return alert('Inicia sesión primero');
        agregarADeseos(comic);
        alert('Añadido a la lista de deseos (Cola)');
    };

    if (!comic) return <p className={styles.loading}>Cargando cómic...</p>;

    return (
        <div className={styles.detailContainer}>
            <Menu />

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
                            <button onClick={handleLeido} className={styles.btnRead}>
                                📖 Marcar como Leído
                            </button>
                            <button onClick={handleDeseos} className={styles.btnWishlist}>
                                ⭐ Añadir a Deseos
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
                        </div>
                    ) : (
                        <p className={styles.loginPrompt}>
                            <Link to="/login">Inicia sesión</Link> para calificar y reseñar este cómic.
                        </p>
                    )}
                </div>

                {/* ✅ SECCIÓN DE RECOMENDACIONES CON RAZÓN */}
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
                                    
                                    {/* ✅ Mostrar la razón de la recomendación */}
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