export type LoginFieldErrors = Partial<Record<"email" | "password", string>>;

export type LoginValues = {
  email: string;
  password: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLoginInput = (values: LoginValues): LoginFieldErrors => {
  const errors: LoginFieldErrors = {};

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "メールアドレスの形式を確認してください。";
  }

  if (values.password.length < 8 || values.password.length > 64) {
    errors.password = "パスワードは8文字以上64文字以下で入力してください。";
  }

  return errors;
};