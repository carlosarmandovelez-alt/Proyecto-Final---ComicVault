// src/hooks/useComics.jsx
import { useState } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { db, storage } from '../firebase/config';

export function useComics() {
    const [comics, setComics] = useState([]);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

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

    // ✅ NUEVA FUNCIÓN: Sube imagen + Guarda en Firestore
    const addComic = async (comic, file) => {
        setIsPending(true);
        setError(null);
        try {
            let imagenUrl = '';

            // 1. Si hay archivo, lo subimos a Storage
            if (file) {
                const storageRef = ref(storage, `comics/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                imagenUrl = await getDownloadURL(storageRef);
            }

            // 2. Guardamos en Firestore con la URL
            const docRef = await addDoc(collection(db, 'comics'), {
                ...comic,
                imagenUrl: imagenUrl, // ← Se guarda la URL
                createdAt: serverTimestamp()
            });

            setIsPending(false);
            return docRef;
        } catch (err) {
            setError(err.message);
            setIsPending(false);
            return null;
        }
    };

    const updateComic = async (id, data) => {
        try {
            await updateDoc(doc(db, 'comics', id), { ...data, updatedAt: serverTimestamp() });
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const removeComic = async (id) => {
        try {
            await deleteDoc(doc(db, 'comics', id));
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    return { comics, isPending, error, getUserComics, addComic, updateComic, removeComic };
}