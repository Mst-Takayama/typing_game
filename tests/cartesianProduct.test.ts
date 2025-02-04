import cartesianProduct from "../src/services/cartesianProduct";
import { expect, test, describe } from "bun:test";

describe("文字配列の直積のテスト", () => {
  test("少林寺拳法", () => {
    const data = [
      {
        statement: "少林寺拳法",
        alphabet: [["syourin", "shourin"], ["zi", "ji"], ["kenpou"]],
      },
    ];
    const result = cartesianProduct(data[0].alphabet);
    expect(result).toEqual([
      "syourinzikenpou",
      "syourinjikenpou",
      "shourinzikenpou",
      "shourinjikenpou",
    ]);
  });

  test("松本市", () => {
    const data = [
      {
        statement: "松本市",
        alphabet: [["matsumoto", "matumoto"], ["shi", "si"]],
      },
    ];
    const result = cartesianProduct(data[0].alphabet);
    expect(result).toEqual([
      "matsumotoshi",
      "matsumotosi",
      "matumotoshi",
      "matumotosi",
    ]);
  });

  test("表記揺れがない場合", () => {
    const data = [
      {
        statement: "犬も歩けば棒に当たる",
        alphabet: [["inumoarukebabouniataru"]],
      },
    ];
    const result = cartesianProduct(data[0].alphabet);
    expect(result).toEqual(["inumoarukebabouniataru"]);
  });
});
