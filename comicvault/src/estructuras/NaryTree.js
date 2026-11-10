class Nodo {
    constructor(data) {
        this.data = data;      // { nombre, tipo, imagen, ... }
        this.hijos = [];
    }

    agregarHijo(nodo) {
        this.hijos.push(nodo);
    }
}

class NaryTree {
    constructor() {
        this.raiz = null;
    }

    setRaiz(nodo) {
        this.raiz = nodo;
    }

    dfs(nodo = this.raiz, resultado = []) {
        if (!nodo) return resultado;
        resultado.push(nodo);
        for (const hijo of nodo.hijos) {
            this.dfs(hijo, resultado);
        }
        return resultado;
    }

    bfs() {
        if (!this.raiz) return [];
        const resultado = [];
        const cola = [this.raiz];
        while (cola.length > 0) {
            const actual = cola.shift();
            resultado.push(actual);
            for (const hijo of actual.hijos) {
                cola.push(hijo);
            }
        }
        return resultado;
    }
}

export { Nodo, NaryTree };