import { createAppWithRedis } from "@/app/utils/factory";
import { handle } from "hono/vercel";
import healthCheck from "@/features/healthCheck/route";
// import { showRoutes } from 'hono/dev'

const app = createAppWithRedis().basePath("/api");

app.route("/health_check", healthCheck);

// ルーティングを確認したいときに使用
// showRoutes(app);
  
export const GET = handle(app);
export const POST = handle(app);

