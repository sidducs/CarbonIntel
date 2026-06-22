# Soil Data Acquisition Strategy for CarbonIntel

This document presents a research analysis of the available sources for acquiring Karnataka-wide soil nutrient data (SOC, N, P, K, and pH) and recommends the optimal acquisition strategy for the CarbonIntel platform.

---

## 1. Comparative Analysis of Data Sources

To expand CarbonIntel's predictive model beyond Chitradurga, we evaluated four primary data acquisition channels:

| Evaluation Criteria | 1. Soil Health Card Portal | 2. Data.gov.in | 3. AIKosh Portal | 4. Google Research Scraper |
| :--- | :--- | :--- | :--- | :--- |
| **Can raw records be downloaded?** | No (Aggregates & single queries only) | Yes (Selected historical sets) | Yes (Pre-packaged CSVs) | Yes (Extracts raw records) |
| **Is scraping required?** | Yes (For individual rows) | No | No | Yes (Automated) |
| **API availability** | None (Publicly exposed) | Yes (OGD API Platform) | Yes (Under development) | None |
| **Authentication required?** | Captcha (Public) / Login (Admin) | Yes (API Key registration) | Yes (User registration) | No (Uses public lookup) |
| **Estimated record count** | Millions (Full state history) | Thousands (Varies by upload) | 100,000+ | Unlimited (Scalable) |
| **Geographic coverage** | 100% of Karnataka | Variable (District snapshots) | Multi-district representative | 100% of India |
| **Legal usage constraints** | High (Potential TOS/Scraping blocks) | Low (GODL-India Open License) | Low (Research use license) | Medium (TOS risks on output) |

---

## 2. Evaluation of Strategic Options

### Option A: Manual Dataset Downloads
* **Process:** Manually export district-level dashboards or charts from the Soil Health Card Portal (`soilhealth.dac.gov.in`).
* **Pros:** Instantly accessible, zero coding or setup required.
* **Cons:** Exports are highly aggregated (e.g., percentage distribution of nutrients per taluk) rather than raw, survey-level values. This limits model capacity to simple rule-based assessments rather than continuous machine learning predictions.

### Option B: Automated Scraper (e.g., Google Research Scraper)
* **Process:** Run the Python-based `google-research-datasets/india-soil-health-card` crawler.
* **Pros:** Sours granular, row-by-row data for any coordinate or survey number.
* **Cons:** High infrastructure setup (GCP credentials, GCS storage), prone to IP blocks/rate limits due to Captcha protections on the portal. High temporal cost to gather state-wide data.

### Option C: Government Bulk Dataset (Data.gov.in)
* **Process:** Register for an OGD API key and query the agricultural datasets for Karnataka.
* **Pros:** Highly reliable, structured, and legally compliant (GODL-India license).
* **Cons:** Datasets are static, often containing historical reports (several years old), and frequently lack GPS coordinates or village-level granularity.

### Option D: Pre-Compiled Repositories (e.g. Kaggle Academic Exports)
* **Process:** Download pre-compiled, cleaned, and scrubbed datasets (such as the *Soil Nutrient Dataset of Southern Indian States* on Kaggle).
* **Pros:** Legally compliant, immediately downloadable as a single CSV file, contains row-by-row continuous measurements (N, P, K, pH, and OC) across multiple Karnataka districts.
* **Cons:** Limited to the districts and cycles previously targeted by the compilers (does not cover 100% of remote sub-villages).

### Option E: AIKosh Portal Hosted "SHC Dataset"
* **Process:** Install the AIKosh Python SDK and fetch the dataset using its unique platform identifier (`403283a7-2042-4b42-946b-b51babcc58b3`).
  
  **Installation & Usage:**
  ```bash
  pip install aikosh
  ```
  ```python
  import aikosh

  # Authenticate using your AIKosh developer API key
  # (Requires active login credentials on https://aikosh.indiaai.gov.in)
  aikosh.set_api_key("YOUR_KEY")

  # Download the structured SHC dataset metadata package
  aikosh.download({
      "identifier": "403283a7-2042-4b42-946b-b51babcc58b3",
      "type": "dataset",
      "destination_path": "./downloads/dataset"
  })
  ```
* **Pros:** Official hosted dataset under the IndiaAI Mission, easily fetched via automated Python SDK calls.
* **Cons:** **Completely Unsuitable**. While the catalog description claims it covers the Soil Health Card scheme, an audit of the downloaded `SHCDataset.csv` shows it only contains **6 metadata columns** (`computedID`, `plotlatitude`, `plotlongitude`, `stateCode`, `sampleDate`, `testCompletedAt`) and **5,000 rows**. It contains **no chemical soil properties** (SOC, Nitrogen, Phosphorus, Potassium, or pH), rendering it useless for predictive modeling.

---

## 3. Final Recommendation and Ranking

> [!IMPORTANT]
> The fastest and most efficient path to obtain row-level **SOC, Nitrogen, Phosphorus, Potassium, and pH** measurements across multiple Karnataka districts is **Option D (Pre-Compiled Repositories)**. The official **AIKosh Hosted SHC Dataset (Option E)** is currently unusable due to missing features.

### Recommendation Ranking:

1. **RANK 1: Option D (Pre-Compiled Repositories)**
   * *Rationale:* Provides immediate, clean, row-level CSV data containing all required chemical features. A developer can ingest this in less than 30 minutes, allowing rapid calibration of CarbonIntel's machine learning models.
   * *Target Source:* [Kaggle Southern Indian States Soil Nutrient CSV](https://www.kaggle.com/datasets/manojkengalagutti/soil-nutrient-dataset-of-southern-indian-states)

2. **RANK 2: Option C (Government Bulk Dataset via Data.gov.in)**
   * *Rationale:* Cleanest legal alignment. However, finding raw, row-by-row files (instead of aggregations) takes search overhead and may require data restructuring.
   * *Target Source:* [Open Government Data Platform India](https://data.gov.in)

3. **RANK 3: Option A (Manual Dataset Downloads)**
   * *Rationale:* Useful only for validation or setting macro thresholds (e.g., verifying if a predicted soil value falls within a district's historical average), but unsuitable for raw training data.
   * *Target Source:* [Soil Health Card Portal Dashboard](https://soilhealth.dac.gov.in)

4. **RANK 4: Option B (Automated Scraper)**
   * *Rationale:* Should be reserved as a last resort due to high technical debt, maintenance cost, and potential violations of the government site's terms of service.
   * *Target Source:* [Google Research Scraper Codebase](https://github.com/google-research-datasets/india-soil-health-card)

5. **RANK 5: Option E (AIKosh Portal Hosted "SHC Dataset")**
   * *Rationale:* Completely unusable for the current model scope due to missing N, P, K, pH, and OC values.
   * *Target Source:* [AIKosh SHC Dataset](https://aikosh.indiaai.gov.in)
