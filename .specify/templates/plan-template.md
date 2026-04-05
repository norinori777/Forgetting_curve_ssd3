# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.0  
**Primary Dependencies**: React, Node.js, Express.js, Prisma, Tailwind CSS  
**Storage**: PostgreSQL  
**Testing**: Jest, React Testing Library  
**Target Platform**: Web
**Project Type**: [e.g., library/cli/web-service/mobile-app/compiler/desktop-app or NEEDS CLARIFICATION]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Language: Write plan/spec/tasks primarily in Japanese
- Learning outcome: Feature MUST tie to improving memory retention (hypothesis + metric)
- Evidence-based scheduling: Any change to review interval logic documents rationale (e.g., SM-2 family)
- User safety: Prevent progress data loss (backup/restore/delete confirmation where relevant)
- Quality gates: Test-first; mandatory tests for core logic (review-date calc, accuracy updates, remind judgement)
- UI work: Follow `.github/agents/frontend.dev.agent.md` guidelines (invoke via `#prompt:frontend.dev.prompt.md` as needed)
- Integration gate: CI must pass (tests, lint, type checks) before merge

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

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
```text
backend/
├── api/          # APIエンドポイント
├── services/     # ビジネスロジック
├── repositories/ # データアクセス
├── domains/       # ドメインモデル
└── utils/        # ユーティリティ

frontend/
├── .storybook/       # Storybook設定
├── public/           # 静的ファイル
├── src/
│   ├── assets/       # 画像などのアセット
│   ├── contents/     # ページ表示基盤の紐づけ情報を格納
│   ├── pages/        # ページ(画面)
│   ├── components/
│   │   ├── uiParts/      # 汎用UI部品
│   │   └── uniqueParts/  # 画面固有部品
│   ├── hooks/        # React hooks
│   ├── services/
│   │   └── api/      # API呼び出し
│   ├── domains/       # DTO/ドメイン型
│   └── utils/
│       └── theme/    # テーマ関連
├── dist/             # ビルド成果物
└── storybook-static/ # Storybookビルド成果物
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
