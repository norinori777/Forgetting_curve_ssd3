# Data Model: アカウント登録画面（UC-01）

## 1. RegistrationFormInput

- Purpose: 画面入力状態の保持と項目単位バリデーション
- Fields:
  - emailRaw: string (required)
  - passwordRaw: string (required, length 8-64)
  - passwordConfirmRaw: string (required)
  - fieldErrors: object (optional)
  - formState: enum(initial, validation_error, submitting, success, failure)
- Validation Rules:
  - emailRaw は必須かつメール形式
  - passwordRaw は 8-64 文字
  - passwordConfirmRaw は passwordRaw と一致

## 2. AccountRegistrationRequest

- Purpose: バックエンドが受け取る登録要求
- Fields:
  - requestId: string (required, unique)
  - normalizedEmail: string (required, lowercase(trim(emailRaw)))
  - passwordRaw: string (required)
  - clientIp: string (required)
  - requestedAt: datetime (required)
- Validation Rules:
  - normalizedEmail が既存と重複しないこと
  - clientIp と normalizedEmail の組み合わせで 1分5回以内

## 3. UserAccount

- Purpose: 登録済みユーザー情報
- Fields:
  - userId: string (required, unique)
  - normalizedEmail: string (required, unique)
  - passwordHash: string (required)
  - createdAt: datetime (required)
  - status: enum(active, locked) (required)
- Validation Rules:
  - passwordHash は復元不能なハッシュで保存
  - raw password は永続化しない

## 4. UserSession

- Purpose: 登録成功直後の自動ログイン状態
- Fields:
  - sessionId: string (required, unique)
  - userId: string (required)
  - issuedAt: datetime (required)
  - expiresAt: datetime (required, issuedAt + 24h)
  - state: enum(active, expired, revoked) (required)
- Validation Rules:
  - expiresAt は issuedAt より後
  - セッション作成失敗時は UserAccount 作成をロールバック

## 5. RegistrationErrorSummary

- Purpose: 画面上部の要約エラー表示
- Fields:
  - errorType: enum(duplicate_email, rate_limited, transient_failure, validation_failed)
  - userMessage: string (required)
  - retryable: boolean (required)
  - retryAfterSeconds: number (optional)
- Validation Rules:
  - rate_limited の場合は retryAfterSeconds を設定
  - userMessage に機密値を含めない

## 6. RegistrationKpiWindow

- Purpose: SC-001 の週次判定に用いる集計ウィンドウ
- Fields:
  - windowStartAt: datetime (required)
  - windowEndAt: datetime (required)
  - totalAttempts: integer (required, 明示キャンセル除外後)
  - completedWithin3m: integer (required)
  - completionRate: number (required, completedWithin3m / totalAttempts)
  - eligibleForScoring: boolean (required, totalAttempts >= 100)
- Validation Rules:
  - window は直近7日
  - eligibleForScoring が false の期間は SC-001 判定対象外
  - 明示キャンセルイベントのみ母数から除外

## Relationships

- RegistrationFormInput -> AccountRegistrationRequest: 1 to 1 (送信時生成)
- AccountRegistrationRequest -> UserAccount: 1 to 0..1 (重複/失敗時は未作成)
- UserAccount -> UserSession: 1 to 0..1 (作成失敗時はロールバック)
- AccountRegistrationRequest -> RegistrationKpiWindow: many to 1 (週次集計)

## State Transition (Registration)

1. initial
2. validation_error (入力不正)
3. submitting
4. success (UserAccount + UserSession 作成完了)
5. failure (duplicate/rate_limit/transient)
