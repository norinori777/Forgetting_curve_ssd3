# Implementation Plan: 基底画面

**Branch**: `007-base-screen` | **Date**: 2026-04-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-base-screen/spec.md`

## Summary

ログイン後の主要導線を共通の基底画面に統一し、ヘッダーメニューからダッシュボード、カード一覧、復習実施、設定へ 1 操作で遷移できるようにする。ページ表示部の初期表示をダッシュボードに固定することで、日次復習の起点を明確にし、学習開始までの摩擦を下げる。

## Technical Context

**Language/Version**: TypeScript 5.0  
**Primary Dependencies**: React, Tailwind CSS, Vite, 既存の path-based page selection（`frontend/src/App.tsx`）  
**Design System/Theme**: design-tokens.md (`./design/design-tokens.md`)  
**Storage**: なし（UI レイアウトのみ）  
**Testing**: Jest, React Testing Library  
**Target Platform**: Web  
**Project Type**: Web application  
**Performance Goals**: 基底画面の初期表示とヘッダー切替を 1 操作で即時に体感できること。ページ表示部はダッシュボードを初期表示とし、標準環境で 1 秒以内の表示を目標にする。  
**Constraints**: 既存の `window.location.pathname` ベースの画面切替を壊さず、ヘッダーメニューは全認証後画面で共通表示にする。  
**Scale/Scope**: 1 つの共通レイアウトと 3 つの主要ヘッダーリンク、既存のログイン/登録/ダッシュボード/カード登録画面に対するナビゲーションを対象とする。

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Language: Write plan/spec/tasks primarily in Japanese
- Learning outcome: 本機能は、日次復習の起点であるダッシュボードへ迷わず到達できる状態を作り、学習開始までの摩擦を減らす
- Evidence-based scheduling: Review interval logic is unchanged in this feature
- User safety: 進捗データを変更しない共通レイアウトの追加に限定する
- Quality gates: 主要分岐は UI テストで確認し、初期表示・リンク遷移・共通表示を担保する
- UI work: Follow `.github/agents/frontend.dev.agent.md` guidelines
- Integration gate: CI must pass (tests, lint, type checks) before merge

## Project Structure

### Documentation (this feature)

```text
specs/007-base-screen/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md            # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── public/
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   └── BaseLayout.tsx
│   │   └── navigation/
│   │       ├── HeaderMenu.tsx
│   │       └── BrandArea.tsx
│   ├── pages/
│   │   ├── LoginPage/
│   │   ├── SignupPage/
│   │   ├── DashboardPage/
│   │   ├── CardRegistrationPage/
│   │   ├── CardListPage/
│   │   ├── ReviewPage/
│   │   └── SettingsPage/
│   ├── routes/
│   │   └── guards/
│   ├── hooks/
│   ├── services/
│   ├── domains/
│   └── utils/
└── dist/
```

**Structure Decision**: 既存の `frontend/src/App.tsx` の path-based 切替を維持しつつ、認証後画面を共通の `BaseLayout` に包む。ヘッダー関連は `components/layout` と `components/navigation` に切り出し、ページ固有の業務処理は各 `pages/*` に残す。

## Phase 0 Research

- `window.location.pathname` ベースの既存切替を継続し、今回の変更でルーティングライブラリは追加しない
- 基底画面は UI レイアウト責務に限定し、backend / DB / contract は変更しない
- 初期表示はダッシュボードを既定にし、復習リンクは復習実施画面へ遷移する
- 共通ヘッダーはブランド領域とメニュー領域に分け、アクセシビリティとレスポンシブを既存トークンで担保する

## Phase 1 Design

- `data-model.md`: ナビゲーション状態、メニュー項目、ページスロットの関係を定義
- `quickstart.md`: frontend 起動、テスト、手動確認手順を記載
- `contracts/`: 外部インターフェース追加がないため作成しない

## Re-check Constitution

- Language: OK
- Learning outcome: OK
- Evidence-based scheduling: OK（対象外）
- User safety: OK
- Quality gates: OK
- UI work: OK
- Integration gate: OK

## Complexity Tracking

不要。新規技術導入や例外はない。
