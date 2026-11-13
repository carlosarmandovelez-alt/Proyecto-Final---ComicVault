// src/estructuras/NaryTree.js
class Nodo {
    constructor(valor, tipo) {
        this.valor = valor;
        this.tipo = tipo; // 'editorial', 'autor' o 'comic'
        this.hijos = [];
    }

    agregarHijo(nodo) {
        this.hijos.push(nodo);
    }
}

class NaryTree {
    constructor() {
        this.raiz = new Nodo('Mi Colección', 'raiz');
    }

    // ✅ Este es el método que falta o está mal guardado
    construirDesdeComics(comics) {
        this.raiz = new Nodo('Mi Colección', 'raiz');

        comics.forEach(comic => {
            // 1. Buscar o crear la editorial
            let editorialNodo = this.raiz.hijos.find(h => h.valor === comic.editorial && h.tipo === 'editorial');
            if (!editorialNodo) {
                editorialNodo = new Nodo(comic.editorial, 'editorial');
                this.raiz.agregarHijo(editorialNodo);
            }

            // 2. Buscar o crear el autor dentro de la editorial
            let autorNodo = editorialNodo.hijos.find(h => h.valor === comic.autor && h.tipo === 'autor');
            if (!autorNodo) {
                autorNodo = new Nodo(comic.autor, 'autor');
                editorialNodo.agregarHijo(autorNodo);
            }

            // 3. Agregar el cómic al autor
            const comicNodo = new Nodo(comic, 'comic');
            autorNodo.agregarHijo(comicNodo);
        });
    }
}

export { Nodo, NaryTree };