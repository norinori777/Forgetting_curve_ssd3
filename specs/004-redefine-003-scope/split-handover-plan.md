# Split Handover Plan: 003-split-us-features → 後続 feature 移管計画

**Feature**: 004-redefine-003-scope  
**Source Feature**: 003-split-us-features  
**Created**: 2026-04-06  
**Status**: Draft（T004 雛形）

---

## Purpose

003-split-us-features から切り出す後続 feature の一覧・実行順序・依存関係・開始条件・完了条件を定義し、依存循環のない安全な移管を保証する。

---

## Handover Overview

003-split-us-features（再定義後）の完了を起点に、3 つの後続 feature が順番に実行される。

```
003-split-us-features（再定義後: 方針定義・依存定義・移管管理）
        │
        ▼ 完了条件: 境界確定・移管計画確定・要件台帳確定
 [005-us1-split-plan]（US1/US2/US3 スコープ境界の詳細化と分割計画の確定）
        │
        ▼ 完了条件: 005 の spec/plan/tasks 完成
 [006-us2-independent-spec]（US1/US2/US3 の独立 spec・plan・tasks 成果物の作成）
        │
        ▼ 完了条件: 006 の各独立成果物レビュー承認
 [007-us3-quality-gates]（分割後 feature の品質ゲート・実行順・完了判定の確定）
```

---

## Handover Entries

| handoverId | targetFeatureId | executionOrder | dependencyTargets | entryCriteria | doneCriteria |
|------------|-----------------|----------------|-------------------|---------------|--------------|
| HO-001 | 005-us1-split-plan | 1 | [] | 003 完了（境界確定・移管計画確定・要件台帳確定） | US1/US2/US3 の詳細スコープ境界と分割計画が spec.md に記録され、レビュー承認済み |
| HO-002 | 006-us2-independent-spec | 2 | [HO-001] | 005 完了（分割計画承認済み） | 各 US ごとに独立した spec/plan/tasks が作成され、相互矛盾がないことをレビュー確認済み |
| HO-003 | 007-us3-quality-gates | 3 | [HO-002] | 006 完了（独立成果物レビュー承認済み） | 実行順・完了条件・品質ゲートが文書化され、チーム合意済み |

---

## Validation Rules

- sourceFeatureId は `003-split-us-features` で固定
- executionOrder は重複不可（一意）: HO-001=1, HO-002=2, HO-003=3
- dependencyTargets に循環依存を含まないこと（循環を検出した場合は依存を解消するまで移管承認を保留する）

---

## Circular Dependency Check

依存グラフ（HO-001 → HO-002 → HO-003）を検証した結果:

| 確認日 | 実施者 | 循環検出 | 対処内容 |
|--------|--------|----------|----------|
| 2026-04-06 | 004-redefine-003-scope 実施チーム | なし | 003 → 005 → 006 → 007 の線形依存のみ。back edge なし。 |

**判定**: PASS（依存循環なし）

- HO-001: dependencyTargets = []（独立、先頭）
- HO-002: dependencyTargets = [HO-001]（HO-001 が先行）
- HO-003: dependencyTargets = [HO-002]（HO-002 が先行）

グラフ: 003 → HO-001 → HO-002 → HO-003（有向非巡回グラフ）

---

## Status Update（status field は SplitHandoverPlan の管理外だが参考記録）

| handoverId | 現状ステータス | 備考 |
|------------|----------------|------|
| HO-001 | pending | 003 完了後に着手可能 |
| HO-002 | blocked | HO-001 完了待ち |
| HO-003 | blocked | HO-002 完了待ち |

---

*このファイルは T004（雛形作成）で生成され、T011（US2 実装）で内容が確定された。*
