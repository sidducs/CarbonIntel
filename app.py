import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
# Initialize FastAPI App
app = FastAPI(
    title="Agricultural Carbon Footprint & Sustainability Assessment API",
    description="API to predict net carbon footprint (kg CO₂e/ha) and evaluate sustainability based on crop type, soil properties, fertilizer applications, and weather conditions.",
    version="1.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5180", "http://127.0.0.1:5180",
        "http://localhost:5181", "http://127.0.0.1:5181",
        "http://localhost:5182", "http://127.0.0.1:5182",
        "http://localhost:5173", "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load Model Pipeline and Metadata on Startup
MODEL_PATH = 'models/model.pkl'
METADATA_PATH = 'models/model_metadata.pkl'

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Trained model not found at {MODEL_PATH}. Please run the training pipeline first.")

pipeline = joblib.load(MODEL_PATH)
metadata = joblib.load(METADATA_PATH) if os.path.exists(METADATA_PATH) else None

# Define Pydantic Models for Input Validation
class FarmDataInput(BaseModel):
    Crop_Type: str = Field(..., example="Rice")

    SOC: float = Field(
        ...,
        ge=0.5,
        le=5.0,
        example=2.5,
        description="Soil Organic Carbon (%)"
    )

    N_Content: float = Field(
        ...,
        ge=10,
        le=200,
        example=80
    )

    P_Content: float = Field(
        ...,
        ge=5,
        le=100,
        example=35
    )

    K_Content: float = Field(
        ...,
        ge=10,
        le=150,
        example=65
    )

    pH: float = Field(
        ...,
        ge=4.5,
        le=8.5,
        example=6.5
    )

    Fertilizer_Type: str = Field(..., example="Urea")

    Fertilizer_Amount: float = Field(
        ...,
        ge=0,
        le=500,
        example=250
    )

    Temperature: float = Field(
        ...,
        ge=10,
        le=38,
        example=28
    )

    Rainfall: float = Field(
        ...,
        ge=200,
        le=2000,
        example=900
    )

    Humidity: float = Field(
        ...,
        ge=30,
        le=90,
        example=70
    )

class PredictionResponse(BaseModel):
    carbon_footprint: float = Field(..., description="Predicted Carbon Footprint (kg CO₂e/ha)")
    sustainability: str = Field(..., description="Sustainability Level (High/Medium/Low)")

@app.get("/")
def read_root():
    """
    Returns API information and metadata including allowed crop and fertilizer values.
    """
    response = {
        "status": "online",
        "api_name": "Agricultural Carbon Footprint API",
        "model_version": "1.0.0"
    }
    if metadata:
        response["allowed_values"] = {
            "Crop_Type": metadata.get("crops", []),
            "Fertilizer_Type": metadata.get("fertilizers", [])
        }
    return response

@app.post("/predict", response_model=PredictionResponse)
def predict_footprint(data: FarmDataInput):
    """
    Predicts the net agricultural carbon footprint (kg CO₂e/ha)
    and classifies the sustainability level.
    """
    # Convert input data to Dictionary
    input_dict = data.model_dump()

    # Validation check against metadata (if available)
    if metadata:
        if input_dict["Crop_Type"] not in metadata.get("crops", []):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid Crop_Type. Must be one of: {metadata['crops']}"
            )
        if input_dict["Fertilizer_Type"] not in metadata.get("fertilizers", []):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid Fertilizer_Type. Must be one of: {metadata['fertilizers']}"
            )
            
    # Force Fertilizer_Amount to 0 if Fertilizer_Type is None
    if input_dict["Fertilizer_Type"] == "None":
        input_dict["Fertilizer_Amount"] = 0.0

    try:
        # Create DataFrame from input parameters matching the training columns format
        df = pd.DataFrame([input_dict])
        
        # Predict using the serialized pipeline
        predicted_cf = pipeline.predict(df)[0]
        predicted_cf = round(float(predicted_cf), 1)
        
        # Determine Sustainability Level
        # High: < 400, Medium: 400 - 1200, Low: > 1200
        if predicted_cf < 400.0:
            sustainability = "High"
        elif predicted_cf <= 1200.0:
            sustainability = "Medium"
        else:
            sustainability = "Low"
            
        return PredictionResponse(
            carbon_footprint=predicted_cf,
            sustainability=sustainability
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

import json

@app.get("/model/metrics")
def get_model_metrics():
    """
    Returns real-time model evaluation metrics, dataset metadata, 
    and feature importances.
    """
    metrics_path = 'models/model_metrics.json'
    if not os.path.exists(metrics_path):
        raise HTTPException(status_code=404, detail="Model metrics metadata file not found.")
    try:
        with open(metrics_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read model metrics: {str(e)}")

