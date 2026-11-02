const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load, runWithFakeApi, describe, trimmed, sharedTests } = require("./helpers");

const FILE = "ex8.js";
const FIRST_1 = "First post title: sunt aut facere repellat provident occaecati excepturi optio reprehenderit";
const postsOf = (id) => new RegExp(`/posts\\?userId=${id}$|/users/${id}/posts$`);

test("Exercise 8: fetches the user first, then the user's posts", async () => {
  const { getUserFirstPost } = load(FILE);
  const run = await runWithFakeApi(() => getUserFirstPost(1));
  const userCall = run.calls.findIndex((c) => /\/users\/1$/.test(c.url));
  const postsCall = run.calls.findIndex((c) => postsOf(1).test(c.url));
  assert.ok(userCall !== -1, `Step 1: fetch the user: https://jsonplaceholder.typicode.com/users/1${describe(run)}`);
  assert.ok(postsCall !== -1, `Step 2: fetch the posts of that user: https://jsonplaceholder.typicode.com/posts?userId=1${describe(run)}`);
  assert.ok(userCall < postsCall, `fetch the posts only after the user arrived (await it first, or fetch inside .then)${describe(run)}`);
});

test("Exercise 8: getUserFirstPost(1) prints the title of the first post", async () => {
  const { getUserFirstPost } = load(FILE);
  const run = await runWithFakeApi(() => getUserFirstPost(1));
  assert.ok(trimmed(run.lines).includes(FIRST_1), `should print exactly: ${FIRST_1}${describe(run)}`);
});

test("Exercise 8: works for another user (getUserFirstPost(3))", async () => {
  const { getUserFirstPost } = load(FILE);
  const run = await runWithFakeApi(() => getUserFirstPost(3));
  const expected = "First post title: asperiores ea ipsam voluptatibus modi minima quia sint";
  assert.ok(trimmed(run.lines).includes(expected), `getUserFirstPost(3) should print: ${expected}${describe(run)}`);
});

sharedTests(8, FILE, "getUserFirstPost", [1], FIRST_1);
