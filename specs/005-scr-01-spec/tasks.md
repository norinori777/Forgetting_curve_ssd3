# Tasks: ログイン/サインアップ DB 永続化

**Input**: Design documents from `/specs/005-scr-01-spec/`
**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), `contracts/login.openapi.yaml`, `contracts/signup.openapi.yaml`, [quickstart.md](quickstart.md)

**Tests**: 本 feature は認証の DB 読み込み/書き込みを含むため、テストは原則必須です。少なくとも repository の永続化、service のトランザクション、contract、integration、UI の成功/失敗/アクセシビリティを含めて検証します。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prisma/PostgreSQL による認証永続化を始めるための共通土台を整える

- [ ] T001 [P] backend/prisma/schema.prisma に `User`/`Session` の永続化前提を反映し、`backend/prisma/migrations/003_auth_postgres_persistence/` を追加する
- [ ] T002 [P] backend/package.json と backend/prisma.config.ts に Prisma 生成・マイグレーション用の実行手順を合わせる
- [ ] T003 [P] backend/tests/integration/auth/authDbTestHelpers.ts と backend/tests/contract/auth/authContractTestHelpers.ts を追加して認証 DB テストの共通 fixture を用意する

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: すべてのユーザーストーリーで共通に使う DB アクセス層と認証契約を整備する

**⚠️ CRITICAL**: ここの完了まで user story の実装を始めない

- [X] T004 [P] backend/src/repositories/auth/authStore.ts を Prisma 連携のストア層に置き換え、`clone/commit` 前提のインメモリ保存を廃止する
- [X] T005 [P] backend/src/repositories/auth/loginRepository.ts を Prisma で `User` 読み取りと `Session` 参照ができる実装に更新する
- [X] T006 [P] backend/src/repositories/auth/signupRepository.ts を Prisma で `User` 作成と `Session` 作成を扱える実装に更新する
- [X] T007 [P] backend/src/services/auth/LoginService.ts と backend/src/services/auth/SignupService.ts のトランザクション境界を整理し、部分成功を残さない atomic write にする
- [ ] T008 [P] backend/src/config/authConfig.ts と backend/src/api/auth/*Controller.ts で 24 時間セッション Cookie と HTTPS 条件を DB 永続化後も維持する

**Checkpoint**: DB を使った認証基盤が ready になり、各 user story を独立に進められる

---

## Phase 3: User Story 1 - 正常にログインしてダッシュボードへ進む (Priority: P1)

**Goal**: 既存ユーザーが DB 上のアカウントを参照してログインし、ダッシュボードへ進める

**Independent Test**: 有効なメールアドレスとパスワードで送信し、`User` を DB から読み取り、`Session` が作成され、`/dashboard` へ遷移することを確認する

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T009 [P] [US1] backend/tests/contract/auth/login-success.contract.test.ts で DB 読み取り後の 200 応答と session cookie を確認する
- [ ] T010 [P] [US1] backend/tests/integration/auth/login-success.integration.test.ts で既存 `User` の参照と `Session` 生成を確認する
- [ ] T011 [P] [US1] frontend/src/pages/LoginPage/LoginPage.success.test.tsx、frontend/src/pages/LoginPage/LoginPage.submission-state.test.tsx、frontend/src/pages/LoginPage/LoginPage.accessibility.test.tsx で成功遷移、二重送信防止、パスワード表示切り替え、モバイル幅での横スクロールなしを確認する

### Implementation for User Story 1

- [ ] T012 [P] [US1] backend/src/repositories/auth/loginRepository.ts に DB からの user lookup と session 参照を実装する
- [X] T013 [US1] backend/src/services/auth/LoginService.ts と backend/src/api/auth/loginController.ts を Prisma ベースの repository に接続し、成功時の cookie と redirectTo を維持する
- [ ] T014 [P] [US1] frontend/src/pages/LoginPage/useLoginSubmit.ts、frontend/src/pages/LoginPage/index.tsx、frontend/src/App.tsx、frontend/src/routes/guards/requireAuth.tsx を更新し、既認証時の自動リダイレクトと未認証時の `/login` 誘導を再接続する

**Checkpoint**: User Story 1 単体でログイン成功フローが動作する

---

## Phase 4: User Story 2 - 新規登録してダッシュボードへ進む (Priority: P1)

**Goal**: 新規ユーザーが DB に永続化され、サインアップ直後にセッションを受け取れる

**Independent Test**: 有効なメールアドレス/パスワード/確認用パスワードを送信し、`User` と `Session` が DB に作成され、完了後に次画面へ遷移することを確認する

### Tests for User Story 2 ⚠️

- [ ] T015 [P] [US2] backend/tests/contract/auth/signup-success.contract.test.ts と backend/tests/contract/auth/signup-validation.contract.test.ts で DB 書き込み契約を確認する
- [ ] T016 [P] [US2] backend/tests/integration/auth/signup-success.integration.test.ts と backend/tests/integration/auth/signup-rollback.integration.test.ts で user/session の作成と失敗時ロールバックを確認する
- [ ] T017 [P] [US2] frontend/src/pages/SignupPage/SignupPage.success.test.tsx、frontend/src/pages/SignupPage/SignupPage.submission-state.test.tsx、frontend/src/pages/SignupPage/SignupPage.accessibility.test.tsx で成功遷移、送信中状態、モバイル幅での横スクロールなしを確認する

### Implementation for User Story 2

- [ ] T018 [P] [US2] backend/src/repositories/auth/signupRepository.ts に DB への user 作成と session 作成を実装する
- [X] T019 [US2] backend/src/services/auth/SignupService.ts と backend/src/api/auth/signupController.ts を Prisma トランザクションで atomic write にする
- [ ] T020 [P] [US2] frontend/src/pages/SignupPage/useSignupSubmit.ts と frontend/src/pages/SignupPage/index.tsx を signup API の成功/失敗レスポンスに合わせて更新する

**Checkpoint**: User Story 2 単体でサインアップ永続化フローが動作する

---

## Phase 5: User Story 3 - 入力不備を送信前に修正する (Priority: P1)

**Goal**: 利用者がログインとサインアップの入力内容の不足や形式不正を送信前に把握し、画面上で修正できる

**Independent Test**: 空メール、形式不正メール、短すぎるパスワード、確認用パスワード不一致をそれぞれ入力し、送信前に項目近傍エラーが出て送信されないことを確認する

### Tests for User Story 3 ⚠️

- [ ] T021 [P] [US3] backend/tests/contract/auth/login-validation.contract.test.ts と backend/tests/contract/auth/signup-validation.contract.test.ts で validation 分岐を確認する
- [ ] T022 [P] [US3] frontend/src/pages/LoginPage/LoginPage.validation.test.tsx と frontend/src/pages/SignupPage/SignupPage.validation.test.tsx で項目近傍エラー、passwordConfirm 不一致、trim 後の検証を確認する

### Implementation for User Story 3

- [ ] T023 [P] [US3] backend/src/api/auth/loginValidationMiddleware.ts と backend/src/api/auth/signupValidationMiddleware.ts を更新し、trim/length/confirm 含む検証を揃える
- [ ] T024 [US3] frontend/src/pages/LoginPage/LoginFieldErrors.tsx と frontend/src/pages/SignupPage/SignupFieldErrors.tsx を更新し、aria-live と項目近傍エラーの表示を整える

**Checkpoint**: 入力不備の送信抑止とエラー表示がログイン/サインアップ両方で動作する

---

## Phase 6: User Story 4 - 認証失敗や通信障害から再試行する (Priority: P2)

**Goal**: 利用者がログインやサインアップで誤った認証情報や一時障害に遭遇しても、原因を把握し再試行できる

**Independent Test**: 誤った認証情報、通信失敗、連続失敗による制限状態を再現し、適切な要約エラーと再試行導線が表示されることを確認する

### Tests for User Story 4 ⚠️

- [ ] T025 [P] [US4] backend/tests/contract/auth/login-failure.contract.test.ts と backend/tests/contract/auth/signup-failure.contract.test.ts で 401/409/429/500 の失敗契約を確認する
- [ ] T026 [P] [US4] backend/tests/integration/auth/login-rollback.integration.test.ts と backend/tests/integration/auth/signup-rollback.integration.test.ts で partial success が残らないことを確認する
- [ ] T027 [P] [US4] frontend/src/pages/LoginPage/LoginPage.failure.test.tsx と frontend/src/pages/SignupPage/SignupPage.failure.test.tsx で要約エラーと再試行導線を確認する

### Implementation for User Story 4

- [ ] T028 [US4] backend/src/api/auth/loginController.ts と backend/src/api/auth/signupController.ts で retry-after, generic error, rollback failure の応答を整える
- [ ] T029 [P] [US4] frontend/src/pages/LoginPage/loginErrorMapper.ts、frontend/src/pages/LoginPage/LoginErrorSummary.tsx、frontend/src/pages/SignupPage/signupErrorMapper.ts、frontend/src/pages/SignupPage/SignupErrorSummary.tsx を更新する

**Checkpoint**: 失敗系がログイン/サインアップ両方で独立に扱える

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 認証永続化を横断的に仕上げ、運用可能な状態にする

- [ ] T030 [P] backend/tests/security/auth/login-logging.security.test.ts と backend/tests/security/auth/signup-logging.security.test.ts で PII が平文ログに出ないことを確認する
- [ ] T031 [P] backend/tests/performance/auth/login.performance.test.ts と backend/tests/performance/auth/signup.performance.test.ts で主要認証フローの応答目標を確認する
- [ ] T032 [P] specs/005-scr-01-spec/contracts/signup.openapi.yaml を `specs/005-scr-01-spec/contracts/login.openapi.yaml` と同期し、両方の契約を quickstart に反映する
- [ ] T033 [P] specs/005-scr-01-spec/quickstart.md を新しい signup 契約と検証手順に合わせて更新する

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存なしで開始できる
- **Foundational (Phase 2)**: Setup 完了が必要。すべての user story をブロックする
- **User Stories (Phase 3+)**: Foundational 完了後に開始できる
- **Polish (Final Phase)**: すべての必要 story 完了後に開始する

### User Story Dependencies

- **User Story 1 (P1)**: Foundational 完了後に開始。既存ユーザーのログインだけで独立検証できる
- **User Story 2 (P1)**: Foundational 完了後に開始。新規ユーザーの登録だけで独立検証できる
- **User Story 3 (P1)**: Foundational 完了後に開始。ログイン/サインアップの入力不備だけで独立検証できる
- **User Story 4 (P2)**: Foundational 完了後に開始。ログイン/サインアップの失敗系を独立検証できる

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Repository/data access before service wiring
- Service before controller/UI wiring
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Phase 1: T001/T002/T003 can run in parallel
- Phase 2: T004/T005/T006/T007/T008 can run in parallel where files do not overlap
- US1: T009/T010/T011 can run in parallel, and T012/T014 can run in parallel once tests exist
- US2: T015/T016/T017 can run in parallel, and T018/T020 can run in parallel once tests exist
- US3: T021/T022 can run in parallel, and T023/T024 can run in parallel once tests exist
- US4: T025/T026/T027 can run in parallel, and T028/T029 can run in parallel once tests exist
- Phase 7: T030/T031/T032/T033 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "backend/tests/contract/auth/login-success.contract.test.ts を更新して DB 読み取り後の成功応答を確認する"
Task: "backend/tests/integration/auth/login-success.integration.test.ts を更新して User 参照と Session 作成を確認する"
Task: "frontend/src/pages/LoginPage/LoginPage.success.test.tsx を更新して成功遷移を確認する"

# Launch implementation work for User Story 1 together after tests exist:
Task: "backend/src/repositories/auth/loginRepository.ts に DB 参照を実装する"
Task: "frontend/src/pages/LoginPage/useLoginSubmit.ts と frontend/src/pages/LoginPage/index.tsx を更新する"
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

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid vague tasks, same file conflicts, cross-story dependencies that break independence
