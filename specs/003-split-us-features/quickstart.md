# Quickstart: US1/US2/US3 分割 feature 化

## Purpose

US1/US2/US3を独立featureとして運用するための最短実行手順を示す。

## Prerequisites

- `specs/003-split-us-features/spec.md` が最新である
- `specs/003-split-us-features/plan.md` がConstitution Checkを通過している
- 既存統合仕様の要件ID一覧を参照できる

## Step 1: 分割方針を固定する

1. `SplitFeatureUnit` を US1/US2/US3 の3件で定義する
2. `DependencyLink` を US1->US2、US2->US3 で定義する
3. 依存衝突時の決定者を product_owner、SLAを1営業日に設定する

## Step 2: 追跡可能性を作成する

1. 元要件IDごとに `TraceabilityMap` を作成する
2. 各要件を単一の targetFeatureId に対応付ける
3. `spec`, `plan`, `tasks` への反映先を artifactPath で記録する

## Step 3: featureごとの品質ゲートを適用する

1. 各featureで tests-first で作業を進める
2. PRマージ前に test/lint/typecheck を必ず実行する
3. 3ゲートすべてが成功したfeatureのみ `done` に遷移させる

## Step 4: 検証する

1. 独立性検証: 各featureが単独で受け入れシナリオを満たす
2. 順序検証: US1→US2→US3 の順で着手・完了記録が残る
3. 追跡検証: 元要件IDの1対1対応率が100%である

## Completion Criteria

- SC-001: 3 featureすべてに独立した spec/plan/tasks が存在する
- SC-002: 実行順の合意時間が1営業日以内
- SC-003: 各featureの受け入れシナリオ単独検証率100%
- SC-004: 要件衝突件数を分割前比50%以上削減
- SC-005: 全PRで test/lint/typecheck 100%成功
- SC-006: TraceabilityMap の1対1対応率100%
