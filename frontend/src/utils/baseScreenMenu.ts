import { BASE_SCREEN_PATHS } from "./baseScreenRoutes";

export const BASE_SCREEN_MENU_ITEMS = [
  { key: "cardList", label: "サービスカード一覧", href: BASE_SCREEN_PATHS.cardList },
  { key: "review", label: "復習", href: BASE_SCREEN_PATHS.review },
  { key: "settings", label: "設定", href: BASE_SCREEN_PATHS.settings }
] as const;
