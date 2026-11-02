const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load, runWithFakeApi, describe, trimmed, sharedTests } = require("./helpers");

const FILE = "ex2.js";
const TITLE_1 = "Post title: sunt aut facere repellat provident occaecati excepturi optio reprehenderit";

test("Exercise 2: getPost(1) prints the post title", async () => {
  const { getPost } = load(FILE);
  const run = await runWithFakeApi(() => getPost(1));
  assert.ok(run.calls.some((c) => /\/posts\/1$/.test(c.url)), `fetch https://jsonplaceholder.typicode.com/posts/1${describe(run)}`);
  assert.ok(trimmed(run.lines).includes(TITLE_1), `should print exactly: ${TITLE_1}${describe(run)}`);
});

test("Exercise 2: works for any post id (getPost(11))", async () => {
  const { getPost } = load(FILE);
  const run = await runWithFakeApi(() => getPost(11));
  const expected = "Post title: et ea vero quia laudantium autem";
  assert.ok(trimmed(run.lines).includes(expected), `getPost(11) should print: ${expected} - put postId in the URL${describe(run)}`);
});

sharedTests(2, FILE, "getPost", [1], TITLE_1);
