import Trie from "../src/services/judge";
import { expect, test, describe } from "bun:test";

describe("入力文字列正誤判定テスト", () => {
  test("次に表示すべき文字が単一の場合", () => {
    const trie = new Trie();
    trie.insert(["matsu", "matu"]);
    expect(trie.charAfter("ma")).toEqual(["t"]);
  });

  test("次に表示すべき文字が複数ある場合", () => {
    const trie = new Trie();
    trie.insert(["matsu", "matu"]);
    expect(trie.charAfter("mat")).toEqual(["s", "u"]);
  });

  test("最後まで文字を入力した場合", () => {
    const trie = new Trie();
    trie.insert(["matsu", "matu"]);
    expect(trie.charAfter("matsu")).toEqual([]);
  });

  test("入力を間違えた場合", () => {
    const trie = new Trie();
    trie.insert(["matsu", "matu"]);
    expect(trie.charAfter("mate")).toBeNull();
    expect(trie.charAfter("i")).toBeNull();
  });

  test("一番最初の入力の場合", () => {
    const trie = new Trie();
    trie.insert(["matsu", "matu"]);
    expect(trie.charAfter("")).toEqual(["m"]);
  });
});
