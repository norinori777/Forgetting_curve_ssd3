import type { BaseScreenPageKey, BaseScreenRouteKey } from "../domains/navigation";

export const BASE_SCREEN_PATHS = {
  dashboard: "/dashboard",
  cardList: "/cards",
  review: "/review",
  settings: "/settings",
  cardRegistration: "/cards/new",
  login: "/login",
  signup: "/signup"
} as const satisfies Record<BaseScreenRouteKey, string>;

const AUTHENTICATED_PAGE_ENTRIES: Array<[BaseScreenPageKey, string]> = [
  ["dashboard", BASE_SCREEN_PATHS.dashboard],
  ["cardList", BASE_SCREEN_PATHS.cardList],
  ["review", BASE_SCREEN_PATHS.review],
  ["settings", BASE_SCREEN_PATHS.settings],
  ["cardRegistration", BASE_SCREEN_PATHS.cardRegistration]
];

export const AUTHENTICATED_BASE_PATHS = AUTHENTICATED_PAGE_ENTRIES.map(([, path]) => path);

export const resolveAppRouteKey = (path: string): BaseScreenRouteKey => {
  if (path.startsWith(BASE_SCREEN_PATHS.dashboard)) {
    return "dashboard";
  }

  if (path.startsWith(BASE_SCREEN_PATHS.cardRegistration)) {
    return "cardRegistration";
  }

  if (path.startsWith(BASE_SCREEN_PATHS.cardList)) {
    return "cardList";
  }

  if (path.startsWith(BASE_SCREEN_PATHS.review)) {
    return "review";
  }

  if (path.startsWith(BASE_SCREEN_PATHS.settings)) {
    return "settings";
  }

  if (path.startsWith(BASE_SCREEN_PATHS.signup)) {
    return "signup";
  }

  return path.startsWith(BASE_SCREEN_PATHS.login) ? "login" : "login";
};

export const getBaseScreenPath = (pageKey: BaseScreenPageKey): string => {
  for (const [key, path] of AUTHENTICATED_PAGE_ENTRIES) {
    if (key === pageKey) {
      return path;
    }
  }

  return BASE_SCREEN_PATHS.dashboard;
};
