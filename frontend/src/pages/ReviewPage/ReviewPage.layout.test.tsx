import { renderToStaticMarkup } from "react-dom/server";

import { hasNoCardShellMarkup } from "../__tests__/plainPageLayoutAssertions";
import ReviewPage from "./index";

export const isReviewPagePlainLayoutValid = (): boolean => {
  const markup = renderToStaticMarkup(<ReviewPage />);

  return markup.includes("復習実施") && markup.includes("今日の復習カードを順に確認します。") && hasNoCardShellMarkup(markup);
};