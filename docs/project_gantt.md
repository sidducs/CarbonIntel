# Project Gantt Chart: CarbonIntel

Below is the Gantt chart and project breakdown illustrating the timeline, tasks, status, and dependencies for the **CarbonIntel** project from **08/06/2026 to 24/06/2026**.

---

## Gantt Chart Visualization

```mermaid
gantt
    title CarbonIntel – Carbon Footprint, Sustainability Assessment and Carbon Credit Estimation in Agriculture
    dateFormat  DD/MM/YYYY
    axisFormat  %d/%m
    todayMarker off

    section Project Initiation
    1. Project Planning :done, p1, 08/06/2026, 09/06/2026
    2. Requirements Analysis :done, p2, after p1, 11/06/2026

    section Data & Research
    3. Dataset Research & Collection :done, p3, after p2, 14/06/2026
    4. Data Processing & Feature Engineering :done, p4, 13/06/2026, 17/06/2026

    section Engineering & ML
    5. Machine Learning Development :done, p5, after p4, 18/06/2026
    6. Backend API Development :done, p6, 16/06/2026, 19/06/2026
    7. Frontend Dashboard Development :done, p7, 17/06/2026, 22/06/2026

    section Integration & Test
    8. Real Data Integration :done, p8, 20/06/2026, 23/06/2026
    9. MVP Testing & Validation :done, p9, 22/06/2026, 24/06/2026

    section Current Sprint
    10. Ongoing Improvements :active, p10, 24/06/2026, 1d

    section Milestones
    MVP Ready :milestone, m1, 24/06/2026, 0d
```

---

## Detailed Task Breakdown

### 1. Project Planning (08/06/2026 - 09/06/2026)
*   **Status:** `Completed` (Green)
*   **Details:**
    *   Defined project objectives.
    *   Identified sustainability assessment workflow.
    *   Selected technology stack (React, FastAPI, XGBoost).

### 2. Requirements Analysis (10/06/2026 - 11/06/2026)
*   **Status:** `Completed` (Green)
*   **Dependencies:** After *Project Planning*
*   **Details:**
    *   Identified input parameters (SOC, N, P, K, pH).
    *   Defined fertilizer and weather requirements.
    *   Defined output metrics (Carbon Footprint, Sustainability, Carbon Credits).

### 3. Dataset Research & Collection (11/06/2026 - 14/06/2026)
*   **Status:** `Completed` (Green)
*   **Dependencies:** After *Requirements Analysis*
*   **Details:**
    *   Soil Health Card dataset research.
    *   Karnataka soil data collection.
    *   Crop Recommendation dataset collection.
    *   Weather API evaluation.

### 4. Data Processing & Feature Engineering (13/06/2026 - 17/06/2026)
*   **Status:** `Completed` (Green)
*   **Details:**
    *   Dataset cleaning.
    *   Feature mapping.
    *   SOC enrichment.
    *   Fertilizer parameter generation.
    *   Dataset merging.

### 5. Machine Learning Development (15/06/2026 - 18/06/2026)
*   **Status:** `Completed` (Green)
*   **Dependencies:** After *Data Processing*
*   **Details:**
    *   Linear Regression training.
    *   Random Forest training.
    *   XGBoost training.
    *   Model comparison and selection.

### 6. Backend API Development (16/06/2026 - 19/06/2026)
*   **Status:** `Completed` (Green)
*   **Details:**
    *   FastAPI setup.
    *   Prediction endpoint development.
    *   Model integration.
    *   API testing.

### 7. Frontend Dashboard Development (17/06/2026 - 22/06/2026)
*   **Status:** `Completed` (Green)
*   **Details:**
    *   React dashboard implementation.
    *   Prediction form creation.
    *   Results visualization.
    *   Responsive UI development.

### 8. Real Data Integration (20/06/2026 - 23/06/2026)
*   **Status:** `Completed` (Green)
*   **Details:**
    *   NASA POWER climatology integration.
    *   Soil dataset integration.
    *   District autofill workflow.
    *   AIKosh dataset exploration.

### 9. MVP Testing & Validation (22/06/2026 - 24/06/2026)
*   **Status:** `Completed` (Green)
*   **Details:**
    *   End-to-end testing.
    *   Model validation.
    *   Workflow verification.
    *   Performance review.

### 10. Ongoing Improvements (24/06/2026)
*   **Status:** `In Progress` (Orange/Blue Active)
*   **Details:**
    *   UX workflow simplification.
    *   Map workflow debugging.
    *   SoilGrids validation.
    *   Research paper preparation.
