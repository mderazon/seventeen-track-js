import { describe, it, before } from "node:test";
import assert from "node:assert";
import util from "util";
const debuglog = util.debuglog("seventeen-track");
import { Client } from "../src/client";

const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASSWORD;

describe("Seventeen Track Library Integration Tests", () => {
  let client: Client;

  before(() => {
    client = new Client();
  });

  it("should successfully login", async () => {
    const loggedIn = await client.profile.login(email!, password!);
    debuglog(`Logged in as ${client.profile.accountId}`);
    assert.strictEqual(loggedIn, true);
    assert.ok(client.profile.accountId);
  });

  it("should fetch a summary", async () => {
    const summary = await client.profile.summary();
    debuglog(JSON.stringify(summary, null, 2));
    assert.ok(summary);
    assert.strictEqual(typeof summary, "object");
  });

  it("should fetch packages", async () => {
    const packages = await client.profile.packages();
    debuglog(JSON.stringify(packages, null, 2));
    assert.ok(Array.isArray(packages));
  });

  it("should fail login with incorrect credentials", async () => {
    const fakeClient = new Client();
    const loggedIn = await fakeClient.profile.login(
      "wrong@example.com",
      "incorrect"
    );
    assert.strictEqual(loggedIn, false);
  });
});
