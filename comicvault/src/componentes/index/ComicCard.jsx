import StarRating from './StarRating';
import styles from './ComicCard.module.scss';

function ComicCard({ comic, onDelete, onRate, onRead, onWishlist, enColeccion = false }) {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                {comic.imagenUrl ? (
                    <img src={comic.imagenUrl} alt={comic.titulo} className={styles.coverImage} />
                ) : (
                    <span className={styles.noImage}>Sin Portada</span>
                )}
            </div>

            <div className={styles.infoContainer}>
                <div className={styles.header}>
                    <h3>{comic.titulo}</h3>
                    {/* Mostramos el botón de eliminar solo si no está en la colección (o si es admin, pero para este caso lo ocultamos) */}
                    {!enColeccion && onDelete && (
                        <button className={styles.btnDelete} onClick={() => onDelete(comic.id)}>✕</button>
                    )}
                </div>

                <div className={styles.details}>
                    <p className={styles.author}>👨‍💻 {comic.autor}</p>
                    <p className={styles.editorial}>🏢 {comic.editorial}</p>
                </div>

                <div className={styles.rating}>
                    <StarRating 
                        rating={comic.calificacion || 0} 
                        onChange={(newRating) => onRate && onRate(comic.id, newRating)} 
                        readonly={enColeccion} // Si está en colección, no se puede cambiar desde aquí
                    />
                </div>

                {/* Lógica condicional: Botones o Reseña */}
                {!enColeccion ? (
                    <div className={styles.actions}>
                        <button className={styles.btnRead} onClick={() => onRead && onRead(comic)}>
                            📖 Leído
                        </button>
                        <button className={styles.btnWishlist} onClick={() => onWishlist && onWishlist(comic)}>
                            ⭐ Deseos
                        </button>
                    </div>
                ) : (
                    <div className={styles.readOnlyInfo}>
                        {comic.resena ? (
                            <p className={styles.shortReview}>"{comic.resena}"</p>
                        ) : (
                            <span className={styles.readBadge}>✅ Leído</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ComicCard;