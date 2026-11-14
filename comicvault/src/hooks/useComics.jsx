// src/hooks/useComics.jsx
import { useState } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export function useComics() {
    const [userComics, setUserComics] = useState([]); // Interacciones del usuario
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Obtener las interacciones del usuario
    const getUserComics = async (userId) => {
        setIsPending(true);
        setError(null);
        try {
            const q = query(collection(db, 'user_comics'), where('userId', '==', userId));
            const snapshot = await getDocs(q);
            const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setUserComics(docs);
            setIsPending(false);
            return docs;
        } catch (err) {
            setError(err.message);
            setIsPending(false);
            return [];
        }
    };

    // ✅ Obtener TODAS las interacciones (para el rating promedio global)
    const getAllInteractions = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'user_comics'));
            return snapshot.docs.map(d => d.data());
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    // ✅ Agregar o actualizar interacción
    const saveInteraction = async (userId, comicId, data) => {
        setIsPending(true);
        setError(null);
        try {
            // Buscar si ya existe
            const q = query(
                collection(db, 'user_comics'),
                where('userId', '==', userId),
                where('comicId', '==', comicId)
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                // Actualizar
                const docId = snapshot.docs[0].id;
                await updateDoc(doc(db, 'user_comics', docId), {
                    ...data,
                    updatedAt: serverTimestamp()
                });
            } else {
                // Crear
                await addDoc(collection(db, 'user_comics'), {
                    userId,
                    comicId,
                    ...data,
                    createdAt: serverTimestamp()
                });
            }
            setIsPending(false);
            return true;
        } catch (err) {
            setError(err.message);
            setIsPending(false);
            return false;
        }
    };

    return {
        userComics,
        isPending,
        error,
        getUserComics,
        getAllInteractions,
        saveInteraction
    };
}