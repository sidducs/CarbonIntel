# 🧪 CarbonIntel Input Parameters Guide

This document explains why every input parameter is used in the CarbonIntel project, its scientific purpose, and how it contributes to the machine learning model and recommendations.

---

### 1. Soil Test Parameters

| Input Parameter | Why It Is Used (Scientific Reason) | What Use It Has in the Model | How It Helps the Project |
| :--- | :--- | :--- | :--- |
| **Soil Organic Carbon (SOC %)** | SOC represents the amount of carbon stored in the soil. Healthy soil acts as a **carbon sink**, pulling carbon out of the atmosphere. | It acts as a **subtractor** (sink) in the carbon footprint calculation. Higher SOC reduces the net carbon footprint. | Helps estimate **Carbon Credits**. Improving SOC is key to showing carbon reduction and earning credits. |
| **Available Nitrogen (N)** | Nitrogen is the primary nutrient for plant growth, but excess nitrogen in soil leads to high **nitrification/denitrification** rates, emitting $\text{N}_2\text{O}$ (a potent greenhouse gas). | It correlates directly with nitrous oxide emission risks. | Helps the recommendation engine suggest if fertilizer rates should be reduced to prevent soil overload. |
| **Phosphorus (P) & Potassium (K)** | Essential soil macronutrients. High or deficient levels affect plant health, root development, and crop yield. | They determine the soil nutrient balance. Deficiency increases crop stress, lowering carbon absorption. | Helps calculate target fertilizer ratios (NPK ratios) and identifies soil depletion. |
| **Soil pH** | Measures soil acidity or alkalinity. pH heavily influences microbial activity and how plants absorb nutrients. | Extreme pH levels (too acidic or alkaline) stress the crop and increase emissions. The model penalizes footprints when pH deviates from the optimal neutral range ($6.5 - 7.0$). | Helps recommend soil amendments (like adding lime to acidic soils or gypsum to alkaline soils) to optimize nutrient intake. |

---

### 2. Fertilizer Parameters

| Input Parameter | Why It Is Used (Scientific Reason) | What Use It Has in the Model | How It Helps the Project |
| :--- | :--- | :--- | :--- |
| **Fertilizer Type** | Different fertilizers have different **emission factors**. Synthetic fertilizers (like Urea) release huge amounts of $\text{CO}_2$ during manufacturing and $\text{N}_2\text{O}$ upon soil application. Organic fertilizers (manure/compost) have much lower emissions. | Categorical feature that applies the appropriate emission multiplier (e.g., Urea has a high factor of $2.3$, Organic has a low factor of $0.4$). | Helps the simulator show the carbon-saving benefit of shifting from synthetic to organic fertilizers. |
| **Fertilizer Amount (kg/ha)** | The volume applied determines the quantity of chemical compounds entering the soil. | Acts as a direct linear multiplier for agricultural emissions. | Allows the farmer to find the "tipping point" where increasing fertilizer no longer improves yield but drastically degrades sustainability. |

---

### 3. Weather Parameters (NASA POWER API)

| Input Parameter | Why It Is Used (Scientific Reason) | What Use It Has in the Model | How It Helps the Project |
| :--- | :--- | :--- | :--- |
| **Temperature (°C)** | Temperature controls the rate of chemical reactions in the soil and evapotranspiration. Higher temperatures increase soil microbial activity, leading to faster carbon loss. | Used by the model to scale soil respiration rates and fertilizer volatilization. | Helps adjust crop-specific recommendations based on seasonal heat risks. |
| **Rainfall (mm)** | Water creates aerobic or anaerobic soil conditions. Flooded soils (anaerobic) release methane ($\text{CH}_4$), while dry soils release less gas but stress the crop. | Direct input to estimate soil moisture levels. Optimal rainfall supports plant growth (sink); extreme rainfall causes runoff and emissions. | Determines if the crop choice is suitable for the local water profile (e.g., advising against high-water Rice in low-rainfall zones). |
| **Humidity (%)** | Humidity affects the evaporation rate of fertilizers (especially ammonia volatilization from Urea) and crop transpiration. | Acts as an environmental coefficient in the footprint algorithm. | Helps schedule fertilizer application timings to avoid gas loss to the atmosphere. |

---

### 4. Crop Type

| Input Parameter | Why It Is Used (Scientific Reason) | What Use It Has in the Model | How It Helps the Project |
| :--- | :--- | :--- | :--- |
| **Crop Type** *(Rice, Wheat, Corn, Soybeans, Vegetables)* | Different crops have completely different carbon profiles. For example, flooded Rice produces methane ($\text{CH}_4$), while Soybeans (legumes) naturally fix nitrogen in the soil and require less fertilizer. | Applies a baseline emission factor and controls fertilizer sensitivity in the ML model. | Suggests **crop rotation** (e.g., planting Soybeans to naturally replenish Nitrogen, reducing the need for chemical fertilizers). |

---

### 💡 Summary: How This Helps the Project Overall

By combining these four categories (Soil, Fertilizer, Weather, Crop), the model moves away from generic, simplified calculations and becomes a **dynamic, location-specific intelligence tool**.

Instead of just telling a farmer "fertilizer is bad," the project uses these inputs to say:
> *"Because your **Tumakuru** soil has a low **SOC of 0.5%** and your **pH is 5.5**, applying **Urea** under a cumulative rainfall of **690mm** will result in **low sustainability**. Shift to **Organic fertilizer** and add **legumes** to raise your score and earn **0.35 Carbon Credits**."*
