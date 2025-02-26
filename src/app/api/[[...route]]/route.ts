import { createAppWithRedis } from "@/app/utils/factory";
import { handle } from "hono/vercel";
import registerHealthCheckRoutes from "@/features/healthCheck/route";
import registerResultRoutes from "@/features/result/route";
import registerQuestionsRoutes from "@/features/questions/route";
// import { showRoutes } from 'hono/dev'

const app = createAppWithRedis().basePath("/api");

registerHealthCheckRoutes(app);
registerResultRoutes(app);
registerQuestionsRoutes(app);
// ルーティングを確認したいときに使用
// showRoutes(app);

export const GET = handle(app);
export const POST = handle(app);

// RPCクライアント生成用にアプリの型をエクスポート
export type AppType = typeof app;
