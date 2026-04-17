# Data Model: 基底画面

この feature は永続データを持たない。対象は画面構成とナビゲーション状態である。

## View Models

### AppShellState

| Field | Meaning | Notes |
|------|---------|------|
| activePage | 現在ページ | dashboard / cardList / review / settings などの画面キー |
| isHeaderVisible | ヘッダー表示状態 | 常に true を想定 |
| brandLabel | サービス名 | 固定表示 |
| brandIcon | サービスアイコン | 固定表示 |

### NavigationItem

| Field | Meaning | Notes |
|------|---------|------|
| label | メニュー表示名 | サービスカード一覧 / 復習 / 設定 |
| destination | 遷移先ページキー | 1 対 1 で対応 |
| order | 表示順 | 左から右へ均等割 |
| isActive | 現在選択中か | activePage により決定 |

### PageSlot

| Field | Meaning | Notes |
|------|---------|------|
| currentPage | 表示中のページ | ヘッダーリンク選択で更新 |
| defaultPage | 初期表示ページ | dashboard に固定 |

## State Transitions

| From | Event | To | Notes |
|------|-------|----|------|
| dashboard | click card list | cardList | ページ表示部のみ切替 |
| dashboard | click review | review | 復習実施画面へ遷移 |
| dashboard | click settings | settings | 設定画面へ遷移 |
| any authenticated page | reload | dashboard | 初期表示はダッシュボード |

## Validation Rules

- ページ表示部は常に 1 つの画面のみを表示する
- ヘッダーメニューの 3 項目は固定順序で表示する
- 初期表示はダッシュボードである