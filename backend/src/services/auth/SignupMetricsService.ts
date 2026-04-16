type SignupMetricEvent =
  | { event: "signup_started"; requestId: string; canceled: boolean }
  | { event: "signup_succeeded"; requestId: string; canceled: boolean }
  | { event: "signup_canceled"; requestId: string; canceled: true };

export class SignupMetricsService {
  private readonly events: SignupMetricEvent[] = [];

  trackSignupStarted(requestId: string): void {
    this.events.push({ event: "signup_started", requestId, canceled: false });
  }

  trackSignupSucceeded(requestId: string): void {
    this.events.push({ event: "signup_succeeded", requestId, canceled: false });
  }

  trackSignupCanceled(requestId: string): void {
    this.events.push({ event: "signup_canceled", requestId, canceled: true });
  }

  // SC-001 denominator excludes explicit cancellation only.
  getSc001EligibleAttempts(): number {
    return this.events.filter((event) => !event.canceled).length;
  }
}
