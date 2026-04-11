# Implementation Plan: ログイン/サインアップ永続化

**Branch**: `005-scr-01-spec` | **Date**: 2026-04-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-scr-01-spec/spec.md`

## Summary

ログインとサインアップの認証経路を、現在のインメモリ実装から Prisma + PostgreSQL ベースの永続化へ寄せる。`User` と `Session` を基盤に、サインアップではユーザー作成とセッション発行を同一トランザクションで行い、ログインではユーザー参照とセッション発行を行う。仮説は、認証失敗と再試行の摩擦を減らすことで学習継続率を維持・向上できることであり、指標はログイン/サインアップ成功率、再試行後の到達率、3 秒以内のダッシュボード到達率とする。既存の API 契約と UI 挙動は維持しつつ、DB 読み込み・書き込みを本番相当の永続層に移す。

## Technical Context

**Language/Version**: TypeScript 5.0  
**Primary Dependencies**: React, Node.js, Express.js, Prisma, Tailwind CSS  
**Design System/Theme**: [design-tokens.md](../../design/design-tokens.md)  
**Storage**: PostgreSQL  
**Testing**: Jest, React Testing Library  
**Target Platform**: Web  
**Project Type**: Web application  
**Performance Goals**: ログイン/サインアップの主要経路は通常の API 応答として 3 秒以内に完了可能であること  
**Constraints**: 認証情報は平文保存しないこと、重複ユーザー登録を防止すること、失敗時に詳細な認証理由を露出しないこと  
**Scale/Scope**: 認証関連のユーザー/セッション永続化と既存フロントエンドからの呼び出しに限定する

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Language: Write plan/spec/tasks primarily in Japanese
- Learning outcome: This feature does not change spaced-repetition logic; no review-interval hypothesis is introduced
- Evidence-based scheduling: Not applicable because review interval logic is unchanged
- User safety: Protect auth data with transaction boundaries and duplicate-email checks
- Quality gates: Add and maintain tests for login/signup repository and service paths before implementation
- UI work: Frontend guidance is relevant only if UI copy or state handling changes; keep the plan backend-focused
- Integration gate: CI must pass (tests, lint, type checks) before merge

## Project Structure

### Documentation (this feature)

```text
specs/005-scr-01-spec/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    ├── login.openapi.yaml
    └── signup.openapi.yaml
```

### Source Code (repository root)

```text
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── api/
│   │   └── auth/
│   ├── config/
│   ├── domains/
│   │   └── auth/
│   ├── repositories/
│   │   └── auth/
│   ├── services/
│   │   └── auth/
│   └── utils/
└── tests/
    ├── contract/
    │   └── auth/
    └── integration/

frontend/
├── src/
│   ├── pages/
│   │   ├── LoginPage/
│   │   └── SignupPage/
│   ├── services/
│   │   └── api/
│   └── routes/
```

**Structure Decision**: バックエンドの `repositories/auth` と `services/auth` を永続化の主な変更対象とし、フロントエンドは既存の API 呼び出し経路を維持する。DB スキーマは `backend/prisma/schema.prisma` を正とし、契約は `specs/005-scr-01-spec/contracts/login.openapi.yaml` と `specs/005-scr-01-spec/contracts/signup.openapi.yaml` を参照する。

## Phase 0: Research

### Research Output

- `research.md` に Prisma/PostgreSQL での永続化方針、トランザクション境界、重複メール対策、テスト方針を整理する
- 既存のインメモリ `authStore` を置き換えるか、互換アダプタを挟むかを比較し、実装影響が最小の案を採用する

## Phase 1: Design & Contracts

### Data Model

- `data-model.md` で `User`、`Session`、`AuthSession` の永続化/参照関係を定義する
- メール正規化、ユニーク制約、セッション有効期限、状態遷移を明文化する

### Contracts

- 既存の `contracts/login.openapi.yaml` と新規の `contracts/signup.openapi.yaml` を基準とし、必要ならリポジトリ実装との差分だけを補足する

### Quickstart

- `quickstart.md` に Prisma マイグレーション、バックエンドテスト、認証フロー確認手順を記載する

### Agent Context Update

- `update-agent-context.ps1 -AgentType copilot` を実行して、現行スタックに Prisma/PostgreSQL の永続化方針を反映する

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
