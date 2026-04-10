import { useState, type CSSProperties, type FormEvent } from "react";
import { LoginErrorSummary } from "./LoginErrorSummary";
import { LoginFieldErrors } from "./LoginFieldErrors";
import { useLoginSubmit } from "./useLoginSubmit";

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
  background: "#117ec6",
  color: "white",
  padding: "10px 16px",
  fontWeight: 700,
  cursor: "pointer"
};

const readReturnTo = (): string | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const returnTo = new URLSearchParams(window.location.search).get("returnTo");
  return returnTo ?? undefined;
};

export default function LoginPage() {
  const [statusText, setStatusText] = useState("入力してログインを開始してください。");
  const { values, fieldErrors, summary, isSubmitting, isPasswordVisible, onChange, togglePasswordVisibility, submit, cancel, retry } = useLoginSubmit();
  const returnTo = readReturnTo();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const result = await submit();

    if (result.redirectTo) {
      const destination = returnTo ?? result.redirectTo;
      setStatusText(`ログインが完了しました。${destination} へ移動します。`);
      window.location.assign(destination);
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
        <h1 style={{ margin: 0, fontSize: "clamp(1.3rem, 5vw, 1.8rem)" }}>ログイン</h1>
        <p style={{ marginTop: 8, color: "#344054" }}>ログイン後、自動でダッシュボードへ遷移します。</p>

        {summary ? <LoginErrorSummary title={summary.title} message={summary.message} retryable={summary.retryable} onRetry={retry} /> : null}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          <label htmlFor="login-email" style={{ display: "grid", gap: 6 }}>
            <span>メールアドレス</span>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={values.email}
              onChange={(event) => onChange("email", event.target.value)}
              aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
              style={fieldStyle}
              required
            />
          </label>

          <label htmlFor="login-password" style={{ display: "grid", gap: 6 }}>
            <span>パスワード</span>
            <input
              id="login-password"
              type={isPasswordVisible ? "text" : "password"}
              autoComplete="current-password"
              value={values.password}
              onChange={(event) => onChange("password", event.target.value)}
              aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
              style={fieldStyle}
              required
            />
          </label>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="button" onClick={togglePasswordVisibility} style={{ borderRadius: 10, border: "1px solid #d0d5dd", background: "#fff", padding: "10px 14px" }}>
              {isPasswordVisible ? "非表示にする" : "表示する"}
            </button>
          </div>

          <LoginFieldErrors errors={fieldErrors} />

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="submit" disabled={isSubmitting} style={primaryButtonStyle}>
              {isSubmitting ? "送信中..." : "ログインする"}
            </button>
            <button
              type="button"
              onClick={cancel}
              style={{ borderRadius: 10, border: "1px solid #d0d5dd", background: "#fff", padding: "10px 14px" }}
            >
              キャンセル
            </button>
            <a href="/signup" style={{ marginLeft: "auto", alignSelf: "center", color: "#117ec6" }}>
              新規登録はこちら
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