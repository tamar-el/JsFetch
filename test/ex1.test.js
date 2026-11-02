const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load, runWithFakeApi, describe, trimmed, sharedTests } = require("./helpers");

const FILE = "ex1.js";

test("Exercise 1: getUser(1) prints the user's name", async () => {
  const { getUser } = load(FILE);
  const run = await runWithFakeApi(() => getUser(1));
  assert.ok(run.calls.some((c) => /\/users\/1$/.test(c.url)), `fetch https://jsonplaceholder.typicode.com/users/1${describe(run)}`);
  assert.ok(trimmed(run.lines).includes("User's name: Leanne Graham"), `should print exactly: User's name: Leanne Graham${describe(run)}`);
});

test("Exercise 1: works for any user id (getUser(7))", async () => {
  const { getUser } = load(FILE);
  const run = await runWithFakeApi(() => getUser(7));
  assert.ok(trimmed(run.lines).includes("User's name: Kurtis Weissnat"), `getUser(7) should print: User's name: Kurtis Weissnat - put userId in the URL${describe(run)}`);
});

sharedTests(1, FILE, "getUser", [1], "User's name: Leanne Graham");
