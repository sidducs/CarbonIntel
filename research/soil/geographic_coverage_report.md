# Soil Dataset Geographic Coverage and Suitability Report

This report evaluates the representativeness, geographic coverage, and machine learning suitability of the acquired soil dataset (`soil_sample.csv`) for the CarbonIntel platform.

---

## 1. Geographic Coverage Analysis

Based on the raw data audit of the **16,002 non-empty revenue records**, the administrative hierarchy and geographic boundaries are structured as follows:

### 1.1. Administrative Summary
* **State Coverage:** Karnataka (100% of the dataset)
* **Number of Districts:** 1 (Chitradurga District)
* **Number of Taluks:** 6 unique taluks
  * Covered taluks: *Challakere, Chitradurga, Hiriyur (Hiriyuru), Holalkere, Hosadurga, Molakalmuru*
* **Number of Hoblis:** 24 unique hobli administrations (e.g., *Kasaba, Parashurampura, Naikanahatti, Aimangala, Dharmapura, Turuvanuru, Mattodu*)
* **Number of Villages:** 233 unique revenue villages (e.g., *Abbinahole, Agasanahalli, Alagavadi, Chikkamadure, Devara Marikunte*)

---

## 2. Dataset Suitability Assessment

To evaluate if the dataset can support various geographical scopes for machine learning models, we analyze it across four distinct levels:

### 2.1. Village-Level Model
* **Suitability:** **High (Restricted)**
* **Evaluation:** The dataset has dense clusters of records per village (e.g., multiple survey numbers and plots within the same village). It is highly suitable for predicting carbon footprints and crop sustainability in the specific 233 covered villages. However, it will not generalize to any village outside this set without geographic coordinate interpolation.

### 2.2. Taluk-Level Model
* **Suitability:** **Very High**
* **Evaluation:** The dataset fully represents all 6 taluks of the Chitradurga district. Model performance at the taluk level will be highly robust within these zones, as the sample count is sufficient to capture sub-district variations in agricultural practices and soil types.

### 2.3. District-Level Model
* **Suitability:** **High (Chitradurga only)**
* **Evaluation:** The dataset provides complete coverage of the Chitradurga district. A model trained on this dataset will be highly representative of Chitradurga's overall soil chemistry. However, it cannot be used as a general "District-Level Model" for other districts in Karnataka due to severe selection bias.

### 2.4. Karnataka-Wide Model
* **Suitability:** **Low**
* **Evaluation:** While the data is geographically located in Karnataka, it is entirely concentrated within one district (Chitradurga) in the central dry zone. It lacks representation of Karnataka's other agro-climatic zones, such as:
  * The humid coastal soils of Uttara Kannada, Udupi, and Dakshina Kannada.
  * The acidic laterite soils of the Western Ghats (Kodagu, Chikkamagaluru).
  * The northern alluvial and deep black cotton soil belts (Belagavi, Vijayapura, Bagalkote).
  Training a statewide model on this data will result in poor generalization and high validation error when predicting outside the central dry zone.

---

## 3. CarbonIntel Target Feature Availability

We audited the dataset for the presence of the primary soil features required by the CarbonIntel prediction pipeline:

| Required Feature | Dataset Column | Records Available | Missing/Null Records | Availability (%) | Status |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **SOC / Organic Carbon** | `avl_oc` | 13,621 | 2,381 | 85.12% | **Available** |
| **Nitrogen (N)** | `avl_n` | 13,621 | 2,381 | 85.12% | **Available** |
| **Phosphorus (P)** | `avl_p` | 13,621 | 2,381 | 85.12% | **Available** |
| **Potassium (K)** | `avl_k` | 13,621 | 2,381 | 85.12% | **Available** |
| **pH** | `ph` | 13,621 | 2,381 | 85.12% | **Available** |

### 3.1. Analysis of Missing Values
* All five core features share an identical availability rate of **85.12%** (with exactly 2,381 missing records).
* This indicates that missing entries are due to incomplete laboratory reports (e.g., records marked as "Pending" in `labstatus` where no chemical tests have been completed yet), rather than sporadic missing values for individual parameters.
* **No key CarbonIntel soil features are completely missing from the dataset structure.**
