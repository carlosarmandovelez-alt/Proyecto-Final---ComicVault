// src/context/ComicContext.jsx
import { createContext, useState, useEffect } from 'react';
import { useComics } from '../hooks/useComics';
import { catalogoComics } from '../data/catalogoComics';
import MaxHeap from '../estructuras/MaxHeap';
import Stack from '../estructuras/Stack';
import Queue from '../estructuras/Queue';
import { NaryTree } from '../estructuras/NaryTree';
import Graph from '../estructuras/Graph';

export const ComicContext = createContext();

export function ComicProvider({ children }) {
    const comicsState = useComics();
    
    const [topComics, setTopComics] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [deseos, setDeseos] = useState([]);
    const [arbol, setArbol] = useState(null);
    const [grafo, setGrafo] = useState(null);
    
    const [stack] = useState(new Stack());
    const [queue] = useState(new Queue());

    useEffect(() => {
        if (catalogoComics.length > 0) {
            // 1. Combinar catálogo con las calificaciones del usuario
            const comicsConCalificacion = catalogoComics.map(comic => {
                const interaccion = comicsState.userComics.find(uc => uc.comicId === comic.id);
                return {
                    ...comic,
                    calificacion: interaccion?.calificacion || 0,
                    resena: interaccion?.resena || '',
                    status: interaccion?.status || null
                };
            });

            // 2. Top 5 (Max-Heap)
            const heap = new MaxHeap();
            comicsConCalificacion.forEach(comic => {
                if (comic.calificacion > 0) heap.insert(comic);
            });
            setTopComics(heap.getTopK(5));

            // 3. Árbol N-ario (Catálogo Global)
            const nuevoArbol = new NaryTree();
            nuevoArbol.construirDesdeComics(catalogoComics);
            setArbol(nuevoArbol);

            // 4. Grafo Ponderado (Conexiones con Prioridad y Razón)
            const nuevoGrafo = new Graph();
            
            catalogoComics.forEach(comic => {
                nuevoGrafo.addNode(comic.id, { 
                    titulo: comic.titulo, 
                    autor: comic.autor, 
                    editorial: comic.editorial 
                });
            });

            for (let i = 0; i < catalogoComics.length; i++) {
                for (let j = i + 1; j < catalogoComics.length; j++) {
                    const c1 = catalogoComics[i];
                    const c2 = catalogoComics[j];
                    
                    let peso = 0;
                    let razones = [];

                    // 🔥 Prioridad 1: Mismo Autor (Peso 10)
                    if (c1.autor === c2.autor) {
                        peso += 10;
                        razones.push('Mismo Autor');
                    }

                    // 🔥 Prioridad 2: Misma Franquicia/Palabra en Título (Peso 5)
                    const palabras1 = c1.titulo.toLowerCase().split(/[\s:]+/);
                    const palabras2 = c2.titulo.toLowerCase().split(/[\s:]+/);
                    const palabrasComunes = palabras1.filter(p => p.length > 3 && palabras2.includes(p));
                    
                    if (palabrasComunes.length > 0) {
                        peso += 5;
                        razones.push('Misma Franquicia');
                    }

                    // 🔥 Prioridad 3: Misma Editorial (Peso 2)
                    if (c1.editorial === c2.editorial) {
                        peso += 2;
                        razones.push('Misma Editorial');
                    }

                    // Si hay alguna relación, agregamos la arista con la razón
                    if (peso > 0) {
                        nuevoGrafo.addEdge(c1.id, c2.id, peso, razones.join(' + '));
                    }
                }
            }
            setGrafo(nuevoGrafo);
        }
    }, [comicsState.userComics]);

    // ✅ Pila y Cola
    const marcarComoLeido = (comic) => {
        stack.push(comic);
        setHistorial(stack.getAll());
    };

    const deshacerUltimoLeido = () => {
        stack.pop();
        setHistorial(stack.getAll());
    };

    const agregarADeseos = (comic) => {
        queue.enqueue(comic);
        setDeseos(queue.getAll());
    };

    const leerSiguienteDeseo = () => {
        const siguiente = queue.dequeue();
        if (siguiente) {
            setDeseos(queue.getAll());
            stack.push(siguiente);
            setHistorial(stack.getAll());
        }
    };

    const eliminarDeDeseos = (id) => {
        const nuevaQueue = new Queue();
        queue.getAll().forEach(c => {
            if (c.id !== id) nuevaQueue.enqueue(c);
        });
        queue.items = nuevaQueue.items;
        setDeseos(queue.getAll());
    };

    return (
        <ComicContext.Provider value={{ 
            ...comicsState, 
            catalogoComics,
            topComics, 
            historial, 
            marcarComoLeido, 
            deshacerUltimoLeido,
            deseos, 
            agregarADeseos, 
            leerSiguienteDeseo, 
            eliminarDeDeseos,
            arbol,
            grafo
        }}>
            {children}
        </ComicContext.Provider>
    );
}