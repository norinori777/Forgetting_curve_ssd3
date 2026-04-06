import { authConfig } from "../../config/authConfig.js";

type RateLimitEntry = {
  count: number;
  windowStart: number;
};

export class SignupGuardService {
  private readonly rateLimitBuckets = new Map<string, RateLimitEntry>();

  isRateLimited(normalizedEmail: string, clientIp: string, now: Date): boolean {
    const bucketKey = `${normalizedEmail}:${clientIp}`;
    const currentWindow = now.getTime();
    const existing = this.rateLimitBuckets.get(bucketKey);

    if (!existing || currentWindow - existing.windowStart >= 60_000) {
      this.rateLimitBuckets.set(bucketKey, {
        count: 1,
        windowStart: currentWindow
      });
      return false;
    }

    if (existing.count >= authConfig.signupRateLimitPerMinute) {
      return true;
    }

    existing.count += 1;
    this.rateLimitBuckets.set(bucketKey, existing);
    return false;
  }
}
