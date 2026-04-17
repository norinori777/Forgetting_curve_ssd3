import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import CardListPage from "./index";

export const hasExpectedCardListActionControls = (): boolean => {
  const markup = renderToStaticMarkup(<CardListPage />);

  return (
    markup.includes("一括ラベル付与") &&
    markup.includes("選択カードに付与") &&
    markup.includes("JSON エクスポート") &&
    markup.includes("選択中:")
  );
};

test("card list page renders bulk label, delete, and export actions", () => {
  assert.equal(hasExpectedCardListActionControls(), true);
});