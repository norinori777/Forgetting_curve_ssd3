# Research: UC-13 カード一覧確認・検索・一括管理

## Decision 1

- **Decision**: カード一覧は新規の専用画面を作らず、既存の `frontend/src/pages/CardListPage/` を実データ駆動の一覧画面へ拡張する。
- **Rationale**: base screen の `/cards` ルートと既存ページの責務がすでに確立しており、画面遷移とヘッダー構成を維持したまま機能追加できるため。
- **Alternatives considered**: 新規ページを別ルートで追加する案もあったが、遷移とメニューの整合性を崩しやすく、既存の画面名と乖離するため採用しない。

## Decision 2

- **Decision**: backend には一覧取得、カーソルページング、一括ラベル更新、削除、エクスポートの API を追加する。
- **Rationale**: カード一覧の検索・無限スクロール・一括管理・JSON 出力は、フロントだけでは成立せず、所有者制御もサーバー側で担保する必要があるため。
- **Alternatives considered**: フロント側で既存の create/preview API だけを流用してローカル表示する案は、他ユーザー保護と一覧の整合性を満たせないため採用しない。

## Decision 3

- **Decision**: カテゴリ/タグは新規の正規化テーブルを今すぐ導入せず、既存の `labels` 配列をユーザー向けの分類語として扱う。
- **Rationale**: 現行の card モデルと frontend の登録 UI がすでに `labels` を採用しており、UC-13 を最短で実現するには既存表現を再利用するのが最も低リスクなため。
- **Alternatives considered**: `CategoryTag` の専用テーブルを追加する案もあるが、今回の feature の中心価値は一覧管理であり、モデル分割は別 feature で扱う方が変更範囲を抑えられる。

## Decision 4

- **Decision**: 無限スクロールは `nextCursor` を返すカーソルページングで実装する。
- **Rationale**: 追加読み込みと選択状態の維持を両立しやすく、1000 件超の閲覧継続という成功基準にも適合するため。
- **Alternatives considered**: 伝統的なページ番号方式は「下端到達時に継続表示」という UX 要件と合わないため採用しない。

## Decision 5

- **Decision**: エクスポートは現在の検索条件を反映した JSON 単一ファイルとして返す。
- **Rationale**: 一覧上で見えている対象をそのまま出力できると利用者の期待と一致し、後続のインポート/バックアップ用途にも拡張しやすいため。
- **Alternatives considered**: 画面全件固定のエクスポートも考えたが、フィルタ後の対象を持ち出したい実運用に弱いため採用しない。

## Decision 6

- **Decision**: 一括付与は選択済みカードの `labels` に対して追加更新する操作とする。
- **Rationale**: 現行データ構造と整合し、編集結果の影響範囲をカード単位で明確にできるため。
- **Alternatives considered**: 選択カードを別の集合へ再分類する案は、今回の対象外であるカテゴリ/タグ新設計まで含んでしまうため採用しない。
