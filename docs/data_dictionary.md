# Data Dictionary

This document defines the schema, units, ranges, and analytical significance of the parameters used in the CarbonIntel platform.

---

## Features Reference

### 1. Crop_Type
* **Definition**: The species of crop cultivated during the agricultural cycle.
* **Unit**: Categorical.
* **Range**: `Rice`, `Wheat`, `Sugarcane`, `Cotton`, `Maize`.
* **Source**: User Input (Prediction Form).
* **Importance**: **Critical**. Different crops have distinct baseline biological processes (e.g., anaerobic fermentation in flooded rice paddies releases substantial methane, a highly potent GHG).

### 2. SOC (Soil Organic Carbon)
* **Definition**: The carbon component of soil organic matter, representing soil fertility and organic health.
* **Unit**: Percentage (`%` of dry weight).
* **Range**: `0.5%` to `5.0%`.
* **Source**: User Input / Soil Testing Report.
* **Importance**: **High**. Actively represents carbon sequestration capacity. Higher SOC levels act as a negative emission modifier (carbon sink), offsetting fertilizer emissions.

### 3. N_Content (Nitrogen)
* **Definition**: Available mineral nitrogen present in the soil.
* **Unit**: mg/kg (milligrams per kilogram of soil).
* **Range**: `10` to `200` mg/kg.
* **Source**: Soil chemistry report.
* **Importance**: **Medium**. Indicates base soil fertility. Interacts with added nitrogenous fertilizers to determine soil-atmosphere nitrous oxide ($N_2O$) emissions.

### 4. P_Content (Phosphorus)
* **Definition**: Available phosphorus present in the soil.
* **Unit**: mg/kg.
* **Range**: `5` to `100` mg/kg.
* **Source**: Soil chemistry report.
* **Importance**: **Medium**. Required for energy transfer in crops. Excess application can lead to run-off, though it has minor direct greenhouse gas impacts compared to Nitrogen.

### 5. K_Content (Potassium)
* **Definition**: Available potassium present in the soil.
* **Unit**: mg/kg.
* **Range**: `10` to `150` mg/kg.
* **Source**: Soil chemistry report.
* **Importance**: **Low-Medium**. Encourages strong root structures and water stress tolerance, acting as a minor sink stabilizer.

### 6. pH (Soil pH)
* **Definition**: Negative logarithm of hydrogen ion concentration, measuring soil acidity or alkalinity.
* **Unit**: pH scale (logarithmic).
* **Range**: `4.5` to `8.5`.
* **Source**: Soil test pH sensor.
* **Importance**: **Medium**. Regulates microbial activity. Acidity/alkalinity extremes modify nitrogen mineralization speed and subsequent volatilization rates.

### 7. Fertilizer_Type
* **Definition**: Main chemical composition of the supplementary nutrients applied to the field.
* **Unit**: Categorical.
* **Range**: `Urea` (high nitrogen), `DAP` (nitrogen/phosphorus), `MOP` (potassium), `None`.
* **Source**: Farmer logs.
* **Importance**: **Critical**. Dictates direct emission multipliers. Nitrogen-heavy fertilizers (Urea) release significant amounts of $CO_2$ during synthesis and $N_2O$ upon soil application.

### 8. Fertilizer_Amount
* **Definition**: Total amount of chemical fertilizer applied per unit area.
* **Unit**: kg/ha (kilograms per hectare).
* **Range**: `0` to `500` kg/ha. (Forced to `0` if `Fertilizer_Type` is `None`).
* **Source**: Farmer application logs.
* **Importance**: **Critical**. Directly proportional to nitrous oxide release. Over-fertilization represents the primary source of controllable agricultural emissions.

### 9. Temperature
* **Definition**: Average atmospheric temperature during the growing season.
* **Unit**: Degrees Celsius (`°C`).
* **Range**: `10°C` to `38°C`.
* **Source**: Weather Integration API (Open-Meteo forecast or NASA POWER history).
* **Importance**: **Medium**. Higher temperatures accelerate soil microbial respiration and decomposition of organic matter, increasing $CO_2$ soil venting.

### 10. Rainfall
* **Definition**: Total cumulative annual precipitation received at the location.
* **Unit**: mm/year.
* **Range**: `200` to `2000` mm/year.
* **Source**: Weather Integration API.
* **Importance**: **High**. Regulates soil moisture. High moisture causes soil saturation, leading to anaerobic conditions that accelerate methane ($CH_4$) and nitrous oxide ($N_2O$) emissions.

### 11. Humidity
* **Definition**: Average relative atmospheric humidity during the cultivation period.
* **Unit**: Percentage (`%`).
* **Range**: `30%` to `90%`.
* **Source**: Weather Integration API.
* **Importance**: **Medium**. Interacts with temperature to regulate plant transpiration and evapotranspiration indices.

---

## Target Variable Reference

### 12. Carbon_Footprint (Target)
* **Definition**: Net greenhouse gas emissions or offsets resulting from cultivation, expressed in carbon dioxide equivalents.
* **Unit**: kg CO₂e/ha (kilograms of carbon dioxide equivalent per hectare).
* **Range**: `-100` to `2200` kg CO₂e/ha.
* **Formula / Thresholds**:
  * **Negative values** signify carbon sequestration (net sink).
  * **High Sustainability**: $< 400\text{ kg CO}_2\text{e/ha}$.
  * **Medium Sustainability**: $400 - 1200\text{ kg CO}_2\text{e/ha}$.
  * **Low Sustainability**: $> 1200\text{ kg CO}_2\text{e/ha}$.
