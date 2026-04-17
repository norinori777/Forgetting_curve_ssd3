import { renderToStaticMarkup } from "react-dom/server";

import { hasNoCardShellMarkup } from "../__tests__/plainPageLayoutAssertions";
import DashboardPage from "./index";

export const isDashboardPagePlainLayoutValid = (): boolean => {
  const markup = renderToStaticMarkup(<DashboardPage />);

  return markup.includes("ダッシュボード") && markup.includes("ログイン成功後の到達先です。") && hasNoCardShellMarkup(markup);
};