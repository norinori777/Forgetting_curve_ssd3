export type AuthConfig = {
  sessionTtlSeconds: number;
  signupRateLimitPerMinute: number;
  loginRateLimitPerMinute: number;
  requireHttps: boolean;
  corsAllowedOrigins: string[];
};

const DEFAULT_SESSION_TTL_SECONDS = 24 * 60 * 60;
const DEFAULT_SIGNUP_RATE_LIMIT_PER_MINUTE = 5;
const DEFAULT_LOGIN_RATE_LIMIT_PER_MINUTE = 5;
const DEFAULT_CORS_ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

const parseAllowedOrigins = (value: string | undefined): string[] => {
  if (!value) {
    return DEFAULT_CORS_ALLOWED_ORIGINS;
  }

  const origins = value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  return origins.length > 0 ? origins : DEFAULT_CORS_ALLOWED_ORIGINS;
};

export const authConfig: AuthConfig = {
  sessionTtlSeconds: Number(process.env.SIGNUP_SESSION_TTL_SECONDS ?? DEFAULT_SESSION_TTL_SECONDS),
  signupRateLimitPerMinute: Number(
    process.env.SIGNUP_RATE_LIMIT_PER_MINUTE ?? DEFAULT_SIGNUP_RATE_LIMIT_PER_MINUTE
  ),
  loginRateLimitPerMinute: Number(
    process.env.LOGIN_RATE_LIMIT_PER_MINUTE ?? DEFAULT_LOGIN_RATE_LIMIT_PER_MINUTE
  ),
  requireHttps: (process.env.REQUIRE_HTTPS ?? "true").toLowerCase() !== "false",
  corsAllowedOrigins: parseAllowedOrigins(process.env.CORS_ALLOWED_ORIGINS)
};
