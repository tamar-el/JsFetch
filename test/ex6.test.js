const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load, runWithFakeApi, describe, trimmed, sharedTests } = require("./helpers");
const { route } = require("./fake-api");

const FILE = "ex6.js";
const URL_TODO = "https://jsonplaceholder.typicode.com/todos/1";

// The response text is pretty JSON. 50 chars of response.text() or of JSON.stringify(data) are both fine
// (and something like "..." after them is fine too).
function printsFirst50(lines, url) {
  const data = route(url);
  const accepted = [JSON.stringify(data, null, 2), JSON.stringify(data)].map((text) => `First 50 chars: ${text.slice(0, 50)}`);
  const all = lines.join("\n");
  return accepted.some((ok) => all.includes(ok.trim()));
}

test("Exercise 6: prints the first 50 characters of the response", async () => {
  const { fetchWithDelay } = load(FILE);
  const run = await runWithFakeApi(() => fetchWithDelay(URL_TODO, 50));
  assert.ok(run.calls.some((c) => c.url === URL_TODO), `fetch the url it got: ${URL_TODO}${describe(run)}`);
  assert.ok(trimmed(run.lines).some((l) => l.startsWith("First 50 chars:")), `should print a line that starts with "First 50 chars:"${describe(run)}`);
  assert.ok(
    printsFirst50(run.lines, URL_TODO),
    `should print "First 50 chars: " and then exactly the first 50 characters of the response (hint: .slice(0, 50))${describe(run)}`
  );
});

test("Exercise 6: waits <delay> milliseconds before calling fetch", async () => {
  const { fetchWithDelay } = load(FILE);
  const run = await runWithFakeApi(() => fetchWithDelay(URL_TODO, 200), { waitIfNoPromise: 500 });
  assert.ok(run.calls.length > 0, `fetchWithDelay should call fetch after the delay${describe(run)}`);
  assert.ok(
    run.calls[0].at >= 180,
    `fetch was called after ${run.calls[0].at}ms - first wait 200ms (setTimeout inside a new Promise), then fetch${describe(run)}`
  );
  assert.ok(run.calls[0].at < 1000, `fetch was called after ${run.calls[0].at}ms - wait only <delay> milliseconds${describe(run)}`);
});

test("Exercise 6: works with another url", async () => {
  const { fetchWithDelay } = load(FILE);
  const url = "https://jsonplaceholder.typicode.com/users/2";
  const run = await runWithFakeApi(() => fetchWithDelay(url, 10));
  assert.ok(printsFirst50(run.lines, url), `fetchWithDelay(".../users/2", 10) should print the first 50 chars of that response${describe(run)}`);
});

sharedTests(6, FILE, "fetchWithDelay", [URL_TODO, 50], (lines) => printsFirst50(lines, URL_TODO));
