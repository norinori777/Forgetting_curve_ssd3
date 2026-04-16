# Implementation Plan: カード登録画面

**Branch**: `006-card-registration` | **Date**: 2026-04-12 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/006-card-registration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

個別登録用のカード登録画面を新設し、入力下書き・復習予定プレビュー・確定保存の 3 段階で学習カードを作成できるようにする。バックエンドは既存の auth 実装と同じ controller / service / repository 構成を採用し、初回復習予定の算出は純粋関数として分離する。フロントエンドは LoginPage / SignupPage と同系統の page-local state + custom hook 構成で、入力保持と重複送信防止を担保する。

## Technical Context

**Language/Version**: TypeScript 5.0  
**Primary Dependencies**: React, Node.js, Express.js, Prisma, Tailwind CSS  
**Design System/Theme**: design-tokens.md (`./design/design-tokens.md`)  
**Storage**: PostgreSQL  
**Testing**: `tsx --test` / React Testing Library 相当の既存フロントテスト基盤  
**Target Platform**: Web
**Project Type**: Web application
**Performance Goals**: 95% の登録/プレビュー操作を 300ms 以内に応答開始し、画面入力は 1 秒以内に主要UIが表示されること
**Constraints**: ログイン済みセッション必須、入力失敗時もフォーム内容を保持、復習予定は固定ルールで決定論的に算出
**Scale/Scope**: 1 新規画面、2 API エンドポイント、1 Prisma モデル、1 マイグレーション、主要テスト 8-12 件程度

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Language: Write plan/spec/tasks primarily in Japanese
- Learning outcome: Feature MUST tie to improving memory retention (hypothesis + metric)
- Evidence-based scheduling: Any change to review interval logic documents rationale (e.g., SM-2 family)
- User safety: Prevent progress data loss (backup/restore/delete confirmation where relevant)
- Quality gates: Test-first; mandatory tests for core logic (review-date calc, accuracy updates, remind judgement)
- UI work: Follow `.github/agents/frontend.dev.agent.md` guidelines (invoke via `#prompt:frontend.dev.prompt.md` as needed)
- Integration gate: CI must pass (tests, lint, type checks) before merge

Current assessment: PASS. The feature directly supports memory retention by showing the first review schedule before confirmation, and the schedule logic will be covered by deterministic unit tests.

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

```text
backend/
├── src/
│   ├── api/
│   │   └── cards/             # カード作成/プレビューAPI
│   ├── services/
│   │   └── cards/             # 入力検証・復習予定算出・作成処理
│   ├── repositories/
│   │   └── cards/             # Prisma 経由の永続化
│   ├── domains/
│   │   └── cards/             # リクエスト/レスポンス/エラー型
│   └── utils/
│       └── cards/             # 復習予定の純粋関数
├── prisma/                    # Card モデル追加のマイグレーション
└── tests/
    ├── unit/
    │   └── cards/
    ├── contract/
    │   └── cards/
    └── integration/
        └── cards/

frontend/
├── public/
├── src/
│   ├── pages/
│   │   ├── CardRegistrationPage/
│   │   ├── DashboardPage/
│   │   ├── LoginPage/
│   │   └── SignupPage/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   │   └── api/
│   │       └── cards/
│   ├── domains/
│   └── utils/
│       └── theme/
└── scripts/
```

**Structure Decision**: 既存の auth 実装と同じ分割を新規 card ドメインに適用する。画面は `frontend/src/pages/CardRegistrationPage/` に追加し、API は `backend/src/api/cards/`、`backend/src/services/cards/`、`backend/src/repositories/cards/`、`backend/src/domains/cards/` に分ける。復習予定の計算は `backend/src/utils/cards/` の純粋関数に寄せ、フロントはその結果を preview/create の両状態で表示する。

## Research Inputs

- 既存の frontend ページは LoginPage / SignupPage が「ページ本体 + 入力ロジック hook + エラー要約」構成で、これを踏襲すると実装とテストを最小化できる。
- 既存の backend は controller / service / repository の 3 層で、SignupController と SignupService の責務分離がそのまま新しい card ドメインの雛形になる。
- Prisma schema には User / Session しかなく、card ドメインは新規追加が必要。
- 画面要件上のインポートは対象外であり、カード登録と重複送信防止に集中する。
- Prisma のスキーマ変更は migration ファイルの作成だけで完了とせず、実装段階で `prisma migrate dev` による適用まで必ず行う。

## Complexity Tracking

No constitution violations. The feature stays within a single screen, a single domain, and a deterministic review-schedule helper.
