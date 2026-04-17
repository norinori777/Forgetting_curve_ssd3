import BaseLayout from "../../components/layout/BaseLayout";

export default function ReviewPage() {
  return (
    <BaseLayout activePage="review">
      <section>
        <h1 style={{ marginTop: 0 }}>復習実施</h1>
        <p style={{ marginBottom: 0 }}>今日の復習カードを順に確認します。</p>
      </section>
    </BaseLayout>
  );
}
