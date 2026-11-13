// src/context/ComicContext.jsx
import { createContext, useState, useEffect } from 'react';
import { useComics } from '../hooks/useComics';
import MaxHeap from '../estructuras/MaxHeap';
import Stack from '../estructuras/Stack';
import Queue from '../estructuras/Queue';
import { NaryTree } from '../estructuras/NaryTree';
import Graph from '../estructuras/Graph'; // ✅ Importar Grafo

export const ComicContext = createContext();

export function ComicProvider({ children }) {
    const comicsState = useComics();
    
    // Estados de las estructuras
    const [topComics, setTopComics] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [deseos, setDeseos] = useState([]);
    const [arbol, setArbol] = useState(null);
    const [grafo, setGrafo] = useState(null); // ✅ Estado del Grafo
    
    // Instancias
    const [stack] = useState(new Stack());
    const [queue] = useState(new Queue());

    // ✅ Recalcular estructuras cuando cambien los cómics
    useEffect(() => {
        if (comicsState.comics.length > 0) {
            // 1. Max-Heap (Top 5)
            const heap = new MaxHeap();
            comicsState.comics.forEach(comic => {
                if (comic.calificacion > 0) heap.insert(comic);
            });
            setTopComics(heap.getTopK(5));

            // 2. Árbol N-ario (Explorador)
            const nuevoArbol = new NaryTree();
            nuevoArbol.construirDesdeComics(comicsState.comics);
            setArbol(nuevoArbol);

            // 3. Grafo (Conexiones por Autor/Editorial)
            const nuevoGrafo = new Graph();
            
            // Agregar todos los nodos
            comicsState.comics.forEach(comic => {
                nuevoGrafo.addNode(comic.id, { titulo: comic.titulo, autor: comic.autor, editorial: comic.editorial });
            });

            // Conectar si comparten autor o editorial
            for (let i = 0; i < comicsState.comics.length; i++) {
                for (let j = i + 1; j < comicsState.comics.length; j++) {
                    const c1 = comicsState.comics[i];
                    const c2 = comicsState.comics[j];

                    if (c1.autor === c2.autor || c1.editorial === c2.editorial) {
                        nuevoGrafo.addEdge(c1.id, c2.id);
                    }
                }
            }
            setGrafo(nuevoGrafo);

        } else {
            setTopComics([]);
            setArbol(null);
            setGrafo(null);
        }
    }, [comicsState.comics]);

    // ... (Funciones de Pila y Cola igual que antes)
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
            topComics, 
            historial, 
            marcarComoLeido, 
            deshacerUltimoLeido,
            deseos, 
            agregarADeseos, 
            leerSiguienteDeseo, 
            eliminarDeDeseos,
            arbol,
            grafo // ✅ Exportar Grafo
        }}>
            {children}
        </ComicContext.Provider>
    );
}