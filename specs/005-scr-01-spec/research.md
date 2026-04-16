# Research: ログイン/サインアップ永続化

## 1. 永続化方式

- Decision: Prisma + PostgreSQL を正式な永続化基盤にする
- Rationale: 既存の `backend/prisma/schema.prisma` がすでに `User` と `Session` を定義しており、認証の読み書きをアプリ内のインメモリ状態から DB に移しやすい
- Alternatives considered:
  - インメモリのまま維持: 再起動でデータが失われ、DB 読み書き要件を満たさない
  - 直接 SQL ドライバを使う: 既存の Prisma 構成と重複し、型安全性と既存スキーマ管理の利点を失う

## 2. ログイン経路の読み取り

- Decision: ログイン時は正規化済みメールアドレスで `User` を検索し、パスワードハッシュ照合後に `Session` を作成する
- Rationale: 既存の `LoginService` は `findUserByEmail` と `createSession` の責務分離ができており、DB 化しても同じ責務分割を維持しやすい
- Alternatives considered:
  - 先にセッションだけ発行する: 認証失敗時の不整合を生みやすい
  - メールの正規化を省く: 重複判定と照合の一貫性が崩れる

## 3. サインアップ経路の書き込み

- Decision: サインアップでは `User` 作成と `Session` 作成を同一トランザクションで行う
- Rationale: ユーザー作成後にセッション作成が失敗すると、アカウントだけ残る中途半端な状態になるため
- Alternatives considered:
  - ユーザー作成とセッション作成を別トランザクションに分ける: 部分成功が起こりやすい
  - セッション作成失敗時に後で補償する: 実装と検証が複雑になる

## 4. 重複メールの扱い

- Decision: `normalizedEmail` にユニーク制約を置き、事前チェックと DB 制約の両方で重複を防止する
- Rationale: アプリ側のチェックだけでは競合に弱く、DB 制約だけでは UX が悪化するため
- Alternatives considered:
  - アプリ側だけで重複判定する: 同時登録競合を防げない
  - DB 制約だけに任せる: エラー制御とメッセージ整形が難しい

## 5. テスト方針

- Decision: repository 単体、service 単体、contract/integration の順で確認する
- Rationale: DB 読み書きは repository に集約されるため、最小単位で失敗を早く検知できる
- Alternatives considered:
  - E2E だけで確認する: 失敗箇所の切り分けが難しい
  - service のみテストする: 永続層の不整合を見逃しやすい# Phase 0 Research: ログイン画面（SCR-01）

## Decision 1: 認証入力は email + password のみ

- Decision: ログイン画面はメールアドレスとパスワードのみを扱う
- Rationale: 既存の認証基盤と整合し、MVPの認証入口として最小構成を維持できる
- Alternatives considered:
  - SNS ログイン追加: 範囲外であり、画面/契約/失敗系が増えすぎるため不採用
  - MFA 同時導入: 初期導入コストとUX負荷が高いため不採用

## Decision 2: メール正規化は trim + lowercase

- Decision: 送信前後の表記揺れ対策として、メールは前後空白除去後に小文字化した値で扱う
- Rationale: 既存登録済みアカウントと表記揺れによるログイン失敗を防げる
- Alternatives considered:
  - 完全一致のみ: 大文字小文字差分で失敗しやすいため不採用
  - ドメインのみ小文字化: ローカル部の揺れが残るため不採用

## Decision 3: セッション有効期限は 24 時間

- Decision: ログイン成功時のセッションは 24 時間有効とする
- Rationale: 利便性と安全性のバランスがよい
- Alternatives considered:
  - 7日間有効: 露出期間が長くなる
  - 毎回再認証: 利便性が低く継続利用率を下げる

## Decision 4: レート制限は email(normalized) + IP で 5 req/min

- Decision: ログイン要求は正規化メールアドレスと送信元 IP の組み合わせで 1分5回まで許可する
- Rationale: 総当たり対策と正常利用の誤検知抑制を両立できる
- Alternatives considered:
  - IPのみ制限: NAT 環境で誤検知しやすい
  - 3 req/min: 正常操作の再試行を阻害しやすい

## Decision 5: 既ログイン時はダッシュボードへ自動リダイレクト

- Decision: `/login` を開いた時点で認証済みならダッシュボードへ遷移する
- Rationale: 二重の認証画面を見せず、利用者の作業を中断しないため
- Alternatives considered:
  - ログイン画面を表示し続ける: 冗長で混乱を招く

## Decision 6: returnTo がある場合はログイン後に優先

- Decision: 保護画面から誘導された場合は returnTo を優先し、なければダッシュボードへ遷移する
- Rationale: 未認証アクセスの復帰導線として自然で、画面移動の損失を減らせる
- Alternatives considered:
  - 常にダッシュボード固定: 保護画面からの復帰が失われる

## Decision 7: 失敗系は 401 / 429 / 500 で分離

- Decision: 認証失敗は 401、レート制限超過は 429、一時障害は 500 とする
- Rationale: UI と API 契約の分岐を明確にできる
- Alternatives considered:
  - すべて 400: 失敗理由の区別がつかない

## Decision 8: 開発環境では HTTP を許容、本番は HTTPS 必須

- Decision: ローカル開発では HTTP を許容し、本番では HTTPS を必須とする
- Rationale: 開発時の立ち上げを阻害せず、本番安全性を維持できる
- Alternatives considered:
  - 全環境 HTTPS 強制: 開発コストが高い

## Testing Best Practices Applied

- Decision: testing.core / testing.frontend / testing.backend を同時適用する
- Rationale: ログイン機能は画面状態、認証失敗、レート制限、認可分岐をまたぐため
- Alternatives considered:
  - frontendのみ: API契約と失敗系の保証が不足
  - backendのみ: 画面状態とアクセシビリティを保証できない

## Resolved Clarifications

本 feature の NEEDS CLARIFICATION は 0 件。未解決項目は存在しない。