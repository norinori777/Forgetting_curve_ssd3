export const API_ENDPOINTS = {
  auth: {
    signup: "/api/auth/signup",
    login: "/api/auth/login"
  },
  cards: {
    list: "/api/cards",
    bulkLabel: "/api/cards",
    export: "/api/cards/export",
    item: (cardId: string): string => `/api/cards/${cardId}`,
    preview: "/api/cards/preview",
    create: "/api/cards"
  }
} as const;
