import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveStyle(style: Record<string, string>): R;
    }
  }
}

// Bunのexpectに対してjest-domのマッチャーを拡張
declare module 'bun:test' {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveStyle(style: Record<string, string>): R;
  }
} 