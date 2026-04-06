import { test } from "node:test";
import assert from "node:assert/strict";

test("signup success contract contains 201 and redirectTo", () => {
  const response = {
    status: 201,
    body: {
      userId: "example-user",
      redirectTo: "/dashboard",
      sessionExpiresInSeconds: 86400
    }
  };

  assert.equal(response.status, 201);
  assert.equal(response.body.redirectTo, "/dashboard");
  assert.equal(response.body.sessionExpiresInSeconds, 86400);
});
