type LoginMetricEvent =
  | { event: "login_started"; requestId: string; canceled: boolean }
  | { event: "login_succeeded"; requestId: string; canceled: boolean }
  | { event: "login_failed"; requestId: string; canceled: boolean }
  | { event: "login_canceled"; requestId: string; canceled: true };

export class LoginMetricsService {
  private readonly events: LoginMetricEvent[] = [];

  trackLoginStarted(requestId: string): void {
    this.events.push({ event: "login_started", requestId, canceled: false });
  }

  trackLoginSucceeded(requestId: string): void {
    this.events.push({ event: "login_succeeded", requestId, canceled: false });
  }

  trackLoginFailed(requestId: string): void {
    this.events.push({ event: "login_failed", requestId, canceled: false });
  }

  trackLoginCanceled(requestId: string): void {
    this.events.push({ event: "login_canceled", requestId, canceled: true });
  }

  getSc001EligibleAttempts(): number {
    return this.events.filter((event) => !event.canceled).length;
  }
}