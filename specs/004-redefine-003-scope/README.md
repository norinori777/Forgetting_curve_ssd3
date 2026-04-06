# README: 004-redefine-003-scope 成果物索引

**Feature**: 004-redefine-003-scope  
**Branch**: develop  
**Purpose**: 003-split-us-features のスコープを再定義し、憲法の分割必須条件（ユーザーストーリー <=2、タスク <=14）へ適合させる  
**Status**: 完了  
**Created**: 2026-04-06

---

## Summary

003-split-us-features は 39 タスク・3 ユーザーストーリーで構成されており、憲法 v1.0.1 の分割必須条件（tasks>=15 または stories>=3）を超過していた。  
本 feature（004）はその責務を「方針定義・依存定義・移管管理」に限定し、後続 feature（005/006/007）への移管計画を確定する。

**適合判定**: `storyCount=2, taskCount=14, policyPassed=true`

---

## Design Artifacts

| ファイル | 内容 | 関連タスク |
|---------|------|-----------|
| [spec.md](spec.md) | 機能仕様（2 US, FR-001〜FR-008, SC-001〜SC-005）| - |
| [plan.md](plan.md) | 実装計画（技術コンテキスト、フェーズ構成） | - |
| [research.md](research.md) | 技術判断・設計決定 5 件 | - |
| [data-model.md](data-model.md) | エンティティ定義（4 エンティティ） | - |
| [quickstart.md](quickstart.md) | 実行手順（4 ステップ + 完了条件） | - |
| [tasks.md](tasks.md) | タスク一覧（T001〜T014、14 タスク） | - |
| [checklists/requirements.md](checklists/requirements.md) | 仕様品質チェックリスト（全項目 pass） | - |

---

## Implementation Artifacts

### Phase 1: Setup

| ファイル | 内容 | タスク |
|---------|------|--------|
| [scope-boundary-definition.md](scope-boundary-definition.md) | 003 の in-scope/out-of-scope・完了条件・根拠 | T001（雛形）+ T007（確定） |
| [requirement-handover-map.md](requirement-handover-map.md) | 元要件 ID 1 対 1 移管台帳（16 件、未分類 0 件） | T002（雛形）+ T012（確定） |

### Phase 2: Foundational

| ファイル | 内容 | タスク |
|---------|------|--------|
| [compliance-rules.md](compliance-rules.md) | 003 適合判定ルール（story<=2, task<=14）| T003 |
| [split-handover-plan.md](split-handover-plan.md) | 後続 feature 移管計画（HO-001〜HO-003）| T004（雛形）+ T011（確定） |

### Phase 3: US1 テスト観点

| ファイル | 内容 | タスク |
|---------|------|--------|
| [tests/us1-boundary-cases.md](tests/us1-boundary-cases.md) | 境界条件テスト（11 ケース） | T005 |
| [tests/us1-failure-cases.md](tests/us1-failure-cases.md) | 失敗シナリオテスト（8 ケース） | T006 |

### Phase 3: US1 実装

| ファイル | 内容 | タスク |
|---------|------|--------|
| [scope-boundary-definition.md](scope-boundary-definition.md) | T007 で in-scope/out-of-scope を記入 | T007 |
| [compliance-evidence.md](compliance-evidence.md) | 適合判定証跡（EVD-004-001, policyPassed=true）| T008 |

### Phase 4: US2 テスト観点

| ファイル | 内容 | タスク |
|---------|------|--------|
| [tests/us2-dependency-cases.md](tests/us2-dependency-cases.md) | 依存循環検出テスト（11 ケース） | T009 |
| [tests/us2-traceability-cases.md](tests/us2-traceability-cases.md) | 要件 1 対 1 対応テスト（12 ケース） | T010 |

### Phase 4: US2 実装

| ファイル | 内容 | タスク |
|---------|------|--------|
| [split-handover-plan.md](split-handover-plan.md) | T011 で後続 feature 順序・依存・条件を記入 | T011 |
| [requirement-handover-map.md](requirement-handover-map.md) | T012 で 16 要件の 1 対 1 移管先を記入 | T012 |

### Phase 5: Polish

| ファイル | 内容 | タスク |
|---------|------|--------|
| [quickstart-validation-report.md](quickstart-validation-report.md) | quickstart 手順の検証結果（全 SC PASS） | T013 |
| [README.md](README.md) | 本ファイル（成果物索引） | T014 |

---

## Successor Features

| feature ID | 目的 | 開始条件 | ステータス |
|------------|------|----------|----------|
| 005-us1-split-plan | US1/US2/US3 スコープ境界の詳細化と分割計画の確定 | 003 完了 | pending |
| 006-us2-independent-spec | 各 US の独立 spec/plan/tasks 成果物の作成 | 005 完了 | blocked |
| 007-us3-quality-gates | 品質ゲート・実行順・完了判定の確定 | 006 完了 | blocked |

---

## Compliance Summary

| 項目 | 値 | 判定 |
|------|-----|------|
| User Stories | 2 | ✓ PASS（<=2） |
| Tasks | 14 | ✓ PASS（<=14） |
| policyPassed | true | ✓ PASS |
| 憲法基準 | v1.0.1 §6.3 | ✓ 適合 |

---

## References

- 設計仕様: [spec.md](spec.md)
- 実装計画: [plan.md](plan.md)
- 技術決定: [research.md](research.md)
- データモデル: [data-model.md](data-model.md)
- 実行手順: [quickstart.md](quickstart.md)
- タスク一覧: [tasks.md](tasks.md)
- 適合証跡: [compliance-evidence.md](compliance-evidence.md)
- 要件移管台帳: [requirement-handover-map.md](requirement-handover-map.md)
- 後続 feature 計画: [split-handover-plan.md](split-handover-plan.md)
- 憲法: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)
