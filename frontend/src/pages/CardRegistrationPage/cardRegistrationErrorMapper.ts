export type CardRegistrationSummary = {
  title: string;
  message: string;
  retryable: boolean;
};

export const mapCardRegistrationError = (
  errorCode:
    | "VALIDATION_FAILED"
    | "AUTH_REQUIRED"
    | "FORBIDDEN"
    | "CARD_PREVIEW_FAILED"
    | "CARD_CREATE_FAILED"
    | "HTTPS_REQUIRED"
): CardRegistrationSummary => {
  switch (errorCode) {
    case "VALIDATION_FAILED":
      return {
        title: "入力内容に誤りがあります",
        message: "項目エラーを修正してから再送信してください。",
        retryable: false
      };
    case "AUTH_REQUIRED":
      return {
        title: "ログインが必要です",
        message: "ログイン後にもう一度お試しください。",
        retryable: true
      };
    case "FORBIDDEN":
      return {
        title: "この操作は許可されていません",
        message: "アカウントの権限を確認してください。",
        retryable: false
      };
    case "HTTPS_REQUIRED":
      return {
        title: "安全な接続が必要です",
        message: "HTTPS 接続で再読み込みしてから再試行してください。",
        retryable: true
      };
    case "CARD_PREVIEW_FAILED":
    case "CARD_CREATE_FAILED":
    default:
      return {
        title: "登録に失敗しました",
        message: "時間をおいて再試行してください。",
        retryable: true
      };
  }
};