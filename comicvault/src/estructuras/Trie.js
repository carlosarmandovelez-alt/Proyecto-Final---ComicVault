class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.comicId = null; 
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word, comicId) {
        let current = this.root;
        const lowerWord = word.toLowerCase();
        for (const char of lowerWord) {
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }
            current = current.children[char];
        }
        current.isEndOfWord = true;
        current.comicId = comicId;
    }

    // Buscar todas las palabras que empiecen con un prefijo
    searchByPrefix(prefix) {
        let current = this.root;
        const lowerPrefix = prefix.toLowerCase();
        for (const char of lowerPrefix) {
            if (!current.children[char]) return [];
            current = current.children[char];
        }
        const results = [];
        this._collect(current, results);
        return results;
    }

    _collect(node, results) {
        if (node.isEndOfWord) {
            results.push(node.comicId);
        }
        for (const char in node.children) {
            this._collect(node.children[char], results);
        }
    }
}

export default Trie;