---
description: Frontend development skill for React + Tailwind projects (component design, naming, accessibility, states, reuse).
---

## Purpose

この Agent は、フロントエンド実装時の一貫した判断基準（コンポーネント分割、命名、Tailwind、Storybook、レスポンシブ、アクセシビリティ、状態設計、既存UI再利用）を提供します。

前提:
- 実装・仕様・計画は原則として日本語で記述する
- 既存のデザインシステム/コンポーネント/トークンとして、./design/design-tokens.mdを参照する。

## React コンポーネント分割方針

- 目的別に分ける
  - **Presentational（表示）**: props からUIを描画するだけ（副作用なし、テスト容易）
  - **Container（接続）**: データ取得、状態管理、イベント組み立て
  - **Hooks（ロジック）**: UI から分離した状態遷移/副作用
- 分割の基準（いずれかを満たしたら分割を検討）
  - 1コンポーネントが「複数の責務（表示+データ取得+状態遷移）」を持ち始めた
  - 条件分岐が増えて読みづらい（例: loading/error/empty/success が混在）
  - 再利用される可能性が高い（フォーム部品、カード、リスト行、モーダル等）
  - props が肥大化（目安: 8〜10個以上）
- コンポーネントの公開単位
  - ページ/画面は「合成（composition）」中心にし、汎用部品を内側に寄せる
  - 汎用化は過度にしない（YAGNI）。まずは“再利用が実際に発生した時”に抽象化

## props / state / event の命名規則

- props
  - 真偽: `isX`, `hasX`, `canX`, `shouldX`
  - ハンドラ（外部公開）: `onX`（例: `onSubmit`, `onSelect`, `onClose`）
  - 表示テキスト: `label`, `title`, `description`, `helperText`
  - 表示バリエーション: `variant`, `size`（既存UIがあればそれに合わせる）
  - スタイル追加: `className`（必要最小限。既存パターンがあればそれを優先）
  - React標準: `children`
- state
  - データ: `items`, `item`, `user`, `form`, `draft`（名詞）
  - 真偽: `isLoading`, `isSubmitting`, `isOpen`, `isDirty`
  - エラー: `error`（型/構造が必要なら `errorMessage`, `fieldErrors` など）
  - 選択: `selectedId`, `activeTab`, `currentPage`
  - setter: `setX`
- event/handler（内部）
  - 内部実装の関数名は `handleX`（例: `handleSubmit`, `handleRetry`）
  - props に渡すときは `onX={handleX}` の形に揃える

## Tailwind の利用方針

- 既存トークン/既存UIのクラス構成を最優先（新しい色・フォント・影などを勝手に追加しない）
- クラスは「レイアウト → 余白 → 文字 → 色 → 状態」の順でまとめて可読性を保つ
- 条件付きクラスは最小化し、複雑になったらコンポーネント分割 or 変数化する
- カスタム CSS は最後の手段（どうしても必要なら最小範囲で、理由を残す）

## Storybook の追加基準

- 追加する（優先度高）
  - 2箇所以上で再利用される UI コンポーネント
  - props により見た目/挙動が変わる（`variant`, `size`, disabled 等）
  - loading/error/empty を含む状態を持つコンポーネント
- 追加しない（原則）
  - 1回しか使わないページ固有のレイアウト
  - データ取得やルーティング前提が強いもの（まずは表示部品へ分離）
- Story の最低限
  - Default
  - 主要な variant
  - loading / error / empty（該当する場合）

## レスポンシブ設計

- モバイルファースト（最小幅で破綻しないことを最優先）
- ブレークポイントは Tailwind の標準を前提に、既存UIがある場合はそれに従う
- 横スクロール強制を避ける（表・長文は折返し/省略/段組みを検討）

## アクセシビリティ最低基準

- セマンティック HTML を優先（`button`/`a`/`label` などを正しく使う）
- キーボード操作可能（Tab 移動、Enter/Space 操作、フォーカスが見える）
- フォームはラベル必須（`label` と `id` の紐付け、または適切な aria）
- 画像には代替テキスト（装飾なら空 alt）
- 状態変化（エラー、保存完了等）は必要なら `aria-live` 等で伝達
- 低コントラストを避ける（既存トークン/デザイン規約に従う）

## loading / error / empty state の扱い

- 各画面/主要コンポーネントは最低限この4状態を持つ設計にする:
  - `loading`: ユーザーが「待っている」と分かる（スケルトン/スピナー/文言）
  - `error`: 失敗理由を簡潔に表示し、可能なら `Retry`（再試行）手段を提供
  - `empty`: データが無いことを示し、次の行動（作成/追加/設定）を案内
  - `success`: 通常表示
- 例外やエラーは握りつぶさない（ログ/表示/再試行のいずれか）

## 既存 UI パターンの再利用方針

- 既にあるコンポーネント/パターン（ボタン、入力、カード、リスト、ダイアログ等）があれば必ず再利用
- 似た見た目の新規実装を増やさない（“微妙に違う” を避ける）
- 必要な差分がある場合は
  - まず既存コンポーネントの拡張（`variant` 追加等）を検討
  - それが破綻するなら新規作成（ただし命名とAPIを既存に寄せる）

## Output Expectations

- 指示がない限り、UI/状態/命名/アクセシビリティの判断理由を短く添える
- 不明点（技術スタック、既存UI、ブレークポイント等）は最小限の質問にまとめる
