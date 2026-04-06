# US2 Dependency Cases: 後続featureへの分割移管確定 — 依存循環検出テスト観点

**Feature**: 004-redefine-003-scope / User Story 2  
**Testing Skill**: testing-core（Branch coverage / 境界値 / 失敗シナリオ）  
**Created**: 2026-04-06

---

## Purpose

後続 feature の依存グラフに循環依存が存在しないことを検証するテスト観点を定義する。  
このファイルを T011（依存計画の実装）着手前に確定し、実装後の検証に使用する。

---

## Dependency Pattern Test Table

| Case ID | Case | Input（依存グラフ） | Setup | Expected | Branch |
|---------|------|---------------------|-------|----------|--------|
| DC-US2-01 | 依存なし（独立 feature）| A → [] | 初期状態 | PASS（循環なし） | no dependency → true |
| DC-US2-02 | 線形依存（A → B → C）| A → [], B → [A], C → [B] | 正常な直列 | PASS（循環なし） | DFS 完走 → true |
| DC-US2-03 | 直接循環（A → B → A）| A → [B], B → [A] | 異常状態 | FAIL（循環検出） | back edge 検出 → true（エラー） |
| DC-US2-04 | 間接循環（A → B → C → A）| A → [B], B → [C], C → [A] | 異常状態 | FAIL（循環検出） | DFS back edge → true（エラー） |
| DC-US2-05 | executionOrder 重複あり | A: order=1, B: order=1 | 異常状態 | FAIL（order 一意制約違反） | order 重複チェック → true（エラー） |
| DC-US2-06 | executionOrder 重複なし | A: order=1, B: order=2, C: order=3 | 正常状態 | PASS（一意） | order 重複チェック → false（OK） |
| DC-US2-07 | sourceFeatureId が 003 以外 | sourceFeatureId = "002-X" | 異常状態 | FAIL（sourceFeatureId バリデーション失敗） | sourceFeatureId == 003 → false（エラー） |
| DC-US2-08 | sourceFeatureId が 003 | sourceFeatureId = "003-split-us-features" | 正常状態 | PASS | sourceFeatureId == 003 → true |
| DC-US2-09 | entryCriteria が空 | entryCriteria = [] | 不完全な計画 | FAIL（開始条件は最低 1 件必須と想定） | entryCriteria.length > 0 → false（エラー） |
| DC-US2-10 | entryCriteria が設定済み | entryCriteria = ["前 feature の done 確認"] | 正常状態 | PASS | entryCriteria.length > 0 → true |
| DC-US2-11 | 循環確認後に移管保留 | 循環検出済み feature を承認しようとする | 承認フロー中 | 保留（承認ブロック）。循環が解消されるまで承認不可 | 循環あり → 承認ブロック |

---

## Coverage Mapping

| FR / SC | 対応 Case ID |
|---------|-------------|
| FR-003（後続 feature の依存関係定義） | DC-US2-01, DC-US2-02, DC-US2-03, DC-US2-04 |
| FR-004（依存先の検証） | DC-US2-07, DC-US2-08 |
| FR-007（循環と移管漏れ確認） | DC-US2-03, DC-US2-04, DC-US2-11 |
| SC-002（1 営業日以内の依存合意）| DC-US2-02（正常系の前提となる依存構造） |

---

## Notes

- DC-US2-03/04 は依存グラフの DFS（深さ優先探索）で back edge を検出するケース
- DC-US2-05/06 は executionOrder の一意性バリデーションを検証する
- DC-US2-11 は「循環検出 → 移管承認保留」のポリシーを検証する（spec.md Edge Cases より）
