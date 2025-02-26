import { hc } from 'hono/client';
import type { AppType } from '@/app/api/[[...route]]/route';

// 型安全なHonoクライアントを作成
export const client = hc<AppType>('/api');

// 型計算を事前に行うためのトリック
// これにより、IDEのパフォーマンスが向上する
export type Client = typeof client;

// 型付きクライアントを返す関数
export const getTypedClient = (): Client => client; 