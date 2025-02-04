import { createAppWithRedis } from "@/app/utils/factory";
import { handle } from "hono/vercel";
import registerHealthCheckRoutes from "@/features/healthCheck/route";
import registerResultRoutes from "@/features/result/route";
// import { showRoutes } from 'hono/dev'

const app = createAppWithRedis().basePath("/api");

registerHealthCheckRoutes(app);
registerResultRoutes(app);

// ルーティングを確認したいときに使用
// showRoutes(app);

export const GET = handle(app);
export const POST = handle(app);
