import { renderToStaticMarkup } from "react-dom/server";

import DashboardPage from "../../pages/DashboardPage";
import SettingsPage from "../../pages/SettingsPage";

export const isSharedHeaderVisibleAcrossAuthenticatedPages = (): boolean => {
  const dashboardMarkup = renderToStaticMarkup(<DashboardPage />);
  const settingsMarkup = renderToStaticMarkup(<SettingsPage />);

  return dashboardMarkup.includes("主要メニュー") && settingsMarkup.includes("主要メニュー") && dashboardMarkup.includes("忘却曲線 SSD3") && settingsMarkup.includes("忘却曲線 SSD3");
};
