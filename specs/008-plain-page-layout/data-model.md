# Data Model: 基底画面のページ表示部フラット化

## Conclusion

この feature は表示レイアウトのみを扱うため、新しい永続データエンティティは追加しない。

## Conceptual Presentation Surfaces

### BaseLayout

- 役割: 認証後画面の共通ヘッダーとページ表示部を提供する
- 関連: 1つの画面内容を子要素として受け取る
- 変更範囲: なし。構造は維持し、外側のカード表現は各ページ側で持たない

### PageContent

- 役割: Dashboard, CardList, Review, Settings の各画面の本文
- 関連: BaseLayout のページ表示部に直接配置される
- 制約: 白背景の独立カード、角丸、影付き、中央寄せ固定幅の外枠を持たない

## Validation Rules

- 主要4画面の本文はページ表示部に直接配置される
- 画面全体を囲む単一カードは表示しない
- 画面遷移や入力値の扱いは既存仕様を維持する

## State Transitions

- この feature で新しい状態遷移は発生しない
- 既存の画面遷移は維持される
