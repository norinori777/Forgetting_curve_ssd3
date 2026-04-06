# Quickstart: アカウント登録画面（UC-01）

## 1. 前提

- Feature branch: 002-signup-screen-spec
- 参照仕様: specs/002-signup-screen-spec/spec.md
- 画面デザイン参照: docs/signup-screen-ascii-ui.md
- デザイントークン参照: design/design-tokens.md

## 2. 実装ステップ（推奨順）

1. API 契約を先に固定する

- contracts/signup-registration.openapi.yaml を基準として /auth/signup の I/O を実装

1. バックエンド実装

- 入力検証: email format, password 8-64, passwordConfirm 一致
- 正規化: email は trim + lowercase
- 重複判定: normalized email の一意制約
- レート制限: normalized email + IP で 5 req/min
- 原子性: アカウント作成 + セッション開始を1トランザクションで扱い、セッション失敗時はロールバック

1. フロントエンド実装

- 状態管理: initial, validation_error, submitting, success, failure
- 項目エラー: 各入力欄近傍に表示
- 画面上部エラー: 重複/通信障害/レート制限の要約表示
- 送信中: ボタン無効化で多重送信防止
- 成功時: ダッシュボード遷移

## 3. テスト観点（必須）

### Frontend (testing.frontend + testing.core)

- 状態分岐: loading/error/empty(success equivalent for form)/success
- 入力境界:
  - password 7/8/64/65 文字
  - email 前後空白あり
  - passwordConfirm 不一致
- 失敗系:
  - 409 重複
  - 429 制限超過（Retry導線）
  - 500 一時障害（再試行導線）
- アクセシビリティ:
  - label と input の関連
  - エラー文言の読み上げ可能性（aria-live 等）

### Backend (testing.backend + testing.core)

- 認可系: 未認証保護画面アクセス時誘導（401/redirect policy）
- バリデーション分岐: 形式、必須、長さ、相関
- レート制限境界:
  - 1分内 5 回成功、6 回目拒否
- 重複境界:
  - `User@Example.com` 登録後 `user@example.com` は409
- トランザクション:
  - セッション作成失敗時に UserAccount が残らない

## 4. 完了条件

- spec の FR-001 から FR-018 を満たすこと
- API 契約テストが通ること
- UI の主要状態遷移テストが通ること
- lint / typecheck / test が CI で成功すること
- SC-001 判定は直近7日・母数100件以上で実施し、利用者の明示キャンセルのみ母数から除外すること
- SC-005 判定は /auth/signup の性能試験で p95 <= 2秒 を満たすこと
