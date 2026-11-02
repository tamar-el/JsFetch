// Exercise 7: Fetch and Show JSON Keys
// Rules: the function returns a Promise (an async function does that for you) and shows the result with console.log.
// Use async/await + try/catch (recommended) or .then()/.catch() - both are fine.

/**
 * Fetch JSON data
 * Show all keys of the top-level object
 *
 * Example output:
 *   Keys: [ 'userId', 'id', 'title', 'completed' ]
 *
 * @param {string} url
 * @returns {Promise} resolves after the result was printed (so whoever calls the function can wait for it)
 */
function showKeys(url) {
  return fetch(url)
  .then(response => response.json())
  .then(data => console.log("Keys:", Object.keys(data)));
}

module.exports = { showKeys };
