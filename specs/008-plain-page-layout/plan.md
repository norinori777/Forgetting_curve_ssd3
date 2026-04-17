# Implementation Plan: 基底画面のページ表示部フラット化

**Branch**: `008-plain-page-layout` | **Date**: 2026-04-17 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/008-plain-page-layout/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

基底画面配下の主要4画面について、ページ表示部をカード状の外枠で囲む現状をやめ、画面本文を基底画面のコンテンツ領域に直接表示する。既存のヘッダー、ルーティング、画面遷移、業務機能は維持し、外側の白背景・角丸・影・中央寄せ固定幅だけを除去する。これにより、復習開始までの視線移動と認知負荷を減らし、毎日の学習導線を短く保つ。

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.0  
**Primary Dependencies**: React, Tailwind CSS, Vite, existing path-based page selection  
**Design System/Theme**: design-tokens.md (`./design/design-tokens.md`)  
**Storage**: None (UI-only feature)  
**Testing**: React Testing Library, existing frontend build/typecheck scripts  
**Target Platform**: Web
**Project Type**: Web application  
**Performance Goals**: 主要4画面の初期描画で、追加のカード外枠を挟まずに内容を表示できること  
**Constraints**: 画面遷移、ルーティング、業務機能を変更しないこと。既存の design tokens と BaseLayout を維持すること  
**Scale/Scope**: 認証後の主要4画面のみを対象とする小規模なレイアウト変更

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Language: Pass. Plan/spec artifacts are written in Japanese.
- Learning outcome: Pass. This UI simplification reduces friction to reach the dashboard and review flow, supporting repeated study sessions.
- Evidence-based scheduling: Pass. No review interval logic is changed.
- User safety: Pass. No persistence or deletion behavior is changed.
- Quality gates: Pass. This is a layout-only feature; verification focuses on frontend UI tests plus existing build/typecheck.
- UI work: Pass. The feature is frontend-only and follows the existing React/Tailwind guidance and design tokens.
- Integration gate: Pass. No backend integration changes are required.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
frontend/
├── src/
│   ├── components/
│   │   ├── layout/   # BaseLayout と共通ヘッダー
│   │   └── navigation/
│   ├── pages/        # Dashboard, CardList, Review, Settings など
│   ├── domains/      # 画面選択用の型
│   ├── services/     # UIから呼ぶ API 層
│   └── utils/        # 画面ルーティングや補助ロジック
└── public/

design/
├── design-tokens.md
├── forgetting-curve-theme.modern.json
├── nori-theme.css
└── tailwind.nori-theme.cjs
```

**Structure Decision**: 既存の `frontend/src/components/layout/BaseLayout.tsx` と各ページコンポーネントをそのまま使い、各画面の最外層カードだけを削除する。レイアウト判断はページコンポーネント側で行い、共通基盤と遷移構造は変更しない。

## Complexity Tracking

不要。憲法違反を正当化する複雑化は発生していない。
