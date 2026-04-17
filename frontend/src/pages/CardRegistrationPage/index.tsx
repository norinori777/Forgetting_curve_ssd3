import { useState, type CSSProperties, type FormEvent } from "react";
import { CardRegistrationErrorSummary } from "./CardRegistrationErrorSummary";
import { CardRegistrationFieldErrorsView } from "./CardRegistrationFieldErrors";
import { useCardRegistration } from "./useCardRegistration";
import BaseLayout from "../../components/layout/BaseLayout";

const formShellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 720,
  margin: "0 auto",
  background: "#fff",
  borderRadius: 20,
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

const buttonStyle: CSSProperties = {
  border: "none",
  borderRadius: 10,
  background: "#175cd3",
  color: "white",
  padding: "10px 16px",
  fontWeight: 700,
  cursor: "pointer"
};

const secondaryButtonStyle: CSSProperties = {
  borderRadius: 10,
  border: "1px solid #d0d5dd",
  background: "#fff",
  padding: "10px 14px",
  cursor: "pointer"
};

const formatReviewSchedule = (date: string): string => new Date(date).toLocaleString("ja-JP", { dateStyle: "medium", timeStyle: "short" });

export default function CardRegistrationPage() {
  const [statusText, setStatusText] = useState("入力して復習予定を確認してください。");
  const { values, fieldErrors, summary, previewSchedule, canPreview, canConfirm, isPreviewing, isSubmitting, labelOptions, onChange, toggleLabel, preview, confirm, cancel, retry } = useCardRegistration();

  const handlePreview = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const result = await preview();

    if (result) {
      setStatusText("復習予定を確認しました。内容を確認して確定できます。");
      return;
    }

    setStatusText("入力内容または通信状態をご確認ください。");
  };

  const handleConfirm = async (): Promise<void> => {
    const result = await confirm();

    if (result.redirectTo) {
      setStatusText(`登録が完了しました。${result.redirectTo} へ移動します。`);
      window.location.assign(result.redirectTo);
      return;
    }

    setStatusText("入力内容または通信状態をご確認ください。");
  };

  return (
    <BaseLayout activePage="cardRegistration">
      <section style={formShellStyle}>
        <h1 style={{ margin: 0, fontSize: "clamp(1.3rem, 5vw, 1.8rem)" }}>カード登録</h1>
        <p style={{ marginTop: 8, color: "#344054" }}>入力内容を確認してから復習予定を表示し、そのまま保存できます。</p>

        {summary ? <CardRegistrationErrorSummary title={summary.title} message={summary.message} retryable={summary.retryable} onRetry={retry} /> : null}

        <form onSubmit={handlePreview} style={{ display: "grid", gap: 14 }}>
          <label htmlFor="card-title" style={{ display: "grid", gap: 6 }}>
            <span>タイトル *</span>
            <input id="card-title" value={values.title} onChange={(event) => onChange("title", event.target.value)} aria-describedby={fieldErrors.title ? "card-title-error" : undefined} style={fieldStyle} />
          </label>

          <label htmlFor="card-question" style={{ display: "grid", gap: 6 }}>
            <span>問い *</span>
            <textarea id="card-question" rows={4} value={values.question} onChange={(event) => onChange("question", event.target.value)} aria-describedby={fieldErrors.question ? "card-question-error" : undefined} style={fieldStyle} />
          </label>

          <label htmlFor="card-answer" style={{ display: "grid", gap: 6 }}>
            <span>答え</span>
            <textarea id="card-answer" rows={3} value={values.answer} onChange={(event) => onChange("answer", event.target.value)} aria-describedby={fieldErrors.answer ? "card-answer-error" : undefined} style={fieldStyle} />
          </label>

          <label htmlFor="card-memo" style={{ display: "grid", gap: 6 }}>
            <span>メモ</span>
            <textarea id="card-memo" rows={3} value={values.memo} onChange={(event) => onChange("memo", event.target.value)} aria-describedby={fieldErrors.memo ? "card-memo-error" : undefined} style={fieldStyle} />
          </label>

          <fieldset style={{ border: "1px solid #eaecf0", borderRadius: 12, padding: 16 }}>
            <legend style={{ padding: "0 6px" }}>タグ・カテゴリ</legend>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {labelOptions.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleLabel(label)}
                  aria-pressed={values.labels.includes(label)}
                  style={{
                    ...secondaryButtonStyle,
                    borderColor: values.labels.includes(label) ? "#175cd3" : "#d0d5dd",
                    background: values.labels.includes(label) ? "#ecf3ff" : "#fff"
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <CardRegistrationFieldErrorsView errors={fieldErrors} />

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="submit" disabled={!canPreview} style={buttonStyle}>
              {isPreviewing ? "確認中..." : "初回復習日を確認する"}
            </button>
            <button type="button" onClick={handleConfirm} disabled={!canConfirm} style={secondaryButtonStyle}>
              {isSubmitting ? "保存中..." : "確定・保存する"}
            </button>
            <button type="button" onClick={cancel} style={secondaryButtonStyle}>
              リセット
            </button>
            <a href="/dashboard" style={{ marginLeft: "auto", alignSelf: "center", color: "#175cd3" }}>
              ダッシュボードへ戻る
            </a>
          </div>
        </form>

        {previewSchedule ? (
          <section style={{ marginTop: 24, padding: 16, borderRadius: 16, background: "#f8fafc", display: "grid", gap: 8 }}>
            <h2 style={{ margin: 0 }}>初回復習予定</h2>
            <dl style={{ display: "grid", gap: 8, margin: 0 }}>
              <div><dt>1回目</dt><dd>{formatReviewSchedule(previewSchedule.firstReviewAt)}</dd></div>
              <div><dt>2回目</dt><dd>{formatReviewSchedule(previewSchedule.secondReviewAt)}</dd></div>
              <div><dt>3回目</dt><dd>{formatReviewSchedule(previewSchedule.thirdReviewAt)}</dd></div>
              <div><dt>4回目</dt><dd>{formatReviewSchedule(previewSchedule.fourthReviewAt)}</dd></div>
            </dl>
          </section>
        ) : null}

        <p aria-live="polite" style={{ marginBottom: 0, marginTop: 16, color: "#475467" }}>
          {statusText}
        </p>
      </section>
    </BaseLayout>
  );
}