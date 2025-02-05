// # 表記揺れをどのように解決するか
// 例えば松本市という文字をタイピングさせるとき, 正解例としては
// [matsumoto,matumoto]と[si,shi]を組合せた
// 「matsumotoshi」や「matumotoshi」が正解となる
// 正解の配列を作成するメソッド → @src/services/cartesianProduct.ts cartesianProductは直積を意味する
// このメソッドから入手した正解の配列をTrieに挿入し, 正解文字列のノードを生成する
// ユーザーの入力とTrieのノードを比較し,一致する場合は次へ進む

class TrieNode {
  children: Map<string, TrieNode>;
  isWordEnd: boolean;

  constructor() {
    this.children = new Map();
    this.isWordEnd = false;
  }
}

class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  // 単語（文字列）を Trie に挿入するメソッド
  insert(words: string[]): void {
    for (const word of words) {
      let node = this.root;
      for (const char of word) {
        if (!node.children.has(char)) {
          node.children.set(char, new TrieNode());
        }
        node = node.children.get(char)!;
      }
      node.isWordEnd = true;
    }
  }

  // 与えられたプレフィックスの次に入力すべきノードを返すメソッド
  searchPrefix(prefix: string): TrieNode | null {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return null;
      }
      node = node.children.get(char)!;
    }
    return node;
  }

  // 渡された文字列の次に入力すべき文字を返すメソッド
  charAfter(char: string): string[] | null {
    const node = this.searchPrefix(char);
    if (!node) {
      return null;
    }

    if (node.isWordEnd) {
      return [];
    }

    return Array.from(node.children.keys());
  }
}

export default Trie;
