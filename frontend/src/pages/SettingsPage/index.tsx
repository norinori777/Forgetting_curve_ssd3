import BaseLayout from "../../components/layout/BaseLayout";

export default function SettingsPage() {
  return (
    <BaseLayout activePage="settings">
      <section>
        <h1 style={{ marginTop: 0 }}>設定</h1>
        <p style={{ marginBottom: 0 }}>復習間隔やアカウント設定を調整します。</p>
      </section>
    </BaseLayout>
  );
}
