import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

def run_validation():
    """
    Validation script performing:
    1. Plotting the target variable (Carbon_Footprint) distribution.
    2. Calculating and plotting the correlation matrix of numerical features.
    3. Loading the model.pkl and verifying prediction capability.
    4. Testing the model with 20 manual farming scenario samples.
    """
    print("Starting Model Validation Checks...")
    
    # Check for dataset
    dataset_path = 'data/agriculture_dataset.csv'
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}. Please run main.py first.")
        
    df = pd.read_csv(dataset_path, keep_default_na=False)
    
    # 1. Plot Carbon_Footprint Distribution
    print("Plotting Carbon Footprint distribution...")
    plt.figure(figsize=(10, 5))
    sns.set_theme(style="whitegrid")
    sns.histplot(df['Carbon_Footprint'], kde=True, color='forestgreen', bins=30)
    plt.title("Distribution of Agricultural Carbon Footprint (kg CO₂e/ha)", fontsize=14, fontweight='bold', pad=15)
    plt.xlabel("Carbon Footprint (kg CO₂e/ha)", fontsize=12)
    plt.ylabel("Frequency", fontsize=12)
    plt.tight_layout()
    
    dist_path = 'reports/figures/carbon_footprint_dist.png'
    os.makedirs(os.path.dirname(dist_path), exist_ok=True)
    plt.savefig(dist_path, dpi=300)
    plt.close()
    print(f"Distribution plot saved to {dist_path}")
    
    # 2. Check Feature Correlations (Numerical features)
    print("Calculating feature correlations...")
    numerical_cols = ['SOC', 'N_Content', 'P_Content', 'K_Content', 'pH', 
                      'Fertilizer_Amount', 'Temperature', 'Rainfall', 'Humidity', 'Carbon_Footprint']
    corr = df[numerical_cols].corr()
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(corr, annot=True, cmap='RdYlGn_r', fmt=".2f", linewidths=0.5, square=True)
    plt.title("Correlation Matrix of Numerical Features & Target", fontsize=14, fontweight='bold', pad=15)
    plt.tight_layout()
    
    corr_path = 'reports/figures/correlation_matrix.png'
    plt.savefig(corr_path, dpi=300)
    plt.close()
    print(f"Correlation heatmap saved to {corr_path}")
    
    # 3. Load Model Pipeline
    model_path = 'models/model.pkl'
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found at {model_path}. Please run main.py first.")
        
    pipeline = joblib.load(model_path)
    print("Model pipeline successfully loaded from models/model.pkl")
    
    # 4. Generate 20 Manual Testing Samples representing diverse farming conditions
    print("Defining 20 manual farming scenarios...")
    manual_samples = [
        # 1-4: Rice paddies (expected high emissions due to flooded paddy methane)
        {"Crop_Type": "Rice", "SOC": 0.8, "N_Content": 120, "P_Content": 30, "K_Content": 150, "pH": 6.5, "Fertilizer_Type": "Urea", "Fertilizer_Amount": 250, "Temperature": 30.0, "Rainfall": 1200.0, "Humidity": 80.0},
        {"Crop_Type": "Rice", "SOC": 2.5, "N_Content": 60, "P_Content": 20, "K_Content": 100, "pH": 7.0, "Fertilizer_Type": "Ammonium Nitrate", "Fertilizer_Amount": 200, "Temperature": 26.0, "Rainfall": 1000.0, "Humidity": 75.0},
        {"Crop_Type": "Rice", "SOC": 4.5, "N_Content": 40, "P_Content": 10, "K_Content": 80, "pH": 6.0, "Fertilizer_Type": "None", "Fertilizer_Amount": 0.0, "Temperature": 22.0, "Rainfall": 900.0, "Humidity": 70.0},
        {"Crop_Type": "Rice", "SOC": 1.2, "N_Content": 150, "P_Content": 40, "K_Content": 110, "pH": 5.8, "Fertilizer_Type": "Organic", "Fertilizer_Amount": 300, "Temperature": 28.0, "Rainfall": 1100.0, "Humidity": 82.0},
        
        # 5-8: Corn (highly nitrogen intensive, high emissions if heavily fertilized)
        {"Crop_Type": "Corn", "SOC": 1.1, "N_Content": 90, "P_Content": 40, "K_Content": 120, "pH": 6.2, "Fertilizer_Type": "Urea", "Fertilizer_Amount": 400, "Temperature": 28.0, "Rainfall": 750.0, "Humidity": 60.0},
        {"Crop_Type": "Corn", "SOC": 3.2, "N_Content": 80, "P_Content": 35, "K_Content": 100, "pH": 6.8, "Fertilizer_Type": "NPK_15-15-15", "Fertilizer_Amount": 220, "Temperature": 24.0, "Rainfall": 800.0, "Humidity": 65.0},
        {"Crop_Type": "Corn", "SOC": 4.8, "N_Content": 50, "P_Content": 15, "K_Content": 90, "pH": 7.2, "Fertilizer_Type": "Organic", "Fertilizer_Amount": 150, "Temperature": 20.0, "Rainfall": 600.0, "Humidity": 55.0},
        {"Crop_Type": "Corn", "SOC": 2.0, "N_Content": 110, "P_Content": 50, "K_Content": 130, "pH": 5.2, "Fertilizer_Type": "Ammonium Nitrate", "Fertilizer_Amount": 350, "Temperature": 32.0, "Rainfall": 950.0, "Humidity": 68.0},
        
        # 9-12: Soybeans (N-fixing legumes, high carbon sequestration, low emissions)
        {"Crop_Type": "Soybeans", "SOC": 3.8, "N_Content": 30, "P_Content": 25, "K_Content": 80, "pH": 6.4, "Fertilizer_Type": "None", "Fertilizer_Amount": 0.0, "Temperature": 24.0, "Rainfall": 650.0, "Humidity": 58.0},
        {"Crop_Type": "Soybeans", "SOC": 1.5, "N_Content": 40, "P_Content": 30, "K_Content": 70, "pH": 6.6, "Fertilizer_Type": "Organic", "Fertilizer_Amount": 80.0, "Temperature": 22.0, "Rainfall": 700.0, "Humidity": 62.0},
        {"Crop_Type": "Soybeans", "SOC": 4.5, "N_Content": 20, "P_Content": 15, "K_Content": 60, "pH": 6.8, "Fertilizer_Type": "NPK_15-15-15", "Fertilizer_Amount": 50.0, "Temperature": 26.0, "Rainfall": 680.0, "Humidity": 60.0},
        {"Crop_Type": "Soybeans", "SOC": 0.6, "N_Content": 50, "P_Content": 35, "K_Content": 90, "pH": 5.5, "Fertilizer_Type": "Urea", "Fertilizer_Amount": 60.0, "Temperature": 25.0, "Rainfall": 720.0, "Humidity": 65.0},
        
        # 13-16: Wheat (moderate emissions and inputs)
        {"Crop_Type": "Wheat", "SOC": 2.2, "N_Content": 70, "P_Content": 30, "K_Content": 85, "pH": 6.5, "Fertilizer_Type": "Ammonium Nitrate", "Fertilizer_Amount": 180, "Temperature": 18.0, "Rainfall": 500.0, "Humidity": 50.0},
        {"Crop_Type": "Wheat", "SOC": 4.1, "N_Content": 50, "P_Content": 20, "K_Content": 75, "pH": 7.0, "Fertilizer_Type": "Organic", "Fertilizer_Amount": 120, "Temperature": 15.0, "Rainfall": 450.0, "Humidity": 45.0},
        {"Crop_Type": "Wheat", "SOC": 1.0, "N_Content": 100, "P_Content": 45, "K_Content": 110, "pH": 6.0, "Fertilizer_Type": "Urea", "Fertilizer_Amount": 260, "Temperature": 22.0, "Rainfall": 550.0, "Humidity": 52.0},
        {"Crop_Type": "Wheat", "SOC": 3.0, "N_Content": 60, "P_Content": 10, "K_Content": 80, "pH": 7.8, "Fertilizer_Type": "None", "Fertilizer_Amount": 0.0, "Temperature": 16.0, "Rainfall": 480.0, "Humidity": 48.0},
        
        # 17-20: Vegetables (intensive but variable)
        {"Crop_Type": "Vegetables", "SOC": 2.8, "N_Content": 80, "P_Content": 50, "K_Content": 140, "pH": 6.3, "Fertilizer_Type": "NPK_15-15-15", "Fertilizer_Amount": 300, "Temperature": 22.0, "Rainfall": 850.0, "Humidity": 70.0},
        {"Crop_Type": "Vegetables", "SOC": 4.9, "N_Content": 60, "P_Content": 30, "K_Content": 100, "pH": 6.6, "Fertilizer_Type": "Organic", "Fertilizer_Amount": 250, "Temperature": 20.0, "Rainfall": 900.0, "Humidity": 75.0},
        {"Crop_Type": "Vegetables", "SOC": 0.7, "N_Content": 120, "P_Content": 60, "K_Content": 150, "pH": 5.6, "Fertilizer_Type": "Urea", "Fertilizer_Amount": 280, "Temperature": 26.0, "Rainfall": 750.0, "Humidity": 68.0},
        {"Crop_Type": "Vegetables", "SOC": 3.5, "N_Content": 50, "P_Content": 25, "K_Content": 90, "pH": 6.8, "Fertilizer_Type": "None", "Fertilizer_Amount": 0.0, "Temperature": 18.0, "Rainfall": 600.0, "Humidity": 60.0}
    ]
    
    manual_df = pd.DataFrame(manual_samples)
    
    # 5. Make Predictions
    print("Running predictions on manual scenarios...")
    predictions = pipeline.predict(manual_df)
    
    manual_df['Predicted_Carbon_Footprint'] = np.round(predictions, 1)
    
    # 6. Apply Sustainability Level Mapping
    # High: < 400, Medium: 400 - 1200, Low: > 1200
    sustainability = []
    for cf in manual_df['Predicted_Carbon_Footprint']:
        if cf < 400:
            sustainability.append('High')
        elif cf <= 1200:
            sustainability.append('Medium')
        else:
            sustainability.append('Low')
    manual_df['Sustainability_Level'] = sustainability
    
    # Print predictions
    print("\nManual Samples Prediction Results:")
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', 1000)
    print(manual_df[['Crop_Type', 'Fertilizer_Type', 'Fertilizer_Amount', 'Predicted_Carbon_Footprint', 'Sustainability_Level']])
    
    # Save validation table
    table_path = 'reports/validation_table.csv'
    manual_df.to_csv(table_path, index=False)
    print(f"\nValidation table saved to {table_path}")
    
    # 7. Save metadata files for backend consistency
    features = list(manual_df.columns[:-2]) # Exclude target & sustainability columns
    
    print("\nSaving feature list and metadata for backend model consumption...")
    joblib.dump(features, 'models/feature_list.pkl')
    print("Feature list saved to models/feature_list.pkl")
    
    crop_categories = pipeline.named_steps['preprocessor'].named_transformers_['cat'].categories_[0].tolist()
    fertilizer_categories = pipeline.named_steps['preprocessor'].named_transformers_['cat'].categories_[1].tolist()
    
    metadata = {
        'features': features,
        'crops': crop_categories,
        'fertilizers': fertilizer_categories
    }
    joblib.dump(metadata, 'models/model_metadata.pkl')
    print("Metadata (crops, fertilizers, features) saved to models/model_metadata.pkl")
    print("Model validation successfully completed!")

if __name__ == '__main__':
    run_validation()
