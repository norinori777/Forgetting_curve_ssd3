# Feature Specification: 003スコープ再定義（分割必須条件適合）

**Feature Branch**: `004-redefine-003-scope`  
**Created**: 2026-04-06  
**Status**: Draft  
**Input**: User description: "003のスコープを再定義（分割必須条件に適合）"

**Language Note**: この仕様書は原則として日本語で記述します（憲法: 実施言語）。

## Clarifications

### Session 2026-04-06

- Q: 003スコープ再定義で適用する上限制約は何か？ → A: ユーザーストーリー2件以下かつタスク14件以下

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 003の責務境界を縮小確定する (Priority: P1)

プロダクトオーナーが、003 feature の対象を「分割方針の定義と移管計画」に限定し、後続featureへ移す作業を明確に定義できる。

**Why this priority**: 憲法違反リスクを最短で解消し、以降の計画・実装の停滞を防ぐため。

**Independent Test**: 003の in-scope / out-of-scope、移管先feature一覧、移管判定ルールが1つの仕様で説明できることを確認する。

**Acceptance Scenarios**:

1. **Given** 003の既存仕様に過剰タスクが含まれる, **When** スコープ再定義を行う, **Then** 003は方針・統制・追跡管理の最小範囲に限定される
2. **Given** 憲法の分割必須条件がある, **When** 新スコープを照合する, **Then** 003単体が分割必須条件を超えない運用単位として定義される

---

### User Story 2 - 後続featureへの分割移管を確定する (Priority: P1)

開発者が、003から切り出す後続featureの作成順序と依存関係を理解し、各featureを独立して開始できる。

**Why this priority**: 分割後の着手順が不明確だと、再度スコープ肥大化と依存衝突が発生するため。

**Independent Test**: 後続featureごとに目的、開始条件、完了条件、移管対象が定義され、相互依存が説明可能なことを確認する。

**Acceptance Scenarios**:

1. **Given** 003の新スコープが確定している, **When** 分割移管計画を定義する, **Then** 後続featureの順序と依存関係が明文化される
2. **Given** 追跡可能性要件がある, **When** 要件移管表を作成する, **Then** 元要件IDが単一の移管先featureへ対応付けられる

### Edge Cases

- 003再定義後でもタスク数が閾値を超える場合は、003をさらに方針策定と監査管理へ再分離する
- 後続feature間に循環依存が検出された場合は、依存を解消するまで移管承認を保留する
- 移管先未定の要件が出た場合は、一時的に未分類として記録し、1営業日以内に移管先を確定する
- 同一要件IDが複数featureへ重複割当された場合は、1対1原則に基づき重複を解消する

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: システムは003 feature の新しい in-scope と out-of-scope を定義しなければならない
- **FR-002**: システムは003 feature に含める作業を「方針定義」「依存定義」「移管管理」に限定しなければならない
- **FR-003**: システムは003 feature から切り出す後続featureの一覧、作成順序、依存関係を定義しなければならない
- **FR-004**: システムは移管対象要件を元要件ID単位で単一の移管先featureへ対応付けなければならない
- **FR-005**: システムは003 feature の完了条件を、方針確定・移管計画確定・追跡表確定の3条件で判定しなければならない
- **FR-006**: システムは再定義後の003 feature が分割必須条件に適合することを検証可能にしなければならない
- **FR-007**: システムは後続feature開始前に依存循環と移管漏れの有無を確認しなければならない
- **FR-008**: システムは003 feature 単体の計画制約として、ユーザーストーリー数を2件以下、タスク数を14件以下に維持しなければならない

### Key Entities *(include if feature involves data)*

- **ScopeBoundaryDefinition**: 003の範囲定義。属性は inScope項目、outOfScope項目、根拠、確定日時。
- **SplitHandoverPlan**: 003から後続featureへの移管計画。属性は移管先feature、順序、依存、開始条件、完了条件。
- **RequirementHandoverMap**: 元要件IDの移管対応表。属性は元要件ID、移管先feature、状態、検証結果。
- **ComplianceEvidence**: 分割必須条件への適合証跡。属性は評価項目、判定結果、判定者、判定日時。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 003の再定義仕様で、in-scope/out-of-scope/完了条件の3要素が100%定義される
- **SC-002**: 後続featureの作成順と依存関係の合意が1営業日以内に成立する
- **SC-003**: 元要件IDの移管先対応率（1対1）が100%になる
- **SC-004**: 003再定義後、003単体のタスク計画が分割必須条件を超過しないことを事前レビューで100%確認できる
- **SC-005**: 003 feature の計画レビュー時に、ユーザーストーリー数<=2 かつタスク数<=14 の適合判定が100%記録される

## Assumptions

- 既存の003仕様・計画・タスク文書を参照できる
- 本featureはスコープ再定義が目的であり、ユーザー向け機能追加は対象外とする
- 後続featureの実装詳細は各feature側で定義し、本featureでは扱わない
- 分割必須条件の判定は現行憲法（v1.0.1）を基準に行う
- 003 feature の成果物は、ユーザーストーリー2件以下・タスク14件以下の上限制約を前提に設計する
