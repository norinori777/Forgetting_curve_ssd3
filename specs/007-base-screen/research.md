# Research: 基底画面

## Decision 1: 既存の path-based 画面切替を継続する

- Decision: `frontend/src/App.tsx` の `window.location.pathname` 判定を維持し、ルーティングライブラリは追加しない
- Rationale: 既存実装との差分が最小で、ログイン・新規登録・ダッシュボードへの切替に既に使われているため
- Alternatives considered:
  - React Router を導入する
  - URL ハッシュで状態を持つ
  - 全ページを単一画面に再構成する

## Decision 2: 共通レイアウトをコンポーネント分割する

- Decision: ヘッダーとページ表示部を `BaseLayout` に集約し、ブランド領域とメニュー領域は別コンポーネントに分ける
- Rationale: 画面ごとの差分をページ本体に限定でき、初期表示・共通ヘッダー・遷移のテストを分けやすい
- Alternatives considered:
  - 各ページに個別ヘッダーを複製する
  - App.tsx にすべてのレイアウトを直書きする

## Decision 3: 初期表示はダッシュボードに固定する

- Decision: 基底画面のページ表示部はダッシュボードを初期表示とする
- Rationale: ユーザーの最重要導線は日次復習の起点確認であり、最初にダッシュボードを見せるのが最も自然
- Alternatives considered:
  - カード一覧を初期表示する
  - 最後に閲覧した画面を復元する

## Decision 4: 復習リンクの遷移先は復習実施画面にする

- Decision: ヘッダーメニューの「復習」は復習実施画面を表示する
- Rationale: ダッシュボードは起点、復習実施画面は行動、という役割を分けられる
- Alternatives considered:
  - 復習一覧を別画面として新設する
  - ダッシュボードへ戻す

## Decision 5: 外部契約・バックエンド変更は不要

- Decision: この feature では API、DB、contract ファイルを追加しない
- Rationale: 基底画面はフロントエンドの共有レイアウトに限定されるため
- Alternatives considered:
  - ナビゲーション状態を backend に保存する
  - 新しい API を設計する