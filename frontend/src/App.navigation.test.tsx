import { BASE_SCREEN_PATHS, resolveAppRouteKey } from "./utils/baseScreenRoutes";

export const isHeaderNavigationIntegrationValid = (): boolean => {
  return resolveAppRouteKey(BASE_SCREEN_PATHS.cardList) === "cardList" && resolveAppRouteKey(BASE_SCREEN_PATHS.review) === "review" && resolveAppRouteKey(BASE_SCREEN_PATHS.settings) === "settings";
};
