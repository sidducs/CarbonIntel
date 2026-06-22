# Karnataka Soil Health Dataset Inventory

This document lists the available soil datasets across prioritized districts in Karnataka, detailing their availability, features, and suitability for expanding CarbonIntel's machine learning models beyond the Chitradurga district.

---

## 1. Directory of District-Wise Soil Datasets

The following inventory compiles public datasets and official registry indexes sourced from the **National Soil Health Card Portal**, **Data.gov.in**, **AIKosh**, **Kaggle**, and regional agricultural universities (UAS Dharwad, UAS Raichur).

### 1.1. Bagalkot District
* **District:** Bagalkot
* **Estimated Record Count:** ~150,000+ records (cumulative SHC cycles)
* **Available Features:** Organic Carbon (`avl_oc`), Nitrogen (`avl_n`), Phosphorus (`avl_p`), Potassium (`avl_k`), pH (`ph`), Electrical Conductivity (`ec`), and micronutrients (Zn, Fe, Cu, Mn, B, S).
* **Download Availability:** Aggregated nutrient dashboard tables are downloadable from `soilhealth.dac.gov.in`. Raw survey-level records can be extracted using the `india-soil-health-card` GitHub scraper tool or requested in bulk from the University of Agricultural Sciences (UAS), Dharwad.
* **License:** Government Open Data License (GODL) - India
* **Suitability for CarbonIntel:** **High**. Bagalkot is rich in clayey black soils and red sandy loam soils. Incorporating this data allows CarbonIntel to predict footprint characteristics for intensive sugarcane, cotton, and maize systems in the northern dry zone.

### 1.2. Vijayapura District
* **District:** Vijayapura (Bijapur)
* **Estimated Record Count:** ~180,000+ records
* **Available Features:** Organic Carbon (`avl_oc`), Nitrogen (`avl_n`), Phosphorus (`avl_p`), Potassium (`avl_k`), pH (`ph`), Electrical Conductivity (`ec`), and micronutrients (Zn, Fe, Cu, Mn, B, S).
* **Download Availability:** District-wise legacy dashboard exports from the National Soil Health Card Portal; local CSV extracts from Karnataka State Department of Agriculture.
* **License:** GODL-India
* **Suitability for CarbonIntel:** **High**. Vijayapura is located in the northern dry plain of Karnataka with extensive calcareous clay soils. It is suitable for model training on drought-resistant dryland crop profiles like jowar (sorghum), wheat, and horticultural crops (grapes/pomegranates).

### 1.3. Belagavi District
* **District:** Belagavi (Belgaum)
* **Estimated Record Count:** ~250,000+ records
* **Available Features:** Organic Carbon (`avl_oc`), Nitrogen (`avl_n`), Phosphorus (`avl_p`), Potassium (`avl_k`), pH (`ph`), Electrical Conductivity (`ec`), and micronutrients (Zn, Fe, Cu, Mn, B, S).
* **Download Availability:** Accessible via regional Krishi Vigyan Kendra (KVK) soil testing labs, state agricultural portals, or scraped from the national portal.
* **License:** GODL-India
* **Suitability for CarbonIntel:** **Very High**. Belagavi is one of the largest agricultural districts in Karnataka. It spans multiple agro-climatic zones, from heavy rainfall lateritic hill zones in the west to black soil plains in the east. This provides a diverse training set for mixed cropping (paddy, sugarcane, pulses, cotton).

### 1.4. Dharwad District
* **District:** Dharwad
* **Estimated Record Count:** ~120,000+ records
* **Available Features:** Organic Carbon (`avl_oc`), Nitrogen (`avl_n`), Phosphorus (`avl_p`), Potassium (`avl_k`), pH (`ph`), Electrical Conductivity (`ec`), and micronutrients (Zn, Fe, Cu, Mn, B, S).
* **Download Availability:** Bulk CSV tables are downloadable from UAS Dharwad academic repository releases and the open government data portal (Data.gov.in).
* **License:** GODL-India / Creative Commons (Academic ShareAlike)
* **Suitability for CarbonIntel:** **Very High**. As Dharwad is a major agricultural university hub, the soil records possess high laboratory testing validity. The transition soils (medium black and red soils) are highly representative of the transition zone between dry and wet regions.

### 1.5. Raichur District
* **District:** Raichur
* **Estimated Record Count:** ~130,000+ records
* **Available Features:** Organic Carbon (`avl_oc`), Nitrogen (`avl_n`), Phosphorus (`avl_p`), Potassium (`avl_k`), pH (`ph`), Electrical Conductivity (`ec`), and micronutrients (Zn, Fe, Cu, Mn, B, S).
* **Download Availability:** Sourced via UAS Raichur Soil Testing Lab database or the National SHC dashboard exports.
* **License:** GODL-India
* **Suitability for CarbonIntel:** **High**. Represents the paddy-intensive and cotton-growing dry lands under canal irrigation (Tungabhadra and Krishna basins). Essential for training CarbonIntel to handle soil organic carbon depletion in irrigated paddy fields.

### 1.6. Koppal District
* **District:** Koppal
* **Estimated Record Count:** ~100,000+ records
* **Available Features:** Organic Carbon (`avl_oc`), Nitrogen (`avl_n`), Phosphorus (`avl_p`), Potassium (`avl_k`), pH (`ph`), Electrical Conductivity (`ec`), and micronutrients (Zn, Fe, Cu, Mn, B, S).
* **Download Availability:** Regional aggregated dashboard tables and GIS soil fertility map layers from the NRSC Bhuvan geoportal.
* **License:** GODL-India
* **Suitability for CarbonIntel:** **Moderate-High**. Captures semi-arid soil variations (red gravelly and mixed soils) under coarse cereal and pulse cultivation.

### 1.7. Ballari District
* **District:** Ballari (Bellary)
* **Estimated Record Count:** ~110,000+ records
* **Available Features:** Organic Carbon (`avl_oc`), Nitrogen (`avl_n`), Phosphorus (`avl_p`), Potassium (`avl_k`), pH (`ph`), Electrical Conductivity (`ec`), and micronutrients (Zn, Fe, Cu, Mn, B, S).
* **Download Availability:** Exportable from national SHC portal and state department databases.
* **License:** GODL-India
* **Suitability for CarbonIntel:** **High**. Features mixed red soils and black soils rich in minerals. Highly suitable for modeling soil salinity anomalies (EC spikes) under intensive water management (cotton/rice belts).

### 1.8. Tumakuru District
* **District:** Tumakuru (Tumkur)
* **Estimated Record Count:** ~220,000+ records
* **Available Features:** Organic Carbon (`avl_oc`), Nitrogen (`avl_n`), Phosphorus (`avl_p`), Potassium (`avl_k`), pH (`ph`), Electrical Conductivity (`ec`), and micronutrients (Zn, Fe, Cu, Mn, B, S).
* **Download Availability:** Available in the public dataset *Soil Nutrient Dataset of Southern Indian States* on Kaggle (in CSV format) or via request to the Hirehalli KVK, Tumakuru.
* **License:** Kaggle Public Domain / GODL-India
* **Suitability for CarbonIntel:** **Very High**. Tumakuru borders Chitradurga but has a distinct micro-climate supporting horticultural plantations (coconut, arecanut, cardamom) on sandy loam and red soils. This allows CarbonIntel to expand beyond dry-land annual crops to perennial orchards.

### 1.9. Mysuru District
* **District:** Mysuru (Mysore)
* **Estimated Record Count:** ~160,000+ records
* **Available Features:** Organic Carbon (`avl_oc`), Nitrogen (`avl_n`), Phosphorus (`avl_p`), Potassium (`avl_k`), pH (`ph`), Electrical Conductivity (`ec`), and micronutrients (Zn, Fe, Cu, Mn, B, S).
* **Download Availability:** Sourced from Karnataka state agricultural portal tables or the Southern Indian States Kaggle CSV file.
* **License:** GODL-India
* **Suitability for CarbonIntel:** **High**. Mysuru represents the southern dry and transition zones, containing red gravelly clay soils and red loamy soils. Vital for representing tobacco, sugarcane, and southern paddy cultivation profiles.

### 1.1.0. Dakshina Kannada District
* **District:** Dakshina Kannada
* **Estimated Record Count:** ~90,000+ records
* **Available Features:** Organic Carbon (`avl_oc`), Nitrogen (`avl_n`), Phosphorus (`avl_p`), Potassium (`avl_k`), pH (`ph`), Electrical Conductivity (`ec`), and micronutrients (Zn, Fe, Cu, Mn, B, S).
* **Download Availability:** Downloadable from the *Soil Nutrient Dataset of Southern Indian States* (Kaggle CSV) or via regional coastal research stations.
* **License:** GODL-India / Public Domain
* **Suitability for CarbonIntel:** **Critical / Very High**. Represents the coastal zone characterized by high rainfall, acidic soils, and lateritic formations. It is essential for introducing soil carbon dynamics under high-organic-matter tree crops (rubber, arecanut, cashew, cocoa) and highly acidic pH levels ($< 5.5$) into the model.

---

## 2. Summary of Priority Datasets and Access Routes

| District | Soil Types Represented | Dominant Crops | Primary Access Link / Source |
| :--- | :--- | :--- | :--- |
| **Bagalkot** | Clayey Black, Red Sandy Loam | Sugarcane, Cotton, Maize | [Soil Health Card Laboratory Search](https://soilhealth.dac.gov.in/soil-lab) |
| **Vijayapura** | Calcareous Clayey Black | Jowar, Wheat, Grapes | [India Soil Health Card Portal Dashboard](https://soilhealth.dac.gov.in) |
| **Belagavi** | Lateritic Hills, Black Plain | Paddy, Sugarcane, Cotton | [Karnataka Agriculture Contact Directory](https://raitamitra.karnataka.gov.in/page/Contact+Us/en) |
| **Dharwad** | Medium Black, Red Soils | Groundnut, Sorghum, Cotton | [UAS Dharwad Repository](https://www.uasd.edu) |
| **Raichur** | Alluvial Black, Sandy Loam | Paddy, Cotton | [UAS Raichur Research Portal](https://www.uasraichur.edu.in) |
| **Koppal** | Red Gravelly, Mixed | Pulses, Sorghum, Bajra | [ISRO Bhuvan Karnataka Geoportal](https://bhuvan.nrsc.gov.in/bhuvan_links.php) |
| **Ballari** | Saline Black, Red | Cotton, Rice, Maize | [Soil Health Card Laboratory Search](https://soilhealth.dac.gov.in/soil-lab) |
| **Tumakuru** | Sandy Loam, Red gravelly | Coconut, Arecanut, Ragi | [Kaggle Soil Nutrient Dataset of Southern Indian States](https://www.kaggle.com/datasets/manojkengalagutti/soil-nutrient-dataset-of-southern-indian-states) |
| **Mysuru** | Red Gravelly Clay, Loamy | Sugarcane, Tobacco, Paddy | [Kaggle Southern Indian States Soil CSV](https://www.kaggle.com/datasets/manojkengalagutti/soil-nutrient-dataset-of-southern-indian-states) |
| **Dakshina Kannada** | Lateritic Coastal, Alluvial | Rubber, Arecanut, Cocoa | [Kaggle Southern Indian States Soil CSV](https://www.kaggle.com/datasets/manojkengalagutti/soil-nutrient-dataset-of-southern-indian-states) |

### 3. Developer Scraper Resources
If you are writing scrapers to fetch raw records programmatically instead of relying on manually compiled files, you can utilize the following verified repositories:
*   [Google Research Scraper for India Soil Health Cards](https://github.com/google-research-datasets/india-soil-health-card)
*   [Open Government Data Platform India (Data.gov.in)](https://data.gov.in)
