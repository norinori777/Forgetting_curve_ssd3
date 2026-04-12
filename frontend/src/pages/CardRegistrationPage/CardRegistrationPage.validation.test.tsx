import { CARD_LABEL_OPTIONS, validateCardRegistrationInput } from "./cardRegistrationValidation";

const maxTitle = "x".repeat(100);
const maxQuestion = "y".repeat(500);

const validationCases = [
  { title: "", question: "question", answer: "", memo: "", labels: [], expectTitleError: true, expectQuestionError: false },
  { title: "title", question: "", answer: "", memo: "", labels: [], expectTitleError: false, expectQuestionError: true },
  { title: maxTitle, question: maxQuestion, answer: "x".repeat(500), memo: "x".repeat(500), labels: [CARD_LABEL_OPTIONS[0]], expectTitleError: false, expectQuestionError: false },
  { title: "title", question: "question", answer: "x".repeat(501), memo: "", labels: [], expectTitleError: false, expectQuestionError: false },
  { title: "title", question: "question", answer: "", memo: "", labels: ["invalid-label"], expectTitleError: false, expectQuestionError: false }
] as const;

export const hasExpectedCardValidationMatrix = (): boolean => {
  return validationCases.every((item) => {
    const errors = validateCardRegistrationInput({
      title: item.title,
      question: item.question,
      answer: item.answer,
      memo: item.memo,
      labels: [...item.labels]
    });

    return Boolean(errors.title) === item.expectTitleError && Boolean(errors.question) === item.expectQuestionError;
  });
};