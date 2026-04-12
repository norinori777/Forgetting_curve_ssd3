import type { CardRegistrationFieldErrors } from "./cardRegistrationValidation";

type CardRegistrationFieldErrorsProps = {
  errors: CardRegistrationFieldErrors;
};

const errorKeyToId = (key: keyof CardRegistrationFieldErrors): string => `card-${key}-error`;

export const CardRegistrationFieldErrorsView = ({ errors }: CardRegistrationFieldErrorsProps) => {
  const entries = Object.entries(errors) as Array<[keyof CardRegistrationFieldErrors, string]>;

  if (entries.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "grid", gap: 6 }}>
      {entries.map(([key, message]) => (
        <p id={errorKeyToId(key)} key={key} role="alert" style={{ margin: 0, color: "#b42318" }}>
          {message}
        </p>
      ))}
    </div>
  );
};