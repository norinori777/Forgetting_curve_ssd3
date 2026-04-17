import type { BaseScreenPageKey } from "../../domains/navigation";
import { BASE_SCREEN_MENU_ITEMS } from "../../utils/baseScreenMenu";

type HeaderMenuProps = {
  activePage?: BaseScreenPageKey;
};

export default function HeaderMenu({ activePage }: HeaderMenuProps) {
  return (
    <nav aria-label="主要メニュー" style={{ flex: "1 1 auto" }}>
      <ul
        style={{
          listStyle: "none",
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
          margin: 0,
          padding: 0
        }}
      >
        {BASE_SCREEN_MENU_ITEMS.map((item) => {
          const isActive = item.key === activePage;

          return (
            <li key={item.key} style={{ minWidth: 0 }}>
              <a
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                data-active={isActive ? "true" : "false"}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "10px 12px",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? "#117ec6" : "#475467",
                  background: isActive ? "#ecf3ff" : "transparent",
                  whiteSpace: "nowrap"
                }}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
