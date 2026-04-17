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

export type CardListQuery = {
  search?: string;
  labels?: string[];
  cursor?: string;
  limit?: number;
};

export type CardListItem = {
  cardId: string;
  title: string;
  question: string;
  answer: string | null;
  memo: string | null;
  labels: string[];
  firstReviewAt: string;
  secondReviewAt: string;
  thirdReviewAt: string;
  fourthReviewAt: string;
  reviewTimezone: string;
  reviewPolicyVersion: string;
  createdAt: string;
  updatedAt: string;
};

export type CardListSuccess = {
  items: CardListItem[];
  nextCursor: string | null;
};

export type CardBulkLabelUpdateRequest = {
  cardIds: string[];
  labels: string[];
};

export type CardBulkLabelUpdateSuccess = {
  updatedCount: number;
};

export type CardDeleteSuccess = {
  deletedCardId: string;
};

export type CardExportFilters = {
  search?: string;
  labels?: string[];
};

export type CardExportSuccess = {
  exportedAt: string;
  filters: CardExportFilters;
  cards: CardListItem[];
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
  errorCode: "VALIDATION_FAILED" | "AUTH_REQUIRED" | "FORBIDDEN" | "CARD_PREVIEW_FAILED" | "CARD_CREATE_FAILED" | "CARD_LIST_FAILED" | "CARD_BULK_UPDATE_FAILED" | "CARD_DELETE_FAILED" | "CARD_EXPORT_FAILED" | "CARD_NOT_FOUND" | "HTTPS_REQUIRED";
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

async function requestCardApi<TSuccess>(url: string, init: { method: "POST" | "GET" | "PATCH"; payload?: unknown }): Promise<CardApiResult<TSuccess>> {
  const response = await fetch(url, {
    method: init.method,
    credentials: "include",
    headers: init.payload
      ? {
          "Content-Type": "application/json",
          "X-Request-Id": createRequestId()
        }
      : {
          "X-Request-Id": createRequestId()
        },
    body: init.payload ? JSON.stringify(init.payload) : undefined
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
  return requestCardApi<CardPreviewSuccess>(API_ENDPOINTS.cards.preview, { method: "POST", payload });
};

export const createCard = async (payload: CardDraftRequest): Promise<CardApiResult<CardCreateSuccess>> => {
  return requestCardApi<CardCreateSuccess>(API_ENDPOINTS.cards.create, { method: "POST", payload });
};

export const listCards = async (query: CardListQuery = {}): Promise<CardApiResult<CardListSuccess>> => {
  const searchParams = new URLSearchParams();

  if (query.search) {
    searchParams.set("search", query.search);
  }

  if (query.labels && query.labels.length > 0) {
    searchParams.set("labels", query.labels.join(","));
  }

  if (query.cursor) {
    searchParams.set("cursor", query.cursor);
  }

  if (typeof query.limit === "number") {
    searchParams.set("limit", String(query.limit));
  }

  const url = searchParams.toString().length > 0 ? `${API_ENDPOINTS.cards.list}?${searchParams.toString()}` : API_ENDPOINTS.cards.list;

  return requestCardApi<CardListSuccess>(url, { method: "GET" });
};

export const bulkLabelCards = async (payload: CardBulkLabelUpdateRequest): Promise<CardApiResult<CardBulkLabelUpdateSuccess>> => {
  return requestCardApi<CardBulkLabelUpdateSuccess>(API_ENDPOINTS.cards.bulkLabel, {
    method: "PATCH",
    payload
  });
};

export const deleteCard = async (cardId: string): Promise<CardApiResult<CardDeleteSuccess>> => {
  const response = await fetch(API_ENDPOINTS.cards.item(cardId), {
    method: "DELETE",
    credentials: "include",
    headers: {
      "X-Request-Id": createRequestId()
    }
  });

  const body = response.status === 200 ? ((await response.json()) as CardDeleteSuccess | CardFailure) : ({ deletedCardId: cardId } as CardDeleteSuccess);

  if (response.ok) {
    return {
      ok: true,
      data: body as CardDeleteSuccess
    };
  }

  return {
    ok: false,
    status: response.status,
    error: body as CardFailure
  };
};

export const exportCards = async (query: CardListQuery = {}): Promise<CardApiResult<CardExportSuccess>> => {
  const searchParams = new URLSearchParams();

  if (query.search) {
    searchParams.set("search", query.search);
  }

  if (query.labels && query.labels.length > 0) {
    searchParams.set("labels", query.labels.join(","));
  }

  const url = searchParams.toString().length > 0 ? `${API_ENDPOINTS.cards.export}?${searchParams.toString()}` : API_ENDPOINTS.cards.export;

  return requestCardApi<CardExportSuccess>(url, { method: "GET" });
};