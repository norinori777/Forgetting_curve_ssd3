type MappedError = {
  title: string;
  message: string;
  retryable: boolean;
};

export const mapSignupError = (
  errorCode: "DUPLICATE_EMAIL" | "RATE_LIMIT_EXCEEDED" | "SIGNUP_FAILED" | "HTTPS_REQUIRED" | "VALIDATION_FAILED",
  retryAfterSeconds?: number
): MappedError => {
  switch (errorCode) {
    case "DUPLICATE_EMAIL":
      return {
        title: "このメールアドレスは登録済みです",
        message: "ログイン画面に移動するか、別のメールアドレスでお試しください。",
        retryable: false
      };
    case "RATE_LIMIT_EXCEEDED":
      return {
        title: "試行回数の上限に達しました",
        message: `しばらく待ってから再試行してください。${
          retryAfterSeconds ? ` (${retryAfterSeconds}秒)` : ""
        }`,
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
        retryable: true
      };
    case "SIGNUP_FAILED":
    default:
      return {
        title: "登録に失敗しました",
        message: "時間をおいて再試行してください。",
        retryable: true
      };
  }
};
