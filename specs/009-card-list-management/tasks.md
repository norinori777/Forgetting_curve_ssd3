# Tasks: UC-13 カード一覧確認・検索・一括管理

**Input**: Design documents from `/specs/009-card-list-management/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: 憲法によりテストは原則必須。少なくとも一覧取得、検索、無限スクロール、一括ラベル付与、削除、エクスポート、所有者制御、空状態、UI 操作の各経路をユニット/契約/統合/フロントエンドテストで覆う。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Shared types and entry points needed by all card list stories.

- [X] T001 [P] Add shared card list request/response and API endpoint constants in backend/src/domains/cards/CardModels.ts, frontend/src/services/api/cards/card.ts, and frontend/src/services/api/endpoints.ts
- [X] T002 [P] Add cards route/controller scaffolding for list management in backend/src/api/cards/cardController.ts, backend/src/api/cards/cardRoutes.ts, backend/src/services/cards/CardService.ts, backend/src/repositories/cards/cardRepository.ts, backend/src/index.ts, and frontend/src/pages/CardListPage/index.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core verification that MUST be in place before user story implementation begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Add backend contract, unit, and integration tests and frontend regression tests for card list management in backend/tests/contract/cards/card-list-management.contract.test.ts, backend/tests/unit/cards/card-list-management.test.ts, backend/tests/integration/cards/card-list-management.integration.test.ts, frontend/src/pages/CardListPage/CardListPage.layout.test.tsx, and frontend/src/pages/CardListPage/CardListPage.behavior.test.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in priority order.

---

## Phase 3: User Story 1 - カード一覧を確認する (Priority: P1) 🎯 MVP

**Goal**: ログイン済みユーザーが自分のカード一覧を確認し、空状態も含めて一覧画面を開けるようにする。

**Independent Test**: カード一覧画面を開いたとき、自分のカードだけが表示され、カードがない場合は空状態メッセージが表示される。

### Tests for User Story 1 ⚠️

- [X] T004 [P] [US1] Add owned-card listing and empty-state coverage in backend/tests/unit/cards/card-list-management.test.ts and frontend/src/pages/CardListPage/CardListPage.render.test.tsx

### Implementation for User Story 1

- [X] T005 [US1] Implement owned-card list retrieval and empty-state handling in backend/src/services/cards/CardService.ts, backend/src/repositories/cards/cardRepository.ts, backend/src/api/cards/cardController.ts, and frontend/src/pages/CardListPage/index.tsx

**Checkpoint**: At this point, the card list page can show only the current user's cards and an empty state when appropriate.

---

## Phase 4: User Story 2 - カードを検索・絞り込む (Priority: P1)

**Goal**: タイトル・問い・答えの部分一致検索とカテゴリ・タグ絞り込みで、対象カードを素早く見つけられるようにする。

**Independent Test**: 複数条件の検索を実行したとき、条件に一致するカードのみが表示され、0 件時には条件クリア導線が出る。

### Tests for User Story 2 ⚠️

- [X] T006 [P] [US2] Add partial-match search, label filtering, and cursor pagination coverage in backend/tests/unit/cards/card-list-management.test.ts and frontend/src/pages/CardListPage/CardListPage.search.test.tsx

### Implementation for User Story 2

- [X] T007 [US2] Implement search and filter controls with zero-result reset affordance in backend/src/services/cards/CardService.ts, backend/src/repositories/cards/cardRepository.ts, frontend/src/pages/CardListPage/index.tsx, and frontend/src/services/api/cards/card.ts

**Checkpoint**: At this point, list retrieval and filtered search both work for the current user's cards.

---

## Phase 5: User Story 3 - 複数カードを一括管理する (Priority: P2)

**Goal**: 検索結果や一覧から複数カードを選び、一括でカテゴリ・タグを付与できるようにする。

**Independent Test**: 複数カードを選択して一括付与を実行し、選択したカードにのみラベルが反映される。

### Tests for User Story 3 ⚠️

- [X] T008 [P] [US3] Add bulk label update contract and multi-select coverage in backend/tests/contract/cards/card-list-management.contract.test.ts, backend/tests/integration/cards/card-list-bulk.integration.test.ts, and frontend/src/pages/CardListPage/CardListPage.selection.test.tsx

### Implementation for User Story 3

- [X] T009 [US3] Implement bulk selection and label update logic in backend/src/services/cards/CardService.ts, backend/src/repositories/cards/cardRepository.ts, backend/src/api/cards/cardController.ts, frontend/src/pages/CardListPage/index.tsx, and frontend/src/services/api/cards/card.ts

**Checkpoint**: At this point, multiple cards can be selected and updated together without affecting unrelated cards.

---

## Phase 6: User Story 4 - 個別編集・削除とエクスポートを行う (Priority: P2)

**Goal**: 一覧から個別編集・削除へ進め、必要に応じて学習データを JSON 単一ファイルでエクスポートできるようにする。

**Independent Test**: 一覧から編集・削除導線をたどれ、エクスポートを実行したときに JSON 単一ファイルが得られる。

### Tests for User Story 4 ⚠️

- [X] T010 [P] [US4] Add delete/export contract and interaction coverage in backend/tests/contract/cards/card-list-management.contract.test.ts, backend/tests/integration/cards/card-list-export-delete.integration.test.ts, and frontend/src/pages/CardListPage/CardListPage.actions.test.tsx

### Implementation for User Story 4

- [X] T011 [US4] Implement delete and export operations for owned cards in backend/src/services/cards/CardService.ts, backend/src/repositories/cards/cardRepository.ts, backend/src/api/cards/cardController.ts, and frontend/src/pages/CardListPage/index.tsx

**Checkpoint**: At this point, the list page supports edit navigation, deletion, and JSON export.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and small cleanup across the feature.

- [X] T012 [P] Run the quickstart validation steps from specs/009-card-list-management/quickstart.md and update specs/009-card-list-management/quickstart.md or backend/frontend scripts if the documented commands differ from the actual project scripts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user story work
- **User Stories (Phase 3+)**: All depend on Foundational completion
  - User stories can then proceed in parallel if files do not overlap
  - User stories should still be delivered in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational completion - no dependency on later stories
- **User Story 2 (P1)**: Can start after User Story 1 foundations are in place; may reuse the same CardListPage and card list service layers
- **User Story 3 (P2)**: Depends on the list/search foundation from User Story 1 and 2
- **User Story 4 (P2)**: Depends on the list foundation and can reuse the same backend service/repository layers

### Within Each User Story

- Tests MUST be written and fail before implementation
- Shared service/repository/controller files should be extended in story order to avoid conflicts
- Frontend page state should be kept in one place per story slice to preserve independent verification
- Story complete before moving to the next priority where practical

### Parallel Opportunities

- T001-T002 can run in parallel because they touch different files
- T003 is a shared blocking test sweep for the feature
- T004-T005 can run in parallel after the foundational tests are in place
- T006-T007 can run in parallel
- T008-T009 can run in parallel
- T010-T011 can run in parallel
- Within each story, the frontend and backend implementation tasks are not marked [P] because they share the same feature slices and may overlap in the same files

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirm the card list page shows only owned cards and the empty state correctly
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → shared list infrastructure and regression coverage are in place
2. Add User Story 1 → validate owned-card display and empty state independently
3. Add User Story 2 → validate search and filtering independently
4. Add User Story 3 → validate multi-select bulk label update independently
5. Add User Story 4 → validate edit/delete/export independently
6. Finish with the quickstart validation pass

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 page and service work
   - Developer B: User Story 2 search/filter work
   - Developer C: User Story 3 bulk update work
   - Developer D: User Story 4 delete/export work
3. Merge only after each story's tests pass independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing each story slice
- Commit after each task or logical group
- Avoid adding new category/tag storage until a separate feature explicitly requires it
