# Data Model: 003スコープ再定義（分割必須条件適合）

## 1. ScopeBoundaryDefinition

003 feature の範囲境界を表す。

### Fields (ScopeBoundaryDefinition)

- featureId: string（固定: 003-split-us-features）
- inScopeItems: string[]
- outOfScopeItems: string[]
- rationale: string
- finalizedAt: datetime
- finalizedBy: string

### Validation Rules (ScopeBoundaryDefinition)

- inScopeItems と outOfScopeItems は重複不可
- inScopeItems は最小1項目以上を保持
- finalizedAt はレビュー承認時刻以前であること

## 2. SplitHandoverPlan

003から後続featureへの移管計画を表す。

### Fields (SplitHandoverPlan)

- handoverId: string
- sourceFeatureId: string
- targetFeatureId: string
- executionOrder: number
- dependencyTargets: string[]
- entryCriteria: string[]
- doneCriteria: string[]

### Validation Rules (SplitHandoverPlan)

- sourceFeatureId は 003-split-us-features
- executionOrder は重複不可
- dependencyTargets に循環依存を含まないこと

## 3. RequirementHandoverMap

元要件IDと移管先featureの1対1対応を表す。

### Fields (RequirementHandoverMap)

- sourceRequirementId: string
- targetFeatureId: string
- mappingStatus: enum（mapped, verified, closed）
- verifiedBy: string
- verifiedAt: datetime

### Validation Rules (RequirementHandoverMap)

- sourceRequirementId は1件につき1つの targetFeatureId のみ
- mappingStatus=closed は verifiedBy/verifiedAt 必須
- 未分類要件は1営業日以内に targetFeatureId を確定

## 4. ComplianceEvidence

分割必須条件への適合判定証跡を表す。

### Fields (ComplianceEvidence)

- evidenceId: string
- checkedFeatureId: string
- storyCount: number
- taskCount: number
- policyPassed: boolean
- checkedBy: string
- checkedAt: datetime

### Validation Rules (ComplianceEvidence)

- policyPassed=true の条件は storyCount <= 2 かつ taskCount <= 14
- checkedFeatureId=003-split-us-features の記録を必須とする

## State Transitions

### RequirementHandoverMap Status Transition

- mapped -> verified: 依存・移管漏れチェック完了
- verified -> closed: レビュー承認と証跡登録完了
