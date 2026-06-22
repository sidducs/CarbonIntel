/**
 * Reusable fetch wrapper that implements retry backoff for transient network and server errors.
 *
 * @param {string} url Target URL
 * @param {Object} options Fetch API request configuration options
 * @param {number} retries Number of retry attempts remaining
 * @param {number} delay Backoff delay in milliseconds
 * @returns {Promise<Response>}
 */
export async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      // transient 5xx server issues or rate limits (e.g. 429) can be retried
      const isTransientStatus = res.status >= 500 || res.status === 429;
      if (isTransientStatus && retries > 0) {
        throw new Error(`HTTP status ${res.status}`);
      }
    }
    return res;
  } catch (err) {
    if (retries <= 0) {
      throw err;
    }
    console.warn(`Fetch failure for ${url}. Retrying in ${delay}ms... (${retries} retries left)`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return fetchWithRetry(url, options, retries - 1, delay * 1.5);
  }
}
