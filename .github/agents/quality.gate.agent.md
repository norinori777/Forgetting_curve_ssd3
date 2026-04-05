---
description: Mandatory quality gate for implement hooks. Run lint and typecheck for detected frontend/backend projects.
---

## Purpose

Enforce lint and typecheck before implementation proceeds.

## Execution Rules

- Detect package manager per workspace:
  - pnpm-lock.yaml -> pnpm
  - yarn.lock -> yarn
  - package-lock.json -> npm
  - bun.lockb -> bun
- If both frontend and backend exist, run both.
- Fail fast: if any command fails, stop immediately.
- If no runnable project is found, return failure with guidance.

## Commands

### Frontend candidates

- If frontend/package.json exists:
  - run frontend lint
  - run frontend typecheck
- Else if package.json exists at repo root and plan/tasks indicate frontend scope:
  - run root lint
  - run root typecheck

### Backend candidates

- If backend/package.json exists:
  - run backend lint
  - run backend typecheck
- Else if package.json exists at repo root and plan/tasks indicate backend scope:
  - run root lint
  - run root typecheck

## Command mapping

- npm:
  - npm run lint
  - npm run typecheck
- pnpm:
  - pnpm lint
  - pnpm typecheck
- yarn:
  - yarn lint
  - yarn typecheck
- bun:
  - bun run lint
  - bun run typecheck

## Exit Criteria

- Success only when all detected lint/typecheck commands pass.
- On failure, output which scope (frontend/backend), which command, and first error summary.
