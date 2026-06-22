# Backend Documentation

This document describes the design, API design, and deployment considerations for the FastAPI backend microservice of CarbonIntel.

---

## 1. FastAPI Architecture Overview

The backend is built as a single-file high-performance web service (`app.py`) using **FastAPI** and **Uvicorn**.

* **Input Type checking**: Managed via Pydantic model schemas that enforce data types and numeric ranges at runtime.
* **CORS Middleware**: Configured to safely permit request headers and methods from the React frontend (running on ports `5173`, `5180`, `5181`, `5182`).
* **Startup Initialization**: Serialized files (`models/model.pkl` and optional `models/model_metadata.pkl`) are loaded into RAM once when the server starts, preventing expensive I/O overhead on subsequent prediction requests.

---

## 2. API Endpoints Reference

### GET `/`
* **Purpose**: Retrieves API status, version, and the allowable crop and fertilizer values compiled during model training.
* **Response Headers**: `Content-Type: application/json`
* **Response Body**:
  ```json
  {
    "status": "online",
    "api_name": "Agricultural Carbon Footprint API",
    "model_version": "1.0.0",
    "allowed_values": {
      "Crop_Type": ["Cotton", "Maize", "Rice", "Sugarcane", "Wheat"],
      "Fertilizer_Type": ["DAP", "MOP", "None", "Urea"]
    }
  }
  ```

### POST `/predict`
* **Purpose**: Predicts net farm footprint and returns the corresponding sustainability classification rating.
* **Request Headers**: `Content-Type: application/json`
* **Request Schema (Pydantic: `FarmDataInput`)**:
  | Parameter | Type | Validation Rules | Description |
  | :--- | :--- | :--- | :--- |
  | **Crop_Type** | string | Must be one of metadata crops | E.g. `"Sugarcane"` |
  | **SOC** | float | $\ge 0.5$, $\le 5.0$ | Soil Organic Carbon (%) |
  | **N_Content** | float | $\ge 10$, $\le 200$ | Soil Nitrogen (mg/kg) |
  | **P_Content** | float | $\ge 5$, $\le 100$ | Soil Phosphorus (mg/kg) |
  | **K_Content** | float | $\ge 10$, $\le 150$ | Soil Potassium (mg/kg) |
  | **pH** | float | $\ge 4.5$, $\le 8.5$ | Soil acidity (pH scale) |
  | **Fertilizer_Type**| string | Must be one of metadata fertilizers | E.g. `"Urea"` |
  | **Fertilizer_Amount**| float | $\ge 0$, $\le 500$ | Fertilizer applied (kg/ha) |
  | **Temperature** | float | $\ge 10$, $\le 38$ | Seasonal Avg Temp (°C) |
  | **Rainfall** | float | $\ge 200$, $\le 2000$ | Seasonal Avg Rain (mm/year) |
  | **Humidity** | float | $\ge 30$, $\le 90$ | Seasonal Avg Humidity (%) |

* **Response Schema (Pydantic: `PredictionResponse`)**:
  ```json
  {
    "carbon_footprint": 412.5,
    "sustainability": "High"
  }
  ```

---

## 3. Request Validation & Prediction Flow

1. **Pydantic Interception**: Requests are vetted against numerical boundaries (e.g. `pH` range `4.5 - 8.5`). If a boundary is breached, FastAPI automatically returns a `422 Unprocessable Entity` containing field-specific validation reports.
2. **Metadata Validation**: The crop and fertilizer inputs are compared against lists in `model_metadata.pkl`. If not found, a `400 Bad Request` is raised.
3. **Fertilizer Sanitation Rule**: If `Fertilizer_Type` is `"None"`, the backend forces `Fertilizer_Amount` to `0.0` to maintain dataset alignment.
4. **Model Execution**: The dictionary payload is converted to a single-row pandas DataFrame matching the exact training columns order:
   ```python
   df = pd.DataFrame([input_dict])
   predicted_cf = pipeline.predict(df)[0]
   ```
5. **Rating Classification**:
   * **High Sustainability**: $< 400\text{ kg CO}_2\text{e/ha}$
   * **Medium Sustainability**: $400 - 1200\text{ kg CO}_2\text{e/ha}$
   * **Low Sustainability**: $> 1200\text{ kg CO}_2\text{e/ha}$

---

## 4. Deployment Considerations

* **Production Server**: Use **Gunicorn** wrapping **Uvicorn workers** for process concurrency:
  ```bash
  gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
  ```
* **Docker Containerization**:
  ```dockerfile
  FROM python:3.11-slim
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt
  COPY app.py .
  COPY models/ ./models/
  EXPOSE 8000
  CMD ["gunicorn", "app:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]
  ```
