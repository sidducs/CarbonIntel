# Soil Feature Analysis and Verification Report

This report presents a thorough audit of the features contained within `soil_sample.csv`, clarifying their physical meanings, measurement units, statistical profiles, and observed anomalies.

---

## 1. Feature Map and Physical Meanings

The dataset contains physical and chemical soil properties. Below is the mapping of CarbonIntel's target requirements to the columns present in the raw dataset:

| Target Field | Dataset Column | Parameter | Unit | Physical Meaning & Agricultural Role |
| :--- | :--- | :--- | :--- | :--- |
| **SOC** | `avl_oc` | Available Organic Carbon | `%` (Percent) | Represents the Soil Organic Carbon pool. Key indicator of soil organic matter, structural integrity, biological activity, and carbon sequestration capacity. |
| **Nitrogen (N)** | `avl_n` | Available Nitrogen | `kg/ha` | Nitrogen in forms ready for plant uptake ($NO_3^-$ and $NH_4^+$). Essential for vegetative growth, chlorophyll synthesis, and overall yield. |
| **Phosphorus (P)** | `avl_p` | Available Phosphorus | `kg/ha` | Available phosphate ions ($H_2PO_4^-$). Drives root development, early maturity, and energy transfer (ATP). |
| **Potassium (K)** | `avl_k` | Available Potassium | `kg/ha` | Available potassium ($K^+$). Regulates cellular water balance (stomata), enzyme activation, and disease resistance. |
| **pH** | `ph` | Soil pH | Dimensionless (Log scale) | Defines active acidity or alkalinity. Impacts nutrient solubility, microbiological activity, and overall soil toxicity. |
| **EC** | `ec` | Electrical Conductivity | `dS/m` (deciSiemens/m) | Measures dissolved salts in the soil solution. Primary index of soil salinity, osmotic pressure, and drainage capability. |

---

## 2. Statistical Profile of the Target Features

Calculated from **16,002 non-empty revenue records** within the raw dataset:

| Feature | Valid Records | Missing/Nulls (%) | Minimum | Maximum | Mean | Median | Std. Deviation |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Available OC (`avl_oc`)** | 13,619 | 14.89% | 0.10 | 61.00 | 0.4330 | 0.4200 | 0.5236 |
| **Available Nitrogen (`avl_n`)** | 13,621 | 14.88% | 47.00 | 30,500.00 | 212.9832 | 210.0000 | 262.2032 |
| **Available Phosphorus (`avl_p`)** | 13,621 | 14.88% | 2.86 | 30,123.25 | 31.7437 | 30.7198 | 257.9354 |
| **Available Potassium (`avl_k`)** | 13,621 | 14.88% | 0.00 | 3,037.44 | 262.4890 | 255.3600 | 81.1536 |
| **Soil pH (`ph`)** | 13,613 | 14.93% | 0.01 | 752.00 | 7.7012 | 7.1400 | 20.1620 |
| **Electrical Cond. (`ec`)** | 13,615 | 14.92% | 0.04 | 24.00 | 0.2242 | 0.2000 | 0.4164 |

---

## 3. Data Quality Audit & Observed Anomalies

As the dataset remains in its raw format ("Do NOT clean data"), several laboratory entry errors and physical anomalies have been identified. These must be addressed during the pipeline's feature engineering stage before retraining:

### 3.1. Extreme pH Outliers
* **Anomaly:** Soil pH is chemically restricted to a scale of 0 to 14. However, the raw dataset contains a minimum pH of `0.01` and a maximum pH of `752.00`.
* **Interpretation:** These are typographic errors during manual data entry (e.g., missing decimal points like typing `752` instead of `7.52` or `7.5`). 
* **Remediation Recommendation:** Values outside $[3.5, 10.5]$ should be filtered, imputed, or scaled (e.g., dividing values between 35 and 105 by 10).

### 3.2. Extreme Macronutrient Outliers
* **Anomaly:** Maximum values for Available Nitrogen (`30,500.00` kg/ha) and Available Phosphorus (`30,123.25` kg/ha) are agronomically impossible (normal range is typically $<1,000$ kg/ha).
* **Interpretation:** High values represent data logging anomalies, sensor calibration failures, or unit mismatches in laboratory reports.
* **Remediation Recommendation:** Apply robust capping (e.g., clipping at the 99th percentile or setting a hard ceiling based on typical region-specific crop tolerance values).

### 3.3. Missing and Null Values
* **Anomaly:** Approximately 14.9% of values across all target features are blank, labeled as `N/A`, or contain non-numeric characters.
* **Remediation Recommendation:** Use spatial administrative imputation (imputing based on median values of the specific revenue `villagename` or `hobli`) or standard median imputation prior to ingestion.

### 3.4. Organic Carbon Distribution
* **Anomaly:** The median Available OC is `0.4200%`, showing low carbon reserves typical of dry, sandy soils in Challakere. The maximum of `61.0%` indicates compost/peat-heavy soil profiles or testing/reporting typos.
* **Remediation Recommendation:** Logarithmic transformations may be necessary due to the positive skewness of the underlying distributions.
