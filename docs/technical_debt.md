# Technical Debt Report

This document records the design compromises, limitations, and future architectural risks of the current CarbonIntel v1 release.

---

## 1. Synthetic Dataset Dependency

### Description
The machine learning pipeline is trained on a generated dataset (`src/data_generator.py`) that uses mathematical rules (e.g. adding baseline constants for Rice crop emissions, scaling fertilizer usage, and applying simple offsets for SOC values) rather than empirical field data.

### Impact & Risk
* **Accuracy Risk**: The predictions reflect the mathematical simulation rules rather than real-world biological variations. If applied directly in the field, predictions could be inaccurate for unique micro-climates.
* **Out-of-Distribution Errors**: Inputs outside the synthetic generation ranges (e.g., highly acidic or alkaline soils) might cause predictions to fail or produce unrealistic outputs.

---

## 2. Browser LocalStorage Limitations

### Description
Historical assessment logs and theme preferences are saved directly in the browser's `localStorage`.

### Impact & Risk
* **No Cross-Device Sync**: Mapped benchmarks cannot be accessed across different browsers or devices.
* **Data Loss Vulnerability**: If a user clears their browser cache or uses private browsing, all saved assessment logs will be deleted.
* **Storage Space Limits**: Browsers cap local storage at roughly 5MB. If a farmer runs hundreds of calculations or downloads extensive weather records, they may hit this limit.

---

## 3. Lack of Backend Persistent Database

### Description
FastAPI is used strictly as an inference engine. It does not connect to a database to persist assessments.

### Impact & Risk
* **Analytics Limitations**: We cannot easily run regional aggregated analytics (e.g., calculating average sugarcane emissions in a specific district) because the data is stored locally in individual users' browsers.
* **Security & Audits**: Lacking a backend database makes it harder to audit assessments for verification or link them to official carbon credit registries.

---

## 4. Pending Cloud Deployment & Monitoring

### Description
The platform is currently run locally (React on `http://localhost:5173`, FastAPI on `http://localhost:8000`).

### Impact & Risk
* **Deployment Pipeline**: A automated CI/CD pipeline (using GitHub Actions) is needed to build and deploy the React build folder to static storage (e.g. AWS S3/Cloudfront) and run the FastAPI server on a containerized service (e.g. AWS ECS/Fargate).
* **Missing Telemetry**: Lacking monitoring tools (such as Prometheus, Grafana, or Sentry) makes it difficult to track prediction latencies, backend errors, or API health in production.

---

## 5. Security & Credentials
* The API connection base URL is configured with environment variable fallbacks, but the client does not yet support authentication tokens. If deployed publicly without access controls, the backend prediction endpoints could be vulnerable to abuse.
