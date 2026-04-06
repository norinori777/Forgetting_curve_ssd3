# US2 Traceability Cases: 後続featureへの分割移管確定 — 要件1対1対応テスト観点

**Feature**: 004-redefine-003-scope / User Story 2  
**Testing Skill**: testing-core（Branch coverage / 境界値 / 失敗シナリオ）  
**Created**: 2026-04-06

---

## Purpose

003-split-us-features の元要件 ID が正確に 1 対 1 で後続 feature へ移管されることを検証するテスト観点を定義する。  
このファイルを T012（要件移管の実装）着手前に確定し、実装後の検証に使用する。

---

## Traceability Test Table

| Case ID | Case | Input | Setup | Expected | Branch |
|---------|------|-------|-------|----------|--------|
| TC-US2-01 | 1 対 1 対応（正常）| FR-001 → feature-A のみ | 正常状態 | PASS（RequirementHandoverMap 有効） | targetFeatureId 重複 → false（OK） |
| TC-US2-02 | 1 要件を複数 feature へ重複割当 | FR-001 → feature-A, FR-001 → feature-B | 異常状態 | FAIL（重複割当禁止違反） | targetFeatureId 重複 → true（エラー） |
| TC-US2-03 | 未分類要件（targetFeatureId = null）| FR-009 → null | 移管先未確定 | 未分類として記録、1 営業日以内に確定必須 | mappingStatus = unmapped → alert |
| TC-US2-04 | 全要件が mapped 済み | 全 FR/SC → 移管先あり | 完全移管状態 | SC-003（1 対 1 対応率 100%）PASS | 未分類件数 = 0 → PASS |
| TC-US2-05 | 1 件でも未分類 | FR-009 → null | 部分的未確定 | SC-003 FAIL（対応率 < 100%） | 未分類件数 > 0 → FAIL |
| TC-US2-06 | mappingStatus=closed で verifiedBy 省略 | verifiedBy = "" | バリデーション違反 | FAIL（closed には verifiedBy/verifiedAt 必須） | verifiedBy 空 → エラー |
| TC-US2-07 | mappingStatus=closed で全フィールド設定 | verifiedBy = "POname", verifiedAt = "2026-04-06" | 正常な closed 状態 | PASS | verifiedBy 空 → false（OK） |
| TC-US2-08 | mapped → verified 遷移（正常）| 依存・移管漏れチェック完了 | 正常フロー | PASS（verified へ遷移） | チェック完了 → true |
| TC-US2-09 | verified → closed 遷移（正常）| レビュー承認と証跡登録完了 | 正常フロー | PASS（closed へ遷移） | 承認済み → true |
| TC-US2-10 | 逆遷移（closed → verified）| closed 後に再オープン試行 | 異常フロー | FAIL（状態遷移規則違反） | closed → 許可状態外 |
| TC-US2-11 | 境界値: 移管対象 0 件 | 移管要件が存在しない | 空の移管台帳 | FAIL（移管台帳は最低 1 要件必須） | count == 0 → FAIL |
| TC-US2-12 | 境界値: 移管対象 1 件 | FR-001 のみ → feature-A | 最小ケース | PASS | count == 1 → 有効 |

---

## Coverage Mapping

| FR / SC | 対応 Case ID |
|---------|-------------|
| FR-004（元要件 ID 1 対 1 対応） | TC-US2-01, TC-US2-02, TC-US2-11, TC-US2-12 |
| FR-007（移管漏れ確認） | TC-US2-03, TC-US2-04, TC-US2-05 |
| SC-003（元要件 ID 移管先 1 対 1 対応率 100%）| TC-US2-04, TC-US2-05 |

---

## State Transition Coverage

| 遷移 | 正常 Case | 失敗 Case |
|------|-----------|-----------|
| mapped → verified | TC-US2-08 | - |
| verified → closed | TC-US2-09 | TC-US2-06 |
| closed → verified（禁止）| - | TC-US2-10 |

---

## Notes

- TC-US2-02 は 1 対 1 原則（data-model の sourceRequirementId は 1 件 = 1 targetFeatureId）を検証
- TC-US2-03/05 は「未分類要件 → 1 営業日以内に確定」という Edge Case ポリシーを検証
- TC-US2-11/12 は RequirementHandoverMap の空状態と最小状態を境界値として検証
