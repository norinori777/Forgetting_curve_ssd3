import { test } from "node:test";
import assert from "node:assert/strict";
import { SignupRepository } from "../../../src/repositories/auth/signupRepository.js";

test("transaction rollback path is available through thrown error", async () => {
  const repository = new SignupRepository();

  await assert.rejects(async () => {
    await repository.withTransaction(async () => {
      throw new Error("force-rollback");
    });
  });
});
