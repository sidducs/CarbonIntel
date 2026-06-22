# Machine Learning Pipeline Documentation

This document provides a comprehensive overview of the CarbonIntel machine learning pipeline, covering data generation, model compilation, evaluation, and inference.

---

## 1. Dataset Generation & Schema

The current pipeline is trained on a robust synthetic dataset that simulates realistic agricultural characteristics.

### Dataset Generation Rules (`src/data_generator.py`)
* **Crop Types**: Sugarcane, Cotton, Wheat, Rice, Maize.
* **Fertilizer Types**: Urea, DAP, MOP, None.
* **Baseline Carbon Formula**: Net emissions are modeled based on agricultural chemistry:
  * **Rice (Wetlands)**: High methane baseline emissions ($\sim 1200\text{ kg CO}_2\text{e/ha}$).
  * **Fertilizer Emissive Factor**: High DAP/Urea amounts increase emissions linearly, scaled by moisture (Rainfall/Humidity).
  * **Soil Carbon Sink**: Higher Soil Organic Carbon (SOC) acts as a carbon sink, reducing net footprint.
  * **Potassium (K)**: Associated with resilient crop root structure, acting as a minor sink.

### Dataset Feature Schema
| Variable | Type | Range / Options | Role |
| :--- | :--- | :--- | :--- |
| **Crop_Type** | Categorical | Rice, Wheat, Sugarcane, Cotton, Maize | Feature |
| **SOC** | Numerical | 0.5% - 5.0% | Feature |
| **N_Content** | Numerical | 10 - 200 mg/kg | Feature |
| **P_Content** | Numerical | 5 - 100 mg/kg | Feature |
| **K_Content** | Numerical | 10 - 150 mg/kg | Feature |
| **pH** | Numerical | 4.5 - 8.5 | Feature |
| **Fertilizer_Type**| Categorical | Urea, DAP, MOP, None | Feature |
| **Fertilizer_Amount**| Numerical | 0 - 500 kg/ha | Feature |
| **Temperature** | Numerical | 10°C - 38°C | Feature |
| **Rainfall** | Numerical | 200 - 2000 mm/year | Feature |
| **Humidity** | Numerical | 30% - 90% | Feature |
| **Carbon_Footprint**| Numerical | -100 to 2200 kg CO₂e/ha | **Target** |

---

## 2. Preprocessing & Split

The preprocessing stage prepares the raw tabular features for regression modeling:

1. **Train/Test Split**:
   * Split ratio: 80% Training (`data/train.csv`), 20% Validation (`data/test.csv`).
2. **Column Transformations**:
   * **Numerical Columns**: Scaled using standard z-score normalization (`StandardScaler`).
   * **Categorical Columns**: Encoded using One-Hot Encoding (`OneHotEncoder`) with unknown values ignored.

---

## 3. Model Training & Comparison

The pipeline trains and evaluates three different classes of regression algorithms:

1. **Linear Regression (Baseline)**: Matches linear emission factors but struggles with complex interaction multipliers (e.g., rainfall-fertilizer interactions).
2. **Random Forest Regressor**: Ensembles multiple decision trees to capture non-linear relationships.
3. **XGBoost Regressor**: Gradient-boosted decision trees optimizing loss iteratively.

### Performance Metrics Comparison
Typical baseline training evaluations yield the following metrics:

| Model | MAE (kg CO₂e/ha) | RMSE (kg CO₂e/ha) | R² Score |
| :--- | :--- | :--- | :--- |
| **Linear Regression** | $\approx 96.5$ | $\approx 124.0$ | $\approx 0.885$ |
| **Random Forest** | $\approx 28.3$ | $\approx 38.5$ | $\approx 0.988$ |
| **XGBoost (Tuned)** | $\approx \mathbf{14.8}$ | $\approx \mathbf{21.2}$ | $\approx \mathbf{0.996}$ |

---

## 4. Hyperparameter Tuning & Cross-Validation

Hyperparameter tuning is performed on the best baseline model (typically **XGBoost**) using `GridSearchCV` with 3-fold cross-validation:

```python
# Hyperparameters optimized for XGBoost
param_grid = {
    'regressor__n_estimators': [100, 200, 300],
    'regressor__max_depth': [4, 5, 6],
    'regressor__learning_rate': [0.03, 0.07, 0.1],
    'regressor__subsample': [0.8, 1.0]
}
```

---

## 5. Feature Importance Analysis

Feature importance analysis extracted from the tuned ensemble model reveals the primary drivers of agricultural carbon footprints:

```text
1. Crop_Type_Rice          ██████████████████████████████  (High methane baseline)
2. Fertilizer_Amount       ████████████████████            (Emissions from nitrogenous inputs)
3. SOC                     ██████████████                  (Soil organic carbon sink)
4. Fertilizer_Type_None    ██████████                      (Low emission baseline flag)
5. Rainfall / Temperature  ███████                         (Weather interactive factors)
```

---

## 6. Limitations & Future Plan

* **Synthetic Data Limitations**: The model is trained on simulation rules rather than empirical field telemetry.
* **Missing Carbon Offsets**: Does not account for specific agroforestry sequestration or cover crop dynamics.
* **Retraining Roadmap**: Future milestones include replacing synthetic generation weights with empirical soil core samples and verified regional emission constants.
