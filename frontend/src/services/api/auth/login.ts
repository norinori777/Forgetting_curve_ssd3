import { API_ENDPOINTS } from "../endpoints";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginSuccess = {
  userId: string;
  redirectTo: string;
  sessionExpiresInSeconds: number;
};

export type LoginFailure = {
  errorCode: "VALIDATION_FAILED" | "INVALID_CREDENTIALS" | "RATE_LIMIT_EXCEEDED" | "LOGIN_FAILED" | "HTTPS_REQUIRED";
  message: string;
  fieldErrors?: Partial<Record<"email" | "password", string>>;
};

export type LoginApiResult =
  | { ok: true; data: LoginSuccess }
  | { ok: false; status: number; retryAfterSeconds?: number; error: LoginFailure };

export const login = async (payload: LoginRequest): Promise<LoginApiResult> => {
  const response = await fetch(API_ENDPOINTS.auth.login, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const body = (await response.json()) as LoginSuccess | LoginFailure;

  if (response.ok) {
    return {
      ok: true,
      data: body as LoginSuccess
    };
  }

  const retryAfterHeader = response.headers.get("Retry-After");
  const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : undefined;

  return {
    ok: false,
    status: response.status,
    retryAfterSeconds,
    error: body as LoginFailure
  };
};