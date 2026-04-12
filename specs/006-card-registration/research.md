# Research: カード登録画面

## Decision 1: 復習予定はバックエンド側で純粋関数として算出する

- Decision: 初回復習予定の算出ロジックは `backend/src/utils/cards/` に純粋関数として分離し、`CardService` から再利用する。
- Rationale: 画面表示と保存処理で同じ予定を出したい。純粋関数にしておけば、境界値テスト（前/一致/後、UTC/JST）を決定論的に書ける。
- Alternatives considered:
  - フロントエンドでのみ計算する案: 確認画面は作りやすいが、保存時との差分が出ると不整合になるため採用しない。
  - create API のみで返す案: 画面の確認タイミングで再利用しづらく、確認→確定の UX が実装しにくいため採用しない。

## Decision 2: API は preview と create の 2 段階に分ける

- Decision: `POST /cards/preview` で検証と初回復習予定を返し、`POST /cards` で確定保存する。
- Rationale: 仕様の「保存前の確認画面」と整合し、フォーム内容を保持したまま修正へ戻れる。preview と create で同一サービスを使えば検証と保存の整合性も保てる。
- Alternatives considered:
  - クライアントだけで preview する案: サーバー側検証とズレると誤表示の原因になる。
  - 1 本の create API で preview も兼ねる案: 実装は簡単だが、確認画面の状態管理が不自然になる。

## Decision 3: Card は User にぶら下がる新規 Prisma モデルとして追加する

- Decision: `Card` モデルを新設し、`userId` 外部キーで所有権を持たせる。タグ/カテゴリは別マスタを作らず、選択済みラベル配列として保持する。
- Rationale: 現在の schema は auth 専用で、カードの永続化が存在しない。タグ/カテゴリの独立管理要件は未確定のため、まずは配列で十分。
- Alternatives considered:
  - タグ・カテゴリ専用テーブルを新設する案: 今回の画面だけでは過剰で、後続機能が固まってからの方がよい。
  - JSON カラムで全入力を保存する案: 柔軟だが検索性・型安全性が落ちるため、まずは列ベースを優先する。

## Decision 4: フロントエンドは Login/Signup と同じ page-local state + custom hook パターンを使う

- Decision: `CardRegistrationPage` は入力フォーム本体を page コンポーネントに置き、送信・エラー・二重送信防止は custom hook に分離する。
- Rationale: 既存の LoginPage / SignupPage と同じ粒度なので、命名・テスト・状態遷移を揃えられる。
- Alternatives considered:
  - 大きな単一コンポーネント: 早いが、preview/confirm/error が増えると保守しにくい。
  - 汎用フォームフレームワーク導入: 既存実装に比べて過剰で、今回の範囲には不要。

## Decision 5: 認可は既存 session cookie を前提に、カード作成時に所有権を強制する

- Decision: backend はログイン済みセッションを前提に、リクエストの userId と作成先 userId を照合し、他人のコンテキストは 403 で拒否する。
- Rationale: 仕様の安全要件に合致し、データ消失や誤登録を防げる。
- Alternatives considered:
  - 認証なしで実装する案: 仕様と憲法に反する。
  - フロントエンドのみで制御する案: クライアント回避に弱く、バックエンド側の防御が必要。
