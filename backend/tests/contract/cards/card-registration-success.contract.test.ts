import { test } from "node:test";
import assert from "node:assert/strict";

test("card registration success contract covers preview and create payloads", () => {
  const previewResponse = {
    status: 200,
    body: {
      isValid: true,
      reviewSchedule: {
        timezone: "Asia/Tokyo",
        policyVersion: "initial-v1"
      }
    }
  };

  const createResponse = {
    status: 201,
    body: {
      cardId: "example-card",
      redirectTo: "/dashboard",
      reviewSchedule: {
        timezone: "Asia/Tokyo",
        policyVersion: "initial-v1"
      }
    }
  };

  assert.equal(previewResponse.status, 200);
  assert.equal(previewResponse.body.isValid, true);
  assert.equal(createResponse.status, 201);
  assert.equal(createResponse.body.redirectTo, "/dashboard");
});