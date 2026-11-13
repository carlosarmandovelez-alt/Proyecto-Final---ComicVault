// src/componentes/index/ComicCard.jsx
import StarRating from './StarRating';
import styles from './ComicCard.module.scss';

function ComicCard({ comic, onDelete, onRate, onRead, onWishlist }) {
    return (
        <div className={styles.card}>
            {/* ... (Imagen e Info) ... */}
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
                    <button className={styles.btnDelete} onClick={() => onDelete(comic.id)}>✕</button>
                </div>

                <div className={styles.details}>
                    <p className={styles.author}>👨‍💻 {comic.autor}</p>
                    <p className={styles.editorial}>🏢 {comic.editorial}</p>
                </div>

                <div className={styles.rating}>
                    <StarRating rating={comic.calificacion || 0} onChange={(newRating) => onRate(comic.id, newRating)} />
                </div>

                {/* ✅ BOTONES DE ACCIÓN */}
                <div className={styles.actions}>
                    <button className={styles.btnRead} onClick={() => onRead(comic)}>
                        📖 Leído
                    </button>
                    <button className={styles.btnWishlist} onClick={() => onWishlist(comic)}>
                        ⭐ Deseos
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ComicCard;