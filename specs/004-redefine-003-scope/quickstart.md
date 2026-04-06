# Quickstart: 003スコープ再定義（分割必須条件適合）

## Purpose

003 feature の責務境界を再定義し、分割必須条件に適合した状態で後続featureへ移管できるようにする。

## Prerequisites

- `specs/004-redefine-003-scope/spec.md` が最新
- `specs/004-redefine-003-scope/plan.md` がConstitution Checkを通過
- 旧 `specs/003-split-us-features/` のspec/plan/tasksを参照可能

## Step 1: 境界を確定する

1. `ScopeBoundaryDefinition` に in-scope/out-of-scope を記録する
2. 003の責務を「方針定義・依存定義・移管管理」に限定する
3. 実装関連項目は out-of-scope へ移す

## Step 2: 移管計画を作成する

1. `SplitHandoverPlan` に後続feature一覧と順序を記録する
2. 各後続featureの開始条件・完了条件を定義する
3. 依存循環がないことを確認する

## Step 3: 要件移管を確定する

1. `RequirementHandoverMap` を元要件ID単位で作成する
2. 1要件につき1つの移管先featureを割り当てる
3. 未分類要件があれば1営業日以内に確定する

## Step 4: 憲法適合を検証する

1. `ComplianceEvidence` に storyCount と taskCount を記録する
2. storyCount <= 2 と taskCount <= 14 を満たすことを確認する
3. 判定者・判定時刻を記録し、レビュー承認を得る

## Completion Criteria

- SC-001: in-scope/out-of-scope/完了条件の3要素が100%定義
- SC-002: 後続featureの順序・依存合意が1営業日以内
- SC-003: 要件移管の1対1対応率100%
- SC-004: 003単体が分割必須条件を超過しないことを100%確認
- SC-005: story<=2 かつ task<=14 の適合判定記録率100%
