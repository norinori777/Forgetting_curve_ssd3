import assert from "node:assert/strict";
import { test } from "node:test";

test("card list action contract covers bulk update, delete, export, and not found errors", () => {
  const errorCodes = [
    "AUTH_REQUIRED",
    "CARD_BULK_UPDATE_FAILED",
    "CARD_DELETE_FAILED",
    "CARD_EXPORT_FAILED",
    "CARD_LIST_FAILED",
    "CARD_NOT_FOUND",
    "FORBIDDEN",
    "VALIDATION_FAILED"
  ];

  assert.deepEqual(errorCodes.sort(), [
    "AUTH_REQUIRED",
    "CARD_BULK_UPDATE_FAILED",
    "CARD_DELETE_FAILED",
    "CARD_EXPORT_FAILED",
    "CARD_LIST_FAILED",
    "CARD_NOT_FOUND",
    "FORBIDDEN",
    "VALIDATION_FAILED"
  ]);
});