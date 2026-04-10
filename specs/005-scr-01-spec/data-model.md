# Data Model: ログイン画面（SCR-01）

## 1. LoginFormInput

- Purpose: 画面入力状態と項目単位のバリデーションを保持する
- Fields:
  - emailRaw: string (required)
  - passwordRaw: string (required)
  - fieldErrors: object (optional)
  - formState: enum(initial, validation_error, submitting, success, failure, locked)
  - isPasswordVisible: boolean (required)
- Validation Rules:
  - emailRaw は必須かつメール形式
  - passwordRaw は 8-64 文字
  - 送信前に前後空白を除去した値で検証する

## 2. LoginRequest

- Purpose: バックエンドが受け取る認証要求
- Fields:
  - requestId: string (required, unique)
  - normalizedEmail: string (required, lowercase(trim(emailRaw)))
  - passwordRaw: string (required)
  - clientIp: string (required)
  - requestedAt: datetime (required)
- Validation Rules:
  - normalizedEmail + clientIp の組み合わせで 1分5回以内
  - raw password を永続化しない

## 3. UserAccount

- Purpose: 既存ユーザーの認証対象
- Fields:
  - userId: string (required, unique)
  - normalizedEmail: string (required, unique)
  - passwordHash: string (required)
  - createdAt: datetime (required)
  - status: enum(active, locked) (required)
- Validation Rules:
  - passwordHash は復元不能なハッシュで保存する
  - ログイン時は normalizedEmail で照合する

## 4. UserSession

- Purpose: ログイン成功後のセッション状態
- Fields:
  - sessionId: string (required, unique)
  - userId: string (required)
  - issuedAt: datetime (required)
  - expiresAt: datetime (required, issuedAt + 24h)
  - state: enum(active, expired, revoked) (required)
- Validation Rules:
  - expiresAt は issuedAt より後
  - セッション作成失敗時はログイン処理全体を失敗にする

## 5. LoginErrorSummary

- Purpose: 画面上部に表示する要約エラー
- Fields:
  - errorType: enum(invalid_credentials, rate_limited, transient_failure, locked)
  - userMessage: string (required)
  - retryable: boolean (required)
  - retryAfterSeconds: number (optional)
- Validation Rules:
  - invalid_credentials では存在有無や一致不一致の詳細を含めない
  - rate_limited / locked では retryAfterSeconds を使って待機時間を示す

## 6. LoginAttemptMetrics

- Purpose: ログイン成功率・失敗率・ロック率の測定に用いる
- Fields:
  - windowStartAt: datetime (required)
  - windowEndAt: datetime (required)
  - totalAttempts: integer (required)
  - successfulAttempts: integer (required)
  - failedAttempts: integer (required)
  - lockedAttempts: integer (required)
- Validation Rules:
  - 主要指標は直近7日で集計可能な形にする
  - 画面上の実装状況ではなく、API 結果を基準に計測する

## Relationships

- LoginFormInput -> LoginRequest: 1 to 1 (送信時生成)
- LoginRequest -> UserAccount: 1 to 0..1 (認証失敗時は未作成)
- UserAccount -> UserSession: 1 to 0..1 (認証成功時に作成)
- LoginRequest -> LoginErrorSummary: 0..1 to 1 (失敗時の表示用)

## State Transition (Login)

1. initial
2. validation_error (入力不正)
3. submitting
4. success (UserSession 作成完了)
5. failure (invalid_credentials / transient_failure)
6. locked (rate limit or account lock)