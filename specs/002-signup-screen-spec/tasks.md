# Tasks: アカウント登録画面（UC-01）

**Input**: Design documents from /specs/002-signup-screen-spec/
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/signup-registration.openapi.yaml, quickstart.md

**Tests**: 本featureでは憲法と testing.core/testing.frontend/testing.backend に従い、テストを必須とする。

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 実装着手前の構成統一と共通設定

- [x] T001 フィーチャー用テスト構成を作成する backend/tests/{contract,integration,security}/auth/ と frontend/src/pages/SignupPage/
- [x] T002 登録機能の設定値を定義する backend/src/config/authConfig.ts
- [x] T003 [P] フロントエンドのAPIエンドポイント定数を定義する frontend/src/services/api/endpoints.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: すべてのユーザーストーリーに共通して必要な基盤を先に完成させる

**⚠️ CRITICAL**: このフェーズ完了まで User Story 実装を開始しない

- [x] T004 Prisma スキーマに User/Session の制約を追加する backend/prisma/schema.prisma
- [x] T005 Prisma マイグレーションを作成する backend/prisma/migrations/002_signup_screen_spec/
- [x] T006 [P] メール正規化・パスワードハッシュの共通ユーティリティを実装する backend/src/utils/auth/credentialUtils.ts
- [x] T007 [P] PII を含めない認証エラーログ出力を実装する backend/src/utils/logging/authLogger.ts
- [x] T008 登録トランザクション用リポジトリを実装する backend/src/repositories/auth/signupRepository.ts
- [x] T009 登録ルートとミドルウェアの雛形を実装する backend/src/api/auth/signupRoutes.ts
- [x] T038 [P] HTTPアクセス拒否の契約テストを追加する backend/tests/contract/auth/signup-https-enforcement.contract.test.ts
- [x] T039 [P] HTTPS以外を拒否するミドルウェアと設定を実装する backend/src/api/middleware/requireHttps.ts と backend/src/api/auth/signupRoutes.ts

**Checkpoint**: Foundation ready - User Story 実装に着手可能

---

## Phase 3: User Story 1 - 新規ユーザーが登録を完了する (Priority: P1) 🎯 MVP

**Goal**: 未登録ユーザーが登録成功し、自動ログインでダッシュボードへ遷移できる

**Independent Test**: 有効入力で登録し、201応答とセッション開始、ダッシュボード遷移を確認する

### Tests for User Story 1 ⚠️

- [x] T010 [P] [US1] 201成功レスポンスの契約テストを追加する backend/tests/contract/auth/signup-success.contract.test.ts
- [x] T011 [P] [US1] 登録成功時のトランザクション統合テストを追加する backend/tests/integration/auth/signup-success.integration.test.ts
- [x] T012 [P] [US1] 登録成功からダッシュボード遷移までの画面統合テストを追加する frontend/src/pages/SignupPage/SignupPage.success.test.tsx

### Implementation for User Story 1

- [x] T013 [P] [US1] 登録ドメインモデルを実装する backend/src/domains/auth/SignupModels.ts
- [x] T014 [US1] 24時間セッション開始を含む登録サービス成功系を実装する backend/src/services/auth/SignupService.ts
- [x] T015 [US1] 201応答を返すコントローラーを実装する backend/src/api/auth/signupController.ts
- [x] T016 [P] [US1] 登録画面の基本UIを実装する frontend/src/pages/SignupPage/index.tsx
- [x] T017 [P] [US1] 登録APIクライアントを実装する frontend/src/services/api/auth/signup.ts
- [x] T018 [US1] 成功時の遷移処理フックを実装する frontend/src/pages/SignupPage/useSignupSubmit.ts

**Checkpoint**: User Story 1 単体で登録成功フローが動作する

---

## Phase 4: User Story 2 - 入力不備を即時に修正できる (Priority: P1)

**Goal**: 入力不正時に送信を止め、項目近傍に明確なエラーを表示する

**Independent Test**: 空メール、7文字パスワード、不一致確認入力で送信停止と項目エラー表示を確認する

### Tests for User Story 2 ⚠️

- [x] T019 [P] [US2] 400バリデーションエラー契約テストを追加する backend/tests/contract/auth/signup-validation.contract.test.ts
- [x] T020 [P] [US2] 入力バリデーション境界値ユニットテストを追加する frontend/src/pages/SignupPage/signupValidation.test.ts
- [x] T021 [P] [US2] 項目近傍エラー表示の画面テストを追加する frontend/src/pages/SignupPage/SignupPage.validation.test.tsx

### Implementation for User Story 2

- [x] T022 [P] [US2] フロントエンド入力バリデーションを実装する frontend/src/pages/SignupPage/signupValidation.ts
- [x] T023 [US2] 項目エラー表示コンポーネントを実装する frontend/src/pages/SignupPage/SignupFieldErrors.tsx
- [x] T024 [P] [US2] バックエンド入力検証ミドルウェアを実装する backend/src/api/auth/signupValidationMiddleware.ts
- [x] T025 [US2] バリデーションミドルウェアをルートへ統合する backend/src/api/auth/signupRoutes.ts

**Checkpoint**: User Story 2 単体で入力不正の送信抑止と項目エラー表示が動作する

---

## Phase 5: User Story 3 - 登録失敗時に再試行できる (Priority: P2)

**Goal**: 重複・制限超過・一時障害で失敗しても、利用者が理解して再試行できる

**Independent Test**: 409/429/500 で要約エラーと再試行導線、セッション失敗時ロールバックを確認する

### Tests for User Story 3 ⚠️

- [x] T026 [P] [US3] 409/429/500失敗系契約テストを追加する backend/tests/contract/auth/signup-failure.contract.test.ts
- [x] T027 [P] [US3] 失敗時UI要約と再試行導線の画面テストを追加する frontend/src/pages/SignupPage/SignupPage.failure.test.tsx
- [x] T028 [P] [US3] セッション作成失敗時ロールバック統合テストを追加する backend/tests/integration/auth/signup-rollback.integration.test.ts

### Implementation for User Story 3

- [x] T029 [P] [US3] 重複判定とレート制限判定サービスを実装する backend/src/services/auth/SignupGuardService.ts
- [x] T030 [US3] セッション失敗時ロールバック分岐を登録サービスへ実装する backend/src/services/auth/SignupService.ts
- [x] T031 [US3] エラーコードを利用者向け文言へ変換するマッパーを実装する frontend/src/pages/SignupPage/signupErrorMapper.ts
- [x] T032 [US3] 画面上部エラー要約と再試行導線コンポーネントを実装する frontend/src/pages/SignupPage/SignupErrorSummary.tsx
- [x] T033 [US3] ログイン画面リンクと未認証ガード遷移を実装する frontend/src/pages/SignupPage/index.tsx と frontend/src/routes/guards/requireAuth.tsx

**Checkpoint**: User Story 3 単体で失敗時の復帰導線が動作する

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 複数ストーリー横断の最終仕上げ

- [x] T034 [P] OpenAPI契約と実装差分を最終同期する specs/002-signup-screen-spec/contracts/signup-registration.openapi.yaml
- [x] T035 [P] PII非出力のセキュリティテストを追加する backend/tests/security/auth/signup-logging.security.test.ts
- [x] T036 quickstart の完了条件でE2E確認手順を更新する specs/002-signup-screen-spec/quickstart.md
- [x] T037 lint/typecheck/test を実行して結果を記録する specs/002-signup-screen-spec/checklists/requirements.md
- [x] T040 [P] 登録開始/登録成功イベントを実装する frontend/src/pages/SignupPage/useSignupSubmit.ts と backend/src/api/auth/signupController.ts
- [x] T041 [P] 登録キャンセルイベントを実装し、SC-001母数から明示キャンセルのみ除外する判定ロジックを追加する frontend/src/pages/SignupPage/useSignupSubmit.ts と backend/src/services/auth/SignupMetricsService.ts
- [x] T044 [P] SC-001計測クエリと集計手順（直近7日、母数100件以上、明示キャンセル除外）を追加する specs/002-signup-screen-spec/quickstart.md
- [x] T042 [P] /auth/signup の性能試験（p95 <= 2秒）を追加する backend/tests/performance/auth/signup.performance.test.ts
- [x] T043 [P] 性能試験結果の判定基準をCI手順へ記録する specs/002-signup-screen-spec/checklists/requirements.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): 依存なし
- Foundational (Phase 2): Phase 1 完了後に開始、全User Storyの前提
- User Stories (Phase 3-5): Phase 2 完了後に開始可能
- Polish (Phase 6): 対象User Story完了後に開始

### User Story Dependencies

- US1: Foundational 完了後に開始可能
- US2: Foundational 完了後に開始可能（US1へ依存しない）
- US3: Foundational 完了後に開始可能（US1/US2へ依存しない）

### Within Each User Story

- テストを先に作成し、失敗を確認してから実装する
- モデル/ユーティリティ → サービス → API/UI統合の順で進める
- ストーリー完了後に独立テストを実施する

### Parallel Opportunities

- Phase 1: T003 は T001/T002 と並行実行可能
- Phase 2: T006/T007/T038/T039 は並行実行可能
- US1: T010/T011/T012 と T013/T016/T017 は並行実行可能
- US2: T019/T020/T021 と T022/T024 は並行実行可能
- US3: T026/T027/T028 と T029 は並行実行可能
- Phase 6: T034/T035/T040/T041/T042/T043/T044 は並行実行可能

---

## Parallel Example: User Story 1

- Task: T010 [US1] backend/tests/contract/auth/signup-success.contract.test.ts
- Task: T011 [US1] backend/tests/integration/auth/signup-success.integration.test.ts
- Task: T012 [US1] frontend/src/pages/SignupPage/SignupPage.success.test.tsx

- Task: T013 [US1] backend/src/domains/auth/SignupModels.ts
- Task: T016 [US1] frontend/src/pages/SignupPage/index.tsx
- Task: T017 [US1] frontend/src/services/api/auth/signup.ts

## Parallel Example: User Story 2

- Task: T019 [US2] backend/tests/contract/auth/signup-validation.contract.test.ts
- Task: T020 [US2] frontend/src/pages/SignupPage/signupValidation.test.ts
- Task: T021 [US2] frontend/src/pages/SignupPage/SignupPage.validation.test.tsx

- Task: T022 [US2] frontend/src/pages/SignupPage/signupValidation.ts
- Task: T024 [US2] backend/src/api/auth/signupValidationMiddleware.ts

## Parallel Example: User Story 3

- Task: T026 [US3] backend/tests/contract/auth/signup-failure.contract.test.ts
- Task: T027 [US3] frontend/src/pages/SignupPage/SignupPage.failure.test.tsx
- Task: T028 [US3] backend/tests/integration/auth/signup-rollback.integration.test.ts

- Task: T029 [US3] backend/src/services/auth/SignupGuardService.ts
- Task: T032 [US3] frontend/src/pages/SignupPage/SignupErrorSummary.tsx

---

## Implementation Strategy

### MVP First (US1)

1. Phase 1 と Phase 2 を完了
2. Phase 3 (US1) を完了
3. US1独立テストを実行しMVPとして検証

### Incremental Delivery

1. 基盤完了後、US1 → US2 → US3 の順で価値を追加
2. 各ストーリー完了時に独立テストと契約テストを通す
3. 最後に横断品質（セキュリティ、ドキュメント、CI）を統合確認

### Parallel Team Strategy

1. 1名: backendサービス/契約テスト
2. 1名: frontend画面/状態遷移
3. 1名: 統合テスト/失敗系とセキュリティ

---

## Notes

- [P] は異なるファイルかつ未完了依存がない場合のみ付与
- 各タスクは必ず対象ファイルパスを記載
- 仕様変更が必要になった場合は spec.md と contract を先に更新
