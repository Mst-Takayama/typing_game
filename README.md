# タイピングゲーム

このプロジェクトは、日本語のタイピング練習ができるWebアプリケーションです。Next.jsとHonoを使用して構築されており、モダンなUI/UXを提供します。

## 技術スタック

- [Next.js](https://nextjs.org) - Reactフレームワーク
- [Hono](https://hono.dev) - 軽量で高速なWebフレームワーク
- [Tailwind CSS](https://tailwindcss.com) - ユーティリティファーストのCSSフレームワーク
- [TypeScript](https://www.typescriptlang.org) - 型安全なJavaScript
- [Bun](https://bun.sh) - 高速なJavaScriptランタイムとパッケージマネージャー

## 開発環境

このプロジェクトは以下の開発環境をサポートしています：

### Cursor / VS Code + Devcontainer

`.devcontainer`ディレクトリが含まれているため、CursorやVS Codeでコンテナを作成して開発することができます。これにより、一貫した開発環境を簡単に構築できます。

### Cursorルール

`.cursor/rules`ディレクトリには、Cursor AIアシスタントのためのカスタムルールが含まれています：

- `next.mdc` - Next.jsに関するルール
- `hono.mdc` - Honoに関するルール

これらのルールにより、AIアシスタントがプロジェクト固有のコードパターンを理解し、より適切な提案を行うことができます。

## データ

`data/statement.json`ファイルには、タイピングゲームで使用される問題文が含まれています。このデータはSupabaseに保存され、アプリケーションから取得されます。

## 始め方

開発サーバーを起動するには：

```bash
# 依存関係のインストール
bun install

# 開発サーバーの起動
bun dev
```

[http://localhost:3000](http://localhost:3000)をブラウザで開くと、アプリケーションが表示されます。

## テスト

テストを実行するには：

```bash
bun test
```

## デプロイ

このアプリケーションは[Vercel](https://vercel.com)にデプロイすることができます。詳細については[Next.jsデプロイドキュメント](https://nextjs.org/docs/app/building-your-application/deploying)を参照してください。
