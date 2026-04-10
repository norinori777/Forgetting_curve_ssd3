# Implementation Plan: ログイン画面（SCR-01）

**Branch**: `005-scr-01-spec` | **Date**: 2026-04-06 | **Spec**: `specs/005-scr-01-spec/spec.md`
**Input**: Feature specification from `specs/005-scr-01-spec/spec.md`

## Summary

未認証ユーザーがメールアドレスとパスワードでログインし、24時間セッションを受け取ってダッシュボードへ到達できるようにする。加えて、入力不備、認証失敗、通信障害、レート制限、一時ロック、既ログイン時の自動遷移を明確に分岐させ、フロントエンドの状態管理とバックエンドの認証契約を一致させる。

## Technical Context

**Language/Version**: TypeScript 5.0  
**Primary Dependencies**: React, Node.js, Express.js, Prisma, Tailwind CSS  
**Design System/Theme**: [design/design-tokens.md](../../design/design-tokens.md)  
**Storage**: PostgreSQL  
**Testing**: Jest, React Testing Library, Supertest, contract tests, performance test (p95)  
**Target Platform**: Web  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: `/auth/login` 正常応答 p95 <= 2秒、主要認証フローの完了率を測定可能にする  
**Constraints**: HTTPSは本番必須、開発環境ではHTTPを許容、認証失敗理由は漏洩させない、メール正規化値+IPで1分5回まで  
**Scale/Scope**: 認証基盤の画面分割第二段として、ログイン画面1画面と関連API・ガード・通知状態を対象

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Gate

- Language: PASS（仕様・計画・成果物を日本語中心で記述）
- Learning outcome: PASS（既存学習機能への継続アクセスを支える認証基盤として、学習継続率向上に寄与）
- Evidence-based scheduling: PASS（復習間隔ロジックは変更せず、根拠ある認証フロー設計のみを追加）
- User safety: PASS（失敗時は部分成功を残さず、入力値と資格情報の保護を徹底）
- Quality gates: PASS（testing.core / frontend / backend を前提に tests-first）
- UI work: PASS（frontend.dev と design tokens を参照）
- Integration gate: PASS（lint/typecheck/test 成功を統合条件とする）

### Post-Design Re-Check

- Language: PASS
- Learning outcome: PASS（ログイン成功後の学習継続導線を定量テスト対象に含める）
- Evidence-based scheduling: PASS（認証機能のみの変更で、復習計算根拠には影響しない）
- User safety: PASS（入力不備・認証失敗・ロック状態の表示を明確化）
- Quality gates: PASS（契約・統合・境界値・失敗系を research/quickstart に反映）
- UI work: PASS（loading/error/lock/redirect 状態を設計化）
- Integration gate: PASS（contracts と quickstart で判定手順を定義）

## Project Structure

### Documentation (this feature)

```text
specs/005-scr-01-spec/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── login.openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   │   └── auth/
│   │       ├── loginController.ts
│   │       ├── loginRoutes.ts
│   │       └── loginValidationMiddleware.ts
│   ├── services/
│   │   └── auth/
│   │       ├── LoginService.ts
│   │       ├── LoginGuardService.ts
│   │       └── LoginMetricsService.ts
│   ├── repositories/
│   │   └── auth/
│   │       └── loginRepository.ts
│   ├── domains/
│   │   └── auth/
│   │       └── LoginModels.ts
│   └── utils/
│       └── logging/
│           └── authLogger.ts

frontend/
├── src/
│   ├── pages/
│   │   └── LoginPage/
│   │       ├── index.tsx
│   │       ├── loginErrorMapper.ts
│   │       ├── LoginFieldErrors.tsx
│   │       ├── LoginPage.accessibility.test.tsx
│   │       ├── LoginPage.failure.test.tsx
│   │       ├── LoginPage.input-validation.test.tsx
│   │       └── LoginPage.submission-state.test.tsx
│   ├── routes/
│   │   └── guards/
│   │       └── requireAuth.tsx
│   ├── services/
│   │   └── api/
│   │       └── auth.ts
│   └── domains/
│       └── auth/
│           └── LoginModels.ts
```

**Structure Decision**: 既存の認証実装パターンに合わせ、画面ロジックは `frontend/src/pages/LoginPage` に、認証処理は `backend/src/api/auth` と `backend/src/services/auth` に分割する。既存の `requireAuth.tsx` は未認証誘導の起点として再利用し、ログイン成功後の戻り先制御を追加する。

## Phase 0 Output (Research)

- `specs/005-scr-01-spec/research.md` を作成し、以下を確定:
  - メール正規化（trim + lowercase）
  - セッション有効期限（24時間）
  - レート制限（email+IP, 5 req/min）
  - 既ログイン時の自動リダイレクトと returnTo 優先
  - HTTP は開発環境のみ許容、本番はHTTPS必須
  - 401/429/500 の失敗分岐と再試行導線

## Phase 1 Output (Design & Contracts)

- `specs/005-scr-01-spec/data-model.md` を作成
- `specs/005-scr-01-spec/contracts/login.openapi.yaml` を作成
- `specs/005-scr-01-spec/quickstart.md` を作成
- `update-agent-context.ps1 -AgentType copilot` を実行

## Complexity Tracking

- Violation: None
- Why Needed: N/A
- Simpler Alternative Rejected Because: N/A
