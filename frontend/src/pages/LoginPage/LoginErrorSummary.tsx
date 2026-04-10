type LoginErrorSummaryProps = {
  title: string;
  message: string;
  retryable: boolean;
  onRetry: () => void;
};

export function LoginErrorSummary({ title, message, retryable, onRetry }: LoginErrorSummaryProps) {
  return (
    <section
      aria-live="assertive"
      role="alert"
      style={{
        border: "1px solid #fda29b",
        background: "#fffbfa",
        padding: "12px 14px",
        borderRadius: 10,
        marginBottom: 14
      }}
    >
      <p style={{ margin: 0, fontWeight: 700 }}>{title}</p>
      <p style={{ margin: "6px 0 10px" }}>{message}</p>
      {retryable ? (
        <button type="button" onClick={onRetry} style={{ borderRadius: 8, border: "1px solid #d0d5dd", padding: "6px 10px" }}>
          再試行
        </button>
      ) : null}
    </section>
  );
}