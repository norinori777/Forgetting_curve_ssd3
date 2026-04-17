import { resolveAppRouteKey } from "./utils/baseScreenRoutes";

export const isDefaultDashboardRenderingValid = (): boolean => {
  return resolveAppRouteKey("/dashboard") === "dashboard" && resolveAppRouteKey("/cards") === "cardList";
};
