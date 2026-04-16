# Quickstart: ログイン/サインアップ永続化

## Prerequisites

- Node.js と npm が利用できること
- PostgreSQL 接続設定が `backend` 側で用意されていること
- Prisma のマイグレーションを適用できること

## Setup

1. `backend` ディレクトリで依存関係を確認する
2. Prisma スキーマを適用する
3. backend のテストを実行する

## Commands

```bash
cd backend
npm test
npm run lint
```

## Verification

- サインアップ成功時に `User` と `Session` が DB に作成されることを確認する
- ログイン成功時に既存 `User` を参照し、新しい `Session` が発行されることを確認する
- 重複メールは登録失敗になることを確認する

## Notes

- 既存の API 契約は `specs/005-scr-01-spec/contracts/login.openapi.yaml` を参照する
- UI 変更が必要な場合は、別途 frontend 側の確認を追加する# Quickstart: ログイン画面（SCR-01）

## 1. 前提

- Feature branch: 005-scr-01-spec
- 参照仕様: [specs/005-scr-01-spec/spec.md](spec.md)
- 画面デザイン参照: [docs/login-screen-ascii-ui.md](../../docs/login-screen-ascii-ui.md)
- デザイントークン参照: [design/design-tokens.md](../../design/design-tokens.md)

## 2. 実装ステップ（推奨順）

1. API 契約を先に固定する

- [contracts/login.openapi.yaml](contracts/login.openapi.yaml) を基準として `POST /auth/login` の I/O を実装

2. バックエンド実装

- 入力検証: email 必須・形式、password 8-64
- 正規化: email は trim + lowercase
- 認証: 既存ユーザーの passwordHash と照合
- レート制限: normalized email + IP で 5 req/min
- セッション: 成功時に 24 時間有効のセッションを発行
- 失敗分岐: 401 / 429 / 500 を UI へ返却

3. フロントエンド実装

- 状態管理: initial, validation_error, submitting, success, failure, locked
- 項目エラー: 各入力欄近傍に表示
- 画面上部エラー: 認証失敗 / 通信失敗 / ロックの要約表示
- 送信中: ボタン無効化で多重送信防止
- 成功時: returnTo があれば優先、なければダッシュボードへ遷移

## 3. テスト観点（必須）

### Frontend (testing.frontend + testing.core)

- 状態分岐: loading / error / success / locked
- 入力境界:
  - password 7/8/64/65 文字
  - email 前後空白あり
  - Enter キー送信
- 失敗系:
  - 401 認証失敗
  - 429 制限超過（Retry 導線）
  - 500 一時障害（再試行導線）
- アクセシビリティ:
  - label と input の関連
  - エラー文言の読み上げ可能性（aria-live 等）

### Backend (testing.backend + testing.core)

- 認可系: 未認証保護画面アクセス時の `/login` 誘導
- バリデーション分岐: 形式、必須、長さ
- レート制限境界:
  - 1分内 5 回成功、6 回目拒否
- 認証失敗境界:
  - 不正なメール/パスワードで 401
  - 失敗理由を詳細化しない
- トランザクション:
  - セッション作成失敗時に UserSession が残らない

## 4. 完了条件

- spec の FR-001 から FR-019 を満たすこと
- API 契約テストが通ること
- UI の主要状態遷移テストが通ること
- lint / typecheck / test が CI で成功すること
- 既ログイン時に `/login` がダッシュボードへ自動誘導されること
- `/auth/login` の p95 が 2 秒以下であること

## 5. E2E確認手順

1. 未認証状態で `/login` を開く
2. `email` と `password` を有効値で入力して送信する
3. 200 応答とセッション開始を確認し、`/dashboard` へ遷移することを確認する
4. 同じメールで誤パスワードを送信し、401 と汎用エラー表示を確認する
5. 1分間に 6 回連続送信して 429 と `Retry-After` を確認する
6. 通信障害シナリオで再試行導線が機能することを確認する