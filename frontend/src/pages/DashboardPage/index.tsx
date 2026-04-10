export default function DashboardPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f7f7f2" }}>
      <section style={{ maxWidth: 560, padding: 24, background: "white", borderRadius: 16, boxShadow: "0 12px 36px rgba(16, 24, 40, 0.08)" }}>
        <h1 style={{ marginTop: 0 }}>ダッシュボード</h1>
        <p style={{ marginBottom: 0 }}>ログイン成功後の到達先です。</p>
      </section>
    </main>
  );
}