function cartesianProduct(arrays: string[][]): string[] {
  return arrays.reduce<string[]>(
    (acc, currArray) => {
      const newAcc: string[] = [];
      for (const prefix of acc) {
        for (const element of currArray) {
          newAcc.push(prefix + element);
        }
      }
      return newAcc;
    },
    [""]
  ); // 初期値は空文字列
}

export default cartesianProduct;
