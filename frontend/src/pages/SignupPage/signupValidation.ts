export type SignupFieldErrors = Partial<Record<"email" | "password" | "passwordConfirm", string>>;

export type SignupValues = {
  email: string;
  password: string;
  passwordConfirm: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignupInput = (values: SignupValues): SignupFieldErrors => {
  const errors: SignupFieldErrors = {};

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "メールアドレスの形式を確認してください。";
  }

  if (values.password.length < 8 || values.password.length > 64) {
    errors.password = "パスワードは8文字以上64文字以下で入力してください。";
  }

  if (!values.passwordConfirm || values.passwordConfirm !== values.password) {
    errors.passwordConfirm = "確認用パスワードが一致しません。";
  }

  return errors;
};
