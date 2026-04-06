# Compliance Rules: 003-split-us-features 適合判定ルール

**Feature**: 004-redefine-003-scope  
**Target Feature**: 003-split-us-features  
**Created**: 2026-04-06  
**Applicable Policy**: 憲法 v1.0.1（`.specify/memory/constitution.md`）

---

## Purpose

003-split-us-features が分割必須条件に適合しているかを客観的・機械的に判定するためのルールを定義する。

---

## Compliance Criteria

### Rule 1: ユーザーストーリー上限

| 判定項目 | 条件 | 判定値（003 再定義後） |
|----------|------|----------------------|
| storyCount | **storyCount <= 2** | 2（US1: 責務境界縮小確定, US2: 分割移管確定） |

- **PASS 要件**: 003 の spec.md に定義されるユーザーストーリーが 2 件以下であること
- **FAIL 条件**: ユーザーストーリーが 3 件以上 → 分割必須（憲法 v1.0.1 §6.3）

---

### Rule 2: タスク上限

| 判定項目 | 条件 | 判定値（003 再定義後） |
|----------|------|----------------------|
| taskCount | **taskCount <= 14** | 14 件以内（004 の 14 タスクを上限設計の参照例とする） |

- **PASS 要件**: 003 の tasks.md に定義されるタスク総数が 14 件以下であること
- **FAIL 条件**: タスクが 15 件以上 → 分割必須（憲法 v1.0.1 §6.3）

---

### Rule 3: policyPassed 判定式

```
policyPassed = storyCount <= 2 AND taskCount <= 14
```

両条件を同時に満たさない限り `policyPassed = false` とする。

---

## Verification Procedure

1. 003 再定義後の spec.md を開き、ユーザーストーリー数を数える
2. 003 の tasks.md を開き、`- [ ]` および `- [x]` を含む行をカウントする
3. Rule 1 / Rule 2 を評価し、policyPassed を記録する
4. ComplianceEvidence（`compliance-evidence.md`）に結果を登録する
5. 判定者・日時を記録し、レビュー承認を得る

---

## Review Checkpoint

| 項目 | 説明 |
|------|------|
| 実施タイミング | 003 の spec/plan/tasks 更新後、初回レビュー前 |
| 判定者 | プロダクトオーナーまたは指定レビュアー |
| 記録先 | `specs/004-redefine-003-scope/compliance-evidence.md` |
| 再判定条件 | 003 の仕様・タスク変更のたびに再実施 |

---

## References

- 憲法 v1.0.1: `.specify/memory/constitution.md` §6.3（分割必須条件）
- FR-008: 003 feature 単体の計画制約（ユーザーストーリー <=2, タスク <=14）
- SC-004, SC-005: 適合判定記録の必須要件
