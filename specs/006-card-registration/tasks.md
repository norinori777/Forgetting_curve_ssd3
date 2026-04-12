# Tasks: カード登録画面

**Input**: Design documents from `/specs/006-card-registration/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: 憲法によりテストは原則必須。少なくとも復習日計算、入力検証、重複送信防止、権限拒否に関わる主要ロジックをユニット/契約/統合テストで覆う。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Create card feature scaffolding in backend/src/api/cards/, backend/src/services/cards/, backend/src/repositories/cards/, backend/src/domains/cards/, backend/src/utils/cards/, frontend/src/pages/CardRegistrationPage/, frontend/src/services/api/cards/, backend/tests/unit/cards/, backend/tests/contract/cards/, and backend/tests/integration/cards/
- [X] T002 [P] Add frontend card API endpoint constants and /cards/new route entry in frontend/src/services/api/endpoints.ts and frontend/src/App.tsx
- [X] T003 [P] Add backend cards router mount and placeholder route module in backend/src/index.ts and backend/src/api/cards/cardRoutes.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Add Card Prisma model, User relation, and migration in backend/prisma/schema.prisma and backend/prisma/migrations/20260412_card_registration/migration.sql
- [X] T004A [P] Apply the card migration to the local development database with backend/package.json scripts or `cd backend && npx prisma migrate dev`
- [X] T005 [P] Define card domain request, response, and error types in backend/src/domains/cards/CardModels.ts
- [X] T006 [P] Implement deterministic review schedule helper in backend/src/utils/cards/reviewSchedule.ts
- [X] T007 [P] Add authenticated session lookup and card ownership guard in backend/src/api/middleware/cardAuth.ts and backend/src/repositories/auth/authStore.ts
- [X] T008 [P] Create frontend card API client contract in frontend/src/services/api/cards/card.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 個別登録でカードを作成する (Priority: P1) 🎯 MVP

**Goal**: 個別登録フォームから下書きを確認し、初回復習予定を表示して、確定保存まで完了できるようにする

**Independent Test**: 有効な入力で preview API が復習予定を返し、create API がカードを保存し、CardRegistrationPage で確認→確定の流れが完了する

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T009 [P] [US1] Add contract tests for POST /cards/preview and POST /cards success payloads in backend/tests/contract/cards/card-registration-success.contract.test.ts
- [X] T010 [P] [US1] Add unit tests for review schedule boundary values and UTC/JST crossover in backend/tests/unit/cards/reviewSchedule.test.ts
- [X] T011 [P] [US1] Add integration test for authenticated preview-to-create happy path in backend/tests/integration/cards/card-registration-success.integration.test.ts

### Implementation for User Story 1

- [X] T012 [P] [US1] Implement review schedule helper in backend/src/utils/cards/reviewSchedule.ts
- [X] T013 [P] [US1] Implement card domain models and preview/create validation rules in backend/src/domains/cards/CardModels.ts
- [X] T014 [P] [US1] Implement card repository persistence and transaction helpers in backend/src/repositories/cards/cardRepository.ts
- [X] T015 [US1] Implement CardService preview/create flow in backend/src/services/cards/CardService.ts
- [X] T016 [US1] Implement card controller and routes, then wire them in backend/src/index.ts and backend/src/api/cards/cardRoutes.ts
- [X] T017 [P] [US1] Implement frontend API client for preview/create in frontend/src/services/api/cards/card.ts
- [X] T018 [P] [US1] Implement CardRegistrationPage shell, confirmation view, and custom hook in frontend/src/pages/CardRegistrationPage/index.tsx and frontend/src/pages/CardRegistrationPage/useCardRegistration.ts
- [X] T019 [US1] Wire frontend route entry and navigation to CardRegistrationPage in frontend/src/App.tsx and any related navigation component files

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - 入力エラーや重複送信から安全に戻る (Priority: P2)

**Goal**: バリデーション失敗、通信失敗、権限拒否、重複送信の各失敗時に、入力内容を保持したまま再試行できるようにする

**Independent Test**: validation / 401 / 403 / 5xx の失敗系を再現し、エラー表示、再試行、送信中無効化、重複作成防止が確認できる

### Tests for User Story 2 ⚠️

- [X] T020 [P] [US2] Add contract tests for validation, unauthorized, forbidden, and server error responses in backend/tests/contract/cards/card-registration-failure.contract.test.ts
- [X] T021 [P] [US2] Add frontend tests for validation, loading, error, input retention, and submit-state behavior in frontend/src/pages/CardRegistrationPage/CardRegistrationPage.validation.test.tsx, frontend/src/pages/CardRegistrationPage/CardRegistrationPage.submission-state.test.tsx, frontend/src/pages/CardRegistrationPage/CardRegistrationPage.input-retention.test.tsx, and frontend/src/pages/CardRegistrationPage/CardRegistrationPage.accessibility.test.tsx
- [X] T022 [P] [US2] Add backend integration tests for forbidden ownership, duplicate submit rollback, and retry-safe failure handling in backend/tests/integration/cards/card-registration-rollback.integration.test.ts

### Implementation for User Story 2

- [X] T023 [P] [US2] Implement frontend field validation and error mapping in frontend/src/pages/CardRegistrationPage/cardRegistrationValidation.ts and frontend/src/pages/CardRegistrationPage/cardRegistrationErrorMapper.ts
- [X] T024 [US2] Implement submit/cancel/retry state handling and isSubmitting guard in frontend/src/pages/CardRegistrationPage/useCardRegistration.ts
- [X] T025 [US2] Implement backend validation, forbidden checks, and duplicate submission protection in backend/src/services/cards/CardService.ts and backend/src/api/cards/cardController.ts
- [X] T026 [P] [US2] Implement loading, error summary, and retry UI components in frontend/src/pages/CardRegistrationPage/CardRegistrationErrorSummary.tsx and frontend/src/pages/CardRegistrationPage/CardRegistrationFieldErrors.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T027 [P] Update quickstart and route references in specs/006-card-registration/quickstart.md and backend/src/api/cards/cardRoutes.ts if the final paths changed during implementation
- [ ] T028 [P] Add any missing regression coverage for midnight boundary and ownership rejection in backend/tests/unit/cards/reviewSchedule.test.ts and backend/tests/integration/cards/card-registration-rollback.integration.test.ts
- [ ] T029 [P] Run the quickstart validation steps from specs/006-card-registration/quickstart.md and fix any gaps in backend/package.json or frontend/package.json if the documented commands differ from the actual scripts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Setup tasks T001-T003 can run in parallel because they touch different files and scaffolding
- Foundational tasks T004-T008 can run in parallel once setup is complete
- User Story 1 test tasks T009-T011 can run in parallel
- User Story 1 implementation tasks T012-T014 and T017-T018 can run in parallel where file ownership does not overlap
- User Story 2 test tasks T020-T022 can run in parallel
- User Story 2 implementation tasks T023 and T026 can run in parallel once the shared hook contract is settled
- User Story 1 and User Story 2 can proceed in parallel after the foundational phase if staffed separately

### Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Add contract tests for POST /cards/preview and POST /cards success payloads in backend/tests/contract/cards/card-registration-success.contract.test.ts"
Task: "Add unit tests for review schedule boundary values and UTC/JST crossover in backend/tests/unit/cards/reviewSchedule.test.ts"
Task: "Add integration test for authenticated preview-to-create happy path in backend/tests/integration/cards/card-registration-success.integration.test.ts"

# Launch all frontend implementation work for User Story 1 together:
Task: "Implement frontend API client for preview/create in frontend/src/services/api/cards/card.ts"
Task: "Implement CardRegistrationPage shell, confirmation view, and custom hook in frontend/src/pages/CardRegistrationPage/index.tsx and frontend/src/pages/CardRegistrationPage/useCardRegistration.ts"
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
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add polish tasks after the story increments are stable
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
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
