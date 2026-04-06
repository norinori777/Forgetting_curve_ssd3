# Scope Boundary Definition: 003-split-us-features

**Feature**: 004-redefine-003-scope  
**Target Feature**: 003-split-us-features  
**Created**: 2026-04-06  
**Status**: Draft（T001 雛形）

---

## Purpose

003-split-us-features の in-scope と out-of-scope を再定義し、憲法の分割必須条件（ユーザーストーリー <=2 件、タスク <=14 件）へ適合させる。

---

## In-Scope（003 に残す作業）

003-split-us-features の責務を「方針定義・依存定義・移管管理」の 3 領域に限定する。

| 項目 | 対応 FR/SC | 根拠 |
|------|-----------|------|
| US1/US2/US3 の分割方針と境界の定義（スコープ境界定義） | FR-001, FR-002 | 方針定義は 003 の中核責務 |
| 後続 feature 間の依存関係・実行順序の定義 | FR-004 | 依存定義は 003 が一元管理する必要あり |
| 後続 feature への要件移管管理（1 対 1 マッピング） | FR-004, FR-005 | 移管管理は 003 の完了条件に直結 |
| 003 単体の完了条件定義（方針確定・移管計画確定・追跡表確定） | FR-005 | 完了判定基準を 003 内で保持する |
| 憲法適合判定証跡（ComplianceEvidence）の記録・管理 | FR-006, FR-008, SC-004, SC-005 | 適合性検証は 003 の説明責任 |

---

## Out-of-Scope（後続 feature へ移す作業）

実装タスク・独立 feature 成果物の作成は後続 feature で実施する。

| 項目 | 移管先 feature | 対応 FR（元） | 根拠 |
|------|---------------|-------------|------|
| 各 US の独立した spec/plan/tasks 成果物の作成 | 005-us1-split-spec（予定）| FR-002（003 旧） | 独立仕様化は各 feature の責務 |
| 各 US の独立実装・独立テスト実施 | 005/006/007（予定） | FR-003（003 旧） | 実装は後続 feature が担当 |
| 各 US の品質ゲート（lint/型チェック/テスト）実行 | 各後続 feature | FR-005（003 旧） | feature ごとに品質ゲートを保有する |
| 段階的仕様化・計画化・実装（US1→US2→US3 順） | 各後続 feature | FR-005a（003 旧） | 実行順は移管計画で制御する |
| 共通ルール文書の重複検知・一本化 | 各後続 feature | EdgeCase | 実装時の重複解消は後続で対応 |

---

## 完了条件（003 単体）

FR-005 の 3 条件に基づいて判定する。

1. **方針確定**: in-scope / out-of-scope が本ドキュメントに記録され、レビュー承認が得られていること
2. **移管計画確定**: `split-handover-plan.md` に後続 feature の順序・依存・開始条件・完了条件が記録されていること
3. **追跡表確定**: `requirement-handover-map.md` に元要件 ID の移管先が 1 対 1 で記録され、未分類が 0 件であること

---

## Rationale

- 確定日時: 2026-04-06
- 根拠 1（憲法適合）: 003 は 39 タスク・3 ストーリーで分割必須条件を超過していた（憲法 v1.0.1 §6.3）。再定義により 2 ストーリー・14 タスク以内に収まる最小責務に限定する。
- 根拠 2（再肥大化防止）: 実装タスクを in-scope から排除することで、「方針定義→後続 feature 実装」の責務分割を恒久化する。
- 根拠 3（回帰防止）: compliance-rules.md の定期判定と ComplianceEvidence の記録により、再定義後のスコープ拡大を早期検知できる体制を維持する。

---

## Finalization Record

| 項目 | 値 |
|------|----|
| featureId | 003-split-us-features |
| finalizedAt | 2026-04-06T00:00:00+09:00 |
| finalizedBy | 004-redefine-003-scope 実施チーム |

---

*このファイルは T001（雛形作成）で生成され、T007（US1 実装）で内容が確定される。*
