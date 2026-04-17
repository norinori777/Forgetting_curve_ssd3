import BaseLayout from "../../components/layout/BaseLayout";

export default function DashboardPage() {
  return (
    <BaseLayout activePage="dashboard">
      <section
        style={{
          maxWidth: 560,
          margin: "0 auto",
          width: "100%",
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 12px 36px rgba(16, 24, 40, 0.08)"
        }}
      >
        <h1 style={{ marginTop: 0 }}>ダッシュボード</h1>
        <p style={{ marginBottom: 0 }}>ログイン成功後の到達先です。</p>
        <p style={{ marginBottom: 0, marginTop: 12 }}>
          <a href="/cards/new" style={{ color: "#175cd3" }}>
            カードを登録する
          </a>
        </p>
      </section>
    </BaseLayout>
  );
}