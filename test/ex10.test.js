const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load, runWithFakeApi, describe, trimmed, sharedTests } = require("./helpers");

const FILE = "ex10.js";

test("Exercise 10: todoAndUser(1) prints the todo title and the user name", async () => {
  const { todoAndUser } = load(FILE);
  const run = await runWithFakeApi(() => todoAndUser(1));
  const lines = trimmed(run.lines);
  assert.ok(lines.includes("Todo title: delectus aut autem"), `should print: Todo title: delectus aut autem${describe(run)}`);
  assert.ok(lines.includes("User name: Leanne Graham"), `should print: User name: Leanne Graham${describe(run)}`);
});

test("Exercise 10: takes the userId from the todo (todo 21 belongs to user 2)", async () => {
  const { todoAndUser } = load(FILE);
  const run = await runWithFakeApi(() => todoAndUser(21));
  const lines = trimmed(run.lines);
  const todoCall = run.calls.findIndex((c) => /\/todos\/21$/.test(c.url));
  const userCall = run.calls.findIndex((c) => /\/users\/2$/.test(c.url));
  assert.ok(todoCall !== -1, `Step 1: fetch the todo: https://jsonplaceholder.typicode.com/todos/21${describe(run)}`);
  assert.ok(userCall !== -1, `Step 3: fetch the user with the todo's userId: https://jsonplaceholder.typicode.com/users/2${describe(run)}`);
  assert.ok(todoCall < userCall, `fetch the user only after the todo arrived (await it first, or fetch inside .then)${describe(run)}`);
  assert.ok(
    lines.includes("Todo title: suscipit repellat esse quibusdam voluptatem incidunt"),
    `should print: Todo title: suscipit repellat esse quibusdam voluptatem incidunt${describe(run)}`
  );
  assert.ok(lines.includes("User name: Ervin Howell"), `should print: User name: Ervin Howell${describe(run)}`);
});

sharedTests(10, FILE, "todoAndUser", [1], "User name: Leanne Graham");
