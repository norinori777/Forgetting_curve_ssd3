# US1 Boundary Cases: 003の責務境界縮小確定

**Feature**: 004-redefine-003-scope / User Story 1  
**Testing Skill**: testing-core（Branch coverage / 境界値 / 失敗シナリオ）  
**Created**: 2026-04-06

---

## Purpose

003の責務境界定義（in-scope / out-of-scope / 完了条件）に関する境界値テスト・分岐カバレッジ観点を定義する。  
このファイルを T007（実装）着手前に確定し、実装後の検証に使用する。

---

## Boundary Case Table

| Case ID | Case | Input（境界） | Setup（前提） | Expected（期待） | Branch（潰す分岐） |
|---------|------|---------------|----------------|------------------|--------------------|
| BC-US1-01 | in-scope 最小（1件）| inScopeItems = ["方針定義"] | 正常状態 | 有効な ScopeBoundaryDefinition | inScopeItems.length >= 1 → true |
| BC-US1-02 | in-scope 上限なし（複数）| inScopeItems = ["方針定義", "依存定義", "移管管理"] | 正常状態 | 有効（項目数制限なし） | length >= 1 → true |
| BC-US1-03 | in-scope 空（0件）| inScopeItems = [] | 異常状態 | バリデーション失敗（最小1項目必須） | length >= 1 → false |
| BC-US1-04 | in-scope と out-of-scope に重複あり | inScopeItems = ["A"], outOfScopeItems = ["A"] | 矛盾状態 | バリデーション失敗（重複禁止） | 重複チェック → true（エラー） |
| BC-US1-05 | in-scope と out-of-scope に重複なし | inScopeItems = ["A"], outOfScopeItems = ["B"] | 正常状態 | 有効な ScopeBoundaryDefinition | 重複チェック → false（OK） |
| BC-US1-06 | ユーザーストーリー数 = 2（上限ぴったり） | storyCount = 2 | 再定義後 | PASS（<= 2 条件を満たす） | storyCount <= 2 → true |
| BC-US1-07 | ユーザーストーリー数 = 3（上限超過） | storyCount = 3 | 再定義後 | FAIL（分割必須） | storyCount <= 2 → false |
| BC-US1-08 | タスク数 = 14（上限ぴったり） | taskCount = 14 | 再定義後 | PASS（<= 14 条件を満たす） | taskCount <= 14 → true |
| BC-US1-09 | タスク数 = 15（上限超過） | taskCount = 15 | 再定義後 | FAIL（分割必須） | taskCount <= 14 → false |
| BC-US1-10 | 完了条件 3 要素のうち 1 つ欠ける | doneCriteria のうち方針確定のみ記録 | 部分確定状態 | 完了判定 FAIL（3 条件すべて必須） | doneCriteria.length == 3 → false |
| BC-US1-11 | 完了条件 3 要素すべて記録 | 方針確定・移管計画確定・追跡表確定がすべて記録 | 最終確定状態 | 完了判定 PASS | doneCriteria.length == 3 → true |

---

## Coverage Mapping

| FR / SC | 対応 Case ID |
|---------|-------------|
| FR-001（in-scope/out-of-scope 定義） | BC-US1-01, BC-US1-02, BC-US1-03, BC-US1-04, BC-US1-05 |
| FR-002（責務を3領域に限定） | BC-US1-01, BC-US1-02 |
| FR-005（完了条件 3 条件判定） | BC-US1-10, BC-US1-11 |
| FR-006（分割必須条件検証） | BC-US1-06, BC-US1-07, BC-US1-08, BC-US1-09 |
| FR-008（story<=2, task<=14）| BC-US1-06, BC-US1-07, BC-US1-08, BC-US1-09 |
| SC-001（3 要素 100% 定義） | BC-US1-10, BC-US1-11 |

---

## Notes

- 境界値は「前 / 一致 / 後（±1）」を基本とし、BC-US1-06/07（story 2/3）と BC-US1-08/09（task 14/15）でカバーする
- inScopeItems = [] のケース（BC-US1-03）は data-model の最小 1 項目バリデーションを検証する
- 重複チェック（BC-US1-04/05）は data-model の重複禁止ルールに基づく
