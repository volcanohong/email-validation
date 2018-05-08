import {Trie} from './trie';

let emails = ['gmail.com', 'yahoo.com', 'google.com'];
let trie;

beforeEach(() => {
    trie = new Trie();
    emails.forEach(function (email) {
        return trie.add(email);
    });
});

test("get words", function () {
    expect(trie.getWords().length).toBe(emails.length);
});

test("remove words", function () {
    trie.remove(emails[0]);
    expect(trie.getWords().length).toBe(emails.length - 1);
});

test("get words by prefix", function () {
    let words = trie.getWordsByPrefix('g');
    expect(words.length).toBe(emails.length - 1);
});




