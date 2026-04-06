# Feature Specification: US1/US2/US3 分割 feature 化

**Feature Branch**: `003-split-us-features`  
**Created**: 2026-04-06  
**Status**: Draft  
**Input**: User description: "US1/US2/US3 を分割 feature 化"

**Language Note**: この仕様書は原則として日本語で記述します（憲法: 実施言語）。

## Clarifications

### Session 2026-04-06

- Q: 分割後featureの進行順はどう定義するか？ → A: US1→US2→US3 の段階実行
- Q: 各featureの品質ゲートはどの時点で満たすか？ → A: 各featureのPRマージ前に必須達成
- Q: 依存衝突が発生した場合の最終決定者は誰か？ → A: プロダクトオーナーが1営業日以内に決定
- Q: 追跡可能性はどの粒度で維持するか？ → A: 元要件ID単位で1対1マッピング

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 分割計画を確定する (Priority: P1)

プロダクトオーナーが既存の統合仕様を読み、US1/US2/US3 を独立した feature として切り出す方針と境界を確定できる。

**Why this priority**: 分割方針が曖昧なまま進むと、重複実装や依存衝突が発生し全体が遅延するため。

**Independent Test**: 既存仕様を起点に、各 US の in-scope/out-of-scope、共通基盤、依存順序が文書化されていることを確認する。

**Acceptance Scenarios**:

1. **Given** 既存の統合仕様が存在する, **When** 分割方針を作成する, **Then** US1/US2/US3 の境界と依存関係が明確化される
2. **Given** 憲法の分割条件がある, **When** 分割設計を確認する, **Then** 分割条件を満たす単位で計画される

---

### User Story 2 - 分割後 feature の仕様を独立化する (Priority: P1)

開発者が US ごとに独立した spec/plan/tasks を持ち、単独で実装・検証・レビューできる。

**Why this priority**: 分割効果は独立成果物が揃って初めて得られるため。

**Independent Test**: US1, US2, US3 の各 feature が独立した spec/plan/tasks と受け入れ条件を持ち、相互参照で矛盾しないことを確認する。

**Acceptance Scenarios**:

1. **Given** 分割方針が確定している, **When** 各 US を仕様化する, **Then** 各 feature に独立した成果物が作成される
2. **Given** 共通要件が存在する, **When** 各成果物を照合する, **Then** 共有ルールは統一されつつ各 feature は独立している

---

### User Story 3 - 分割後の実行順と品質ゲートを確定する (Priority: P2)

チームが分割後に迷わず着手できるよう、実行順・完了条件・品質ゲートを合意できる。

**Why this priority**: 分割後の運用が不明確だと、着手順序や完了判定がぶれて再統合が難しくなるため。

**Independent Test**: US ごとの開始条件、完了条件、品質ゲート、再統合条件が定義され、実行順を説明できることを確認する。

**Acceptance Scenarios**:

1. **Given** 分割後 feature が揃っている, **When** 実行計画を定義する, **Then** 優先順と依存順が明文化される
2. **Given** 品質ゲート方針がある, **When** 完了条件を定義する, **Then** 各 feature のテスト・lint・型チェック基準が揃う

### Edge Cases

- US 間で同じ要件を重複定義してしまう場合は、共通ルール文書へ一本化し参照関係を定義する
- 分割後に依存が逆転する場合は、先行着手 feature を見直し順序を再確定し、プロダクトオーナーが1営業日以内に最終決定する
- 分割した結果、単一 feature が過小粒度になった場合は再統合する
- 分割前後で成功指標の定義が変わる場合は、比較可能性を維持する変換ルールを定義する

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: システムは既存統合仕様から US1/US2/US3 のスコープ境界を定義しなければならない
- **FR-002**: システムは各 US を独立した feature 成果物（spec/plan/tasks）として管理できなければならない
- **FR-003**: 各 feature は単独で実装・検証可能な受け入れシナリオを持たなければならない
- **FR-004**: 分割後 feature 間の依存関係（先行/後続）を明示しなければならない
- **FR-005**: 分割後 feature は共通品質ゲート（テスト、lint、型チェック）を満たす条件を持たなければならない
- **FR-005a**: 分割後 feature は US1→US2→US3 の順で段階的に仕様化・計画化・実装しなければならない
- **FR-006**: 分割によって生じる重複要件は統合ルールを定め、矛盾を回避しなければならない
- **FR-007**: 分割後も元のビジネス目標と成功指標の追跡可能性を保持しなければならない
- **FR-007a**: 追跡可能性は元要件ID単位で1対1に対応付け、欠落なく管理しなければならない
- **FR-008**: 各 feature はPRマージ前に品質ゲート（テスト、lint、型チェック）を必須達成しなければならない

### Key Entities *(include if feature involves data)*

- **SplitFeatureUnit**: US単位の独立 feature。属性は識別子、対象US、優先度、状態。
- **DependencyLink**: feature 間依存関係。属性は先行 feature、後続 feature、依存理由。
- **QualityGateProfile**: feature ごとの品質判定条件。属性は必須テスト、lint、型チェック、完了基準。
- **TraceabilityMap**: 旧統合仕様と分割後成果物の対応表。属性は元要件ID、移行先feature、状態。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: US1/US2/US3 の3 feature すべてで、独立した spec/plan/tasks が作成される
- **SC-002**: 分割後 feature の依存関係が文書化され、実行順の合意に要する時間を1営業日以内に収める
- **SC-003**: 分割後の各 feature で、受け入れシナリオを単独で検証できる状態を100%達成する
- **SC-004**: 分割後1スプリントで発生する要件衝突件数を分割前比で50%以上削減する
- **SC-005**: 各 feature のPRは、テスト・lint・型チェックの3品質ゲートを100%満たした場合のみマージ可能とする
- **SC-006**: TraceabilityMapで元要件IDの1対1対応率を100%維持する

## Assumptions

- 既存統合仕様（US1/US2/US3 を含む）が参照可能である
- 分割対象は仕様管理単位であり、直ちに本番挙動を変えるものではない
- 分割後の命名規約とディレクトリ規約は既存プロジェクト規約に従う
- 分割作業は段階実施し、各段階でレビューと承認が行われる
