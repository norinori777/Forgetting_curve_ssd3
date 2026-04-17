import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import CardListPage from "./index";

test("card list page shows the loading state on first render", () => {
  const markup = renderToStaticMarkup(<CardListPage />);

  assert.ok(markup.includes("サービスカード一覧"));
  assert.ok(markup.includes("タイトル、問い、答え、カテゴリ、タグを検索して管理します。"));
  assert.ok(markup.includes("カード一覧を読み込んでいます。"));
  assert.ok(markup.includes("読み込み中..."));
});