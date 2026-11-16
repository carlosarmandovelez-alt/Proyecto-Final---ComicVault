import { useState } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export function useComics() {
    const [userComics, setUserComics] = useState([]);
    const [userLists, setUserLists] = useState({ deseos: [], historial: [] });
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    //Obtener interacciones y listas del usuario
    const getUserComics = async (userId) => {
        setIsPending(true);
        setError(null);
        try {
            // 1. Traer calificaciones/reseñas/leídos
            const q = query(collection(db, 'user_comics'), where('userId', '==', userId));
            const snapshot = await getDocs(q);
            const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setUserComics(docs);

            // 2. Traer listas (Deseos e Historial)
            const qLists = query(collection(db, 'user_lists'), where('userId', '==', userId));
            const snapshotLists = await getDocs(qLists);
            
            if (!snapshotLists.empty) {
                const listaData = snapshotLists.docs[0].data();
                setUserLists({
                    deseos: listaData.deseos || [],
                    historial: listaData.historial || []
                });
            } else {
                setUserLists({ deseos: [], historial: [] });
            }

            setIsPending(false);
            return docs;
        } catch (err) {
            setError(err.message);
            setIsPending(false);
            return [];
        }
    };

    //Obtener TODAS las interacciones (para promedios y reseñas)
    const getAllInteractions = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'user_comics'));
            return snapshot.docs.map(d => d.data());
        } catch (err) {
            console.error("Error obteniendo interacciones:", err);
            return [];
        }
    };

    //Guardar interacción (Calificación / Reseña) sin duplicados
    const saveInteraction = async (userId, comicId, data) => {
        setIsPending(true);
        setError(null);
        try {
            const q = query(
                collection(db, 'user_comics'),
                where('userId', '==', userId),
                where('comicId', '==', comicId)
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                // Actualizar si ya existe
                const docId = snapshot.docs[0].id;
                await updateDoc(doc(db, 'user_comics', docId), {
                    ...data,
                    leido: true, //Al calificar/reseñar, siempre es leído
                    updatedAt: serverTimestamp()
                });
                setUserComics(prev => prev.map(uc => 
                    uc.comicId === comicId ? { ...uc, ...data, leido: true } : uc
                ));
            } else {
                // Crear nuevo
                const newDoc = await addDoc(collection(db, 'user_comics'), {
                    userId,
                    comicId,
                    ...data,
                    leido: true, //Al calificar/reseñar, siempre es leído
                    createdAt: serverTimestamp()
                });
                setUserComics(prev => [...prev, { id: newDoc.id, userId, comicId, ...data, leido: true }]);
            }
            setIsPending(false);
            return true;
        } catch (err) {
            setError(err.message);
            setIsPending(false);
            return false;
        }
    };

    // guardar estado de leído (sin calificar)
    const saveReadStatus = async (userId, comicId, leido = true) => {
        setIsPending(true);
        try {
            const q = query(
                collection(db, 'user_comics'),
                where('userId', '==', userId),
                where('comicId', '==', comicId)
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const docId = snapshot.docs[0].id;
                await updateDoc(doc(db, 'user_comics', docId), {
                    leido: leido,
                    updatedAt: serverTimestamp()
                });
                setUserComics(prev => prev.map(uc => 
                    uc.comicId === comicId ? { ...uc, leido } : uc
                ));
            } else {
                const newDoc = await addDoc(collection(db, 'user_comics'), {
                    userId,
                    comicId,
                    leido: leido,
                    calificacion: 0,
                    resena: '',
                    createdAt: serverTimestamp()
                });
                setUserComics(prev => [...prev, { id: newDoc.id, userId, comicId, leido, calificacion: 0, resena: '' }]);
            }
            setIsPending(false);
            return true;
        } catch (err) {
            setError(err.message);
            setIsPending(false);
            return false;
        }
    };

    //Guardar listas (Deseos e Historial) en Firestore
    const saveUserLists = async (userId, newLists) => {
        try {
            const q = query(collection(db, 'user_lists'), where('userId', '==', userId));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const docId = snapshot.docs[0].id;
                await updateDoc(doc(db, 'user_lists', docId), {
                    ...newLists,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, 'user_lists'), {
                    userId,
                    ...newLists,
                    createdAt: serverTimestamp()
                });
            }
            setUserLists(newLists);
        } catch (err) {
            console.error("Error guardando listas:", err);
        }
    };

    return {
        userComics,
        userLists,
        isPending,
        error,
        getUserComics,
        getAllInteractions,
        saveInteraction,
        saveReadStatus,
        saveUserLists
    };
}