import BaseLayout from "../../components/layout/BaseLayout";

export default function DashboardPage() {
  return (
    <BaseLayout activePage="dashboard">
      <section>
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