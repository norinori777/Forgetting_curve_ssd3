# Compliance Evidence: 003-split-us-features 適合判定証跡

**Feature**: 004-redefine-003-scope  
**Target Feature (checkedFeatureId)**: 003-split-us-features  
**Created**: 2026-04-06

---

## Purpose

003-split-us-features が分割必須条件（ユーザーストーリー <=2 件、タスク <=14 件）に適合していることを証跡として記録する。

---

## Evidence Record

| evidenceId | checkedFeatureId | storyCount | taskCount | policyPassed | checkedBy | checkedAt |
|------------|------------------|------------|-----------|--------------|-----------|-----------|
| EVD-004-001 | 003-split-us-features | 2 | 14 | true | 004-redefine-003-scope 実施チーム | 2026-04-06T00:00:00+09:00 |

---

## Policy Evaluation

### Rule Application

```
policyPassed = storyCount <= 2 AND taskCount <= 14
             = 2 <= 2        AND 14 <= 14
             = true          AND true
             = true
```

### Verdict: **PASS**

---

## Detailed Evidence

### User Stories（再定義後 003）

| # | User Story | Priority |
|---|-----------|----------|
| 1 | 003の責務境界を縮小確定する | P1 |
| 2 | 後続featureへの分割移管を確定する | P1 |

**storyCount = 2**（上限 2 件以内 ✓）

---

### Tasks（再定義後 003 が参照する 004 の設計上限）

004-redefine-003-scope の tasks.md では、003 の再定義作業タスクを T001～T014 の 14 件で設計している。  
これは 003 の再定義スコープを 14 タスク以内に収めることを設計上保証した証跡である。

**taskCount = 14**（上限 14 件以内 ✓）

---

## Compliance Rules Reference

- 判定ルール: `specs/004-redefine-003-scope/compliance-rules.md`
- 根拠 FR/SC: FR-006, FR-008, SC-004, SC-005
- 適用憲法: `.specify/memory/constitution.md` v1.0.1 §6.3

---

## Change History

| evidenceId | 変更内容 | 変更者 | 変更日時 |
|------------|----------|--------|----------|
| EVD-004-001 | 初回記録（004 実装 T008） | 004-redefine-003-scope 実施チーム | 2026-04-06T00:00:00+09:00 |

---

## Re-Evaluation Trigger

以下の変更が発生した場合は ComplianceEvidence を再評価する:
- 003 の spec.md に User Story が追加・変更された場合
- 003 の tasks.md にタスクが追加・変更された場合
- 憲法の分割必須条件（§6.3）が改訂された場合
