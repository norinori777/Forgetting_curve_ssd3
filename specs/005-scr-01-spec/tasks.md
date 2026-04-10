# Tasks: ログイン画面�E�ECR-01�E�E

**Input**: Design documents from `/specs/005-scr-01-spec/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/login.openapi.yaml, quickstart.md

**Tests**: 本プロジェクトでは憲法�E「品質ゲート」により、テスト�E原則忁E��です。ログイン機�Eでは、認証成功・入力バリチE�Eション・失敗復帰・レート制限�EアクセシビリチE��・性能・セキュリチE��を含めて検証します、E

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: ログイン画面の実裁E��忁E��な共通ディレクトリとルーチE��ングの土台を整える

- [X] T001 ログイン機�EのチE��ト�E画面チE��レクトリを作�Eする backend/tests/contract/auth/, backend/tests/integration/auth/, backend/tests/performance/auth/, backend/tests/security/auth/, frontend/src/pages/LoginPage/, frontend/src/services/api/auth/
- [X] T002 [P] フロントエンド�E /login ルーチE��ングと returnTo 受け渡し�E入口を用意すめEfrontend/src/App.tsx と frontend/src/routes/guards/requireAuth.tsx
- [X] T003 [P] バックエンド�EログインAPIエントリポイントをマウントすめEbackend/src/index.ts と backend/src/api/auth/loginRoutes.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: すべてのユーザースト�Eリーに共通して忁E��な認証基盤を�Eに完�EさせめE

**⚠�E�ECRITICAL**: こ�Eフェーズ完亁E��で User Story 実裁E��開始しなぁE

- [X] T004 [P] ログイン用のドメインモチE��と応答型を定義する backend/src/domains/auth/LoginModels.ts と frontend/src/domains/auth/LoginModels.ts
- [X] T005 [P] メール正規化とパスワード�E合�E共通ユーチE��リチE��を拡張する backend/src/utils/auth/credentialUtils.ts
- [X] T006 [P] ログイン用のトランザクションリポジトリを実裁E��めEbackend/src/repositories/auth/loginRepository.ts
- [X] T007 [P] ログイン制限判定と持E��集計サービスを実裁E��めEbackend/src/services/auth/LoginGuardService.ts と backend/src/services/auth/LoginMetricsService.ts
- [X] T008 [P] ログイン入力検証ミドルウェアの雛形を実裁E��めEbackend/src/api/auth/loginValidationMiddleware.ts
- [X] T009 [P] ログインコントローラーの雛形を実裁E��めEbackend/src/api/auth/loginController.ts
- [X] T010 [P] ログイン画面の土台と送信フックの雛形を実裁E��めEfrontend/src/pages/LoginPage/index.tsx、frontend/src/pages/LoginPage/useLoginSubmit.ts、frontend/src/pages/LoginPage/LoginFieldErrors.tsx
- [X] T011 [P] ログインAPIクライアントとエラー変換の雛形を実裁E��めEfrontend/src/services/api/auth/login.ts と frontend/src/pages/LoginPage/loginErrorMapper.ts

**Checkpoint**: Foundation ready - User Story 実裁E��着手可能

---

## Phase 3: User Story 1 - 正常にログインしてダチE��ュボ�Eドへ進む (Priority: P1) 🎯 MVP

**Goal**: 有効なメールアドレスとパスワードでログインし、セチE��ョン発行後にダチE��ュボ�Eドへ到達できる

**Independent Test**: 有効な認証惁E��で送信し、E00 応答�EセチE��ョン開始�EダチE��ュボ�Eド�E移を確認すめE

### Tests for User Story 1 ⚠�E�E

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T012 [P] [US1] 200成功レスポンスの契紁E��ストを追加する backend/tests/contract/auth/login-success.contract.test.ts
- [X] T013 [P] [US1] 成功時�EセチE��ョン発行と応答を統合テストで確認すめEbackend/tests/integration/auth/login-success.integration.test.ts
- [X] T014 [P] [US1] ログイン成功後�EダチE��ュボ�Eド�E移を画面チE��トで確認すめEfrontend/src/pages/LoginPage/LoginPage.success.test.tsx
- [X] T015 [P] [US1] キーボ�Eド操作とフォーカス頁E�EアクセシビリチE��を画面チE��トで確認すめEfrontend/src/pages/LoginPage/LoginPage.accessibility.test.tsx

### Implementation for User Story 1

- [X] T016 [P] [US1] 認証成功時に 24 時間セチE��ョンを発行するサービスを実裁E��めEbackend/src/services/auth/LoginService.ts
- [X] T017 [US1] 200 応答とセチE��ョン Cookie を返すコントローラーを実裁E��めEbackend/src/api/auth/loginController.ts
- [X] T018 [P] [US1] ログイン成功状態とダチE��ュボ�Eド�E移を実裁E��めEfrontend/src/pages/LoginPage/index.tsx と frontend/src/pages/LoginPage/useLoginSubmit.ts
- [X] T019 [P] [US1] /login の表示と authenticated-user redirect を接続すめEfrontend/src/App.tsx と frontend/src/routes/guards/requireAuth.tsx

**Checkpoint**: User Story 1 単体でログイン成功フローが動作すめE

---

## Phase 4: User Story 2 - 入力不備を送信前に修正する (Priority: P1)

**Goal**: 入力不備を送信前に止め、E��E��近傍に明確なエラーを表示する

**Independent Test**: 空メール、形式不正メール、E/8/64/65斁E��パスワードで送信停止と頁E��エラー表示を確認すめE

### Tests for User Story 2 ⚠�E�E

- [X] T020 [P] [US2] 400バリチE�Eションエラーの契紁E��ストを追加する backend/tests/contract/auth/login-validation.contract.test.ts
- [X] T021 [P] [US2] email trim と password 7/8/64/65 の墁E��値チE��トを追加する frontend/src/pages/LoginPage/loginValidation.test.ts
- [X] T022 [P] [US2] 頁E��近傍エラー表示と送信停止の画面チE��トを追加する frontend/src/pages/LoginPage/LoginPage.validation.test.tsx

### Implementation for User Story 2

- [X] T023 [P] [US2] ログイン用のクライアントサイド検証ヘルパ�Eを実裁E��めEfrontend/src/pages/LoginPage/loginValidation.ts
- [X] T024 [US2] 頁E��エラー表示と aria-live フィードバチE��を実裁E��めEfrontend/src/pages/LoginPage/LoginFieldErrors.tsx
- [X] T025 [P] [US2] バックエンド�Eログイン入力検証ミドルウェアを実裁E��めEbackend/src/api/auth/loginValidationMiddleware.ts
- [X] T026 [US2] 検証ミドルウェアをルートへ統合し、検証エラー応答を整合させる backend/src/api/auth/loginRoutes.ts と backend/src/api/auth/loginController.ts

**Checkpoint**: User Story 2 単体で入力不備の送信抑止とエラー表示が動作すめE

---

## Phase 5: User Story 3 - 認証失敗や通信障害から再試行すめE(Priority: P2)

**Goal**: 誤認証・制限趁E��・一時障害でも、利用老E��原因を把握して再試行できる

**Independent Test**: 401/429/500 を�E現し、要紁E��ラー・再試行導線�EロチE��表示・ロールバックを確認すめE

### Tests for User Story 3 ⚠�E�E

- [X] T027 [P] [US3] 401/429/500失敗系の契紁E��ストを追加する backend/tests/contract/auth/login-failure.contract.test.ts
- [X] T028 [P] [US3] セチE��ョン作�E失敗時のロールバック統合テストを追加する backend/tests/integration/auth/login-rollback.integration.test.ts
- [X] T029 [P] [US3] 失敗要紁E�E再試行�EロチE��状態�E画面チE��トを追加する frontend/src/pages/LoginPage/LoginPage.failure.test.tsx

### Implementation for User Story 3

- [X] T030 [P] [US3] レート制限とロチE��アウト判定ロジチE��を実裁E��めEbackend/src/services/auth/LoginGuardService.ts と backend/src/services/auth/LoginMetricsService.ts
- [X] T031 [US3] トランザクション失敗時のロールバックとエラー応答を実裁E��めEbackend/src/services/auth/LoginService.ts と backend/src/api/auth/loginController.ts
- [X] T032 [P] [US3] エラー要紁E��再試行アクションを実裁E��めEfrontend/src/pages/LoginPage/LoginErrorSummary.tsx
- [X] T033 [US3] APIエラーから利用老E��け文言への変換とロチE��状態描画を実裁E��めEfrontend/src/pages/LoginPage/loginErrorMapper.ts と frontend/src/pages/LoginPage/index.tsx

**Checkpoint**: User Story 3 単体で失敗時の復帰導線が動作すめE

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 褁E��スト�Eリー横断の最終仕上げ

- [X] T034 [P] PII と認証惁E��がログへ出なぁE��とを検証するセキュリチE��チE��トを追加する backend/tests/security/auth/login-logging.security.test.ts
- [X] T035 [P] `/auth/login` の p95 <= 2 秒を検証する性能チE��トを追加する backend/tests/performance/auth/login.performance.test.ts
- [X] T036 [P] quickstart の E2E 手頁E��計測手頁E��最終同期すめEspecs/005-scr-01-spec/quickstart.md
- [X] T037 [P] OpenAPI 契紁E�E例示と応答コードを実裁E��同期する specs/005-scr-01-spec/contracts/login.openapi.yaml
- [X] T038 [P] lint、typecheck、test の結果を記録して完亁E��件を確定すめEspecs/005-scr-01-spec/checklists/requirements.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 ↁEP2 ↁEP3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May share infrastructure but is independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May share infrastructure but is independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models/validators before services
- Services before controllers/UI wiring
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Phase 1: T002/T003 can run in parallel after T001
- Phase 2: T004/T005/T006/T007/T008/T009/T010/T011 can run in parallel where files do not overlap
- US1: T012/T013/T014/T015 can run in parallel, and T016/T018/T019 can run in parallel once tests exist
- US2: T020/T021/T022 can run in parallel, and T023/T025 can run in parallel once tests exist
- US3: T027/T028/T029 can run in parallel, and T030/T032 can run in parallel once tests exist
- Phase 6: T034/T035/T036/T037/T038 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "200成功レスポンスの契紁E��ストを追加する backend/tests/contract/auth/login-success.contract.test.ts"
Task: "成功時�EセチE��ョン発行と応答を統合テストで確認すめEbackend/tests/integration/auth/login-success.integration.test.ts"
Task: "ログイン成功後�EダチE��ュボ�Eド�E移を画面チE��トで確認すめEfrontend/src/pages/LoginPage/LoginPage.success.test.tsx"

# Launch all implementation work for User Story 1 together after tests exist:
Task: "認証成功時に 24 時間セチE��ョンを発行するサービスを実裁E��めEbackend/src/services/auth/LoginService.ts"
Task: "ログイン成功状態とダチE��ュボ�Eド�E移を実裁E��めEfrontend/src/pages/LoginPage/index.tsx と frontend/src/pages/LoginPage/useLoginSubmit.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational ↁEFoundation ready
2. Add User Story 1 ↁETest independently ↁEDeploy/Demo (MVP!)
3. Add User Story 2 ↁETest independently ↁEDeploy/Demo
4. Add User Story 3 ↁETest independently ↁEDeploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
