// src/hooks/useComics.jsx
import { useState } from 'react';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

export function useComics() {
    const [comics, setComics] = useState([]);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Obtener cómics del usuario
    const getUserComics = async (userId) => {
        setIsPending(true);
        setError(null);
        try {
            const q = query(collection(db, 'comics'), where('userId', '==', userId));
            const snapshot = await getDocs(q);
            const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setComics(docs);
            setIsPending(false);
            return docs;
        } catch (err) {
            setError(err.message);
            setIsPending(false);
            return [];
        }
    };

    // ✅ Agregar cómic
    const addComic = async (comic) => {
        setIsPending(true);
        setError(null);
        try {
            const ref = await addDoc(collection(db, 'comics'), {
                ...comic,
                createdAt: serverTimestamp()
            });
            setIsPending(false);
            return ref;
        } catch (err) {
            setError(err.message);
            setIsPending(false);
            return null;
        }
    };

    // ✅ Actualizar cómic (calificación, reseña)
    const updateComic = async (id, data) => {
        setIsPending(true);
        setError(null);
        try {
            await updateDoc(doc(db, 'comics', id), {
                ...data,
                updatedAt: serverTimestamp()
            });
            setIsPending(false);
            return true;
        } catch (err) {
            setError(err.message);
            setIsPending(false);
            return false;
        }
    };

    // ✅ Eliminar cómic
    const removeComic = async (id) => {
        setIsPending(true);
        setError(null);
        try {
            await deleteDoc(doc(db, 'comics', id));
            setIsPending(false);
            return true;
        } catch (err) {
            setError(err.message);
            setIsPending(false);
            return false;
        }
    };

    return {
        comics,
        isPending,
        error,
        getUserComics,
        addComic,
        updateComic,
        removeComic
    };
}