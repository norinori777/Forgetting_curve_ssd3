import type { LoginFieldErrors as LoginFieldErrorsType } from "./loginValidation";

type LoginFieldErrorsProps = {
  errors: LoginFieldErrorsType;
};

export function LoginFieldErrors({ errors }: LoginFieldErrorsProps) {
  return (
    <>
      {errors.email ? (
        <p id="login-email-error" role="alert" aria-live="polite" style={{ color: "#b42318", margin: "6px 0 0" }}>
          {errors.email}
        </p>
      ) : null}
      {errors.password ? (
        <p id="login-password-error" role="alert" aria-live="polite" style={{ color: "#b42318", margin: "6px 0 0" }}>
          {errors.password}
        </p>
      ) : null}
    </>
  );
}