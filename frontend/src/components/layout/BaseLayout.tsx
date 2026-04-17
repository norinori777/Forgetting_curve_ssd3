import type { ReactNode } from "react";

import type { BaseScreenPageKey } from "../../domains/navigation";
import BrandArea from "../navigation/BrandArea";
import HeaderMenu from "../navigation/HeaderMenu";

type BaseLayoutProps = {
  children: ReactNode;
  activePage?: BaseScreenPageKey;
};

export default function BaseLayout({ children, activePage }: BaseLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(130deg, #f2f6ff, #eefcf7)",
        display: "grid",
        gridTemplateRows: "auto 1fr"
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "12px 16px",
          borderBottom: "1px solid #e4e7ec",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)"
        }}
      >
        <BrandArea />
        <HeaderMenu activePage={activePage} />
      </header>

      <main style={{ padding: 24, display: "grid", alignItems: "start" }}>{children}</main>
    </div>
  );
}
