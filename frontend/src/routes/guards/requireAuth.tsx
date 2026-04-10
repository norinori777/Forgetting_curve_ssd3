type RedirectDecision = {
  allow: boolean;
  redirectTo?: string;
};

export const resolveRequireAuth = (isAuthenticated: boolean, requestedPath?: string): RedirectDecision => {
  if (isAuthenticated) {
    return { allow: true };
  }

  return {
    allow: false,
    redirectTo: requestedPath ? `/login?returnTo=${encodeURIComponent(requestedPath)}` : "/login"
  };
};
