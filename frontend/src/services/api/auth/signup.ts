import { API_ENDPOINTS } from "../endpoints";

export type SignupRequest = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export type SignupSuccess = {
  userId: string;
  redirectTo: string;
  sessionExpiresInSeconds: number;
};

export type SignupFailure = {
  errorCode: "VALIDATION_FAILED" | "DUPLICATE_EMAIL" | "RATE_LIMIT_EXCEEDED" | "SIGNUP_FAILED" | "HTTPS_REQUIRED";
  message: string;
  fieldErrors?: Partial<Record<"email" | "password" | "passwordConfirm", string>>;
};

export type SignupApiResult =
  | { ok: true; data: SignupSuccess }
  | { ok: false; status: number; retryAfterSeconds?: number; error: SignupFailure };

export const signup = async (payload: SignupRequest): Promise<SignupApiResult> => {
  const response = await fetch(API_ENDPOINTS.auth.signup, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const body = (await response.json()) as SignupSuccess | SignupFailure;

  if (response.ok) {
    return {
      ok: true,
      data: body as SignupSuccess
    };
  }

  const retryAfterHeader = response.headers.get("Retry-After");
  const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : undefined;

  return {
    ok: false,
    status: response.status,
    retryAfterSeconds,
    error: body as SignupFailure
  };
};
