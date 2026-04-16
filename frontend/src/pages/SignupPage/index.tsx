import { useState, type CSSProperties, type FormEvent } from "react";
import { SignupErrorSummary } from "./SignupErrorSummary";
import { SignupFieldErrors } from "./SignupFieldErrors";
import { useSignupSubmit } from "./useSignupSubmit";

const formShellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 420,
  margin: "0 auto",
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 14px 40px rgba(16, 24, 40, 0.12)",
  padding: "clamp(16px, 4vw, 28px)"
};

const fieldStyle: CSSProperties = {
  width: "100%",
  border: "1px solid #d0d5dd",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: "1rem"
};

const primaryButtonStyle: CSSProperties = {
  border: "none",
  borderRadius: 10,
  background: "#175cd3",
  color: "white",
  padding: "10px 16px",
  fontWeight: 700,
  cursor: "pointer"
};

export default function SignupPage() {
  const [statusText, setStatusText] = useState("入力して登録を開始してください。");
  const { values, fieldErrors, summary, isSubmitting, onChange, submit, cancel, retry } = useSignupSubmit();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const result = await submit();

    if (result.redirectTo) {
      setStatusText(`登録が完了しました。${result.redirectTo} へ移動します。`);
      return;
    }

    setStatusText("入力内容または通信状態をご確認ください。");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(130deg, #f2f6ff, #eefcf7)",
        padding: "24px 12px",
        display: "grid",
        alignItems: "center"
      }}
    >
      <section style={formShellStyle}>
        <h1 style={{ margin: 0, fontSize: "clamp(1.3rem, 5vw, 1.8rem)" }}>アカウント登録</h1>
        <p style={{ marginTop: 8, color: "#344054" }}>登録完了後、自動でダッシュボードへ遷移します。</p>

        {summary ? (
          <SignupErrorSummary
            title={summary.title}
            message={summary.message}
            retryable={summary.retryable}
            onRetry={retry}
          />
        ) : null}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          <label htmlFor="signup-email" style={{ display: "grid", gap: 6 }}>
            <span>メールアドレス</span>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={values.email}
              onChange={(event) => onChange("email", event.target.value)}
              aria-describedby={fieldErrors.email ? "signup-email-error" : undefined}
              style={fieldStyle}
              required
            />
          </label>

          <label htmlFor="signup-password" style={{ display: "grid", gap: 6 }}>
            <span>パスワード（8-64文字）</span>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={values.password}
              onChange={(event) => onChange("password", event.target.value)}
              aria-describedby={fieldErrors.password ? "signup-password-error" : undefined}
              style={fieldStyle}
              required
            />
          </label>

          <label htmlFor="signup-password-confirm" style={{ display: "grid", gap: 6 }}>
            <span>パスワード（確認）</span>
            <input
              id="signup-password-confirm"
              type="password"
              autoComplete="new-password"
              value={values.passwordConfirm}
              onChange={(event) => onChange("passwordConfirm", event.target.value)}
              aria-describedby={fieldErrors.passwordConfirm ? "signup-password-confirm-error" : undefined}
              style={fieldStyle}
              required
            />
          </label>

          <SignupFieldErrors errors={fieldErrors} />

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="submit" disabled={isSubmitting} style={primaryButtonStyle}>
              {isSubmitting ? "送信中..." : "登録する"}
            </button>
            <button
              type="button"
              onClick={cancel}
              style={{ borderRadius: 10, border: "1px solid #d0d5dd", background: "#fff", padding: "10px 14px" }}
            >
              キャンセル
            </button>
            <a href="/login" style={{ marginLeft: "auto", alignSelf: "center", color: "#175cd3" }}>
              ログインはこちら
            </a>
          </div>
        </form>

        <p aria-live="polite" style={{ marginBottom: 0, marginTop: 16, color: "#475467" }}>
          {statusText}
        </p>
      </section>
    </main>
  );
}
