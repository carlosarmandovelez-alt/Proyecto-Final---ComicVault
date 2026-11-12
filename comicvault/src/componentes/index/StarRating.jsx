// src/componentes/index/StarRating.jsx
import styles from './StarRating.module.scss';

function StarRating({ rating, onChange, readonly = false }) {
    return (
        <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map(star => (
                <span
                    key={star}
                    className={`${styles.star} ${star <= rating ? styles.active : ''}`}
                    onClick={() => !readonly && onChange && onChange(star)}
                    style={{ cursor: readonly ? 'default' : 'pointer' }}
                >
                    ★
                </span>
            ))}
        </div>
    );
}

export default StarRating;