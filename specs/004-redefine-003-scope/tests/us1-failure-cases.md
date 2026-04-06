# US1 Failure Cases: 003の責務境界縮小確定 — 失敗シナリオ

**Feature**: 004-redefine-003-scope / User Story 1  
**Testing Skill**: testing-core（失敗・例外シナリオの網羅）  
**Created**: 2026-04-06

---

## Purpose

003スコープ再定義において発生しうる失敗・例外シナリオ（上限制約超過・未分類要件・バリデーション違反）の観点を定義する。  
このファイルを T007（実装）着手前に確定し、実装後の検証に使用する。

---

## Failure Scenario Table

| Case ID | シナリオ | 原因 | Expected（期待） | 対処 |
|---------|----------|------|-----------------|------|
| FS-US1-01 | 上限制約超過（story >= 3）| 再定義後も 003 に 3 件以上のストーリーが残る | FAIL / ComplianceEvidence.policyPassed = false | 超過ストーリーを後続 feature へ移管し再判定 |
| FS-US1-02 | 上限制約超過（task >= 15）| 再定義後も 003 に 15 件以上のタスクが残る | FAIL / ComplianceEvidence.policyPassed = false | 超過タスクを後続 feature へ移管し再判定 |
| FS-US1-03 | 未分類要件の存在 | 移管先 feature が未決定の要件が残る | RequirementHandoverMap に未分類エントリが記録される | 1 営業日以内に targetFeatureId を確定 |
| FS-US1-04 | 要件の重複割当 | 同一 sourceRequirementId が複数 targetFeatureId へ割り当て | バリデーション失敗（1 対 1 原則違反） | 重複を解消し唯一の移管先を確定 |
| FS-US1-05 | in-scope と out-of-scope の重複 | 同一項目が両方に記録される | ScopeBoundaryDefinition バリデーション失敗 | 重複項目を in-scope / out-of-scope のいずれかに再分類 |
| FS-US1-06 | inScopeItems が空 | 責務が何も定義されていない状態 | ScopeBoundaryDefinition バリデーション失敗（最小 1 項目必須） | in-scope に「方針定義」を最低 1 項目記入 |
| FS-US1-07 | 完了条件 3 要素のうちいずれかが未記録 | 方針確定・移管計画確定・追跡表確定のいずれかが欠落 | 完了判定 FAIL | 欠落している完了条件を記録してから再判定 |
| FS-US1-08 | finalizedAt がレビュー承認時刻より後 | 事後改ざんまたは記録ミス | ScopeBoundaryDefinition バリデーション失敗 | finalizedAt をレビュー承認時刻以前に修正 |

---

## Coverage Mapping

| FR / SC | 対応 Case ID |
|---------|-------------|
| FR-001（in-scope/out-of-scope 定義） | FS-US1-05, FS-US1-06 |
| FR-004（移管先 1 対 1 対応） | FS-US1-04 |
| FR-005（完了条件 3 条件判定） | FS-US1-07 |
| FR-006（分割必須条件検証可能） | FS-US1-01, FS-US1-02 |
| FR-008（story<=2, task<=14） | FS-US1-01, FS-US1-02 |
| SC-001（3 要素 100% 定義） | FS-US1-07 |
| SC-003（元要件 ID 1 対 1 対応率 100%）| FS-US1-03, FS-US1-04 |
| SC-005（適合判定記録 100%） | FS-US1-01, FS-US1-02 |

---

## Edge Cases（spec.md から引用）

| Edge Case | 対応シナリオ |
|-----------|-------------|
| 再定義後もタスク数が閾値を超える場合は方針策定と監査管理へ再分離 | FS-US1-02（再帰的な再定義が必要なケース） |
| 移管先未定の要件が出た場合は一時的に未分類として記録し 1 営業日以内に確定 | FS-US1-03 |
| 同一要件 ID が複数 feature へ重複割当された場合は 1 対 1 原則で解消 | FS-US1-04 |

---

## Notes

- FS-US1-01/02 は ComplianceEvidence.policyPassed を直接検証する失敗パス
- FS-US1-03 は RequirementHandoverMap の「未分類状態」を検証する失敗パス
- FS-US1-08 は finalizedAt のタイムスタンプ整合性を検証するケース（tamper防止）
