# Research: 基底画面のページ表示部フラット化

## Decision 1: 各認証後ページの最外層カードを削除する

- Decision: Dashboard, CardList, Review, Settings の各ページから、最外層の白背景・角丸・影付き・中央寄せ固定幅のカード表現を取り除く。
- Rationale: 変更要件は表示レイアウトに限定されており、本文や操作導線は維持したまま、外観だけをフラット化するのが最小変更である。
- Alternatives considered:
  - BaseLayout 側で全体の見た目を吸収する案
  - 共通コンテナコンポーネントを新設する案
  - いずれも影響範囲が広がりやすく、今回の「カード状外枠だけを外す」という目的に対して過剰。

## Decision 2: BaseLayout のヘッダーと main 構造は維持する

- Decision: BaseLayout のヘッダー、main の配置、ページ切り替えの構造は変更しない。
- Rationale: 仕様はページ表示部の外枠のみを対象としており、ナビゲーションや画面遷移を変える必要がない。
- Alternatives considered:
  - BaseLayout を再設計してページごとのレイアウトを分岐させる案
  - 見た目の変更をルーティング層に寄せる案
  - どちらも不要な複雑化となり、レイアウト責務を不明瞭にする。

## Decision 3: 既存 design tokens を参照し、追加のデザイン契約は作らない

- Decision: 既存の design tokens と現在の React/Tailwind 方針を参照し、追加の契約ファイルは作成しない。
- Rationale: この feature は UI の見た目変更のみで、外部 API や永続データの仕様変更を伴わない。
- Alternatives considered:
  - 新しい UI 契約やデータ契約を作る案
  - 外部公開の仕様がないため不要。
