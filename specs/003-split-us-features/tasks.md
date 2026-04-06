# Tasks: US1/US2/US3 分割 feature 化

**Input**: Design documents from `/specs/003-split-us-features/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: 憲法の品質ゲートに従い、各ユーザーストーリーで独立テスト観点（分岐、境界値、失敗系）を先に定義し、実装タスク着手前に失敗確認を行う。

**Organization**: ユーザーストーリー単位で独立実装・独立検証できるようにフェーズ分割する。

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 分割運用ドキュメントの初期基盤を作る

- [ ] T001 分割feature一覧テンプレートを `specs/003-split-us-features/split-feature-registry.md` に作成する
- [ ] T002 追跡管理テンプレートを `specs/003-split-us-features/traceability-map.md` に作成する
- [ ] T003 [P] 品質ゲート証跡テンプレートを `specs/003-split-us-features/quality-gate-evidence.md` に作成する
- [ ] T004 [P] 依存衝突意思決定ログテンプレートを `specs/003-split-us-features/dependency-decisions.md` に作成する

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 全USに共通する分割ルールと検証基盤を固定する

**⚠️ CRITICAL**: このフェーズ完了までUS実装に着手しない

- [ ] T005 元要件ID 1対1対応の検証ルールを `specs/003-split-us-features/governance.md` に定義する
- [ ] T006 依存順序（US1->US2->US3）の基準グラフを `specs/003-split-us-features/dependency-graph.md` に定義する
- [ ] T007 [P] 分割整合性チェック項目を `specs/003-split-us-features/checklists/split-integrity.md` に定義する
- [ ] T008 [P] 品質ゲート実行手順を `specs/003-split-us-features/quality-gate-runbook.md` に定義する
- [ ] T009 分割完了判定基準を `specs/003-split-us-features/checklists/completion-gate.md` に定義する

**Checkpoint**: 分割ルール・依存順序・品質ゲートが固定され、US作業を開始可能

---

## Phase 3: User Story 1 - 分割計画を確定する (Priority: P1) 🎯 MVP

**Goal**: US境界と依存順序を確定し、計画として承認可能にする

**Independent Test**: in-scope/out-of-scope、共通基盤、依存順序が文書化され、レビューで説明できる

### Tests for User Story 1 ⚠️

- [ ] T010 [P] [US1] US境界の分岐・例外ケースを `specs/003-split-us-features/tests/us1-scope-boundary-tests.md` に定義する
- [ ] T011 [P] [US1] 依存逆転・衝突時の失敗シナリオを `specs/003-split-us-features/tests/us1-dependency-failure-tests.md` に定義する

### Implementation for User Story 1

- [ ] T012 [US1] US1/US2/US3 の in-scope/out-of-scope を `specs/003-split-us-features/split-feature-registry.md` に記述する
- [ ] T013 [US1] SplitFeatureUnit の初期レコードを `specs/003-split-us-features/split-feature-registry.md` に記述する
- [ ] T014 [US1] DependencyLink と意思決定SLAを `specs/003-split-us-features/dependency-graph.md` に記述する
- [ ] T015 [US1] 憲法の分割条件適合結果を `specs/003-split-us-features/checklists/split-integrity.md` に記録する
- [ ] T016 [US1] US1の独立検証結果を `specs/003-split-us-features/quality-gate-evidence.md` に記録する

**Checkpoint**: User Story 1 が独立で計画確定可能

---

## Phase 4: User Story 2 - 分割後 feature の仕様を独立化する (Priority: P1)

**Goal**: USごとに独立した spec/plan/tasks 成果物を成立させる

**Independent Test**: US1/US2/US3 の各featureで spec/plan/tasks が揃い、相互参照で矛盾がない

### Tests for User Story 2 ⚠️

- [ ] T017 [P] [US2] 成果物独立性テスト観点を `specs/003-split-us-features/tests/us2-artifact-independence-tests.md` に定義する
- [ ] T018 [P] [US2] 追跡1対1対応の検証観点を `specs/003-split-us-features/tests/us2-traceability-tests.md` に定義する

### Implementation for User Story 2

- [ ] T019 [P] [US2] US1用の独立specを `specs/004-us1-split/spec.md` に作成する
- [ ] T020 [P] [US2] US2用の独立specを `specs/005-us2-split/spec.md` に作成する
- [ ] T021 [P] [US2] US3用の独立specを `specs/006-us3-split/spec.md` に作成する
- [ ] T022 [US2] US1用の独立planを `specs/004-us1-split/plan.md` に作成する
- [ ] T023 [US2] US2用の独立planを `specs/005-us2-split/plan.md` に作成する
- [ ] T024 [US2] US3用の独立planを `specs/006-us3-split/plan.md` に作成する
- [ ] T025 [US2] US1用の独立tasksを `specs/004-us1-split/tasks.md` に作成する
- [ ] T026 [US2] US2用の独立tasksを `specs/005-us2-split/tasks.md` に作成する
- [ ] T027 [US2] US3用の独立tasksを `specs/006-us3-split/tasks.md` に作成する
- [ ] T028 [US2] 元要件IDの移行先を `specs/003-split-us-features/traceability-map.md` に反映する

**Checkpoint**: User Story 2 が独立で検証可能（3feature分の成果物が揃う）

---

## Phase 5: User Story 3 - 分割後の実行順と品質ゲートを確定する (Priority: P2)

**Goal**: 実行順・完了条件・品質ゲートを運用可能な手順として固定する

**Independent Test**: 開始条件/完了条件/品質ゲート/再統合条件が明文化され、順序説明と判定が可能

### Tests for User Story 3 ⚠️

- [ ] T029 [P] [US3] 品質ゲート pass/fail シナリオを `specs/003-split-us-features/tests/us3-quality-gate-tests.md` に定義する
- [ ] T030 [P] [US3] 実行順・待機条件の境界ケースを `specs/003-split-us-features/tests/us3-sequencing-tests.md` に定義する

### Implementation for User Story 3

- [ ] T031 [US3] 実行順と着手条件を `specs/003-split-us-features/execution-playbook.md` に定義する
- [ ] T032 [US3] US1の完了条件チェックを `specs/003-split-us-features/checklists/us1-dod.md` に定義する
- [ ] T033 [US3] US2の完了条件チェックを `specs/003-split-us-features/checklists/us2-dod.md` に定義する
- [ ] T034 [US3] US3の完了条件チェックを `specs/003-split-us-features/checklists/us3-dod.md` に定義する
- [ ] T035 [US3] 初回ドライランの順序・判定結果を `specs/003-split-us-features/quality-gate-evidence.md` に記録する

**Checkpoint**: User Story 3 が独立で運用検証可能

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 全USを横断した整合性・仕上げ

- [ ] T036 [P] 用語統一表を `specs/003-split-us-features/glossary.md` に作成する
- [ ] T037 分割仕様全体の整合性差分を `specs/003-split-us-features/split-consistency-report.md` に記録する
- [ ] T038 [P] quickstart検証結果を `specs/003-split-us-features/quickstart-validation-report.md` に記録する
- [ ] T039 最終成果物索引を `specs/003-split-us-features/README.md` に作成する

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 依存なし
- **Phase 2 (Foundational)**: Phase 1 完了後に開始
- **Phase 3-5 (User Stories)**: Phase 2 完了後に開始
- **Phase 6 (Polish)**: Phase 3-5 の対象完了後に開始

### User Story Dependencies

- **US1 (P1)**: Foundational 完了後に開始、他USへの依存なし
- **US2 (P1)**: US1 で確定した境界・依存順を前提に開始
- **US3 (P2)**: US2 で作成された独立成果物を入力として開始

### Within Each User Story

- テスト定義タスクを先に完了し、失敗観点を固定してから実装へ進む
- 構造定義（registry/map）を先に行い、その後に証跡・判定を記録する
- チェックリストと証跡の両方が揃って初めて完了とする

### Parallel Opportunities

- Setupでは T003/T004 を並行実行可能
- Foundationalでは T007/T008 を並行実行可能
- US1では T010/T011 を並行実行可能
- US2では T017/T018 を並行実行可能、T019/T020/T021 を並行実行可能
- US3では T029/T030 を並行実行可能
- Polishでは T036/T038 を並行実行可能

---

## Parallel Example: User Story 1

```bash
Task: "T010 [US1] specs/003-split-us-features/tests/us1-scope-boundary-tests.md を作成"
Task: "T011 [US1] specs/003-split-us-features/tests/us1-dependency-failure-tests.md を作成"
```

## Parallel Example: User Story 2

```bash
Task: "T019 [US2] specs/004-us1-split/spec.md を作成"
Task: "T020 [US2] specs/005-us2-split/spec.md を作成"
Task: "T021 [US2] specs/006-us3-split/spec.md を作成"
```

## Parallel Example: User Story 3

```bash
Task: "T029 [US3] specs/003-split-us-features/tests/us3-quality-gate-tests.md を作成"
Task: "T030 [US3] specs/003-split-us-features/tests/us3-sequencing-tests.md を作成"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 と Phase 2 を完了する
2. Phase 3 (US1) を完了する
3. US1 の独立テストと証跡を確認する
4. 分割計画の承認を取得する

### Incremental Delivery

1. Setup + Foundational を完了して共通基盤を固定する
2. US1 で境界と依存順を確定する
3. US2 で独立成果物を3feature分作成する
4. US3 で実行順と品質ゲート運用を固定する
5. Polish で整合性報告を仕上げる

### Parallel Team Strategy

1. 1名が governance/traceability を担当
2. 1名が feature別成果物（US1/US2/US3）の独立化を担当
3. 1名が品質ゲート証跡と最終整合性確認を担当
