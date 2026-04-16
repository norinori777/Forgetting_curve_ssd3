import { API_ENDPOINTS } from "../endpoints";

export type CardDraftRequest = {
  title: string;
  question: string;
  answer?: string;
  memo?: string;
  labels?: string[];
};

export type ReviewSchedule = {
  firstReviewAt: string;
  secondReviewAt: string;
  thirdReviewAt: string;
  fourthReviewAt: string;
  timezone: string;
  policyVersion: string;
};

export type CardPreviewSuccess = {
  isValid: true;
  reviewSchedule: ReviewSchedule;
};

export type CardCreateSuccess = {
  cardId: string;
  redirectTo: string;
  reviewSchedule: ReviewSchedule;
};

export type CardFailure = {
  errorCode: "VALIDATION_FAILED" | "AUTH_REQUIRED" | "FORBIDDEN" | "CARD_PREVIEW_FAILED" | "CARD_CREATE_FAILED" | "HTTPS_REQUIRED";
  message: string;
  fieldErrors?: Partial<Record<"title" | "question" | "answer" | "memo" | "labels", string>>;
};

export type CardApiResult<TSuccess> =
  | { ok: true; data: TSuccess }
  | { ok: false; status: number; error: CardFailure };

const createRequestId = (): string => {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `card-${Date.now()}`;
};

async function requestCardApi<TSuccess>(url: string, payload: CardDraftRequest): Promise<CardApiResult<TSuccess>> {
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Request-Id": createRequestId()
    },
    body: JSON.stringify(payload)
  });

  const body = (await response.json()) as TSuccess | CardFailure;

  if (response.ok) {
    return {
      ok: true,
      data: body as TSuccess
    };
  }

  return {
    ok: false,
    status: response.status,
    error: body as CardFailure
  };
}

export const previewCard = async (payload: CardDraftRequest): Promise<CardApiResult<CardPreviewSuccess>> => {
  return requestCardApi<CardPreviewSuccess>(API_ENDPOINTS.cards.preview, payload);
};

export const createCard = async (payload: CardDraftRequest): Promise<CardApiResult<CardCreateSuccess>> => {
  return requestCardApi<CardCreateSuccess>(API_ENDPOINTS.cards.create, payload);
};