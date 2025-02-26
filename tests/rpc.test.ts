import { describe, test, expect } from 'bun:test';
import { z } from 'zod';

// テスト用のスキーマ
const schema = z.object({
  name: z.string(),
  age: z.number(),
});

// レスポンスの型定義
interface MockResponse<T> {
  status: number;
  data: T;
}

// モックレスポンス関数
function createMockResponse<T>(status: number, data: T): MockResponse<T> {
  return {
    status,
    data
  };
}

describe('スキーマ検証のテスト', () => {
  test('正しいスキーマ検証', async () => {
    const validData = { name: 'テスト', age: 25 };
    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test('バリデーションエラー処理', async () => {
    const invalidData = { name: 'テスト', age: '25' }; // ageが文字列
    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  test('モックRPCハンドラーが正しく動作する', async () => {
    // モックRPCハンドラー
    const mockHandler = async (data: { name: string; age: number | string }) => {
      // スキーマ検証をシミュレート
      const result = schema.safeParse(data);
      
      if (!result.success) {
        return createMockResponse(400, { error: 'バリデーションエラー' });
      }
      
      const { name, age } = result.data;
      return createMockResponse(200, { message: `こんにちは、${name}さん（${age}歳）` });
    };

    // 有効なデータでテスト
    const response = await mockHandler({ name: 'テスト', age: 25 });
    
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ message: 'こんにちは、テストさん（25歳）' });
    
    // 無効なデータでテスト
    const errorResponse = await mockHandler({ name: 'テスト', age: '25' });
    
    expect(errorResponse.status).toBe(400);
    expect(errorResponse.data).toEqual({ error: 'バリデーションエラー' });
  });
}); 