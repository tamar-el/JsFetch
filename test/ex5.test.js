const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load, runWithFakeApi, describe, trimmed, sharedTests } = require("./helpers");

const FILE = "ex5.js";

test('Exercise 5: an existing post prints "Post exists"', async () => {
  const { checkPostExists } = load(FILE);
  const run = await runWithFakeApi(() => checkPostExists(1));
  const lines = trimmed(run.lines);
  assert.ok(run.calls.some((c) => /\/posts\/1$/.test(c.url)), `fetch https://jsonplaceholder.typicode.com/posts/1${describe(run)}`);
  assert.ok(lines.includes("Post exists"), `checkPostExists(1) should print: Post exists${describe(run)}`);
  assert.ok(!lines.includes("Post not found"), `checkPostExists(1) should not print "Post not found"${describe(run)}`);
});

test('Exercise 5: a missing post (404) prints "Post not found"', async () => {
  const { checkPostExists } = load(FILE);
  const run = await runWithFakeApi(() => checkPostExists(9999));
  const lines = trimmed(run.lines);
  assert.ok(
    lines.includes("Post not found"),
    `checkPostExists(9999) should print: Post not found. fetch does not fail on 404 - check response.ok, throw an error, and catch it (try/catch or .catch)${describe(run)}`
  );
  assert.ok(!lines.includes("Post exists"), `a missing post should not print "Post exists"${describe(run)}`);
});

test('Exercise 5: a network error prints "Post not found" and does not crash', async () => {
  const { checkPostExists } = load(FILE);
  const run = await runWithFakeApi(() => checkPostExists(1), { failNetwork: true });
  assert.ok(trimmed(run.lines).includes("Post not found"), `when fetch fails, catch the error (try/catch or .catch) and print: Post not found${describe(run)}`);
  assert.equal(run.error, null, `catch the error (try/catch or .catch), so the returned Promise does not reject${describe(run)}`);
});

sharedTests(5, FILE, "checkPostExists", [1], "Post exists");
