import { createInitialCardRegistrationValues } from "./cardRegistrationValidation";

export const isInputRetentionExpectationValid = (): boolean => {
  const initialValues = createInitialCardRegistrationValues();

  return (
    initialValues.title === "" &&
    initialValues.question === "" &&
    initialValues.answer === "" &&
    initialValues.memo === "" &&
    initialValues.labels.length === 0
  );
};