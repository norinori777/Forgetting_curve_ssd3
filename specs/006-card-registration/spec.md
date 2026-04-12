# Feature Specification: カード登録画面

**Feature Branch**: `[006-card-registration]`  
**Created**: 2026-04-12  
**Status**: Draft  
**Input**: User description: "カート登録画面を作成します。docs/card-registration-screen-ascii-ui.mdから仕様を作成してください。"

**Language Note**: この仕様書は原則として日本語で記述します（憲法: 実施言語）。

## Clarifications

### Session 2026-04-12

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - 個別登録でカードを作成する (Priority: P1)

学習者は、タイトル*・問い*・答え・メモを入力し、必要に応じてタグやカテゴリを選んだうえで、保存前に復習予定を確認し、その内容を確定してカードを登録できる。

**Why this priority**: カード登録画面の中心となる価値であり、最小限の利用でも学習カードを作成できる必要があるため。

**Independent Test**: 必須項目を入力して確認画面に進み、表示された復習予定を確認したうえで保存まで完了できることで独立して検証できる。

**Acceptance Scenarios**:

1. **Given** 個別登録タブでタイトル*と問い*が空欄のとき、**When** ユーザーが保存を実行すると、**Then** 必須項目ごとのエラーが表示され保存されない。
2. **Given** 必須項目が入力済みのとき、**When** ユーザーが初回復習日を確認すると、**Then** 復習予定が表示され、修正または確定のどちらかを選べる。
3. **Given** 確定前の確認画面が表示されているとき、**When** ユーザーが確定して保存すると、**Then** カードが登録され、完了状態へ進む。

---

### User Story 2 - 入力エラーや重複送信から安全に戻る (Priority: P2)

学習者は、入力エラー、通信失敗、重複クリックなどの失敗時にも、現在の入力内容を保ったまま原因を確認し、修正または再試行できる。

**Why this priority**: 成功経路を支える安全性の要件であり、誤登録や混乱を防ぐために必要だが、主機能より優先度は低いため。

**Independent Test**: エラー状態や送信中状態を再現し、保存されないこと、再試行導線が出ること、二重作成が起きないことを確認できる。

**Acceptance Scenarios**:

1. **Given** 必須項目が不足しているとき、**When** ユーザーが保存を試みると、**Then** 該当項目が強調表示され、保存は実行されない。
2. **Given** 送信中の状態であるとき、**When** ユーザーが同じ操作を再度実行すると、**Then** 2 回目以降の送信は無視され、カードは 1 件だけ処理される。
3. **Given** 通信失敗が起きたとき、**When** ユーザーがエラー表示を確認すると、**Then** 再試行できる案内が表示され、入力内容は保持される。

---

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- タイトルが 100 文字を超える入力は受け付けない。
- 問い、答え、メモが 500 文字を超える入力は受け付けない。
- タグ・カテゴリは未選択のままでも登録できる。
- 初回復習予定は表示できるが、ユーザーは保存前に修正へ戻れる。
- 他ユーザーの管理対象に対する操作は拒否され、保存処理へ進まない。

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: 個別登録では、タイトル*、問い*、答え、メモ、タグ・カテゴリの入力領域を提供する。
- **FR-002**: タイトル*と問い*は必須とし、答え、メモ、タグ・カテゴリは任意として扱う。
- **FR-003**: タイトルは 100 文字以内、問い・答え・メモはそれぞれ 500 文字以内に制限する。
- **FR-004**: 文字数は入力中に即時表示し、上限を超える入力は受け付けない。
- **FR-005**: 必須項目が不足している場合は、項目ごとのエラーを表示し、保存を実行しない。
- **FR-006**: 保存前に初回復習予定を確認できる画面を表示し、ユーザーが修正または確定を選べるようにする。
- **FR-007**: 確定後はカードを登録し、登録完了後に次の導線へ進める。
- **FR-008**: 送信中は保存や確認の操作を無効化し、同じ操作の重複送信を防止する。
- **FR-009**: 通信失敗時は失敗理由と再試行の導線を表示し、入力内容を保持する。
- **FR-010**: 登録対象が権限のないコンテキストである場合は操作を拒否し、保存しない。

### Key Entities *(include if feature involves data)*

- **学習カード**: タイトル、問い、答え、メモ、タグ・カテゴリ、復習予定を持つ登録対象。
- **登録入力**: 個別登録時の入力内容と検証状態を表す下書き。
- **復習予定**: 初回登録後に提示される将来の確認日一覧。

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 90% 以上の利用者が、個別登録の開始から保存完了までを 2 分以内に完了できる。
- **SC-002**: 95% 以上の入力エラー発生時に、利用者は画面を離れずに修正点を特定できる。
- **SC-003**: 重複送信の試行を 100% 防ぎ、同一操作で作成される学習カードが 1 件を超えない。
- **SC-004**: 文字数制限を超える入力については、100% のケースで上限超過を明示し、保存対象に含めない。

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- 利用者はすでにログイン済みで、自分の学習カードを管理する権限を持っている。
- タグ・カテゴリは既存の選択肢から指定する前提であり、この画面で新規作成は行わない。
- 復習予定の算出方法は既存の復習間隔ルールに従い、この仕様では画面表示と確認導線に焦点を当てる。
- モバイル表示でも利用できることを前提とするが、専用のモバイル体験は別要件として扱わない。
