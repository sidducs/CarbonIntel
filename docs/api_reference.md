# API Reference Documentation

This document describes the endpoints, validation constraints, and response schemas of the FastAPI prediction server.

---

## Service Host Configuration
* **Default Local Base URL**: `http://127.0.0.1:8000`
* **Port bindings**: Configurable via the Uvicorn command runner.

---

## 1. GET `/`

Returns the API service operational status and the allowable categorical variables (crops and fertilizers) matching the trained model pipeline metadata.

### Request Example
```bash
curl -X GET http://127.0.0.1:8000/
```

### Response Example (`200 OK`)
```json
{
  "status": "online",
  "api_name": "Agricultural Carbon Footprint API",
  "model_version": "1.0.0",
  "allowed_values": {
    "Crop_Type": [
      "Cotton",
      "Maize",
      "Rice",
      "Sugarcane",
      "Wheat"
    ],
    "Fertilizer_Type": [
      "DAP",
      "MOP",
      "None",
      "Urea"
    ]
  }
}
```

---

## 2. POST `/predict`

Predicts the net farm carbon footprint and returns the corresponding sustainability classification rating.

### Request Body Schema
| Parameter | Type | Validation Constraint | Description |
| :--- | :--- | :--- | :--- |
| **Crop_Type** | String | Must be in `Crop_Type` metadata list | E.g. `"Rice"` |
| **SOC** | Float | $\ge 0.5$, $\le 5.0$ | Soil Organic Carbon (%) |
| **N_Content** | Float | $\ge 10$, $\le 200$ | Nitrogen (mg/kg) |
| **P_Content** | Float | $\ge 5$, $\le 100$ | Phosphorus (mg/kg) |
| **K_Content** | Float | $\ge 10$, $\le 150$ | Potassium (mg/kg) |
| **pH** | Float | $\ge 4.5$, $\le 8.5$ | Soil acidity value |
| **Fertilizer_Type**| String | Must be in `Fertilizer_Type` list | E.g. `"Urea"` |
| **Fertilizer_Amount**| Float | $\ge 0$, $\le 500$ | Fertilizer quantity (kg/ha) |
| **Temperature** | Float | $\ge 10$, $\le 38$ | Avg temperature (°C) |
| **Rainfall** | Float | $\ge 200$, $\le 2000$ | Avg rainfall (mm/year) |
| **Humidity** | Float | $\ge 30$, $\le 90$ | Avg relative humidity (%) |

### Request Example
```bash
curl -X POST http://127.0.0.1:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Crop_Type": "Rice",
    "SOC": 2.5,
    "N_Content": 80,
    "P_Content": 35,
    "K_Content": 65,
    "pH": 6.5,
    "Fertilizer_Type": "Urea",
    "Fertilizer_Amount": 250,
    "Temperature": 28,
    "Rainfall": 900,
    "Humidity": 70
  }'
```

### Response Example (`200 OK`)
```json
{
  "carbon_footprint": 1058.4,
  "sustainability": "Medium"
}
```

---

## 3. Error Codes & Validation Checks

If validation fails, the API responds with structured error codes:

### HTTP `422 Unprocessable Entity`
* **Trigger**: Input values are outside validation limits (e.g. `pH` is `9.0` or `SOC` is `0.2%`).
* **Response Body**:
  ```json
  {
    "detail": [
      {
        "loc": ["body", "pH"],
        "msg": "Input should be less than or equal to 8.5",
        "type": "less_than_equal_to"
      }
    ]
  }
  ```

### HTTP `400 Bad Request`
* **Trigger**: Categorical parameters do not match metadata options (e.g. `Crop_Type` is `"Apple"`).
* **Response Body**:
  ```json
  {
    "detail": "Invalid Crop_Type. Must be one of: ['Cotton', 'Maize', 'Rice', 'Sugarcane', 'Wheat']"
  }
  ```

### HTTP `500 Internal Server Error`
* **Trigger**: Model loading issues or failed predictions.
* **Response Body**:
  ```json
  {
    "detail": "Prediction error: [Description of issue]"
  }
  ```
