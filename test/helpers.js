const fs = require("node:fs");
const path = require("node:path");
const util = require("node:util");
const { fakeResponse } = require("./fake-api");

const ROOT = path.join(__dirname, "..");

// Loads a student module fresh (no cache), so every test starts clean.
function load(relativePath) {
  const full = path.join(ROOT, relativePath);
  try {
    delete require.cache[require.resolve(full)];
    return require(full);
  } catch (err) {
    throw new Error(`could not load ${relativePath}: ${err.message}`);
  }
}

// Returns a student file's source without comments.
function sourceOf(relativePath) {
  const text = fs.readFileSync(path.join(ROOT, relativePath), "utf8");
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calls the student's function with a fake `fetch` (no internet needed) and records what happens.
 * The fake server answers like jsonplaceholder.typicode.com, after a few milliseconds, like a real network.
 * Returns { lines, calls, isPromise, resolvedLines, error, timedOut }:
 * - lines: everything printed with console.log (one entry per line)
 * - calls: the URLs passed to fetch, with the time (ms since the call) of each
 * - isPromise: did the function return a Promise
 * - resolvedLines: what was printed by the moment the returned Promise resolved
 */
async function runWithFakeApi(call, { failNetwork = false, timeout = 2000, waitIfNoPromise = 300 } = {}) {
  const lines = [];
  const calls = [];
  const start = Date.now();
  const originalFetch = globalThis.fetch;
  const originalLog = console.log;
  const result = { lines, calls, isPromise: false, resolvedLines: null, error: null, timedOut: false };
  const onUnhandled = (err) => { result.error = err; };

  globalThis.fetch = (input) => {
    const url = String(input && input.url ? input.url : input);
    calls.push({ url, at: Date.now() - start });
    return sleep(5).then(() => {
      if (failNetwork) throw new TypeError("fetch failed");
      return fakeResponse(url);
    });
  };
  console.log = (...args) => lines.push(...util.format(...args).split(/\r?\n/));
  process.on("unhandledRejection", onUnhandled);

  try {
    const returned = call();
    result.isPromise = returned instanceof Promise || (!!returned && typeof returned.then === "function");
    if (result.isPromise) {
      let timer;
      const timedOut = new Promise((resolve) => { timer = setTimeout(() => resolve("timeout"), timeout); });
      const outcome = await Promise.race([
        Promise.resolve(returned).then(() => "ok", (err) => { result.error = err; return "rejected"; }),
        timedOut,
      ]);
      clearTimeout(timer);
      if (outcome === "timeout") result.timedOut = true;
      else result.resolvedLines = lines.slice();
    }
    // Give chains that were not returned a moment to finish, so the output can still be checked.
    await sleep(result.isPromise ? 20 : waitIfNoPromise);
  } catch (err) {
    result.error = err;
  } finally {
    globalThis.fetch = originalFetch;
    console.log = originalLog;
    process.off("unhandledRejection", onUnhandled);
  }
  return result;
}

// A short, one-line description of a run, added to failure messages so the student sees what really happened.
function describe(run) {
  const short = (text) => (text.length > 90 ? text.slice(0, 87) + "..." : text);
  const printed = run.lines.length ? run.lines.slice(0, 4).map((l) => JSON.stringify(short(l))).join(", ") : "nothing";
  const fetched = run.calls.length ? run.calls.map((c) => c.url).join(", ") : "nothing";
  const error = run.error ? ` | error: ${run.error && run.error.message ? run.error.message : run.error}` : "";
  return ` | printed: ${printed} | fetched: ${fetched}${error}`;
}

const trimmed = (lines) => lines.map((line) => line.trim());

// A check every exercise shares: the function returns a Promise that resolves only after the result was printed.
// Both styles pass: an async function with await, or return fetch(...).then(...).
// `expected` is the line that must already be printed when the Promise resolves, or a function (lines) => boolean.
function sharedTests(n, file, fnName, args, expected) {
  const { test } = require("node:test");
  const assert = require("node:assert/strict");
  const printed = typeof expected === "function" ? expected : (lines) => trimmed(lines).includes(expected);
  const what = typeof expected === "function" ? "the result" : `"${expected}"`;

  test(`Exercise ${n}: returns a Promise that resolves after the result is printed`, async () => {
    const fn = load(file)[fnName];
    const run = await runWithFakeApi(() => fn(...args));
    assert.ok(run.isPromise, `${fnName} should return a Promise - make it an async function, or return the fetch(...).then(...) chain${describe(run)}`);
    assert.ok(!run.timedOut, `the Promise returned by ${fnName} never resolved${describe(run)}`);
    assert.ok(
      printed(run.resolvedLines || []),
      `${what} should already be printed when the returned Promise resolves - await every fetch and .json() (or return the whole .then chain)${describe(run)}`
    );
  });
}

module.exports = { load, sourceOf, runWithFakeApi, describe, trimmed, sharedTests };
