# Implementation Plan: アカウント登録画面（UC-01）

**Branch**: `002-signup-screen-spec` | **Date**: 2026-04-06 | **Spec**: `specs/002-signup-screen-spec/spec.md`
**Input**: Feature specification from `specs/002-signup-screen-spec/spec.md`

## Summary

未登録ユーザーがアカウント登録画面で入力・送信し、登録成功時に24時間セッションを開始した状態でダッシュボードへ遷移できるようにする。  
同時に、重複メール拒否、レート制限、送信失敗時リカバリ、登録+セッション開始の原子性（失敗時ロールバック）を保証する。

## Technical Context

**Language/Version**: TypeScript 5.0  
**Primary Dependencies**: React, Node.js, Express.js, Prisma, Tailwind CSS  
**Design System/Theme**: `design/design-tokens.md`  
**Storage**: PostgreSQL  
**Testing**: Jest, React Testing Library, Supertest, performance test (p95)  
**Target Platform**: Web  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: `/auth/signup` 正常応答 p95 <= 2秒、SC-001 は直近7日・母数100以上で90%以上  
**Constraints**: HTTPS必須、パスワード平文保存禁止、PII非出力、登録APIはメール正規化値+IPで1分5回上限  
**Scale/Scope**: 認証機能の画面分割第一段として登録画面1画面と関連APIを対象

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Gate

- Language: PASS（仕様・計画を日本語で記述）
- Learning outcome: PASS（登録完了率改善は学習継続率向上に寄与）
- Evidence-based scheduling: PASS（忘却曲線計算ロジックは本スコープ外で変更なし）
- User safety: PASS（登録失敗時の既存データ不変、部分成功禁止）
- Quality gates: PASS（testing.core/frontend/backend を前提に tests-first）
- UI work: PASS（frontend.dev と design-tokens を参照）
- Integration gate: PASS（lint/typecheck/test 成功を統合条件とする）

### Post-Design Re-Check

- Language: PASS
- Learning outcome: PASS（SC-001/SC-005 を定量化）
- Evidence-based scheduling: PASS（復習間隔計算に変更なし）
- User safety: PASS（FR-013/FR-018 を設計へ反映）
- Quality gates: PASS（契約・統合・境界値・失敗系を quickstart/research に明記）
- UI work: PASS（状態遷移と再試行導線を設計化）
- Integration gate: PASS（contracts と quickstart で判定手順を定義）

## Project Structure

### Documentation (this feature)

```text
specs/002-signup-screen-spec/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── signup-registration.openapi.yaml
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

**Structure Decision**: UI状態管理は `frontend/src`、登録処理・制約実装は `backend/src` に集約し、責務分離を維持する。

## Phase 0 Output (Research)

- `specs/002-signup-screen-spec/research.md` を作成し、以下を確定:
  - メール正規化（trim + lowercase）
  - セッション有効期限（24時間）
  - レート制限（email+IP, 5 req/min）
  - 原子性（セッション失敗時ロールバック）
  - SC-001 判定条件（週次7日、母数100以上、明示キャンセルのみ除外）

## Phase 1 Output (Design & Contracts)

- `specs/002-signup-screen-spec/data-model.md` を作成
- `specs/002-signup-screen-spec/contracts/signup-registration.openapi.yaml` を作成
- `specs/002-signup-screen-spec/quickstart.md` を作成
- `update-agent-context.ps1 -AgentType copilot` を実行

## Complexity Tracking

- Violation: None
- Why Needed: N/A
- Simpler Alternative Rejected Because: N/A
