// Exercise 5: Check if Post Exists (with error handling)
// Rules: the function returns a Promise (an async function does that for you) and shows the result with console.log.
// Use async/await + try/catch (recommended) or .then()/.catch() - both are fine.

/**
 * Fetch post by ID
 * If found, show "Post exists"
 * If error, show "Post not found" (try/catch, or .catch)
 * Note: fetch does NOT fail on 404 - check response.ok and throw an error yourself
 *
 * Example output:
 *   Post exists   (or: Post not found)
 *
 * @param {number} postId
 * @returns {Promise} resolves after the result was printed (so whoever calls the function can wait for it)
 */
function checkPostExists(postId) {
  // write your code here
}

module.exports = { checkPostExists };
