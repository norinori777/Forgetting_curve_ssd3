import { renderToStaticMarkup } from "react-dom/server";

import { hasNoCardShellMarkup } from "../__tests__/plainPageLayoutAssertions";
import CardListPage from "./index";

export const isCardListPagePlainLayoutValid = (): boolean => {
  const markup = renderToStaticMarkup(<CardListPage />);

  return markup.includes("サービスカード一覧") && markup.includes("タイトル、問い、答え、カテゴリ、タグを検索して管理します。") && hasNoCardShellMarkup(markup);
};