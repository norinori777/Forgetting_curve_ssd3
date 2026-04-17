# Implementation Plan: UC-13 カード一覧確認・検索・一括管理

**Branch**: `009-card-list-management` | **Date**: 2026-04-17 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/009-card-list-management/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

既存のカードドメインを拡張し、ログイン済みユーザーが自分の学習カードを一覧で確認し、タイトル・問い・答えを検索し、カテゴリ/タグとして扱うラベルで絞り込み、複数選択したカードへ一括付与し、必要に応じて JSON 形式でエクスポートできるようにする。フロントエンドは静的なプレースホルダ表示の CardListPage を実データ駆動の一覧画面へ置き換え、バックエンドは一覧取得・カーソルページング・一括ラベル更新・エクスポートの API を追加する。現行の `labels` 配列を当面のカテゴリ/タグ表現として再利用し、既存のカード登録フローと整合する形で拡張する。

## Technical Context

**Language/Version**: TypeScript 5.0
**Primary Dependencies**: React, Vite, Express.js, Prisma, Tailwind CSS
**Design System/Theme**: `design/design-tokens.md`, `design/nori-theme.css`
**Storage**: PostgreSQL (DATABASE_URL 有効時) / 既存のメモリストア互換
**Testing**: backend は既存の `tsx --test` 系ユニット/統合/契約テスト、frontend は React Testing Library ベースのページテストと lint
**Target Platform**: Web
**Project Type**: Web application
**Performance Goals**: 初回表示は 100 件規模で 1 秒以内、検索後の追加入力や下端到達時の追加読み込みは体感遅延を最小化する
**Constraints**: 自分のカードのみ操作可能にすること、既存の認証/セッション/登録フローを壊さないこと、無限スクロールと選択状態を両立すること、エクスポートは JSON 単一ファイルであること
**Scale/Scope**: 1 画面の大幅拡張 + backend の一覧/更新/出力 API 追加 + フロント/バック双方のテスト追加

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Language: Pass. 仕様・計画は日本語中心で記述している。
- Learning outcome: Pass. カード一覧の検索・整理性を高めることで、復習対象へ素早く到達しやすくし、反復学習の継続を支える。
- Evidence-based scheduling: Pass. 復習間隔ロジック自体は変更せず、既存のレビュー予定を表示・保持する。
- User safety: Pass. 他ユーザーのカードは扱えず、削除や一括操作は所有者制約で保護する。
- Quality gates: Pass. 一覧検索、選択、一括更新、エクスポート、空状態の各経路に対してテストを追加する。
- UI work: Pass. 既存の React/Tailwind パターンと base screen 構成に沿って実装する。
- Integration gate: Pass. backend/frontend の両側で lint・型チェック・テストが通る状態を目標にする。

## Project Structure

### Documentation (this feature)

```text
specs/009-card-list-management/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── card-list-management.openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   │   └── cards/
│   ├── services/
│   │   └── cards/
│   ├── repositories/
│   │   └── cards/
│   ├── domains/
│   │   └── cards/
│   └── utils/
│       └── cards/
└── tests/
    ├── unit/
    │   └── cards/
    ├── contract/
    │   └── cards/
    └── integration/
        └── cards/

frontend/
├── src/
│   ├── pages/
│   │   └── CardListPage/
│   ├── services/
│   │   └── api/
│   │       └── cards/
│   ├── components/
│   ├── hooks/
│   ├── domains/
│   └── utils/
└── public/
```

**Structure Decision**: 既存の card ドメインを中心に、backend は一覧/API/更新/出力の責務を `api -> services -> repositories -> domains` の既存レイヤーへ追加する。frontend は `CardListPage` とその周辺の hook/API client を追加し、共通レイアウトと base screen 遷移は維持する。カテゴリ/タグは新規テーブルに分割せず、当面は既存の `labels` 配列をユーザー向けの分類語として扱う。

## Phase 0: Research Notes

- 現在の CardListPage は静的テキストのみで、一覧取得や操作 UI は未実装である。
- backend のカード API は preview/create のみを提供しており、一覧取得・一括更新・エクスポート・削除の read/write 経路がない。
- 既存の card レコードには `labels` 配列と復習予定が保存されており、一覧表示・検索・エクスポートの元データとして再利用できる。
- frontend のカード API クライアントは preview/create のみを扱っており、一覧系 API を追加する必要がある。
- カテゴリ/タグの概念は既存実装ではラベル配列に相当するため、今回の feature では UI 上の用語を揃えつつ、保存先は既存モデルへ寄せる。

## Phase 1: Design Notes

- 一覧 API は検索語、ラベル、カーソル、件数上限を受け取り、所有者のカードだけを返す。
- 無限スクロールはカーソルページングで実装し、次の読み込み可否を `nextCursor` で表す。
- 一括付与は選択されたカード群に対してラベルを追加する操作として定義し、未選択時は処理しない。
- エクスポートは現在の検索条件に一致するカードを JSON 単一ファイルとして返す。
- 削除は所有者確認後に 1 件単位で実行し、UI 側では確認モーダルを経由する。
- 編集への導線は既存のカード登録/編集画面への遷移として扱い、一覧画面は起点のみを担う。

## Complexity Tracking

複雑化の正当化は不要。既存のカードドメインと base screen 構成を拡張する範囲に収まっている。
