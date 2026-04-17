export default function BrandArea() {
  return (
    <div aria-label="サービス情報" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
      <span
        aria-hidden="true"
        style={{
          display: "inline-grid",
          placeItems: "center",
          width: 36,
          height: 36,
          borderRadius: 999,
          background: "linear-gradient(135deg, #117ec6, #12c74b)",
          color: "#fff",
          fontWeight: 700,
          flex: "0 0 auto"
        }}
      >
        忘
      </span>
      <span style={{ fontWeight: 700, color: "#101828", whiteSpace: "nowrap" }}>忘却曲線 SSD3</span>
    </div>
  );
}
