import { useMemo, useRef, useState } from "react";
import { createCard, previewCard } from "../../services/api/cards/card";
import { mapCardRegistrationError, type CardRegistrationSummary } from "./cardRegistrationErrorMapper";
import {
  CARD_LABEL_OPTIONS,
  createInitialCardRegistrationValues,
  validateCardRegistrationInput,
  type CardRegistrationFieldErrors,
  type CardRegistrationValues
} from "./cardRegistrationValidation";

type ReviewScheduleView = {
  firstReviewAt: string;
  secondReviewAt: string;
  thirdReviewAt: string;
  fourthReviewAt: string;
  timezone: string;
  policyVersion: string;
} | null;

type CardRegistrationStatus = "editing" | "previewing" | "previewed" | "submitting" | "success" | "failure";

export function useCardRegistration() {
  const [values, setValues] = useState<CardRegistrationValues>(createInitialCardRegistrationValues);
  const [fieldErrors, setFieldErrors] = useState<CardRegistrationFieldErrors>({});
  const [summary, setSummary] = useState<CardRegistrationSummary | null>(null);
  const [previewSchedule, setPreviewSchedule] = useState<ReviewScheduleView>(null);
  const [status, setStatus] = useState<CardRegistrationStatus>("editing");
  const requestLockRef = useRef(false);

  const isPreviewing = status === "previewing";
  const isSubmitting = status === "submitting";

  const canPreview = useMemo(() => !requestLockRef.current && !isPreviewing && !isSubmitting, [isPreviewing, isSubmitting]);
  const canConfirm = useMemo(() => !requestLockRef.current && Boolean(previewSchedule) && !isSubmitting, [isSubmitting, previewSchedule]);

  const onChange = (field: keyof CardRegistrationValues, value: string): void => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const toggleLabel = (label: string): void => {
    setValues((prev) => {
      const hasLabel = prev.labels.includes(label);
      return {
        ...prev,
        labels: hasLabel ? prev.labels.filter((item) => item !== label) : [...prev.labels, label]
      };
    });
  };

  const preview = async (): Promise<boolean> => {
    if (!canPreview || requestLockRef.current) {
      return false;
    }

    const clientErrors = validateCardRegistrationInput(values);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setSummary(mapCardRegistrationError("VALIDATION_FAILED"));
      setStatus("editing");
      return false;
    }

    requestLockRef.current = true;
    setStatus("previewing");
    setSummary(null);
    setFieldErrors({});

    const response = await previewCard(values);

    requestLockRef.current = false;

    if (response.ok) {
      setPreviewSchedule(response.data.reviewSchedule);
      setStatus("previewed");
      return true;
    }

    setSummary(mapCardRegistrationError(response.error.errorCode));
    setFieldErrors({ ...clientErrors, ...(response.error.fieldErrors ?? {}) });
    setStatus("editing");
    return false;
  };

  const confirm = async (): Promise<{ redirectTo?: string }> => {
    if (!previewSchedule || requestLockRef.current) {
      return {};
    }

    requestLockRef.current = true;
    setStatus("submitting");
    setSummary(null);
    setFieldErrors({});

    const response = await createCard(values);

    requestLockRef.current = false;

    if (response.ok) {
      setStatus("success");
      setValues(createInitialCardRegistrationValues());
      setPreviewSchedule(response.data.reviewSchedule);
      return { redirectTo: response.data.redirectTo };
    }

    setSummary(mapCardRegistrationError(response.error.errorCode));
    setFieldErrors({ ...validateCardRegistrationInput(values), ...(response.error.fieldErrors ?? {}) });
    setStatus("previewed");
    return {};
  };

  const cancel = (): void => {
    setValues(createInitialCardRegistrationValues());
    setFieldErrors({});
    setSummary(null);
    setPreviewSchedule(null);
    setStatus("editing");
    requestLockRef.current = false;
  };

  const retry = (): void => {
    setSummary(null);
    setStatus(previewSchedule ? "previewed" : "editing");
  };

  return {
    values,
    fieldErrors,
    summary,
    previewSchedule,
    status,
    isPreviewing,
    isSubmitting,
    canPreview,
    canConfirm,
    labelOptions: CARD_LABEL_OPTIONS,
    onChange,
    toggleLabel,
    preview,
    confirm,
    cancel,
    retry
  };
}