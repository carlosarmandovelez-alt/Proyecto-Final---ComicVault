import { createContext, useState, useEffect, useContext } from 'react';
import { useComics } from '../hooks/useComics';
import { catalogoComics } from '../data/catalogoComics';
import MaxHeap from '../estructuras/MaxHeap';
import Stack from '../estructuras/Stack';
import Queue from '../estructuras/Queue';
import { NaryTree } from '../estructuras/NaryTree';
import Graph from '../estructuras/Graph';
import { AuthContext } from './AuthContext';

export const ComicContext = createContext();

export function ComicProvider({ children }) {
    const { user } = useContext(AuthContext);
    const comicsState = useComics();
    
    const [topComics, setTopComics] = useState([]);
    const [arbol, setArbol] = useState(null);
    const [grafo, setGrafo] = useState(null);
    
    const [stack] = useState(new Stack());
    const [queue] = useState(new Queue());
    
    const [historial, setHistorial] = useState([]);
    const [deseos, setDeseos] = useState([]);

    // Cargar datos del usuario al iniciar
    useEffect(() => {
        if (user) {
            comicsState.getUserComics(user.uid);
        } else {
            setHistorial([]);
            setDeseos([]);
            stack.items = [];
            queue.items = [];
        }
    }, [user]);

    //  Reconstruir Pila y Cola cuando se cargan las listas
    useEffect(() => {
        if (comicsState.userLists) {
            stack.items = [];
            queue.items = [];

            comicsState.userLists.deseos.forEach(comic => queue.enqueue(comic));
            setDeseos(queue.getAll());

            comicsState.userLists.historial.forEach(comic => stack.push(comic));
            setHistorial(stack.getAll());
        }
    }, [comicsState.userLists]);

    // Calcular Heap, Árbol y Grafo
    useEffect(() => {
        if (catalogoComics.length > 0) {
            // 1. Top 5 (Max-Heap)
            const comicsConCalificacion = catalogoComics.map(comic => {
                const interaccion = comicsState.userComics.find(uc => uc.comicId === comic.id);
                return {
                    ...comic,
                    calificacion: interaccion?.calificacion || 0
                };
            });

            const heap = new MaxHeap();
            comicsConCalificacion.forEach(comic => {
                if (comic.calificacion > 0) heap.insert(comic);
            });
            setTopComics(heap.getTopK(5));

            // 2. Árbol N-ario
            const nuevoArbol = new NaryTree();
            nuevoArbol.construirDesdeComics(catalogoComics);
            setArbol(nuevoArbol);

            // 3. Grafo Ponderado
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

                    if (c1.autor === c2.autor) { peso += 10; razones.push('Mismo Autor'); }
                    
                    const palabras1 = c1.titulo.toLowerCase().split(/[\s:]+/);
                    const palabras2 = c2.titulo.toLowerCase().split(/[\s:]+/);
                    if (palabras1.some(p => p.length > 3 && palabras2.includes(p))) { 
                        peso += 5; 
                        razones.push('Misma Franquicia'); 
                    }
                    
                    if (c1.editorial === c2.editorial) { peso += 2; razones.push('Misma Editorial'); }

                    if (peso > 0) nuevoGrafo.addEdge(c1.id, c2.id, peso, razones.join(' + '));
                }
            }
            setGrafo(nuevoGrafo);
        }
    }, [comicsState.userComics]);

    // PILA (Historial) con persistencia
    const marcarComoLeido = async (comic) => {
        if (!user) return;
        if (!stack.isEmpty() && stack.peek().id === comic.id) return;

        stack.push(comic);
        const nuevoHistorial = stack.getAll();
        setHistorial(nuevoHistorial);

        // Guardar en listas (Pila)
        await comicsState.saveUserLists(user.uid, {
            deseos: deseos,
            historial: nuevoHistorial
        });

        // Guardar en user_comics como leído
        await comicsState.saveReadStatus(user.uid, comic.id, true);
    };

    const deshacerUltimoLeido = async () => {
        if (!user) return;
        stack.pop();
        const nuevoHistorial = stack.getAll();
        setHistorial(nuevoHistorial);
        await comicsState.saveUserLists(user.uid, { 
            deseos, 
            historial: nuevoHistorial 
        });
    };

    // COLA (Deseos) con persistencia y feedback
    const agregarADeseos = async (comic) => {
        if (!user) return;

        const yaExiste = queue.getAll().some(c => c.id === comic.id);
        if (yaExiste) {
            alert('Este cómic ya está en tu lista de deseos.');
            return false;
        }

        queue.enqueue(comic);
        const nuevosDeseos = queue.getAll();
        setDeseos(nuevosDeseos);

        await comicsState.saveUserLists(user.uid, {
            deseos: nuevosDeseos,
            historial: historial
        });
        return true;
    };

    const leerSiguienteDeseo = async () => {
        if (!user) return;
        const siguiente = queue.dequeue();
        if (siguiente) {
            const nuevosDeseos = queue.getAll();
            setDeseos(nuevosDeseos);
            
            stack.push(siguiente);
            const nuevoHistorial = stack.getAll();
            setHistorial(nuevoHistorial);

            await comicsState.saveUserLists(user.uid, {
                deseos: nuevosDeseos,
                historial: nuevoHistorial
            });

            //marcar como leído
            await comicsState.saveReadStatus(user.uid, siguiente.id, true);
        }
    };

    const eliminarDeDeseos = async (id) => {
        if (!user) return;
        const nuevaQueue = new Queue();
        queue.getAll().forEach(c => {
            if (c.id !== id) nuevaQueue.enqueue(c);
        });
        queue.items = nuevaQueue.items;
        const nuevosDeseos = queue.getAll();
        setDeseos(nuevosDeseos);

        await comicsState.saveUserLists(user.uid, {
            deseos: nuevosDeseos,
            historial: historial
        });
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