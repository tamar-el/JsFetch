const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load, runWithFakeApi, describe, sharedTests } = require("./helpers");

const FILE = "ex7.js";
const URL_TODO = "https://jsonplaceholder.typicode.com/todos/1";

// Accepts console.log("Keys:", keys), "Keys: " + keys.join(", ") and similar: "Keys:" and then all keys, in order.
function printsKeys(lines, keys) {
  const all = lines.join(" ");
  const start = all.indexOf("Keys:");
  if (start === -1) return false;
  let rest = all.slice(start + "Keys:".length);
  for (const key of keys) {
    const match = new RegExp(`\\b${key}\\b`).exec(rest);
    if (!match) return false;
    rest = rest.slice(match.index + key.length);
  }
  return true;
}

const TODO_KEYS = ["userId", "id", "title", "completed"];

test("Exercise 7: prints the keys of a todo", async () => {
  const { showKeys } = load(FILE);
  const run = await runWithFakeApi(() => showKeys(URL_TODO));
  assert.ok(run.calls.some((c) => c.url === URL_TODO), `fetch the url it got: ${URL_TODO}${describe(run)}`);
  assert.ok(printsKeys(run.lines, TODO_KEYS), `should print: Keys: [ 'userId', 'id', 'title', 'completed' ] (hint: Object.keys)${describe(run)}`);
});

test("Exercise 7: works for another object (a user)", async () => {
  const { showKeys } = load(FILE);
  const run = await runWithFakeApi(() => showKeys("https://jsonplaceholder.typicode.com/users/1"));
  assert.ok(
    printsKeys(run.lines, ["id", "name", "username", "email"]),
    `showKeys(".../users/1") should print: Keys: [ 'id', 'name', 'username', 'email' ]${describe(run)}`
  );
});

sharedTests(7, FILE, "showKeys", [URL_TODO], (lines) => printsKeys(lines, TODO_KEYS));
