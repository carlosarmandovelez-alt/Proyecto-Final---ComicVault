// src/estructuras/Graph.js
class Graph {
    constructor() {
        // { idNodo: [{ id: idVecino, peso: 10, razon: 'Mismo Autor' }, ...] }
        this.adjList = {}; 
        this.nodesData = {};
    }

    addNode(id, data = {}) {
        if (!this.adjList[id]) {
            this.adjList[id] = [];
            this.nodesData[id] = data;
        }
    }

    // ✅ Agregar arista con PESO y RAZÓN
    addEdge(node1, node2, peso = 1, razon = 'Relacionado') {
        if (this.adjList[node1] && this.adjList[node2]) {
            // Actualizar o agregar para node1
            const existe1 = this.adjList[node1].find(e => e.id === node2);
            if (existe1) {
                if (peso > existe1.peso) {
                    existe1.peso = peso;
                    existe1.razon = razon;
                }
            } else {
                this.adjList[node1].push({ id: node2, peso, razon });
            }

            // Actualizar o agregar para node2 (bidireccional)
            const existe2 = this.adjList[node2].find(e => e.id === node1);
            if (existe2) {
                if (peso > existe2.peso) {
                    existe2.peso = peso;
                    existe2.razon = razon;
                }
            } else {
                this.adjList[node2].push({ id: node1, peso, razon });
            }
        }
    }

    // ✅ Obtener vecinos ORDENADOS por peso (mayor a menor)
    getNeighborsSorted(id) {
        const vecinos = this.adjList[id] || [];
        // Retorna una copia ordenada para no mutar el original
        return [...vecinos].sort((a, b) => b.peso - a.peso);
    }

    getNodesData() {
        return this.nodesData;
    }
}

export default Graph;