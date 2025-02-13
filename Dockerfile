# ベースイメージとしてBun公式のイメージを使用
FROM oven/bun:latest

# 作業ディレクトリを設定
WORKDIR /app

# パッケージマネージャーの設定
ENV NPM_CONFIG_REGISTRY=https://registry.npmjs.org/

# アプリケーションの依存関係をインストール
COPY package.json bun.lock ./
RUN bun install

# アプリケーションのソースコードをコピー
COPY . .

# 環境変数の設定（必要に応じて）
ENV NODE_ENV=production

# アプリケーションのビルド（必要に応じて）
RUN bun run build

# アプリケーションが使用するポートを公開
EXPOSE 3000

# アプリケーションの起動コマンド
CMD ["bun", "run", "start"]
