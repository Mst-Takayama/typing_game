import { createAppWithRedis } from "@/app/utils/factory";

const app = createAppWithRedis();

app.get("/", (c) => {
  return c.json({ message: "ok" });
});

export default app;
