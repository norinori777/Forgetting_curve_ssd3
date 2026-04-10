import { test } from "node:test";
import assert from "node:assert/strict";
import { applyCorsHeaders, isAllowedCorsOrigin } from "../../../src/api/middleware/cors.js";

test("cors allows local frontend origin", () => {
  assert.equal(isAllowedCorsOrigin("http://localhost:5173"), true);
});

test("cors headers include credentials support", () => {
  const headerStore: Record<string, string> = {};
  const response = {
    vary: () => undefined,
    setHeader: (name: string, value: string) => {
      headerStore[name] = value;
    }
  } as unknown as import("express").Response;

  applyCorsHeaders(response, "http://localhost:5173", "Content-Type");

  assert.equal(headerStore["Access-Control-Allow-Origin"], "http://localhost:5173");
  assert.equal(headerStore["Access-Control-Allow-Credentials"], "true");
  assert.equal(headerStore["Access-Control-Allow-Headers"], "Content-Type");
});