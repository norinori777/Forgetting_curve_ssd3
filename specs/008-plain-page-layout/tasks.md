# Tasks: 基底画面のページ表示部フラット化

**Input**: Design documents from `/specs/008-plain-page-layout/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: この feature は UI レイアウト変更のみだが、憲法に従い表示退行を防ぐテストを必須とする。少なくともページ表示部の外枠有無、BaseLayout の構造、ルート選択の不変性を確認する。

**Organization**: Tasks are grouped by user story so each slice can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create shared test support for page-layout regression checks.

- [X] T001 Create a shared plain-page layout assertion helper in `frontend/src/pages/__tests__/plainPageLayoutAssertions.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Lock shared layout and routing behavior before page-specific changes.

**Checkpoint**: Base layout and route resolution are protected by regression tests before page wrappers are removed.

- [X] T002 [P] Add route-resolution regression tests for `resolveAppRouteKey` and `getBaseScreenPath` in `frontend/src/utils/baseScreenRoutes.test.ts`
- [X] T003 [P] Extend `BaseLayout` structural regression coverage in `frontend/src/components/layout/BaseLayout.test.tsx` and `frontend/src/components/layout/BaseLayout.persistence.test.tsx`

---

## Phase 3: User Story 1 - カード枠なしで表示する (Priority: P1) 🎯 MVP

**Goal**: ダッシュボードとカード一覧を、カード状の外枠なしでページ表示部に直接表示する。

**Independent Test**: `DashboardPage` と `CardListPage` を個別に開いたとき、白背景の独立カード、角丸、影付き、中央寄せ固定幅の外枠が表示されず、本文がそのまま表示される。

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T004 [P] [US1] Add cardless layout regression test for `frontend/src/pages/DashboardPage/DashboardPage.layout.test.tsx`
- [X] T005 [P] [US1] Add cardless layout regression test for `frontend/src/pages/CardListPage/CardListPage.layout.test.tsx`

### Implementation for User Story 1

- [X] T006 [P] [US1] Remove the card-style outer wrapper from `frontend/src/pages/DashboardPage/index.tsx`
- [X] T007 [P] [US1] Remove the card-style outer wrapper from `frontend/src/pages/CardListPage/index.tsx`

**Checkpoint**: Dashboard and card list now render directly in the page display area without a card shell.

---

## Phase 4: User Story 2 - 直接配置で内容を見せる (Priority: P2)

**Goal**: 復習と設定を、見出し・本文・一覧・フォーム要素がページ表示部に直接配置された状態で表示する。

**Independent Test**: `ReviewPage` と `SettingsPage` を個別に開いたとき、要素がページ表示部へ直接配置され、独立カードの中に閉じ込められていない。

### Tests for User Story 2 ⚠️

- [X] T008 [P] [US2] Add direct-placement regression test for `frontend/src/pages/ReviewPage/ReviewPage.layout.test.tsx`
- [X] T009 [P] [US2] Add direct-placement regression test for `frontend/src/pages/SettingsPage/SettingsPage.layout.test.tsx`

### Implementation for User Story 2

- [X] T010 [P] [US2] Remove the card-style outer wrapper from `frontend/src/pages/ReviewPage/index.tsx`
- [X] T011 [P] [US2] Remove the card-style outer wrapper from `frontend/src/pages/SettingsPage/index.tsx`

**Checkpoint**: Review and settings now follow the same direct-placement layout as the other authenticated pages.

---

## Phase 5: User Story 3 - 画面遷移を変えない (Priority: P3)

**Goal**: 画面遷移、ルーティング、BaseLayout の共通構造を維持し、今回の変更が表示レイアウトだけに限定されていることを保証する。

**Independent Test**: 主要ルートを開いたとき、到達先とヘッダー/メイン構造が従来どおりで、レイアウト変更以外の差分がない。

### Tests for User Story 3 ⚠️

- [X] T012 [P] [US3] Add authenticated route smoke tests in `frontend/src/utils/baseScreenRoutes.test.ts`
- [X] T013 [P] [US3] Add shared shell-preservation smoke test in `frontend/src/components/layout/BaseLayout.persistence.test.tsx`

### Implementation for User Story 3

- [X] T014 [US3] Verify `frontend/src/App.tsx` and `frontend/src/components/layout/BaseLayout.tsx` still use the existing route selection and shell structure after the page layout refactor

**Checkpoint**: Route selection and the authenticated shell remain unchanged apart from the page content layout.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and small cleanups that affect the feature as a whole.

- [X] T015 [P] Validate the frontend scripts defined in `frontend/package.json` by running the layout-focused test suite and `yarn build` from `frontend/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user story work
- **User Stories (Phase 3+)**: Depend on Foundational completion
  - User Story 1 and User Story 2 can proceed in parallel after the shared layout helper and baseline regressions are in place
  - User Story 3 should be validated after the page-level layout refactor is complete
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Can start after Foundational; can reuse the same layout assertion helper as User Story 1
- **User Story 3 (P3)**: Can start after the page layout refactor is complete; validates that route and shell behavior were preserved

### Within Each User Story

- Tests MUST be written and fail before implementation
- Different page files can be edited in parallel when the task is marked [P]
- Keep route and shell regression checks green while removing page-local card wrappers

---

## Parallel Example: User Story 1

```bash
# Write both regression tests together:
Task: "Add cardless layout regression test for frontend/src/pages/DashboardPage/DashboardPage.layout.test.tsx"
Task: "Add cardless layout regression test for frontend/src/pages/CardListPage/CardListPage.layout.test.tsx"

# Then update both page implementations together:
Task: "Remove the card-style outer wrapper from frontend/src/pages/DashboardPage/index.tsx"
Task: "Remove the card-style outer wrapper from frontend/src/pages/CardListPage/index.tsx"
```

## Parallel Example: User Story 2

```bash
# Write both regression tests together:
Task: "Add direct-placement regression test for frontend/src/pages/ReviewPage/ReviewPage.layout.test.tsx"
Task: "Add direct-placement regression test for frontend/src/pages/SettingsPage/SettingsPage.layout.test.tsx"

# Then update both page implementations together:
Task: "Remove the card-style outer wrapper from frontend/src/pages/ReviewPage/index.tsx"
Task: "Remove the card-style outer wrapper from frontend/src/pages/SettingsPage/index.tsx"
```

## Parallel Example: User Story 3

```bash
# Lock the shared behavior with tests together:
Task: "Add authenticated route smoke tests in frontend/src/utils/baseScreenRoutes.test.ts"
Task: "Add shared shell-preservation smoke test in frontend/src/components/layout/BaseLayout.persistence.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirm the dashboard and card list no longer render as card shells
5. Demo if the primary cardless-display slice is ready

### Incremental Delivery

1. Complete Setup + Foundational → shared regression coverage is in place
2. Add User Story 1 → validate dashboard and card list independently
3. Add User Story 2 → validate review and settings independently
4. Add User Story 3 → confirm routing and shell structure remained unchanged
5. Finish with the full frontend validation pass

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 page tests and page refactor
   - Developer B: User Story 2 page tests and page refactor
   - Developer C: User Story 3 regression tests and shell verification
3. Merge only after the layout-only behavior is stable across the four authenticated pages

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Keep the change layout-only: do not alter routing, navigation, or business behavior
- Verify tests fail before implementing each page refactor
