# Tasks: 003スコープ再定義（分割必須条件適合）

**Input**: Design documents from `/specs/004-redefine-003-scope/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: 憲法の品質ゲートに従い、各ユーザーストーリーで分岐・境界・失敗シナリオを先に定義し、実装タスク前に検証観点を固定する。

**Organization**: ユーザーストーリー単位で独立実装・独立検証できるように構成する。

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 004の再定義作業で使う共通ドキュメントの雛形を準備する

- [x] T001 004スコープ境界ワークシートを `specs/004-redefine-003-scope/scope-boundary-definition.md` に作成する
- [x] T002 [P] 要件移管台帳の雛形を `specs/004-redefine-003-scope/requirement-handover-map.md` に作成する

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 全ユーザーストーリーの前提となる判定基準を固定する

**⚠️ CRITICAL**: このフェーズ完了までユーザーストーリー作業を開始しない

- [x] T003 003適合判定ルール（story<=2, task<=14）を `specs/004-redefine-003-scope/compliance-rules.md` に定義する
- [x] T004 [P] 後続feature依存グラフ雛形を `specs/004-redefine-003-scope/split-handover-plan.md` に作成する

**Checkpoint**: 判定基準と移管計画の共通基盤が準備完了

---

## Phase 3: User Story 1 - 003の責務境界を縮小確定する (Priority: P1) 🎯 MVP

**Goal**: 003のin-scope/out-of-scopeと完了条件を確定し、再肥大化を防ぐ

**Independent Test**: 003の責務境界、上限制約、完了条件が単独文書で説明できる

### Tests for User Story 1 ⚠️

- [x] T005 [P] [US1] 境界条件テスト観点（過剰スコープ・重複割当）を `specs/004-redefine-003-scope/tests/us1-boundary-cases.md` に定義する
- [x] T006 [P] [US1] 失敗シナリオ観点（上限制約超過・未分類要件）を `specs/004-redefine-003-scope/tests/us1-failure-cases.md` に定義する

### Implementation for User Story 1

- [x] T007 [US1] 003の in-scope/out-of-scope を `specs/004-redefine-003-scope/scope-boundary-definition.md` に記述する
- [x] T008 [US1] 003の完了条件と適合判定証跡を `specs/004-redefine-003-scope/compliance-evidence.md` に記録する

**Checkpoint**: User Story 1 が独立で確認可能

---

## Phase 4: User Story 2 - 後続featureへの分割移管を確定する (Priority: P1)

**Goal**: 後続featureの順序・依存・要件移管を確定し、着手可能にする

**Independent Test**: 移管先一覧、順序、依存、1対1要件対応が整合していることを説明できる

### Tests for User Story 2 ⚠️

- [x] T009 [P] [US2] 依存循環検出テスト観点を `specs/004-redefine-003-scope/tests/us2-dependency-cases.md` に定義する
- [x] T010 [P] [US2] 要件1対1対応テスト観点を `specs/004-redefine-003-scope/tests/us2-traceability-cases.md` に定義する

### Implementation for User Story 2

- [x] T011 [US2] 後続featureの順序・依存・開始条件を `specs/004-redefine-003-scope/split-handover-plan.md` に記述する
- [x] T012 [US2] 元要件IDの移管先1対1対応を `specs/004-redefine-003-scope/requirement-handover-map.md` に記述する

**Checkpoint**: User Story 2 が独立で確認可能

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: 全体整合性の最終確認

- [x] T013 [P] quickstart手順の検証結果を `specs/004-redefine-003-scope/quickstart-validation-report.md` に記録する
- [x] T014 004成果物の最終索引を `specs/004-redefine-003-scope/README.md` に作成する

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 依存なし
- **Phase 2 (Foundational)**: Phase 1 完了後に開始
- **Phase 3-4 (User Stories)**: Phase 2 完了後に開始
- **Phase 5 (Polish)**: Phase 3-4 完了後に開始

### User Story Dependencies

- **User Story 1 (P1)**: Foundational 完了後に開始（他ストーリー依存なし）
- **User Story 2 (P1)**: User Story 1 の境界確定を前提に開始

### Within Each User Story

- テスト観点定義（T005/T006、T009/T010）を先に完了する
- 実装タスクはテスト観点定義後に着手する
- 各ストーリーはチェックポイントを満たした時点で独立完了とする

### Parallel Opportunities

- Setup: T001 と T002 は並行可能
- Foundational: T003 と T004 は並行可能
- US1: T005 と T006 は並行可能
- US2: T009 と T010 は並行可能
- Polish: T013 と T014 は並行可能

---

## Parallel Example: User Story 1

```bash
Task: "T005 [US1] specs/004-redefine-003-scope/tests/us1-boundary-cases.md を作成"
Task: "T006 [US1] specs/004-redefine-003-scope/tests/us1-failure-cases.md を作成"
```

## Parallel Example: User Story 2

```bash
Task: "T009 [US2] specs/004-redefine-003-scope/tests/us2-dependency-cases.md を作成"
Task: "T010 [US2] specs/004-redefine-003-scope/tests/us2-traceability-cases.md を作成"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 と Phase 2 を完了
2. Phase 3 (US1) を完了
3. 003の責務境界と上限制約の適合判定を確認

### Incremental Delivery

1. Setup + Foundational を完了
2. US1 を確定して境界を固定
3. US2 で移管計画を確定
4. Polish で最終整合性を記録

### Parallel Team Strategy

1. 1名が境界定義と適合判定を担当
2. 1名が移管計画と要件対応表を担当
3. 1名がテスト観点と最終検証記録を担当
