import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { CARD_LABEL_OPTIONS } from "../CardRegistrationPage/cardRegistrationValidation";
import { buildCardListQuery, createInitialCardListFilters, normalizeCardListSearchText, toggleCardListLabel } from "./cardListQuery";
import CardListPage from "./index";

export const hasExpectedCardListSearchControls = (): boolean => {
  const filters = createInitialCardListFilters();
  const toggledOnce = toggleCardListLabel(filters.labels, CARD_LABEL_OPTIONS[0]);
  const toggledTwice = toggleCardListLabel(toggledOnce, CARD_LABEL_OPTIONS[0]);
  const query = buildCardListQuery({ searchText: "  sample query  ", labels: [CARD_LABEL_OPTIONS[1]] }, "cursor-1");

  return (
    normalizeCardListSearchText("  sample query  ") === "sample query" &&
    JSON.stringify(toggledOnce) === JSON.stringify([CARD_LABEL_OPTIONS[0]]) &&
    JSON.stringify(toggledTwice) === JSON.stringify([]) &&
    JSON.stringify(query) === JSON.stringify({
      search: "sample query",
      labels: [CARD_LABEL_OPTIONS[1]],
      cursor: "cursor-1",
      limit: 20
    })
  );
};

test("card list search helpers normalize filters and toggle labels", () => {
  assert.equal(hasExpectedCardListSearchControls(), true);
});

test("card list page renders interactive search controls", () => {
  const markup = renderToStaticMarkup(<CardListPage />);

  assert.ok(markup.includes("検索"));
  assert.ok(markup.includes("タイトル・問い・答えを検索"));
  assert.ok(markup.includes("カテゴリ・タグ"));
  assert.ok(markup.includes("検索する"));
  assert.ok(markup.includes("条件をクリア"));
  assert.ok(markup.includes("aria-pressed"));
});