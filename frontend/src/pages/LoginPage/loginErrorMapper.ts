type MappedError = {
  title: string;
  message: string;
  retryable: boolean;
};

export const mapLoginError = (
  errorCode:
    | "INVALID_CREDENTIALS"
    | "RATE_LIMIT_EXCEEDED"
    | "LOGIN_FAILED"
    | "HTTPS_REQUIRED"
    | "VALIDATION_FAILED",
  retryAfterSeconds?: number
): MappedError => {
  switch (errorCode) {
    case "INVALID_CREDENTIALS":
      return {
        title: "メールアドレスまたはパスワードが正しくありません",
        message: "入力内容を確認してもう一度お試しください。",
        retryable: false
      };
    case "RATE_LIMIT_EXCEEDED":
      return {
        title: "試行回数の上限に達しました",
        message: `しばらく待ってから再試行してください。${retryAfterSeconds ? ` (${retryAfterSeconds}秒)` : ""}`,
        retryable: true
      };
    case "HTTPS_REQUIRED":
      return {
        title: "安全な接続が必要です",
        message: "HTTPS接続で再読み込みしてから再試行してください。",
        retryable: true
      };
    case "VALIDATION_FAILED":
      return {
        title: "入力内容に誤りがあります",
        message: "項目エラーを修正してから再送信してください。",
        retryable: false
      };
    case "LOGIN_FAILED":
    default:
      return {
        title: "ログインに失敗しました",
        message: "時間をおいて再試行してください。",
        retryable: true
      };
  }
};