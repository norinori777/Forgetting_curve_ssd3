import { renderToStaticMarkup } from "react-dom/server";

import { hasNoCardShellMarkup } from "../__tests__/plainPageLayoutAssertions";
import SettingsPage from "./index";

export const isSettingsPagePlainLayoutValid = (): boolean => {
  const markup = renderToStaticMarkup(<SettingsPage />);

  return markup.includes("設定") && markup.includes("復習間隔やアカウント設定を調整します。") && hasNoCardShellMarkup(markup);
};