import { renderToStaticMarkup } from "react-dom/server";

import HeaderMenu from "./HeaderMenu";

export const areHeaderLinksCorrect = (): boolean => {
  const markup = renderToStaticMarkup(<HeaderMenu activePage="review" />);

  return markup.includes('href="/cards"') && markup.includes("サービスカード一覧") && markup.includes('href="/review"') && markup.includes('aria-current="page"') && markup.includes('href="/settings"');
};
