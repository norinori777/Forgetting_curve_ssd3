import { renderToStaticMarkup } from "react-dom/server";

import CardListPage from "./index";

export const isCardListPagePlainLayoutValid = (): boolean => {
  const markup = renderToStaticMarkup(<CardListPage />);

  return (
    markup.includes("サービスカード一覧") &&
    markup.includes("タイトル、問い、答え、カテゴリ、タグを検索して管理します。") &&
    markup.includes("検索") &&
    markup.includes("カテゴリ・タグ") &&
    markup.includes("検索する") &&
    markup.includes("条件をクリア")
  );
};