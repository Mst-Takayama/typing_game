// # 表記揺れをどのように解決するか
// 例えば松本市という文字をタイピングさせるとき, 正解例としては
// [matsumoto,matumoto]と[si,shi]を組合せた
// 「matsumotoshi」や「matumotoshi」が正解となる
// 正解の配列を作成するメソッド → @src/services/cartesianProduct.ts cartesianProductは直積を意味する
// このメソッドから入手した正解の配列をTrieに挿入し, 正解文字列のノードを生成する
// ユーザーの入力とTrieのノードを比較し,一致する場合は次へ進む
import cartesianProduct  from "./cartesianProduct";

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
  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isWordEnd = true;
  }

  // プレフィックスに沿ったノードを返す（存在しなければ null）
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
}

// 利用例
const trie = new Trie();
const data = [
  {
    statement: "松本市",
    alphabet: [["matsu", "matumoto"], ["shi", "machi"]],
  },
];
const correct = cartesianProduct(data[0].alphabet); 


correct.forEach((word) => {
  trie.insert(word);
});

const prefixNode = trie.searchPrefix("mat");
if (prefixNode) {
  // prefixNode.children により、次に期待できる文字群が取得可能
  console.log("次の文字候補:", Array.from(prefixNode.children.keys()));
} else {
  console.log("そのプレフィックスは存在しません");
}

console.log(prefixNode); 