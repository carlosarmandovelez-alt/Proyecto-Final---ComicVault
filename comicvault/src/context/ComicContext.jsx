// src/context/ComicContext.jsx
import { createContext } from 'react';
import { useComics } from '../hooks/useComics';

export const ComicContext = createContext();

export function ComicProvider({ children }) {
    const comics = useComics();
    return (
        <ComicContext.Provider value={comics}>
            {children}
        </ComicContext.Provider>
    );
}