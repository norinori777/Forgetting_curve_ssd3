# Tasks: 基底画面

**Input**: Design documents from `/specs/007-base-screen/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: 本プロジェクトでは憲法の「品質ゲート」により、テストは原則必須です。基底画面についても、初期表示、リンク遷移、アクセシビリティ、共通表示を必ずテストに含めます。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 基底画面で共通利用するナビゲーション定義とページ枠の初期配置を用意する

- [X] T001 [P] Create shared base-screen route map in frontend/src/utils/baseScreenRoutes.ts for dashboard, card list, review, and settings destinations
- [X] T002 [P] Create placeholder page shells in frontend/src/pages/CardListPage/index.tsx, frontend/src/pages/ReviewPage/index.tsx, and frontend/src/pages/SettingsPage/index.tsx so the header links have concrete targets
- [X] T003 [P] Create shared layout and navigation component files in frontend/src/components/layout/BaseLayout.tsx, frontend/src/components/navigation/BrandArea.tsx, and frontend/src/components/navigation/HeaderMenu.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: All user stories depend on the shared navigation model and shell contract

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Define base-screen page-key and navigation types in frontend/src/domains/navigation.ts
- [X] T005 [P] Define the shared menu metadata in frontend/src/utils/baseScreenMenu.ts and reuse the destination paths from frontend/src/utils/baseScreenRoutes.ts

**Checkpoint**: Shared navigation model and shell contract are ready - user story implementation can now begin

---

## Phase 3: User Story 1 - 初期表示で基底画面を開く (Priority: P1) 🎯 MVP

**Goal**: ログイン後に基底画面を開いたとき、ヘッダーメニュー部の下にダッシュボードが初期表示される

**Independent Test**: `/dashboard` を開いたときに、ヘッダーメニュー部とダッシュボードが同一画面で表示されることを確認できる

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T006 [P] [US1] Add RTL test for default dashboard rendering in frontend/src/App.base-screen.test.tsx
- [X] T007 [P] [US1] Add RTL test for BaseLayout page-slot placement in frontend/src/components/layout/BaseLayout.test.tsx

### Implementation for User Story 1

- [X] T008 [P] [US1] Implement the BaseLayout shell and page-slot rendering in frontend/src/components/layout/BaseLayout.tsx
- [X] T009 [US1] Update frontend/src/App.tsx and frontend/src/pages/DashboardPage/index.tsx to render the dashboard inside the shared shell as the initial authenticated page

**Checkpoint**: User Story 1 should now show the shared base screen with dashboard as the default page

---

## Phase 4: User Story 2 - ヘッダーリンクで画面を切り替える (Priority: P1)

**Goal**: ヘッダーメニューのリンク操作で、カード一覧、復習実施、設定の各画面へページ表示部を切り替えられる

**Independent Test**: ヘッダーの各リンクを押したとき、対応する画面がページ表示部に表示されることを確認できる

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T010 [P] [US2] Add RTL test for header link labels and destinations in frontend/src/components/navigation/HeaderMenu.test.tsx
- [X] T011 [P] [US2] Add navigation integration test for link clicks switching the page display in frontend/src/App.navigation.test.tsx

### Implementation for User Story 2

- [X] T012 [P] [US2] Implement the service icon and service name area in frontend/src/components/navigation/BrandArea.tsx
- [X] T013 [P] [US2] Implement the header menu links and active-page semantics in frontend/src/components/navigation/HeaderMenu.tsx
- [X] T014 [US2] Extend frontend/src/App.tsx with /cards, /review, and /settings path handling and connect frontend/src/pages/CardListPage/index.tsx, frontend/src/pages/ReviewPage/index.tsx, and frontend/src/pages/SettingsPage/index.tsx

**Checkpoint**: User Story 2 should now let users move between the main pages from the shared header

---

## Phase 5: User Story 3 - 共通ヘッダーでサービスを認識する (Priority: P2)

**Goal**: どの画面を見てもサービスアイコンとサービス名が共通ヘッダーに表示され、画面遷移後も一貫した見た目を保てる

**Independent Test**: Dashboard, card list, review, and settings の各画面で、同じ共通ヘッダーが表示されることを確認できる

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T015 [P] [US3] Add accessibility test for header landmarks, focus order, and aria-current in frontend/src/components/navigation/HeaderMenu.accessibility.test.tsx
- [X] T016 [P] [US3] Add persistence test ensuring the shared header remains visible across authenticated pages in frontend/src/components/layout/BaseLayout.persistence.test.tsx

### Implementation for User Story 3

- [X] T017 [P] [US3] Apply responsive layout and active-state styling in frontend/src/components/layout/BaseLayout.tsx and frontend/src/components/navigation/HeaderMenu.tsx
- [X] T018 [US3] Wrap the authenticated page components with the shared base layout in frontend/src/pages/DashboardPage/index.tsx, frontend/src/pages/CardRegistrationPage/index.tsx, frontend/src/pages/CardListPage/index.tsx, frontend/src/pages/ReviewPage/index.tsx, and frontend/src/pages/SettingsPage/index.tsx

**Checkpoint**: All authenticated pages should now share the same base layout and header behavior

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish integration, validation, and documentation consistency across all stories

- [X] T019 [P] Run frontend validation with yarn test, yarn lint, and yarn typecheck and fix any issues in frontend/src/App.tsx, frontend/src/components/layout/BaseLayout.tsx, and frontend/src/components/navigation/HeaderMenu.tsx
- [X] T020 [P] Verify the manual steps in specs/007-base-screen/quickstart.md against the implemented header flow and update the document if any navigation detail changed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Reuses the shared shell but remains independently testable
- **User Story 3 (P2)**: Can start after User Story 1 and User Story 2 - It hardens the shared shell and header across the authenticated pages

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Shared navigation/model work before shell rendering
- Base layout before page composition
- Header links before route wiring
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Setup tasks T001-T003 can run in parallel
- Foundational tasks T004-T005 can run in parallel
- User Story 1 tests T006-T007 can run in parallel
- User Story 2 tests T010-T011 can run in parallel
- User Story 2 implementation tasks T012-T013 can run in parallel
- User Story 3 tests T015-T016 can run in parallel
- User Story 3 implementation task T017 can run in parallel with T018 once BaseLayout semantics are stable
- Final validation tasks T019-T020 can run in sequence after implementation is complete

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Add RTL test for default dashboard rendering in frontend/src/App.base-screen.test.tsx"
Task: "Add RTL test for BaseLayout page-slot placement in frontend/src/components/layout/BaseLayout.test.tsx"

# Launch all implementation tasks for User Story 1 together:
Task: "Implement the BaseLayout shell and page-slot rendering in frontend/src/components/layout/BaseLayout.tsx"
Task: "Update frontend/src/App.tsx and frontend/src/pages/DashboardPage/index.tsx to render the dashboard inside the shared shell as the initial authenticated page"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Shared shell ready
2. Add User Story 1 → Test independently → Demo the initial dashboard shell
3. Add User Story 2 → Test independently → Demo header navigation
4. Add User Story 3 → Test independently → Demo consistent shared header behavior
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
