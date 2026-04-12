type CardRegistrationErrorSummaryProps = {
  title: string;
  message: string;
  retryable: boolean;
  onRetry: () => void;
};

export const CardRegistrationErrorSummary = ({ title, message, retryable, onRetry }: CardRegistrationErrorSummaryProps) => {
  return (
    <section
      aria-live="assertive"
      style={{
        borderRadius: 12,
        border: "1px solid #fecdca",
        background: "#fff7f7",
        padding: 14,
        marginBottom: 16,
        display: "grid",
        gap: 8
      }}
    >
      <strong>{title}</strong>
      <span>{message}</span>
      {retryable ? (
        <button type="button" onClick={onRetry} style={{ justifySelf: "start", borderRadius: 10, border: "1px solid #d0d5dd", background: "#fff", padding: "8px 12px" }}>
          再試行する
        </button>
      ) : null}
    </section>
  );
};