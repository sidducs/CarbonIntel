import os
import numpy as np
import pandas as pd

def generate_agricultural_data(num_samples=5000, random_seed=42):
    """
    Generates a simplified, scientifically inspired synthetic dataset for agricultural carbon footprint.
    Contains exactly 12 columns: Crop_Type, SOC, N_Content, P_Content, K_Content, pH,
    Fertilizer_Type, Fertilizer_Amount, Temperature, Rainfall, Humidity, and Carbon_Footprint.
    """
    np.random.seed(random_seed)
    
    # 1. Input Feature Generation
    crop_options = ['Corn', 'Rice', 'Wheat', 'Soybeans', 'Vegetables']
    crop_type = np.random.choice(crop_options, size=num_samples, p=[0.25, 0.20, 0.25, 0.15, 0.15])
    
    # Soil Organic Carbon (SOC) in %
    soc = np.clip(np.random.normal(loc=2.2, scale=0.8, size=num_samples), 0.5, 5.0)
    
    # Soil pH
    ph = np.clip(np.random.normal(loc=6.4, scale=0.7, size=num_samples), 4.5, 8.5)
    
    # Soil Nutrient baseline contents (kg/ha)
    n_content = np.clip(np.random.normal(loc=75, scale=25, size=num_samples), 10, 200)
    p_content = np.clip(np.random.normal(loc=35, scale=15, size=num_samples), 5, 100)
    k_content = np.clip(np.random.normal(loc=65, scale=20, size=num_samples), 10, 150)
    
    # Weather variables
    temperature = np.clip(np.random.normal(loc=23.5, scale=5.2, size=num_samples), 10.0, 38.0)
    rainfall = np.clip(np.random.normal(loc=850, scale=350, size=num_samples), 200, 2000)
    humidity = np.clip(np.random.normal(loc=65, scale=12, size=num_samples), 30, 90)
    
    # Fertilizer type and amount (correlated with crop types for realism)
    fertilizer_options = ['Urea', 'Ammonium Nitrate', 'NPK_15-15-15', 'Organic', 'None']
    fertilizer_type = []
    fertilizer_amount = []
    
    for crop in crop_type:
        if crop == 'Soybeans':
            # Nitrogen fixers require less/no fertilizer or organic
            f_type = np.random.choice(fertilizer_options, p=[0.05, 0.05, 0.20, 0.40, 0.30])
            f_amt = np.random.uniform(0, 100) if f_type != 'None' else 0.0
        elif crop == 'Rice':
            f_type = np.random.choice(fertilizer_options, p=[0.45, 0.20, 0.25, 0.05, 0.05])
            f_amt = np.random.uniform(150, 450) if f_type != 'None' else 0.0
        elif crop == 'Corn':
            f_type = np.random.choice(fertilizer_options, p=[0.50, 0.25, 0.15, 0.05, 0.05])
            f_amt = np.random.uniform(180, 450) if f_type != 'None' else 0.0
        elif crop == 'Wheat':
            f_type = np.random.choice(fertilizer_options, p=[0.35, 0.30, 0.25, 0.05, 0.05])
            f_amt = np.random.uniform(100, 300) if f_type != 'None' else 0.0
        else: # Vegetables
            f_type = np.random.choice(fertilizer_options, p=[0.10, 0.15, 0.45, 0.25, 0.05])
            f_amt = np.random.uniform(100, 350) if f_type != 'None' else 0.0
            
        fertilizer_type.append(f_type)
        fertilizer_amount.append(f_amt)
        
    fertilizer_type = np.array(fertilizer_type)
    fertilizer_amount = np.round(np.array(fertilizer_amount), 1)
    
    # 2. Target Generation (Carbon Footprint in kg CO2e/ha)
    # Baseline crop emissions (sowing, diesel, flooding methane in rice)
    crop_baselines = {'Rice': 1100.0, 'Corn': 300.0, 'Wheat': 200.0, 'Soybeans': 120.0, 'Vegetables': 250.0}
    e_crop_baseline = np.array([crop_baselines[c] for c in crop_type])
    
    # Fertilizer emissions (cradle-to-gate mfg + direct volatilization)
    # Factors represent emissions per kg of fertilizer applied
    fert_factors = {'Urea': 2.3, 'Ammonium Nitrate': 2.9, 'NPK_15-15-15': 1.1, 'Organic': 0.15, 'None': 0.0}
    e_fertilizer = np.array([fert_factors[ft] * fa for ft, fa in zip(fertilizer_type, fertilizer_amount)])
    
    # Weather-related biological emission factor scaling
    e_weather = temperature * 6 + (rainfall / 100.0) * 8 + humidity * 2.5
    
    # Soil impact: SOC acts as a carbon sink (offset), high N content slightly increases background N2O
    # e_soil = n_content * 0.25 - soc * 110.0 + ((ph - 6.5) ** 2) * 12.0
    e_soil =(n_content * 0.35+p_content * 0.15+k_content * 0.10-soc * 110+((ph - 6.5)**2) * 12)
    # Calculate total Carbon Footprint
    carbon_footprint = e_crop_baseline + e_fertilizer + e_weather + e_soil
    
    # Add Gaussian noise for realistic model performance
    noise = np.random.normal(loc=0.0, scale=35.0, size=num_samples)
    carbon_footprint = np.round(carbon_footprint + noise, 1)
    
    # Create DataFrame with exactly 12 columns
    df = pd.DataFrame({
        'Crop_Type': crop_type,
        'SOC': np.round(soc, 2),
        'N_Content': np.round(n_content, 1),
        'P_Content': np.round(p_content, 1),
        'K_Content': np.round(k_content, 1),
        'pH': np.round(ph, 2),
        'Fertilizer_Type': fertilizer_type,
        'Fertilizer_Amount': fertilizer_amount,
        'Temperature': np.round(temperature, 1),
        'Rainfall': np.round(rainfall, 1),
        'Humidity': np.round(humidity, 1),
        'Carbon_Footprint': carbon_footprint
    })
    
    return df

if __name__ == '__main__':
    # Ensure folders exist
    os.makedirs('data', exist_ok=True)
    os.makedirs('models', exist_ok=True)
    os.makedirs('notebooks', exist_ok=True)
    os.makedirs('src', exist_ok=True)
    
    print("Generating simplified agricultural dataset (5000 rows)...")
    df = generate_agricultural_data(num_samples=5000)
    
    output_path = 'data/agriculture_dataset.csv'
    df.to_csv(output_path, index=False)
    print(f"Dataset generated successfully! Shape: {df.shape}")
    print(f"Saved to: {output_path}")
    print("\nSample Data:")
    print(df.head())
    print("\nSummary Statistics:")
    print(df.describe())
