const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load, runWithFakeApi, describe, trimmed, sharedTests } = require("./helpers");

const FILE = "ex4.js";

test("Exercise 4: listUserTodos(3) prints how many todos user 3 has", async () => {
  const { listUserTodos } = load(FILE);
  const run = await runWithFakeApi(() => listUserTodos(3));
  assert.ok(
    run.calls.some((c) => /\/todos\?userId=3$|\/users\/3\/todos$/.test(c.url)),
    `fetch https://jsonplaceholder.typicode.com/todos?userId=3${describe(run)}`
  );
  assert.ok(trimmed(run.lines).includes("User 3 has 20 todos"), `should print exactly: User 3 has 20 todos${describe(run)}`);
});

test("Exercise 4: counts the todos it got (user 5 has 12 todos in the test data)", async () => {
  const { listUserTodos } = load(FILE);
  const run = await runWithFakeApi(() => listUserTodos(5));
  assert.ok(trimmed(run.lines).includes("User 5 has 12 todos"), `listUserTodos(5) should print: User 5 has 12 todos - use the length of the array you got${describe(run)}`);
});

sharedTests(4, FILE, "listUserTodos", [3], "User 3 has 20 todos");
