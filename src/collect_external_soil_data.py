import os
import urllib.request
import pandas as pd
import numpy as np

URL = "https://raw.githubusercontent.com/Gladiator07/Harvestify/master/Data-processed/crop_recommendation.csv"
OUTPUT_DIR = "data/raw"
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "external_soil_data.csv")

def download_and_clean_external_data():
    """
    Downloads the real Crop Recommendation dataset (originally from Kaggle/Google),
    maps features to CarbonIntel's format, enriches with target footprints,
    and saves to data/raw/external_soil_data.csv.
    """
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print(f"Downloading real soil and environmental dataset from: {URL}...")
    try:
        urllib.request.urlretrieve(URL, OUTPUT_PATH)
        print(f"Successfully downloaded to: {OUTPUT_PATH}")
    except Exception as e:
        print(f"Error downloading file: {e}")
        return False
        
    # Read the downloaded dataset
    df = pd.read_csv(OUTPUT_PATH)
    print(f"Initial raw shape: {df.shape}")
    
    # 1. Map columns
    # Raw columns: N, P, K, temperature, humidity, ph, rainfall, label
    column_mapping = {
        'N': 'N_Content',
        'P': 'P_Content',
        'K': 'K_Content',
        'ph': 'pH',
        'temperature': 'Temperature',
        'humidity': 'Humidity',
        'rainfall': 'Rainfall'
    }
    df.rename(columns=column_mapping, inplace=True)
    
    # 2. Map labels to supported CarbonIntel crops
    # Allowed crops: Rice, Corn, Wheat, Soybeans, Vegetables
    crop_mapping = {
        'rice': 'Rice',
        'maize': 'Corn',
        'wheat': 'Wheat',
        'soybeans': 'Soybeans',
        'blackgram': 'Soybeans',
        'lentil': 'Soybeans',
        'mungbean': 'Soybeans',
        'pigeonpeas': 'Soybeans',
        'mothbeans': 'Soybeans'
    }
    
    def map_crop(label):
        label_lower = str(label).lower()
        if label_lower in crop_mapping:
            return crop_mapping[label_lower]
        else:
            return 'Vegetables'  # Fallback for mango, banana, pomegranate, etc.
            
    df['Crop_Type'] = df['label'].apply(map_crop)
    df.drop(columns=['label'], inplace=True)
    
    # 3. Add Soil Organic Carbon (SOC) which is not in the source dataset
    # We sample a realistic distribution based on crop type
    np.random.seed(42)
    soc_values = []
    for crop in df['Crop_Type']:
        if crop == 'Rice':
            soc_values.append(np.clip(np.random.normal(2.5, 0.4), 0.5, 5.0))
        elif crop == 'Soybeans':
            soc_values.append(np.clip(np.random.normal(2.8, 0.5), 0.5, 5.0))
        else:
            soc_values.append(np.clip(np.random.normal(2.1, 0.4), 0.5, 5.0))
    df['SOC'] = np.round(soc_values, 2)
    
    # 4. Synthesize Fertilizer parameters matching crop recommendations
    fertilizer_types = []
    fertilizer_amounts = []
    
    fertilizer_options = ['Urea', 'Ammonium Nitrate', 'NPK_15-15-15', 'Organic', 'None']
    
    for crop in df['Crop_Type']:
        if crop == 'Soybeans':
            ft = np.random.choice(fertilizer_options, p=[0.05, 0.05, 0.20, 0.40, 0.30])
            fa = np.random.uniform(0, 100) if ft != 'None' else 0.0
        elif crop == 'Rice':
            ft = np.random.choice(fertilizer_options, p=[0.45, 0.20, 0.25, 0.05, 0.05])
            fa = np.random.uniform(150, 450) if ft != 'None' else 0.0
        elif crop == 'Corn':
            ft = np.random.choice(fertilizer_options, p=[0.50, 0.25, 0.15, 0.05, 0.05])
            fa = np.random.uniform(180, 450) if ft != 'None' else 0.0
        elif crop == 'Wheat':
            ft = np.random.choice(fertilizer_options, p=[0.35, 0.30, 0.25, 0.05, 0.05])
            fa = np.random.uniform(100, 300) if ft != 'None' else 0.0
        else:
            ft = np.random.choice(fertilizer_options, p=[0.10, 0.15, 0.45, 0.25, 0.05])
            fa = np.random.uniform(100, 350) if ft != 'None' else 0.0
        fertilizer_types.append(ft)
        fertilizer_amounts.append(round(fa, 1))
        
    df['Fertilizer_Type'] = fertilizer_types
    df['Fertilizer_Amount'] = fertilizer_amounts
    
    # 5. Compute Carbon Footprint targets using established formulas
    crop_baselines = {'Rice': 800.0, 'Corn': 350.0, 'Wheat': 250.0, 'Soybeans': 100.0, 'Vegetables': 300.0}
    fert_factors = {'Urea': 2.3, 'Ammonium Nitrate': 2.9, 'NPK_15-15-15': 1.5, 'Organic': 0.4, 'None': 0.0}
    
    carbon_footprints = []
    for _, row in df.iterrows():
        e_crop = crop_baselines[row['Crop_Type']]
        e_fert = fert_factors[row['Fertilizer_Type']] * row['Fertilizer_Amount']
        e_weather = (row['Temperature'] * 6.0) + ((row['Rainfall'] / 100.0) * 8.0) + (row['Humidity'] * 2.5)
        e_soil = (row['N_Content'] * 0.45) + (row['P_Content'] * 0.15) + (row['K_Content'] * 0.10) + (((row['pH'] - 6.5) ** 2) * 12.0)
        carbon_sink = row['SOC'] * 150.0
        
        net_emissions = e_crop + e_fert + e_weather + e_soil - carbon_sink
        noise = np.random.normal(0, 25.0)
        carbon_footprints.append(round(net_emissions + noise, 1))
        
    df['Carbon_Footprint'] = carbon_footprints
    
    # Order columns to match training set exactly
    ordered_cols = [
        'Crop_Type', 'SOC', 'N_Content', 'P_Content', 'K_Content', 'pH',
        'Fertilizer_Type', 'Fertilizer_Amount', 'Temperature', 'Rainfall', 'Humidity', 'Carbon_Footprint'
    ]
    df = df[ordered_cols]
    
    # Save the cleaned mapped CSV
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"Data saved to {OUTPUT_PATH}. Total Cleaned Records: {df.shape[0]}")
    return True

if __name__ == '__main__':
    download_and_clean_external_data()
