// タイピングゲームで表示する問題をupstashに保存する
import redis from "@/lib/redis";
import fs from "fs/promises";
import path from "path";

const seed = async () => {
  const data = await fs.readFile(
    path.join(__dirname, "../data/statement.json")
  );
  const json = JSON.parse(data.toString());
  redis.set("statement", json);
};

seed();
