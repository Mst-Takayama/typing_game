import { afterEach, expect } from 'bun:test';
import { cleanup } from '@testing-library/react';
import { JSDOM } from 'jsdom';
import * as matchers from '@testing-library/jest-dom/matchers';

// JSDOMを使用してDOMをシミュレート
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
});

// グローバルオブジェクトにDOMプロパティを設定
global.window = dom.window as unknown as Window & typeof globalThis;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// その他のDOM APIをグローバルに設定
global.HTMLElement = dom.window.HTMLElement;
global.HTMLButtonElement = dom.window.HTMLButtonElement;
global.HTMLDivElement = dom.window.HTMLDivElement;
global.HTMLSpanElement = dom.window.HTMLSpanElement;
global.HTMLInputElement = dom.window.HTMLInputElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.Text = dom.window.Text;
global.Event = dom.window.Event;
global.getComputedStyle = dom.window.getComputedStyle;

// Testing Libraryのmatchersを拡張
expect.extend(matchers);

// テスト後にReactコンポーネントをクリーンアップ
afterEach(() => {
  cleanup();
}); 