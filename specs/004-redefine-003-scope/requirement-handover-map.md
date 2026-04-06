# Requirement Handover Map: 003-split-us-features

**Feature**: 004-redefine-003-scope  
**Target Feature**: 003-split-us-features  
**Created**: 2026-04-06  
**Status**: Draft（T002 雛形）

---

## Purpose

元要件 ID（FR-xxx / SC-xxx）を単一の移管先 feature へ 1 対 1 で対応付け、追跡可能性と漏れなしを機械的に検証できるようにする。

---

## Handover Table

003-split-us-features の全 FR/SC を 1 対 1 で移管先 feature（または再定義後 003 自身）に対応付ける。

| sourceRequirementId | targetFeatureId | mappingStatus | verifiedBy | verifiedAt | 備考 |
|---------------------|-----------------|---------------|------------|------------|------|
| FR-001（スコープ境界定義） | 003-split-us-features | verified | 004 実施チーム | 2026-04-06 | 003 の in-scope に残す。scope-boundary-definition.md で管理 |
| FR-002（各US独立成果物管理）| 006-us2-independent-spec | mapped | - | - | 独立 spec/plan/tasks 作成は 006 が担当 |
| FR-003（独立受け入れシナリオ） | 006-us2-independent-spec | mapped | - | - | 各 US の独立検証は 006 で実施 |
| FR-004（依存関係明示） | 003-split-us-features | verified | 004 実施チーム | 2026-04-06 | 003 の in-scope に残す。split-handover-plan.md で管理 |
| FR-005（品質ゲート条件） | 007-us3-quality-gates | mapped | - | - | feature ごとの品質ゲート定義は 007 が担当 |
| FR-005a（US1→US2→US3 段階実行）| 003-split-us-features | verified | 004 実施チーム | 2026-04-06 | 実行順ガバナンスは 003 の移管計画（split-handover-plan.md）で管理 |
| FR-006（重複要件統合ルール） | 005-us1-split-plan | mapped | - | - | 分割計画確定時に重複ルールを策定する（005 担当） |
| FR-007（追跡可能性保持） | 003-split-us-features | verified | 004 実施チーム | 2026-04-06 | 003 の in-scope に残す。requirement-handover-map.md 自体が証跡 |
| FR-007a（元要件ID 1対1対応） | 003-split-us-features | verified | 004 実施チーム | 2026-04-06 | 本ファイルの構造自体が 1 対 1 ポリシーを実装 |
| FR-008（PRマージ前品質ゲート） | 007-us3-quality-gates | mapped | - | - | PR 品質ゲート基準の確定は 007 が担当 |
| SC-001（3 feature spec/plan/tasks 作成） | 006-us2-independent-spec | mapped | - | - | 独立成果物完成の判定は 006 で |
| SC-002（依存文書化・1営業日合意） | 003-split-us-features | verified | 004 実施チーム | 2026-04-06 | 003 の split-handover-plan.md で管理 |
| SC-003（単独受け入れシナリオ検証 100%）| 006-us2-independent-spec | mapped | - | - | 各 feature 単独検証可能性は 006 で確認 |
| SC-004（要件衝突 50% 削減） | 005-us1-split-plan | mapped | - | - | 分割後衝突削減は 005 の境界定義で実現 |
| SC-005（品質ゲート 100%）| 007-us3-quality-gates | mapped | - | - | 品質ゲート達成率の測定は 007 が担当 |
| SC-006（TraceabilityMap 1 対 1 100%）| 003-split-us-features | verified | 004 実施チーム | 2026-04-06 | 本ファイル（requirement-handover-map.md）が SC-006 の具体的成果物 |

---

## Unmapped Requirements

現時点で未分類の要件はない。

| sourceRequirementId | 記録日 | 確定期限 | 担当者 |
|---------------------|--------|----------|--------|
| なし | - | - | - |

---

## Validation Rules

- sourceRequirementId は 1 件につき 1 つの targetFeatureId のみ（重複割当禁止）
- mappingStatus=closed は verifiedBy / verifiedAt 必須
- 未分類要件は記録日から 1 営業日以内に targetFeatureId を確定する

---

## State Transition

```
mapped → verified（依存・移管漏れチェック完了）
verified → closed（レビュー承認と証跡登録完了）
```

---

*このファイルは T002（雛形作成）で生成され、T012（US2 実装）で内容が確定された。*
