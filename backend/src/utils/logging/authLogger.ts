type AuthLogLevel = "info" | "warn" | "error";

type AuthLogEvent = {
  event: string;
  requestId?: string;
  normalizedEmail?: string;
  userId?: string;
  reason?: string;
  ip?: string;
  errorCode?: string;
};

const redactEmail = (normalizedEmail?: string): string | undefined => {
  if (!normalizedEmail) {
    return undefined;
  }

  const [localPart, domain] = normalizedEmail.split("@");
  if (!localPart || !domain) {
    return "invalid-email";
  }

  return `${localPart.slice(0, 2)}***@${domain}`;
};

const formatEvent = (payload: AuthLogEvent): Record<string, string> => ({
  event: payload.event,
  requestId: payload.requestId ?? "n/a",
  normalizedEmailMasked: redactEmail(payload.normalizedEmail) ?? "n/a",
  userId: payload.userId ?? "n/a",
  ip: payload.ip ?? "n/a",
  reason: payload.reason ?? "n/a",
  errorCode: payload.errorCode ?? "n/a"
});

export const authLogger = {
  log(level: AuthLogLevel, payload: AuthLogEvent): void {
    const line = JSON.stringify(formatEvent(payload));
    if (level === "error") {
      console.error(line);
      return;
    }

    if (level === "warn") {
      console.warn(line);
      return;
    }

    console.info(line);
  }
};
