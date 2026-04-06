# Data Model: US1/US2/US3 分割 feature 化

## 1. SplitFeatureUnit

分割後の独立feature単位を表す。

### Fields (SplitFeatureUnit)

- featureId: string（例: US1, US2, US3）
- title: string
- priority: enum（P1, P2）
- status: enum（draft, planned, in_progress, done）
- ownerRole: enum（product_owner, developer, reviewer）
- acceptanceReady: boolean
- gateReady: boolean

### Validation Rules (SplitFeatureUnit)

- featureIdは一意であること
- status=done の場合、acceptanceReady=true かつ gateReady=true であること
- priorityはspec定義と一致すること

## 2. DependencyLink

feature間の先行/後続依存を表す。

### Fields (DependencyLink)

- linkId: string
- predecessorFeatureId: string
- successorFeatureId: string
- reason: string
- decisionOwner: string（固定: product_owner）
- decisionSlaBusinessDays: number（固定: 1）

### Validation Rules (DependencyLink)

- predecessorFeatureId と successorFeatureId は同一不可
- 依存グラフに循環が存在しないこと
- 衝突発生時は decisionOwner と decisionSlaBusinessDays が必須

## 3. QualityGateProfile

各featureのマージ条件を表す。

### Fields (QualityGateProfile)

- featureId: string
- testPassed: boolean
- lintPassed: boolean
- typecheckPassed: boolean
- evaluatedAt: datetime
- evaluatedBy: string

### Validation Rules (QualityGateProfile)

- PRマージ可否は testPassed && lintPassed && typecheckPassed が true の場合のみ true
- evaluatedAt はPRマージ時刻以前であること

## 4. TraceabilityMap

元統合仕様の要件と分割後featureの対応を表す。

### Fields (TraceabilityMap)

- sourceRequirementId: string
- targetFeatureId: string
- migratedArtifactType: enum（spec, plan, tasks）
- migratedArtifactPath: string
- migrationStatus: enum（mapped, verified, closed）

### Validation Rules (TraceabilityMap)

- sourceRequirementId は1件につき1つの targetFeatureId のみを持つ（1対1）
- migrationStatus=closed の場合、spec/plan/tasks の3種すべてで verified が成立していること

## State Transitions

### SplitFeatureUnit Status Transition

- draft -> planned: 分割方針と依存順が確定
- planned -> in_progress: 先行feature依存が満たされ着手可能
- in_progress -> done: 受け入れシナリオ検証完了 + 品質ゲート通過

### TraceabilityMap Status Transition

- mapped -> verified: 対応先成果物に反映確認
- verified -> closed: レビュー承認と衝突なし確認
