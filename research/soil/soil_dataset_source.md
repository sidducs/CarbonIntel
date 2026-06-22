# Soil Health Card Dataset Source Information

This document details the source, licensing, metadata, and collection parameters of the real-world soil health dataset acquired for the retraining and calibration of the CarbonIntel machine learning models.

---

## 1. Dataset Overview

* **Dataset Name:** National Food Security Mission (NFSM) Soil Health Card Dataset
* **Acquisition URL:** `https://raw.githubusercontent.com/Raghavendramy09/crop-recommendation/main/Cleaned_NFSM_Dataset.csv`
* **Upstream Source:** Indian National Food Security Mission (NFSM), Department of Agriculture & Farmers Welfare, Ministry of Agriculture & Farmers Welfare, Government of India.
* **Geographic Coverage:** Challakere Taluk, Kasaba Hobli, Chitradurga District, Karnataka, State of India.
* **Total Dataset Size:** 17,784 raw CSV lines.
* **Non-Empty Record Count:** 16,002 rows of physical soil sample reports.

---

## 2. Source Context and Project Origin

The dataset was compiled from open agricultural records under the **National Food Security Mission (NFSM)**, a Centrally Sponsored Scheme of the Government of India launched in 2007. The mission regularly performs grid-based soil sampling across agricultural zones to issue **Soil Health Cards (SHC)** to farmers. 

These cards report the chemical state of the soil (Macronutrients, Micronutrients, pH, and Electrical Conductivity) and suggest fertilizer dosages and crop choices.

This specific sub-dataset is an extract focusing on Challakere Taluk in Chitradurga, Karnataka, which features semi-arid soil profiles suitable for crops like groundnut, finger millet (ragi), bajra, cotton, and oilseeds.

---

## 3. License and Usage Terms

* **License Type:** Government Open Data License (GODL) - India
* **Access Policy:** Open Access / Public Domain
* **Usage Permissions:**
  * **Share:** Copy and redistribute the material in any medium or format.
  * **Adapt:** Remix, transform, and build upon the material for any purpose, including commercial applications.
* **Attribution Requirement:** Users must acknowledge the provider of the data (Ministry of Agriculture and Farmers Welfare, Govt of India) as the source of the data.
* **Integrity Assertion:** The dataset has been copied and archived in its **raw, unmodified state** in accordance with project constraints to maintain historical anomalies and avoid premature cleaning before feature engineering steps.

---

## 4. Metadata Details

| Field | Description | Type / Format |
|---|---|---|
| `taluku` | Sub-district administrative division (Challakere) | String |
| `hobli` | Sub-district cluster of villages (Kasaba) | String |
| `villagename` | Revenue village name where the sample was collected | String |
| `surveyno` / `surnoc` / `hissano` | Cadastral land registry identification codes | Alphanumeric |
| `soilsampleid` | Unique ID of the physical soil health card report | String |
| `latitude` / `longitude` | Coordinates of the sample collection point | Numeric (WGS84) |
| `soiltype` | Local soil classification (e.g., Red loamy, Black cotton) | String |
| `scheme` | Government funding/mission scheme (e.g., NFSM) | String |
| `farmers_name` | Name of the landowner (for validation/consent verification) | String |
| `syncdate` | Date and timestamp of laboratory data sync | Date |
