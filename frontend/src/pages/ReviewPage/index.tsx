import BaseLayout from "../../components/layout/BaseLayout";

export default function ReviewPage() {
  return (
    <BaseLayout activePage="review">
      <section
        style={{
          maxWidth: 720,
          margin: "0 auto",
          width: "100%",
          background: "#fff",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 14px 40px rgba(16, 24, 40, 0.12)"
        }}
      >
        <h1 style={{ marginTop: 0 }}>復習実施</h1>
        <p style={{ marginBottom: 0 }}>今日の復習カードを順に確認します。</p>
      </section>
    </BaseLayout>
  );
}
