import { useMemo, useState } from "react";
import { login, type LoginFailure } from "../../services/api/auth/login";
import { mapLoginError } from "./loginErrorMapper";
import { validateLoginInput, type LoginFieldErrors, type LoginValues } from "./loginValidation";

export type LoginSummaryState = {
  title: string;
  message: string;
  retryable: boolean;
} | null;

type LoginStatus = "initial" | "validation_error" | "submitting" | "success" | "failure" | "locked";

type LoginTrackingEvent =
  | { event: "login_started"; requestId: string }
  | { event: "login_succeeded"; requestId: string }
  | { event: "login_failed"; requestId: string }
  | { event: "login_canceled"; requestId: string };

const eventStore: LoginTrackingEvent[] = [];

const trackEvent = (event: LoginTrackingEvent): void => {
  eventStore.push(event);
};

const createRequestId = (): string => {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `login-${Date.now()}`;
};

const createInitialValues = (): LoginValues => ({
  email: "",
  password: ""
});

const mergeServerFieldErrors = (
  clientErrors: LoginFieldErrors,
  serverError?: LoginFailure
): LoginFieldErrors => ({
  ...clientErrors,
  ...(serverError?.fieldErrors ?? {})
});

export function useLoginSubmit() {
  const [values, setValues] = useState<LoginValues>(createInitialValues);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [summary, setSummary] = useState<LoginSummaryState>(null);
  const [status, setStatus] = useState<LoginStatus>("initial");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isSubmitting = status === "submitting";

  const canSubmit = useMemo(() => {
    return !isSubmitting;
  }, [isSubmitting]);

  const onChange = (field: keyof LoginValues, value: string): void => {
    setValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (): void => {
    setIsPasswordVisible((prev) => !prev);
  };

  const submit = async (): Promise<{ redirectTo?: string }> => {
    const clientErrors = validateLoginInput(values);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setSummary(null);
      setStatus("validation_error");
      return {};
    }

    if (!canSubmit) {
      return {};
    }

    const requestId = createRequestId();

    setStatus("submitting");
    setSummary(null);
    setFieldErrors({});
    trackEvent({ event: "login_started", requestId });

    const response = await login(values);

    if (response.ok) {
      setStatus("success");
      setValues(createInitialValues());
      trackEvent({ event: "login_succeeded", requestId });
      return { redirectTo: response.data.redirectTo };
    }

    const mappedError = mapLoginError(response.error.errorCode, response.retryAfterSeconds);
    setStatus(response.status === 429 ? "locked" : "failure");
    setSummary(mappedError);
    setFieldErrors(mergeServerFieldErrors({}, response.error));
    setValues((prev) => ({
      ...prev,
      password: ""
    }));
    trackEvent({ event: "login_failed", requestId });
    return {};
  };

  const cancel = (): void => {
    const requestId = createRequestId();
    trackEvent({ event: "login_canceled", requestId });
    setValues((prev) => ({
      ...prev,
      password: ""
    }));
    setSummary(null);
    setFieldErrors({});
    setStatus("initial");
  };

  const retry = (): void => {
    setSummary(null);
    setStatus("initial");
  };

  return {
    values,
    fieldErrors,
    summary,
    status,
    isSubmitting,
    isPasswordVisible,
    canSubmit,
    onChange,
    togglePasswordVisibility,
    submit,
    cancel,
    retry,
    trackedEvents: eventStore
  };
}