// src/estructuras/Graph.js
class Graph {
    constructor() {
        this.adjList = {}; // Lista de adyacencia
        this.nodesData = {}; // Datos de cada nodo (título, etc.)
    }

    // ✅ Agregar un nodo
    addNode(id, data = {}) {
        if (!this.adjList[id]) {
            this.adjList[id] = [];
            this.nodesData[id] = data;
        }
    }

    // ✅ Agregar una arista (conexión bidireccional)
    addEdge(node1, node2) {
        if (this.adjList[node1] && this.adjList[node2]) {
            // Evitar duplicados
            if (!this.adjList[node1].includes(node2)) {
                this.adjList[node1].push(node2);
            }
            if (!this.adjList[node2].includes(node1)) {
                this.adjList[node2].push(node1);
            }
        }
    }

    // ✅ Obtener los vecinos (conexiones) de un nodo
    getNeighbors(id) {
        return this.adjList[id] || [];
    }

    // ✅ Ver todos los datos de los nodos
    getNodesData() {
        return this.nodesData;
    }
}

export default Graph;