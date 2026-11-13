// src/estructuras/MaxHeap.js
class MaxHeap {
    constructor() {
        this.heap = [];
    }

    // ✅ Insertar un cómic basado en su calificación
    insert(comic) {
        this.heap.push(comic);
        this.percolateUp();
    }

    // ✅ Extraer el cómic con mejor calificación
    extractMax() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const max = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.percolateDown(0);
        return max;
    }

    percolateUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            // Si el hijo tiene más calificación que el padre, se intercambian
            if (this.heap[index].calificacion > this.heap[parentIndex].calificacion) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    percolateDown(index) {
        const length = this.heap.length;
        let largest = index;
        const left = 2 * index + 1;
        const right = 2 * index + 2;

        if (left < length && this.heap[left].calificacion > this.heap[largest].calificacion) {
            largest = left;
        }
        if (right < length && this.heap[right].calificacion > this.heap[largest].calificacion) {
            largest = right;
        }

        if (largest !== index) {
            this.swap(index, largest);
            this.percolateDown(largest);
        }
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    // ✅ Obtener los K mejores sin destruir el Heap original
    getTopK(k) {
        const copia = new MaxHeap();
        copia.heap = [...this.heap];
        
        const topK = [];
        for (let i = 0; i < k && copia.heap.length > 0; i++) {
            topK.push(copia.extractMax());
        }
        return topK;
    }
}

export default MaxHeap;