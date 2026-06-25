# CarbonIntel Prediction Methodology & Logic

This document explains the calculation mechanics behind the prediction results shown in the CarbonIntel dashboard: **Carbon Footprint**, **Sustainability Rating**, and **Carbon Credits**.

---

## 1. Carbon Footprint (XGBoost Regressor)

The **Carbon Footprint** is computed dynamically using a machine learning model rather than a static formula:

*   **Model Type:** Tuned XGBoost Regressor Pipeline (`models/model.pkl`).
*   **Inputs:** 11 active features:
    1.  `Crop_Type` (One-hot encoded)
    2.  `Fertilizer_Type` (One-hot encoded)
    3.  `SOC` (Soil Organic Carbon %)
    4.  `N_Content` (Nitrogen kg/ha)
    5.  `P_Content` (Phosphorus kg/ha)
    6.  `K_Content` (Potassium kg/ha)
    7.  `pH` (Soil Acidity/Alkalinity)
    8.  `Fertilizer_Amount` (kg/ha)
    9.  `Temperature` (°C)
    10. `Rainfall` (mm)
    11. `Humidity` (%)
*   **Process:** The inputs are formatted into a single-row pandas DataFrame, encoded/scaled via the model pipeline, and passed to the trained XGBoost estimator, which returns the predicted net carbon footprint in $\text{kg CO}_2\text{e/ha}$.

---

## 2. Sustainability Rating (Rule-Based Classification)

The **Sustainability Rating** is determined by classifying the predicted carbon footprint into three ecological zones:

| Carbon Footprint Range ($\text{kg CO}_2\text{e/ha}$) | Rating | Description |
| :--- | :--- | :--- |
| **$< 400.0$** | **High** (Gold) | Sustainable practices with low carbon emission footprint. |
| **$400.0 \text{ to } 1200.0$** | **Medium** (Silver) | Moderate emissions; some optimization opportunities exist. |
| **$> 1200.0$** | **Low** (Bronze) | High carbon footprint; recommendations suggest immediate optimization. |

---

## 3. Carbon Credits (Offset Formula)

**Carbon Credits** are computed using a standard crediting formula compared against a benchmark limit of **`800 kg CO2e/ha`**:

*   **Formula:**
    $$\text{Carbon Credits (tCO}_2\text{e)} = \max\left(0, \frac{800 - \text{Predicted Carbon Footprint}}{1000}\right)$$
*   **Logic:**
    *   If your farm's footprint is **less than 800 kg**, you generate positive credits (1 credit = 1 metric tonne of $\text{CO}_2\text{e}$ offset).
    *   If your farm's footprint is **greater than or equal to 800 kg** (e.g., `1642.5 kg`), you produce excess emissions above the baseline and earn **`0.00 tCO2e`** credits.
