/**
 * 複数の文字列配列の直積（全組み合わせ）を生成する関数
 * @param arrays - 各部分の表記揺れを格納した文字列配列の配列
 * @returns 各組み合わせを結合した文字列の配列
 */

function cartesianProduct(arrays: string[][]): string[] {
  return arrays.reduce<string[]>((acc, currArray) => {
    const newAcc: string[] = [];
    for (const prefix of acc) {
      for (const element of currArray) {
        newAcc.push(prefix + element);
      }
    }
    return newAcc;
  }, [""]); // 初期値は空文字列
}


export default cartesianProduct;