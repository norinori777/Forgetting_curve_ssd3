import BaseLayout from "../../components/layout/BaseLayout";

export default function CardListPage() {
  return (
    <BaseLayout activePage="cardList">
      <section>
        <h1 style={{ marginTop: 0 }}>サービスカード一覧</h1>
        <p style={{ marginBottom: 0 }}>タイトル、問い、答え、カテゴリ、タグを検索して管理します。</p>
      </section>
    </BaseLayout>
  );
}
