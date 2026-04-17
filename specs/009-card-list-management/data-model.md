# Data Model: UC-13 カード一覧確認・検索・一括管理

## Overview

UC-13 では、既存の学習カードデータを一覧表示し、検索条件・複数選択・一括ラベル付与・削除・エクスポートへつなぐ。ここでは新しい永続化概念を最小限に抑え、既存の `labels` 配列を分類語として再利用する。

## Entities

### CardListItem

一覧に表示される 1 件のカード。

| Field | Meaning |
| --- | --- |
| cardId | カード識別子 |
| title | タイトル |
| question | 問い |
| answer | 答え |
| memo | メモ |
| labels | カードに付与された分類語 |
| firstReviewAt | 初回復習日 |
| secondReviewAt | 2 回目復習日 |
| thirdReviewAt | 3 回目復習日 |
| fourthReviewAt | 4 回目復習日 |
| createdAt | 作成日時 |
| updatedAt | 更新日時 |

### CardListQuery

一覧取得とエクスポートに使う検索条件。

| Field | Meaning | Rules |
| --- | --- | --- |
| q | タイトル・問い・答えに対する部分一致検索語 | 空欄可 |
| labels | 絞り込み対象の分類語配列 | 0 件以上 |
| cursor | 次ページ取得用カーソル | 空欄可 |
| limit | 1 回の取得件数 | 既定値あり |

### CardListSelection

一覧上で選択されているカード集合。

| Field | Meaning |
| --- | --- |
| selectedCardIds | 選択中の cardId 一覧 |
| source | 検索結果か通常一覧かを区別する参照情報 |

### BulkLabelUpdate

選択済みカードに対する一括付与命令。

| Field | Meaning | Rules |
| --- | --- | --- |
| cardIds | 対象カード識別子一覧 | 1 件以上 |
| labels | 追加付与する分類語一覧 | 重複除去して扱う |

### ExportPayload

JSON 単一ファイルとして出力されるデータセット。

| Field | Meaning |
| --- | --- |
| exportedAt | 出力日時 |
| filters | 出力に使った検索条件 |
| cards | エクスポート対象カード一覧 |

## Relationships

- 1 人のユーザーは 0 件以上の CardListItem を所有する。
- 1 件の CardListItem は 0 件以上の labels を持つ。
- CardListSelection は CardListItem の部分集合である。
- BulkLabelUpdate は CardListSelection を元に実行される。
- ExportPayload は CardListQuery の結果セットをそのままシリアライズする。

## Validation Rules

- 検索語は前後空白を除去したうえで評価する。
- 検索語、labels、カーソル、件数制限は所有者のカードにだけ適用する。
- labels は同一カード内で重複を持たない。
- 一括更新は選択カードが 0 件なら実行不可とする。
- 削除済みカードは一覧の再取得時に選択状態から除外する。

## State Notes

- 無限スクロールは `nextCursor` がある限り追加取得可能とする。
- 空状態は「検索条件に一致するカードが 0 件」の画面状態として扱う。
- エクスポートは表示条件と同じフィルタを反映した結果のみを含める。
