import { renderToStaticMarkup } from "react-dom/server";

import HeaderMenu from "./HeaderMenu";

export const isHeaderAccessibilityExpectationMet = (): boolean => {
  const markup = renderToStaticMarkup(<HeaderMenu activePage="cardList" />);

  return markup.includes('aria-label="主要メニュー"') && markup.includes('aria-current="page"') && markup.includes("サービスカード一覧") && markup.includes("復習") && markup.includes("設定");
};
