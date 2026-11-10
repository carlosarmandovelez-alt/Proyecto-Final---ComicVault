// src/hooks/useAuth.jsx
import { useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Escuchar cambios de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // ✅ Registro
    const register = async (email, password, displayName) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(result.user, { displayName });
            setUser({ ...result.user, displayName });
            setIsLoading(false);
            return result.user;
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    };

    // ✅ Login
    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            setUser(result.user);
            setIsLoading(false);
            return result.user;
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    };

    // ✅ Logout
    const logout = async () => {
        setIsLoading(true);
        try {
            await signOut(auth);
            setUser(null);
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    };

    return {
        user,
        isLoading,
        error,
        isLogged: !!user,
        register,
        login,
        logout
    };
}