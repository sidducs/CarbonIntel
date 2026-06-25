import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

/**
 * Executes a network call with exponential backoff retries on network or 5xx server failures.
 * 
 * @param {Function} fn Async function containing the target API call
 * @param {number} retries Number of retry attempts remaining
 * @param {number} delay Initial backoff delay in milliseconds
 */
const fetchWithRetry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) {
      throw err;
    }
    const isNetworkError = !err.response;
    const isServerError = err.response && err.response.status >= 500;
    if (isNetworkError || isServerError) {
      console.warn(`Network/Server failure detected. Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(fn, retries - 1, delay * 1.5);
    }
    throw err;
  }
};

export const predictCarbonFootprint = async (data) => {
  return fetchWithRetry(() => api.post("/predict", data).then((res) => res.data));
};

export const fetchModelMetrics = async () => {
  return fetchWithRetry(() => api.get("/model/metrics").then((res) => res.data));
};

export default api;