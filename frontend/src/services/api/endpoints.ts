export const API_ENDPOINTS = {
  auth: {
    signup: "/api/auth/signup",
    login: "/api/auth/login"
  },
  cards: {
    preview: "/api/cards/preview",
    create: "/api/cards"
  }
} as const;
