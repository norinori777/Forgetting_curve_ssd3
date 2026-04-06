# Implementation Plan: 003スコープ再定義（分割必須条件適合）

**Branch**: `004-redefine-003-scope` | **Date**: 2026-04-06 | **Spec**: `specs/004-redefine-003-scope/spec.md`
**Input**: Feature specification from `specs/004-redefine-003-scope/spec.md`

## Summary

003 feature の責務を「方針定義・依存定義・移管管理」に限定し、憲法の分割必須条件へ適合させる。  
同時に、後続featureへの移管順序と元要件ID 1対1対応を固定し、003単体での再肥大化（ユーザーストーリー2件超、タスク14件超）を防止する。

## Technical Context

**Language/Version**: TypeScript 5.0  
**Primary Dependencies**: React, Node.js, Express.js, Prisma, Tailwind CSS  
**Design System/Theme**: `design/design-tokens.md`  
**Storage**: PostgreSQL  
**Testing**: Jest, React Testing Library, Supertest（本featureではドキュメント整合性テスト中心）  
**Target Platform**: Web  
**Project Type**: Web application（仕様運用統制）  
**Performance Goals**: 後続featureの順序・依存合意を1営業日以内に成立  
**Constraints**: spec→plan→tasks順守、003はユーザーストーリー2件以下・タスク14件以下、元要件IDは1対1移管  
**Scale/Scope**: 003スコープ再定義と移管計画策定に限定し、実装追加は行わない

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Gate

- Language: PASS（日本語で作成）
- Learning outcome: PASS（分割統制で学習機能改善サイクルの停滞を予防）
- Evidence-based scheduling: PASS（復習間隔ロジックは非変更）
- User safety: PASS（ユーザーデータ変更なし）
- Quality gates: PASS（テスト先行観点をquickstartへ明文化）
- UI work: PASS（frontend.dev基準とdesign-tokens参照方針を維持）
- Integration gate: PASS（後続featureのマージ前品質ゲート前提を保持）

### Post-Design Re-Check

- Language: PASS
- Learning outcome: PASS（SC-002/SC-004/SC-005で運用改善を定量化）
- Evidence-based scheduling: PASS（非変更をresearchで確定）
- User safety: PASS（スコープ再定義のみ）
- Quality gates: PASS（分岐・境界・失敗観点をタスク前提に明記）
- UI work: PASS（UI実装は後続featureでfrontend.dev準拠）
- Integration gate: PASS（依存循環・移管漏れチェックを完了条件化）

## Project Structure

### Documentation (this feature)

```text
specs/004-redefine-003-scope/
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

**Structure Decision**: 本featureは実装変更ではなく仕様運用統制の再定義を目的とするため、実装ディレクトリ構造は維持し、成果物は `specs/004-redefine-003-scope/` に集約する。

## Phase 0 Output (Research)

- `specs/004-redefine-003-scope/research.md` を作成し、以下を確定:
  - 003の上限制約（ユーザーストーリー<=2、タスク<=14）
  - 後続featureへの移管順序と依存管理
  - 移管表の1対1整合性ルール
  - 憲法適合判定のレビュー手順

## Phase 1 Output (Design)

- `specs/004-redefine-003-scope/data-model.md` を作成
- `specs/004-redefine-003-scope/quickstart.md` を作成
- 本featureは外部公開API/CLI等を追加しないため `contracts/` は作成しない
- `update-agent-context.ps1 -AgentType copilot` を実行

## Complexity Tracking

- Violation: None
- Why Needed: N/A
- Simpler Alternative Rejected Because: N/A
