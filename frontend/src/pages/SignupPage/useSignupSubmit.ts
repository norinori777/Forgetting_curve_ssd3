import { useMemo, useState } from "react";
import { signup, type SignupFailure } from "../../services/api/auth/signup";
import { mapSignupError } from "./signupErrorMapper";
import { validateSignupInput, type SignupFieldErrors, type SignupValues } from "./signupValidation";

export type SignupSummaryState = {
  title: string;
  message: string;
  retryable: boolean;
} | null;

type SignupStatus = "initial" | "validation_error" | "submitting" | "success" | "failure";

type SignupTrackingEvent =
  | { event: "signup_started"; requestId: string }
  | { event: "signup_succeeded"; requestId: string }
  | { event: "signup_canceled"; requestId: string };

const eventStore: SignupTrackingEvent[] = [];

const trackEvent = (event: SignupTrackingEvent): void => {
  eventStore.push(event);
};

const createRequestId = (): string => {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `signup-${Date.now()}`;
};

const createInitialValues = (): SignupValues => ({
  email: "",
  password: "",
  passwordConfirm: ""
});

const mergeServerFieldErrors = (
  clientErrors: SignupFieldErrors,
  serverError?: SignupFailure
): SignupFieldErrors => ({
  ...clientErrors,
  ...(serverError?.fieldErrors ?? {})
});

export function useSignupSubmit() {
  const [values, setValues] = useState<SignupValues>(createInitialValues);
  const [fieldErrors, setFieldErrors] = useState<SignupFieldErrors>({});
  const [summary, setSummary] = useState<SignupSummaryState>(null);
  const [status, setStatus] = useState<SignupStatus>("initial");

  const isSubmitting = status === "submitting";

  const canSubmit = useMemo(() => {
    return !isSubmitting;
  }, [isSubmitting]);

  const onChange = (field: keyof SignupValues, value: string): void => {
    setValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const submit = async (): Promise<{ redirectTo?: string }> => {
    const clientErrors = validateSignupInput(values);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setSummary(mapSignupError("VALIDATION_FAILED"));
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
    trackEvent({ event: "signup_started", requestId });

    const response = await signup(values);

    if (response.ok) {
      setStatus("success");
      setValues(createInitialValues());
      trackEvent({ event: "signup_succeeded", requestId });
      return { redirectTo: response.data.redirectTo };
    }

    const mappedError = mapSignupError(response.error.errorCode, response.retryAfterSeconds);
    setStatus("failure");
    setSummary(mappedError);
    setFieldErrors(mergeServerFieldErrors({}, response.error));
    setValues((prev) => ({
      ...prev,
      password: "",
      passwordConfirm: ""
    }));
    return {};
  };

  const cancel = (): void => {
    const requestId = createRequestId();
    trackEvent({ event: "signup_canceled", requestId });
    setValues((prev) => ({
      ...prev,
      password: "",
      passwordConfirm: ""
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
    canSubmit,
    onChange,
    submit,
    cancel,
    retry,
    trackedEvents: eventStore
  };
}
