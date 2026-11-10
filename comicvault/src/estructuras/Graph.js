class Graph {
    constructor() {
        this.nodes = [];
        this.adjList = {};
        this.nodeData = {};
    }

    addNode(id, data = {}) {
        if (!this.searchNode(id)) {
            this.nodes.push(id);
            this.adjList[id] = [];
            this.nodeData[id] = data;
        }
    }

    addEdge(nodo1, nodo2) {
        this.adjList[nodo1].push(nodo2);
        this.adjList[nodo2].push(nodo1);
    }

    searchNode(id) {
        return this.nodes.find(n => n === id);
    }

    getAdjacency(id) {
        return this.adjList[id] || [];
    }

    toD3Format() {
        const nodes = this.nodes.map(id => ({
            id: id,
            ...this.nodeData[id]
        }));

        const links = [];
        const visited = new Set();

        this.nodes.forEach(id => {
            this.adjList[id].forEach(vecino => {
                const edgeKey = [id, vecino].sort().join('-');
                if (!visited.has(edgeKey)) {
                    visited.add(edgeKey);
                    links.push({ source: id, target: vecino });
                }
            });
        });

        return { nodes, links };
    }
}

export default Graph;