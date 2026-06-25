# CarbonIntel Project Directory Structure & File Map

This directory guide maps where all raw data, scripts, trained models, documentation, backend services, and frontend pages reside in the **CarbonIntel** repository.

---

```text
CarbonFootprintML/
│
├── app.py                         # FastAPI Backend entrypoint (routes, CORS, schema validation)
├── main.py                        # Executable orchestrator for model retraining and testing
├── requirements.txt               # List of Python dependencies
├── test_api.py                    # Helper script to test API endpoints locally
│
├── data/                          # Storage for all raw, merged, and split datasets (unified)
│   ├── soil_sample.csv            # Raw Challakere physical soil card measurements (7.5 MB)
│   ├── external_soil_data.csv     # Seed external datasets (Kaggle/Google)
│   ├── agriculture_dataset.csv    # The final combined dataset of 77,811 rows
│   ├── train.csv                  # 80% training split
│   └── test.csv                   # 20% validation split
│
├── src/                           # Active data processing and ML pipeline code
│   ├── generate_11_dist_data.py   # Synthesizes 31 districts via Gaussian sampling + merges Challakere CSV
│   ├── preprocess.py              # Data cleaning and scaling functions
│   ├── train.py                   # Main ML training script (compares LR, RF, XGBoost & saves best)
│   ├── validation.py              # Cross-validation and residual error scoring
│   ├── cross_validation.py        # Small helper CV test script
│   └── utils.py                   # Helper functions (plotting, metrics)
│
├── models/                        # Serialized artifacts output by the ML pipeline
│   ├── model.pkl                  # Serialized XGBoost pipeline (preprocessor + estimator)
│   ├── model_metadata.pkl         # Category lists for Crop_Type and Fertilizer_Type mapping
│   └── feature_list.pkl           # List of training column sequences
│
├── research/                      # Scraping scripts, HTML parsers, and raw local data files
│   ├── soil/
│   │   └── soil_sample.csv        # Raw Challakere physical soil card measurements (7.5 MB)
│   │   └── karnataka_soil_inventory.md # Analysis of regional soil composition
│   └── google-shc-scraper/        # Modified Google SHC web scraper files
│       ├── local_scraper.py       # Custom scraper running with local Chrome & GCS/Spanner mocks
│       ├── debug_page.py          # Portal hydration console logs inspector
│       └── click_karnataka.py     # Navigation explorer script
│
├── frontend/                      # React / Vite SPA Client
│   ├── index.html                 # Main template index file
│   ├── package.json               # Node module dependency mappings
│   ├── src/
│   │   ├── pages/                 # Full dashboard pages
│   │   │   ├── Dashboard.jsx      # Primary assessment portal with map & charts
│   │   │   ├── Analysis.jsx       # Historical records and reports comparison
│   │   │   └── About.jsx          # Explanation of equations and parameters
│   │   ├── components/            # Reusable UI widgets
│   │   │   ├── PredictionForm.jsx # Input form with progressive disclosure & manual input options
│   │   │   └── FarmLocationMap.jsx# Interactive map picker
│   │   ├── services/              # External API connectors
│   │   │   ├── weatherService.js  # NASA POWER climatology connector
│   │   │   └── districtSoilDefaults.js # Hand-curated 11-district averages library
│   │   └── hooks/                 # Custom React hooks
│   │       ├── usePredictionForm.js # Form validation and submission hook
│   │       └── useDistrictAutofill.js # Autofill dispatcher
│   
└── docs/                          # In-depth architectural reports
    ├── prediction_methodology.md  # Detailed calculations (XGBoost, ratings, credits formulas)
    ├── dataset_journey.md         # End-to-end dataset lifecycle walkthrough
    ├── real_data_roadmap.md       # Empirical data ingestion targets
    └── project_gantt.md           # Mermaid task roadmap chart
```
