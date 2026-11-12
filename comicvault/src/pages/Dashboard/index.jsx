// src/pages/Dashboard/index.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ComicContext } from '../../context/ComicContext';
import Menu from '../../componentes/shared/Menu';
import ComicCard from '../../componentes/index/ComicCard';
import ComicForm from '../../componentes/index/ComicForm';
import styles from './index.module.scss';

function Dashboard() {
    const { user } = useContext(AuthContext);
    const { comics, getUserComics, addComic, removeComic, updateComic } = useContext(ComicContext);

    const [showForm, setShowForm] = useState(false);

    // ✅ Cargar cómics al iniciar
    useEffect(() => {
        if (user) {
            getUserComics(user.uid);
        }
    }, [user]);

    // ✅ RECIBE comic Y file
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

                {showForm && (
                    <div className={styles.formContainer}>
                        <ComicForm onAdd={handleAdd} />
                    </div>
                )}

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
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;