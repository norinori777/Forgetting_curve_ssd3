type RedirectDecision = {
  allow: boolean;
  redirectTo?: string;
};

export const resolveRequireAuth = (isAuthenticated: boolean): RedirectDecision => {
  if (isAuthenticated) {
    return { allow: true };
  }

  return {
    allow: false,
    redirectTo: "/login"
  };
};
