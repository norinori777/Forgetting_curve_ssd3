export const CARD_LABEL_OPTIONS = ["英語", "文法", "語彙", "試験対策"] as const;

export type CardRegistrationValues = {
  title: string;
  question: string;
  answer: string;
  memo: string;
  labels: string[];
};

export type CardRegistrationFieldErrors = Partial<Record<"title" | "question" | "answer" | "memo" | "labels", string>>;

export const createInitialCardRegistrationValues = (): CardRegistrationValues => ({
  title: "",
  question: "",
  answer: "",
  memo: "",
  labels: []
});

export const validateCardRegistrationInput = (values: CardRegistrationValues): CardRegistrationFieldErrors => {
  const errors: CardRegistrationFieldErrors = {};

  if (values.title.trim().length === 0) {
    errors.title = "タイトルは必須です。";
  } else if (values.title.trim().length > 100) {
    errors.title = "タイトルは100文字以内で入力してください。";
  }

  if (values.question.trim().length === 0) {
    errors.question = "問いは必須です。";
  } else if (values.question.trim().length > 500) {
    errors.question = "問いは500文字以内で入力してください。";
  }

  if (values.answer.trim().length > 500) {
    errors.answer = "答えは500文字以内で入力してください。";
  }

  if (values.memo.trim().length > 500) {
    errors.memo = "メモは500文字以内で入力してください。";
  }

  const invalidLabel = values.labels.find((label) => !CARD_LABEL_OPTIONS.includes(label as (typeof CARD_LABEL_OPTIONS)[number]));
  if (invalidLabel) {
    errors.labels = `許可されていないラベルがあります: ${invalidLabel}`;
  }

  return errors;
};