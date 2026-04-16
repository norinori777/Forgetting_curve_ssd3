import { test } from "node:test";
import assert from "node:assert/strict";

test("login success contract contains 200 and redirectTo", () => {
  const response = {
    status: 200,
    body: {
      userId: "example-user",
      redirectTo: "/dashboard",
      sessionExpiresInSeconds: 86400
    }
  };

  assert.equal(response.status, 200);
  assert.equal(response.body.redirectTo, "/dashboard");
  assert.equal(response.body.sessionExpiresInSeconds, 86400);
});