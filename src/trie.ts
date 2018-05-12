//Trie algorithm for words match
class Knode {
    private data: string;
    private prefix: number;
    private isWord: boolean;
    private weight: number;
    private children: any;

    constructor(data: string) {
        this.data = data;
        this.isWord = false;
        this.prefix = 0;
        this.weight = 0;
        this.children = {};
    }
}

export class Trie {
    private root: Knode;

    constructor() {
        this.root = new Knode('');
    }

    public add(word: string) {
        if (!this.root) return;
        this._add(this.root, word);
    }

    public remove(word: string) {
        if (!this.root) return;
        if (this.contains(word))
            this._remove(this.root, word);
    }

    public contains(word): boolean {
        if (!this.root) return false;
        return this._contains(this.root, word);
    }

    public getWords() {
        let words = [];
        this._getWords(this.root, words, '');
        return words;
    }

    public getWordsByPrefix(str: string) {
        if (!this.root || !str) return [];
        let words = [];
        this._getWordsByPrefix(this.root, words, '', str);
        return words;
    }

    public getNode(node, word, idx) {
        if (idx === word.length - 1) return node.children[word.charAt(idx)];
        else return this.getNode(node.children[word.charAt(idx)], word, ++idx);
    }

    private _add(node, word) {
        if (!node || !word) return;
        node.prefix++;
        let letter = word.charAt(0);
        let child = node.children[letter];
        if (!child) {
            child = new Knode(letter);
            node.children[letter] = child;
        }
        let reStr = word.substring(1);
        if (!reStr) child.isWord = true;
        this._add(child, reStr);
    }

    private _remove(node, word) {
        if (!node || !word) return;
        node.prefix--;
        let letter = word.charAt(0);
        let child = node.children[letter];
        if (child) {
            let reStr = word.substring(1);
            if (reStr) {
                if (child.prefix === 1) {
                    delete node.children[letter];
                } else {
                    this._remove(child, reStr);
                }
            } else {
                if (child.prefix === 0) {
                    delete node.children[letter];
                } else {
                    child.isWord = false;
                }
            }
        }
    }

    private _contains(node, word): boolean {
        if (!node || !word) return false;
        let letter = word.charAt(0);
        let child = node.children[letter];
        if (child) {
            let remainder = word.substring(1);
            if (!remainder && child.isWord) {
                return true;
            } else {
                return this._contains(child, remainder);
            }
        } else {
            return false;
        }
    }

    private _getWords(node, words, word) {
        for (let child in node.children) {
            if (node.children.hasOwnProperty(child)) {
                word += child;
                if (node.children[child].isWord) {
                    words.push(word);
                }
                this._getWords(node.children[child], words, word);
                word = word.substring(0, word.length - 1);
            }
        }
    }

    private _getWordsByPrefix(node, words, word, str) {
        if (!node) return;
        let len = word.length;
        if (len < str.length) {
            word += str.charAt(len);
            this._getWordsByPrefix(node.children[str.charAt(len)], words, word, str);
        } else {
            this._getWords(node, words, word);
        }
    }
}

