export type AuthConfig = {
  sessionTtlSeconds: number;
  signupRateLimitPerMinute: number;
  requireHttps: boolean;
};

const DEFAULT_SESSION_TTL_SECONDS = 24 * 60 * 60;
const DEFAULT_SIGNUP_RATE_LIMIT_PER_MINUTE = 5;

export const authConfig: AuthConfig = {
  sessionTtlSeconds: Number(process.env.SIGNUP_SESSION_TTL_SECONDS ?? DEFAULT_SESSION_TTL_SECONDS),
  signupRateLimitPerMinute: Number(
    process.env.SIGNUP_RATE_LIMIT_PER_MINUTE ?? DEFAULT_SIGNUP_RATE_LIMIT_PER_MINUTE
  ),
  requireHttps: (process.env.REQUIRE_HTTPS ?? "true").toLowerCase() !== "false"
};
