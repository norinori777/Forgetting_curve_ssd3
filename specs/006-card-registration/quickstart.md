# Quickstart: カード登録画面

## Prerequisites

- PostgreSQL が起動していること
- `backend/.env` で `DATABASE_URL` が設定されていること
- 依存関係がインストール済みであること

## Setup

1. バックエンドの依存関係を確認する。

   ```bash
   cd backend
   npm install
   ```

2. フロントエンドの依存関係を確認する。

   ```bash
   cd frontend
   npm install
   ```

3. Prisma のマイグレーションを適用する。

   ```bash
   cd backend
   npx prisma migrate dev
   ```

## Run

1. バックエンドを起動する。

   ```bash
   cd backend
   npm run dev
   ```

2. フロントエンドを起動する。

   ```bash
   cd frontend
   npm run dev
   ```

3. ログイン後にカード登録画面へ移動し、`/cards/new` を開く。

## Verify

1. バックエンドのテストと静的チェックを実行する。

   ```bash
   cd backend
   npm test
   npm run lint
   npm run typecheck
   ```

2. フロントエンドのテストと静的チェックを実行する。

   ```bash
   cd frontend
   npm test
   npm run lint
   npm run typecheck
   ```

## Expected Outcome

- 個別登録フォームが表示される
- 保存前に復習予定を確認できる
- 送信失敗時に入力内容を保持したまま再試行できる
