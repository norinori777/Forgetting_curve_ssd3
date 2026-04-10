import { test } from "node:test";
import assert from "node:assert/strict";
import { SignupRepository } from "../../../src/repositories/auth/signupRepository.js";
import { LoginRepository } from "../../../src/repositories/auth/loginRepository.js";
import { SignupGuardService } from "../../../src/services/auth/SignupGuardService.js";
import { SignupMetricsService } from "../../../src/services/auth/SignupMetricsService.js";
import { SignupService } from "../../../src/services/auth/SignupService.js";
import { LoginGuardService } from "../../../src/services/auth/LoginGuardService.js";
import { LoginMetricsService } from "../../../src/services/auth/LoginMetricsService.js";
import { LoginService } from "../../../src/services/auth/LoginService.js";
import { createAuthStore } from "../../../src/repositories/auth/authStore.js";

test("login succeeds for an account created in the shared auth store", async () => {
  const store = createAuthStore();
  const signupRepository = new SignupRepository(store);
  const signupService = new SignupService(signupRepository, new SignupGuardService(), new SignupMetricsService());
  const loginRepository = new LoginRepository(store);
  const loginService = new LoginService(loginRepository, new LoginGuardService(), new LoginMetricsService());

  await signupService.register({
    body: {
      email: "existing@example.com",
      password: "password-123",
      passwordConfirm: "password-123"
    },
    requestId: "signup-request",
    clientIp: "127.0.0.1"
  });

  const baselineSessions = loginRepository.getSessionCount();

  const result = await loginService.login({
    body: {
      email: "existing@example.com",
      password: "password-123"
    },
    requestId: "login-request",
    clientIp: "127.0.0.1"
  });

  assert.equal(result.redirectTo, "/dashboard");
  assert.equal(result.sessionExpiresInSeconds, 86400);
  assert.equal(loginRepository.getSessionCount(), baselineSessions + 1);
});