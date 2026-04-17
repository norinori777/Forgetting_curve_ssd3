import BaseLayout from "../../components/layout/BaseLayout";

export default function SettingsPage() {
  return (
    <BaseLayout activePage="settings">
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
        <h1 style={{ marginTop: 0 }}>設定</h1>
        <p style={{ marginBottom: 0 }}>復習間隔やアカウント設定を調整します。</p>
      </section>
    </BaseLayout>
  );
}
