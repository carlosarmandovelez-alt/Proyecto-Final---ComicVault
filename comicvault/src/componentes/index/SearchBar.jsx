import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Trie from '../../estructuras/Trie';
import { catalogoComics } from '../../data/catalogoComics';
import styles from './SearchBar.module.scss';

function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [trie] = useState(() => {
        const t = new Trie();
        catalogoComics.forEach(comic => t.insert(comic.titulo, comic.id));
        return t;
    });
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (query.length > 0) {
            const comicIds = trie.searchByPrefix(query);
            const comics = comicIds.map(id => catalogoComics.find(c => c.id === id));
            setResults(comics);
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    }, [query, trie]);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.searchWrapper} ref={wrapperRef}>
            <input
                type="text"
                className={styles.searchInput}
                placeholder="🔍 Buscar cómic..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length > 0 && setIsOpen(true)}
            />
            {isOpen && (
                <ul className={styles.resultsList}>
                    {results.length > 0 ? (
                        results.map(comic => (
                            <li key={comic.id}>
                                <Link 
                                    to={`/comic/${comic.id}`} 
                                    className={styles.resultItem}
                                    onClick={() => { setQuery(''); setIsOpen(false); }}
                                >
                                    <img src={comic.imagenUrl} alt={comic.titulo} />
                                    <div>
                                        <p className={styles.resultTitle}>{comic.titulo}</p>
                                        <p className={styles.resultAuthor}>{comic.autor}</p>
                                    </div>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className={styles.noResults}>No se encontraron resultados</li>
                    )}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;