# Implementation Plan: US1/US2/US3 分割 feature 化

**Branch**: `003-split-us-features` | **Date**: 2026-04-06 | **Spec**: `specs/003-split-us-features/spec.md`
**Input**: Feature specification from `specs/003-split-us-features/spec.md`

## Summary

統合仕様に含まれている US1/US2/US3 を独立した feature 単位へ再編し、各 feature が単独で spec/plan/tasks を持つ状態へ移行する。  
同時に、依存順序（US1→US2→US3）、品質ゲート（テスト・lint・型チェック）、および元要件ID単位の追跡可能性を固定化し、分割後の衝突と再作業を削減する。

## Technical Context

**Language/Version**: TypeScript 5.0  
**Primary Dependencies**: React, Node.js, Express.js, Prisma, Tailwind CSS  
**Design System/Theme**: `design/design-tokens.md`  
**Storage**: PostgreSQL  
**Testing**: Jest, React Testing Library, Supertest  
**Target Platform**: Web  
**Project Type**: Web application（仕様分割の運用改善）  
**Performance Goals**: 分割後の実行順合意を1営業日以内、要件衝突件数を1スプリントで50%以上削減  
**Constraints**: spec→plan→tasks順守、US1→US2→US3の段階実行、PRマージ前に品質ゲート必須  
**Scale/Scope**: 既存統合仕様のUS3件を対象に、成果物分離と運用ルール整備を行う

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Gate

- Language: PASS（計画・調査・設計成果物を日本語で記述）
- Learning outcome: PASS（分割で実装遅延を抑制し、学習機能改善サイクルを短縮）
- Evidence-based scheduling: PASS（忘却曲線ロジック自体は変更せず、変更時の根拠記録方針を維持）
- User safety: PASS（本featureは仕様運用改善であり、ユーザーデータ変更を伴わない）
- Quality gates: PASS（testing.core + frontend + backend観点を計画へ組み込み）
- UI work: PASS（frontend.dev方針とdesign-tokens参照を維持）
- Integration gate: PASS（全featureで test/lint/typecheck を必須化）

### Post-Design Re-Check

- Language: PASS
- Learning outcome: PASS（SC-002/SC-004 で運用品質を定量評価）
- Evidence-based scheduling: PASS（計算ロジック非変更をresearchで明示）
- User safety: PASS（影響はドキュメント管理に限定、実データ変更なし）
- Quality gates: PASS（quickstartに品質ゲート達成手順を明記）
- UI work: PASS（UI対象featureへはfrontend.dev準拠を継承）
- Integration gate: PASS（依存順序とマージ条件を固定化）

## Project Structure

### Documentation (this feature)

```text
specs/003-split-us-features/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   ├── services/
│   ├── repositories/
│   ├── domains/
│   └── utils/
└── tests/

frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   ├── services/api/
│   ├── domains/
│   └── utils/theme/
└── public/
```

**Structure Decision**: 本featureは実装追加よりも成果物分割ルールの固定化が中心であるため、既存 `backend/src` と `frontend/src` の責務境界を維持し、USごとの実装は後続featureで段階的に配置する。

## Phase 0 Output (Research)

- `specs/003-split-us-features/research.md` を作成し、以下を確定:
  - 段階実行（US1→US2→US3）
  - 追跡可能性（元要件ID 1対1）
  - 依存衝突時の意思決定SLA（1営業日）
  - 品質ゲート適用タイミング（PRマージ前）

## Phase 1 Output (Design)

- `specs/003-split-us-features/data-model.md` を作成
- `specs/003-split-us-features/quickstart.md` を作成
- 本featureは外部公開API/CLI等の新規インターフェースを追加しないため `contracts/` は作成しない
- `update-agent-context.ps1 -AgentType copilot` を実行

## Complexity Tracking

- Violation: None
- Why Needed: N/A
- Simpler Alternative Rejected Because: N/A
