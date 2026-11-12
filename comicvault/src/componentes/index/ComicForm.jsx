// src/componentes/index/ComicForm.jsx
import { useState } from 'react';
import styles from './ComicForm.module.scss';

function ComicForm({ onAdd }) {
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [editorial, setEditorial] = useState('');
    const [file, setFile] = useState(null); // ✅ Estado para la imagen

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!titulo.trim() || !autor.trim() || !editorial.trim()) return;

        onAdd({
            titulo: titulo.trim(),
            autor: autor.trim(),
            editorial: editorial.trim(),
            calificacion: 0,
            reseña: ''
        }, file); // ✅ Se pasa el archivo

        setTitulo('');
        setAutor('');
        setEditorial('');
        setFile(null);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3>➕ Agregar Cómic</h3>

            <div className={styles.field}>
                <label>Título:</label>
                <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
            </div>
            <div className={styles.field}>
                <label>Autor:</label>
                <input type="text" value={autor} onChange={(e) => setAutor(e.target.value)} required />
            </div>
            <div className={styles.field}>
                <label>Editorial:</label>
                <input type="text" value={editorial} onChange={(e) => setEditorial(e.target.value)} required />
            </div>

            {/* ✅ INPUT PARA LA IMAGEN */}
            <div className={styles.field}>
                <label>Portada (opcional):</label>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setFile(e.target.files[0])} 
                />
            </div>

            <button type="submit" className={styles.btnAdd}>Agregar a Colección</button>
        </form>
    );
}

export default ComicForm;