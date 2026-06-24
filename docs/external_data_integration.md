# 🌐 External Data Integration Guide

This guide documents the collection, processing, and integration of the external real soil and crop dataset (originally sourced from Kaggle/Google) into the CarbonIntel machine learning pipeline.

---

## 📥 1. External Dataset Selection

We selected the widely recognized **Crop Recommendation Dataset** (available on Kaggle and curated from the Government of India's agricultural monitoring) as our trusted external source.

*   **Original Source:** Kaggle (atharvaingle/crop-recommendation-dataset)
*   **Total Records:** 2,200 samples
*   **Key Parameters Provided:** Nitrogen (N), Phosphorus (P), Potassium (K), pH, Temperature, Rainfall, and Humidity.

---

## 🛠️ 2. Processing and Mapping Pipeline

Because the external dataset was designed for crop recommendation, we created an automated pipeline (`src/collect_external_soil_data.py`) to align the data schema with CarbonIntel's footprint prediction model:

### Feature Mapping:
*   `N` ➡️ `N_Content`
*   `P` ➡️ `P_Content`
*   `K` ➡️ `K_Content`
*   `ph` ➡️ `pH`
*   `temperature` ➡️ `Temperature`
*   `rainfall` ➡️ `Rainfall`
*   `humidity` ➡️ `Humidity`
*   `label` ➡️ `Crop_Type` (mapped to supported crop classifications: Rice, Corn, Wheat, Soybeans, and Vegetables).

### Enriched Parameters:
Since the external crop dataset does not contain Soil Organic Carbon (SOC) or fertilizer application parameters, we synthesized these parameters using crop science standards:
1.  **Soil Organic Carbon (SOC %):** Sampled from Gaussian distributions tailored by crop type (e.g., higher carbon levels for Soybeans due to nitrogen-fixing organic build-up; lower carbon levels for vegetables).
2.  **Fertilizer Type & Amount:** Sampled using statistical probabilities defined in the CarbonIntel crop guide (e.g., Urea for grain crops, organic manure for vegetables).
3.  **Target Carbon Footprint:** Computed using the scientific formulas defined in our model architecture, incorporating local NPK values, weather coefficients, and SOC carbon sinks.

---

## 🔄 3. Merging and Compiling

The dataset compiler (`src/generate_11_dist_data.py`) was updated to import the cleaned external records (`data/raw/external_soil_data.csv`) and combine them alongside the other datasets.

### Final Master Dataset Composition (`data/agriculture_dataset.csv`):

| Data Source | Type | Records | Description |
| :--- | :--- | :--- | :--- |
| **Chitradurga (Challakere)** | Raw physical tests | 13,611 | Cleaned local lab testing records. |
| **Google / Kaggle Crop Data** | Real external records | 2,200 | Cleaned environmental crop compatibility tests. |
| **10 Karnataka Districts** | Statistically anchored | 20,000 | Generated using official district Soil Health Card benchmarks. |
| **Total Dataset Size** | **Combined** | **35,811** | **Complete unified ML training set.** |

---

## 📈 4. Model Retraining Performance

After merging the datasets, we reran preprocessing and retrained the machine learning models. The updated results show high accuracy:

*   **Linear Regression:** $R^2 = 0.9686$ | MAE: 61.40
*   **Random Forest Regressor:** $R^2 = 0.9951$ | MAE: 25.17
*   **XGBoost Regressor (Baseline):** $R^2 = 0.9959$ | MAE: 23.69
*   **XGBoost Regressor (Tuned via Grid Search):** **$R^2 = 0.9965$** | MAE: 22.15

The final, high-performance pipeline is saved and ready for deployment at `models/model.pkl`.
