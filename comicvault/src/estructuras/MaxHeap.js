class MaxHeap {
    constructor() {
        this.items = [];
    }

    insertar(item) {
        this.items.push(item);
        this.subir(this.items.length - 1);
    }

    extraerMax() {
        if (this.items.length === 0) return null;
        const max = this.items[0];
        const ultimo = this.items.pop();
        if (this.items.length > 0) {
            this.items[0] = ultimo;
            this.bajar(0);
        }
        return max;
    }

    subir(i) {
        while (i > 0) {
            const padre = Math.floor((i - 1) / 2);
            if (this.items[i].puntuacion <= this.items[padre].puntuacion) break;
            [this.items[i], this.items[padre]] = [this.items[padre], this.items[i]];
            i = padre;
        }
    }

    bajar(i) {
        const n = this.items.length;
        while (true) {
            let mayor = i;
            const izq = 2 * i + 1;
            const der = 2 * i + 2;

            if (izq < n && this.items[izq].puntuacion > this.items[mayor].puntuacion) mayor = izq;
            if (der < n && this.items[der].puntuacion > this.items[mayor].puntuacion) mayor = der;
            if (mayor === i) break;

            [this.items[i], this.items[mayor]] = [this.items[mayor], this.items[i]];
            i = mayor;
        }
    }

    getTop(n = 10) {
        const copia = new MaxHeap();
        copia.items = [...this.items];
        const top = [];
        for (let i = 0; i < n && !copia.isEmpty(); i++) {
            top.push(copia.extraerMax());
        }
        return top;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }
}

export default MaxHeap;