const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load, runWithFakeApi, describe, trimmed, sharedTests } = require("./helpers");

const FILE = "ex3.js";

test("Exercise 3: getUserEmail(1) prints the user's email", async () => {
  const { getUserEmail } = load(FILE);
  const run = await runWithFakeApi(() => getUserEmail(1));
  assert.ok(run.calls.some((c) => /\/users\/1$/.test(c.url)), `fetch the user: https://jsonplaceholder.typicode.com/users/1${describe(run)}`);
  assert.ok(trimmed(run.lines).includes("User's email: Sincere@april.biz"), `should print exactly: User's email: Sincere@april.biz${describe(run)}`);
});

test("Exercise 3: works for any user id (getUserEmail(3))", async () => {
  const { getUserEmail } = load(FILE);
  const run = await runWithFakeApi(() => getUserEmail(3));
  assert.ok(trimmed(run.lines).includes("User's email: Nathan@yesenia.net"), `getUserEmail(3) should print: User's email: Nathan@yesenia.net${describe(run)}`);
});

sharedTests(3, FILE, "getUserEmail", [1], "User's email: Sincere@april.biz");
