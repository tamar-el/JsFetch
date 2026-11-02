const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load, runWithFakeApi, describe, trimmed, sharedTests } = require("./helpers");

const FILE = "ex9.js";
const commentsOf = (id) => new RegExp(`/comments\\?postId=${id}$|/posts/${id}/comments$`);

test("Exercise 9: fetches the post first, then its comments", async () => {
  const { getPostCommentsCount } = load(FILE);
  const run = await runWithFakeApi(() => getPostCommentsCount(1));
  const postCall = run.calls.findIndex((c) => /\/posts\/1$/.test(c.url));
  const commentsCall = run.calls.findIndex((c) => commentsOf(1).test(c.url));
  assert.ok(postCall !== -1, `Step 1: fetch the post: https://jsonplaceholder.typicode.com/posts/1${describe(run)}`);
  assert.ok(
    commentsCall !== -1,
    `Step 2: fetch the comments: https://jsonplaceholder.typicode.com/posts/1/comments (or /comments?postId=1)${describe(run)}`
  );
  assert.ok(postCall < commentsCall, `fetch the comments only after the post arrived (await it first, or fetch inside .then)${describe(run)}`);
});

test("Exercise 9: getPostCommentsCount(1) prints the number of comments", async () => {
  const { getPostCommentsCount } = load(FILE);
  const run = await runWithFakeApi(() => getPostCommentsCount(1));
  assert.ok(trimmed(run.lines).includes("Post has 5 comments"), `should print exactly: Post has 5 comments${describe(run)}`);
});

test("Exercise 9: counts the comments it got (post 11 has 3 comments in the test data)", async () => {
  const { getPostCommentsCount } = load(FILE);
  const run = await runWithFakeApi(() => getPostCommentsCount(11));
  assert.ok(
    trimmed(run.lines).includes("Post has 3 comments"),
    `getPostCommentsCount(11) should print: Post has 3 comments - use the length of the comments array${describe(run)}`
  );
});

sharedTests(9, FILE, "getPostCommentsCount", [1], "Post has 5 comments");
