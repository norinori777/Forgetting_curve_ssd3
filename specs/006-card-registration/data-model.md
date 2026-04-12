# Data Model: カード登録画面

## Entities

### CardDraft

個別登録フォームの入力途中状態。

- title: string
- question: string
- answer: string | null
- memo: string | null
- labels: string[]
- fieldErrors: Record<string, string>
- isSubmitting: boolean
- isPreviewing: boolean

Validation rules:

- title is required and max 100 characters
- question is required and max 500 characters
- answer max 500 characters when present
- memo max 500 characters when present
- labels may be empty

### ReviewSchedule

保存前に表示する初回復習予定の派生データ。

- firstReviewAt: Date
- secondReviewAt: Date
- thirdReviewAt: Date
- fourthReviewAt: Date
- timezone: string
- policyVersion: string

State transitions:

- derived from CardDraft after preview validation
- reused by create response so the confirmed card matches the preview

### Card

永続化される学習カード。

- id: string
- userId: string
- title: string
- question: string
- answer: string | null
- memo: string | null
- labels: string[]
- firstReviewAt: Date
- reviewPolicyVersion: string
- createdAt: Date
- updatedAt: Date

Relationships:

- belongs to one User
- is created from one CardDraft

Validation rules:

- owner must match the authenticated user
- created card stores the same values that were previewed
- labels are limited to approved option values from the UI configuration

### CardPreviewResponse

プレビュー API が返す検証結果。

- isValid: boolean
- fieldErrors: Record<string, string>
- reviewSchedule: ReviewSchedule | null

## State Flow

1. Draft is edited in the UI.
2. Preview API validates the draft and returns a schedule.
3. User returns to edit or confirms.
4. Create API persists the card in a transaction.
5. UI shows completion state and navigates back to the main area.

## Notes

- Initial review schedule is deterministic and must be tested around day boundaries.
- No separate tag master is introduced in this feature.
