import BaseLayout from "../../components/layout/BaseLayout";

export default function CardListPage() {
  return (
    <BaseLayout activePage="cardList">
      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
          width: "100%",
          background: "#fff",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 14px 40px rgba(16, 24, 40, 0.12)"
        }}
      >
        <h1 style={{ marginTop: 0 }}>サービスカード一覧</h1>
        <p style={{ marginBottom: 0 }}>タイトル、問い、答え、カテゴリ、タグを検索して管理します。</p>
      </section>
    </BaseLayout>
  );
}
