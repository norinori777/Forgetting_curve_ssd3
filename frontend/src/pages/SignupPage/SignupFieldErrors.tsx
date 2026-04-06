import type { SignupFieldErrors as SignupFieldErrorsType } from "./signupValidation";

type SignupFieldErrorsProps = {
  errors: SignupFieldErrorsType;
};

export function SignupFieldErrors({ errors }: SignupFieldErrorsProps) {
  return (
    <>
      {errors.email ? (
        <p id="signup-email-error" role="alert" aria-live="polite" style={{ color: "#b42318", margin: "6px 0 0" }}>
          {errors.email}
        </p>
      ) : null}
      {errors.password ? (
        <p id="signup-password-error" role="alert" aria-live="polite" style={{ color: "#b42318", margin: "6px 0 0" }}>
          {errors.password}
        </p>
      ) : null}
      {errors.passwordConfirm ? (
        <p
          id="signup-password-confirm-error"
          role="alert"
          aria-live="polite"
          style={{ color: "#b42318", margin: "6px 0 0" }}
        >
          {errors.passwordConfirm}
        </p>
      ) : null}
    </>
  );
}
