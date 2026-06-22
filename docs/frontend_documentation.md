# Frontend Documentation

This document describes the design, routing, state architecture, and UI/UX implementation of the CarbonIntel React frontend.

---

## 1. Page Structure & Routing

The client-side interface is compiled as a Single Page Application (SPA) using React Router DOM.

### Page Directory (`src/pages/`)
* **`Home.jsx`**: Landing portal detailing platform capabilities, target audiences, and entry gateways.
* **`Dashboard.jsx`**: The core work hub hosting soil input modules, coordinate maps, and assessment history logs.
* **`Analysis.jsx`**: Explains environmental outputs via interactive charts (Venn distributions, feature correlations).
* **`Optimization.jsx`**: Hosts the What-If simulation engine and fertilizer optimization configurations.
* **`Reports.jsx`**: A report archiving page allowing users to view, select, compare, and download full executive PDF summaries.
* **`Copilot.jsx`**: A conversation interface interacting with the AI Sustainability Copilot.
* **`About.jsx`**: Project summary and educational cards.

---

## 2. Navigation & Theme Configuration

### Route Configuration (`src/routes/AppRoutes.jsx`)
Defines clean paths mapped to the pages:
* `/` -> Home
* `/dashboard` -> Dashboard
* `/analysis` -> Analysis
* `/optimization` -> Optimization
* `/reports` -> Reports
* `/copilot` -> Copilot
* `/about` -> About

### Global Layout & Nav Bar (`src/components/Navbar.jsx`)
* Implements a responsive menu with active route highlighting using `NavLink`.
* Renders a sliding drawer menu for mobile interfaces.
* Incorporates the `ThemeToggle` to manage dark/light modes.

### Theme Context (`src/context/ThemeContext.jsx`)
* Manages client-side theme states.
* On initialization, reads local storage preferences (`theme`) or fallbacks to the browser's preferred color scheme (`matchMedia`).
* Syncs theme adjustments dynamically by toggling the `dark` class on the root `<html>` document.

---

## 3. Storage Adapters & Services (`src/services/`)

To keep components decoupled and future-ready, core operations are handled in service modules:

1. **`api.js`**: Integrates backoff retries with axios.
2. **`weatherService.js`**: Fetches coordinates and forecasts from Open-Meteo API.
3. **`weatherHistoryService.js`**: Manages NASA POWER integrations and csv generation.
4. **`geocodingService.js`**: Integrates Nominatim reverse lookup queries and HTML5 browser geolocation detection.
5. **`copilotEngine.js`**: Connects natural language queries with rule-based recommendations.

---

## 4. Key Component Modules

### Prediction Form (`src/components/PredictionForm.jsx`)
* Consolidates all soil, crop, and chemical input fields.
* Houses Nominatim autocomplete location search and maps coordinates dynamically.
* Fetches current weather telemetry and clamps variables within ML constraints (preventing out-of-bounds inputs).

### What-If Simulator (`src/components/WhatIfSimulator.jsx`)
* Features slider elements allowing farmers to simulate changes (e.g., reducing DAP by 30% or increasing SOC) to immediately evaluate carbon footprint reductions.

---

## 5. Responsive Design Strategy

The application layout uses Tailwind CSS mobile-first design system principles:
* **Grid Layouts**: Desktop splits (such as Form + Map) collapse into stacked mobile layouts automatically.
* **Scroll Tables**: Data tables (`AssessmentHistory`) adapt using overflow wrappers or collapse into styled layout cards on mobile viewports.
* **Sidebar Drawers**: Large headers transform into a hidden hamburger-activated mobile slide-out panel, preventing navigation clutter.

---

## 6. Global Error Safeguards (`src/components/ErrorBoundary.jsx`)

An application-wide class boundary intercepts rendering errors in children components, outputting a descriptive fallback error card while keeping the browser state active and allowing simple recovery.
