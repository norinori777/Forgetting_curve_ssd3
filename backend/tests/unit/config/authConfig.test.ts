import { test } from "node:test";
import assert from "node:assert/strict";

const importAuthConfig = async (): Promise<typeof import("../../../src/config/authConfig.js")> => {
  const moduleUrl = new URL("../../../src/config/authConfig.js", import.meta.url);
  moduleUrl.searchParams.set("t", String(Date.now()));

  return await import(moduleUrl.href);
};

test("auth config disables HTTPS by default in development", async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalRequireHttps = process.env.REQUIRE_HTTPS;

  try {
    process.env.NODE_ENV = "development";
    delete process.env.REQUIRE_HTTPS;

    const { authConfig } = await importAuthConfig();

    assert.equal(authConfig.requireHttps, false);
  } finally {
    process.env.NODE_ENV = originalNodeEnv;

    if (originalRequireHttps === undefined) {
      delete process.env.REQUIRE_HTTPS;
    } else {
      process.env.REQUIRE_HTTPS = originalRequireHttps;
    }
  }
});

test("auth config keeps HTTPS enabled by default in production", async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalRequireHttps = process.env.REQUIRE_HTTPS;

  try {
    process.env.NODE_ENV = "production";
    delete process.env.REQUIRE_HTTPS;

    const { authConfig } = await importAuthConfig();

    assert.equal(authConfig.requireHttps, true);
  } finally {
    process.env.NODE_ENV = originalNodeEnv;

    if (originalRequireHttps === undefined) {
      delete process.env.REQUIRE_HTTPS;
    } else {
      process.env.REQUIRE_HTTPS = originalRequireHttps;
    }
  }
});

test("auth config allows explicit HTTPS override", async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalRequireHttps = process.env.REQUIRE_HTTPS;

  try {
    process.env.NODE_ENV = "production";
    process.env.REQUIRE_HTTPS = "false";

    const { authConfig } = await importAuthConfig();

    assert.equal(authConfig.requireHttps, false);
  } finally {
    process.env.NODE_ENV = originalNodeEnv;

    if (originalRequireHttps === undefined) {
      delete process.env.REQUIRE_HTTPS;
    } else {
      process.env.REQUIRE_HTTPS = originalRequireHttps;
    }
  }
});