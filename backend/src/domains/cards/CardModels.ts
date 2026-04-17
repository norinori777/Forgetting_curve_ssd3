export const CARD_LABEL_OPTIONS = ["英語", "文法", "語彙", "試験対策"] as const;

export type CardLabelOption = (typeof CARD_LABEL_OPTIONS)[number];

export type CardDraftRequest = {
  title: string;
  question: string;
  answer?: string;
  memo?: string;
  labels?: string[];
};

export type CardFieldName = "title" | "question" | "answer" | "memo" | "labels";

export type CardFieldErrors = Partial<Record<CardFieldName, string>>;

export type NormalizedCardDraft = {
  title: string;
  question: string;
  answer: string | null;
  memo: string | null;
  labels: string[];
};

export type CardValidationResult = {
  isValid: boolean;
  fieldErrors: CardFieldErrors;
  normalizedDraft: NormalizedCardDraft;
};

export type ReviewSchedule = {
  firstReviewAt: Date;
  secondReviewAt: Date;
  thirdReviewAt: Date;
  fourthReviewAt: Date;
  timezone: string;
  policyVersion: string;
};

export type CardPreviewResponse = {
  isValid: true;
  reviewSchedule: ReviewSchedule;
};

export type CardCreateResponse = {
  cardId: string;
  redirectTo: "/dashboard";
  reviewSchedule: ReviewSchedule;
};

export type CardListQuery = {
  userId: string;
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
  firstReviewAt: Date;
  secondReviewAt: Date;
  thirdReviewAt: Date;
  fourthReviewAt: Date;
  reviewTimezone: string;
  reviewPolicyVersion: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CardListResponse = {
  items: CardListItem[];
  nextCursor: string | null;
};

export type CardBulkLabelUpdateRequest = {
  cardIds: string[];
  labels: string[];
};

export type CardBulkLabelUpdateResponse = {
  updatedCount: number;
};

export type CardDeleteResponse = {
  deletedCardId: string;
};

export type CardExportFilters = {
  search?: string;
  labels?: string[];
};

export type CardExportResponse = {
  exportedAt: string;
  filters: CardExportFilters;
  cards: CardListItem[];
};

export type CardErrorCode =
  | "VALIDATION_FAILED"
  | "AUTH_REQUIRED"
  | "FORBIDDEN"
  | "CARD_PREVIEW_FAILED"
  | "CARD_CREATE_FAILED"
  | "CARD_LIST_FAILED"
  | "CARD_BULK_UPDATE_FAILED"
  | "CARD_DELETE_FAILED"
  | "CARD_EXPORT_FAILED"
  | "CARD_NOT_FOUND"
  | "HTTPS_REQUIRED";

export type CardErrorResponse = {
  errorCode: CardErrorCode;
  message: string;
  fieldErrors?: CardFieldErrors;
};

export type CardAuthContext = {
  userId: string;
  sessionId: string;
};

export type CardRecord = {
  cardId: string;
  requestId: string;
  userId: string;
  title: string;
  question: string;
  answer: string | null;
  memo: string | null;
  labels: string[];
  firstReviewAt: Date;
  secondReviewAt: Date;
  thirdReviewAt: Date;
  fourthReviewAt: Date;
  reviewTimezone: string;
  reviewPolicyVersion: string;
  createdAt: Date;
  updatedAt: Date;
};

export const mapCardRecordToListItem = (record: CardRecord): CardListItem => ({
  cardId: record.cardId,
  title: record.title,
  question: record.question,
  answer: record.answer,
  memo: record.memo,
  labels: [...record.labels],
  firstReviewAt: record.firstReviewAt,
  secondReviewAt: record.secondReviewAt,
  thirdReviewAt: record.thirdReviewAt,
  fourthReviewAt: record.fourthReviewAt,
  reviewTimezone: record.reviewTimezone,
  reviewPolicyVersion: record.reviewPolicyVersion,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt
});

export const normalizeCardLabels = (labels: string[]): string[] => {
  return Array.from(new Set(labels.map((label) => label.trim()).filter((label) => label.length > 0)));
};

export const isAllowedCardLabel = (label: string): boolean => {
  return CARD_LABEL_OPTIONS.includes(label as CardLabelOption);
};

const trimValue = (value: string | undefined): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const normalizeCardDraft = (draft: Partial<CardDraftRequest>): NormalizedCardDraft => {
  const labels = Array.from(new Set((draft.labels ?? []).map((label) => label.trim()).filter((label) => label.length > 0)));

  return {
    title: trimValue(draft.title) ?? "",
    question: trimValue(draft.question) ?? "",
    answer: trimValue(draft.answer) ?? null,
    memo: trimValue(draft.memo) ?? null,
    labels
  };
};

export const validateCardDraft = (draft: Partial<CardDraftRequest>): CardValidationResult => {
  const normalizedDraft = normalizeCardDraft(draft);
  const fieldErrors: CardFieldErrors = {};

  if (normalizedDraft.title.length === 0) {
    fieldErrors.title = "タイトルは必須です。";
  } else if (normalizedDraft.title.length > 100) {
    fieldErrors.title = "タイトルは100文字以内で入力してください。";
  }

  if (normalizedDraft.question.length === 0) {
    fieldErrors.question = "問いは必須です。";
  } else if (normalizedDraft.question.length > 500) {
    fieldErrors.question = "問いは500文字以内で入力してください。";
  }

  if (normalizedDraft.answer && normalizedDraft.answer.length > 500) {
    fieldErrors.answer = "答えは500文字以内で入力してください。";
  }

  if (normalizedDraft.memo && normalizedDraft.memo.length > 500) {
    fieldErrors.memo = "メモは500文字以内で入力してください。";
  }

  const invalidLabel = normalizedDraft.labels.find((label) => !CARD_LABEL_OPTIONS.includes(label as CardLabelOption));
  if (invalidLabel) {
    fieldErrors.labels = `許可されていないラベルがあります: ${invalidLabel}`;
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
    normalizedDraft
  };
};