# Production Hardening Audit Report

This report outlines the hardening assessments, fixes applied, and security optimizations completed to prepare CarbonIntel for production deployment.

---

## Issues Found & Fixes Applied

### 1. API Reliability & Fault Tolerance
* **Issue**: API calls to weather providers (Open-Meteo, NASA POWER), Nominatim geocoding services, and the local FastAPI prediction engine were made using standard `fetch` or `axios` instances without failure retry policies. Transient connection timeouts or server-side rate limits could crash UI views.
* **Fix**: 
  * Implemented a reusable network helper `src/services/fetchHelper.js` featuring exponential backoff retries (default 3 retries) targeting transient status codes (5xx, 429).
  * Hardened the primary API client `src/services/api.js` using a custom request retry loop.
  * Replaced native geocoding/weather fetches with `fetchWithRetry` in `weatherService.js`, `weatherHistoryService.js`, and `geocodingService.js`.

### 2. Nesting HTML Form Violation
* **Issue**: The `FarmProfileManager` sub-component rendered a nested `<form>` tag inside the main `PredictionForm` container, causing console errors (`In HTML, <form> cannot be a descendant of <form>`) and React hydration issues.
* **Fix**: Refactored `FarmProfileManager.jsx` to wrap save targets in a standard layout `<div>`. Set button types to `"button"` to block parent submit bubbles and added an `onKeyDown` hook to catch `Enter` keystrokes gracefully.

### 3. Out-Of-Bounds Weather Values
* **Issue**: Real-world geocoded weather data sometimes returned temperatures (e.g. above 38°C) or relative humidity (e.g. 96%) exceeding the strict bounds of the ML prediction model's input validators. This caused validation failures.
* **Fix**: Added dynamic variable clamping to the weather retrieval handlers in `PredictionForm.jsx`. Fetched weather metrics are now rounded and safely clamped to the model's expected ranges (`Temperature`: 10-38°C, `Humidity`: 30-90%, `Rainfall`: 200-2000mm) before updating form states.

### 4. Form Validation & Empty Input Hardening
* **Issue**: Basic form checking looked for empty strings (`""`) but failed to flag whitespace-only inputs (`"   "`) or undefined/null edge cases.
* **Fix**: Updated `validateField` checks to handle `undefined`, `null`, and string-trimmed whitespace entries.

### 5. Application Crash Safeguards
* **Issue**: Unhandled runtime exceptions in layout renders could cause the entire React Single Page Application (SPA) to freeze or display a blank screen.
* **Fix**: Created a premium global `<ErrorBoundary>` component in `src/components/ErrorBoundary.jsx` and wrapped the application root in `src/App.jsx`. In case of rendering crashes, a clean fallback UI allows users to safely navigate back to the dashboard.

### 6. Environment Hardening & Security
* **Issue**: The API client baseUrl was hardcoded to `http://127.0.0.1:8000`, complicating multi-environment staging configurations.
* **Fix**: Configured the axios instance in `src/services/api.js` to look for a `import.meta.env.VITE_API_URL` environment variable first, defaulting to local port 8000.

---

## Remaining Improvements
* **API Rate Limiting & Caching**: Integrate a brief caching window (e.g., 5 minutes) in `localStorage` for weather coordinates to prevent repeated lookups of unchanged locations.
* **Token Authentication (Future Ready)**: The API client configuration is built with interceptor capability, ready to accept JWT header injection when a backend database is linked.
