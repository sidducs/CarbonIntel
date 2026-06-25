import os
import csv
import random
import math

# Define paths
SOIL_SAMPLE_PATH = r"c:\Users\Siddu\Desktop\CarbonFootprintML\data\soil_sample.csv"
EXTERNAL_DATA_PATH = r"c:\Users\Siddu\Desktop\CarbonFootprintML\data\external_soil_data.csv"
OUTPUT_PATH = r"c:\Users\Siddu\Desktop\CarbonFootprintML\data\agriculture_dataset.csv"

# District definitions and their official soil distributions (Mean, Std Dev)
# [N_mean, N_std, P_mean, P_std, K_mean, K_std, pH_mean, pH_std, OC_mean, OC_std]
soil_stats = {
    'Bagalkot': [380.0, 50.0, 20.0, 5.0, 320.0, 45.0, 8.0, 0.3, 0.45, 0.08],
    'Bangalore Rural': [160.0, 25.0, 18.0, 4.0, 210.0, 30.0, 6.8, 0.35, 0.48, 0.09],
    'Bangalore Urban': [155.0, 24.0, 17.0, 4.0, 205.0, 28.0, 6.7, 0.35, 0.46, 0.08],
    'Belagavi': [210.0, 35.0, 22.0, 6.0, 280.0, 40.0, 7.4, 0.4, 0.65, 0.12],
    'Ballari': [125.0, 22.0, 15.0, 4.5, 300.0, 45.0, 8.0, 0.3, 0.41, 0.07],
    'Bidar': [135.0, 22.0, 14.0, 4.0, 270.0, 35.0, 7.9, 0.3, 0.48, 0.08],
    'Chamarajanagar': [150.0, 25.0, 16.0, 4.0, 220.0, 30.0, 7.1, 0.35, 0.52, 0.09],
    'Chikkaballapur': [115.0, 20.0, 17.0, 4.0, 195.0, 25.0, 7.2, 0.3, 0.39, 0.07],
    'Chikkamagaluru': [240.0, 38.0, 13.0, 3.5, 170.0, 25.0, 5.8, 0.45, 0.95, 0.18],
    'Chitradurga': [85.0, 15.0, 18.0, 4.0, 92.0, 15.0, 7.1, 0.3, 0.45, 0.08],
    'Dakshina Kannada': [260.0, 40.0, 10.0, 3.0, 130.0, 20.0, 5.2, 0.4, 1.15, 0.25],
    'Davanagere': [160.0, 28.0, 22.0, 5.0, 250.0, 35.0, 7.0, 0.35, 0.52, 0.10],
    'Dharwad': [190.0, 30.0, 24.0, 5.5, 260.0, 35.0, 7.6, 0.35, 0.58, 0.10],
    'Gadag': [130.0, 22.0, 18.0, 4.0, 290.0, 40.0, 7.9, 0.3, 0.43, 0.07],
    'Kalaburagi': [120.0, 20.0, 15.0, 4.0, 330.0, 48.0, 8.1, 0.25, 0.40, 0.06],
    'Hassan': [200.0, 30.0, 16.0, 4.0, 210.0, 30.0, 6.2, 0.4, 0.75, 0.13],
    'Haveri': [175.0, 26.0, 20.0, 5.0, 240.0, 35.0, 7.3, 0.35, 0.55, 0.10],
    'Kodagu': [280.0, 45.0, 11.0, 3.0, 140.0, 22.0, 5.4, 0.5, 1.30, 0.28],
    'Kolar': [110.0, 18.0, 18.0, 4.0, 190.0, 25.0, 7.3, 0.3, 0.38, 0.07],
    'Koppal': [135.0, 24.0, 14.0, 4.0, 220.0, 30.0, 7.8, 0.3, 0.44, 0.08],
    'Mandya': [195.0, 30.0, 23.0, 5.0, 230.0, 35.0, 7.0, 0.35, 0.58, 0.11],
    'Mysuru': [180.0, 28.0, 20.0, 5.0, 240.0, 35.0, 6.9, 0.35, 0.55, 0.10],
    'Raichur': [130.0, 22.0, 18.0, 5.0, 310.0, 40.0, 8.1, 0.25, 0.42, 0.07],
    'Ramanagara': [145.0, 24.0, 16.0, 4.0, 200.0, 28.0, 6.9, 0.35, 0.49, 0.09],
    'Shivamogga': [220.0, 35.0, 15.0, 4.0, 180.0, 25.0, 6.0, 0.4, 0.85, 0.15],
    'Tumakuru': [150.0, 25.0, 12.0, 3.5, 210.0, 30.0, 6.5, 0.4, 0.50, 0.09],
    'Udupi': [250.0, 38.0, 9.0, 2.5, 125.0, 18.0, 5.3, 0.4, 1.10, 0.22],
    'Uttara Kannada': [270.0, 42.0, 11.0, 3.0, 135.0, 20.0, 5.5, 0.45, 1.20, 0.26],
    'Vijayapura': [120.0, 20.0, 16.0, 4.0, 340.0, 50.0, 8.2, 0.25, 0.40, 0.06],
    'Vijayanagara': [128.0, 22.0, 15.0, 4.0, 295.0, 42.0, 7.95, 0.3, 0.42, 0.07],
    'Yadgir': [125.0, 21.0, 16.0, 4.0, 300.0, 44.0, 8.0, 0.28, 0.41, 0.07]
}

# District weather distributions
# [Temp_mean, Temp_std, Rain_mean, Rain_std, Hum_mean, Hum_std]
weather_stats = {
    'Bagalkot': [26.8, 2.0, 560.0, 80.0, 52.0, 5.0],
    'Bangalore Rural': [23.2, 1.6, 820.0, 110.0, 64.0, 5.5],
    'Bangalore Urban': [23.5, 1.5, 840.0, 110.0, 63.0, 5.0],
    'Belagavi': [23.5, 1.5, 1200.0, 200.0, 72.0, 6.0],
    'Ballari': [28.2, 2.0, 630.0, 90.0, 51.0, 5.0],
    'Bidar': [26.2, 2.2, 790.0, 110.0, 55.0, 6.0],
    'Chamarajanagar': [24.1, 1.4, 750.0, 100.0, 66.0, 5.5],
    'Chikkaballapur': [23.6, 1.7, 720.0, 100.0, 61.0, 5.5],
    'Chikkamagaluru': [21.8, 1.8, 1850.0, 250.0, 78.0, 6.5],
    'Chitradurga': [25.8, 1.8, 580.0, 80.0, 56.0, 6.0],
    'Dakshina Kannada': [27.5, 1.2, 3800.0, 400.0, 82.0, 5.0],
    'Davanagere': [25.5, 1.6, 680.0, 90.0, 60.0, 5.5],
    'Dharwad': [24.5, 1.5, 780.0, 100.0, 65.0, 6.0],
    'Gadag': [26.0, 1.8, 610.0, 85.0, 54.0, 5.0],
    'Kalaburagi': [28.0, 2.1, 750.0, 105.0, 49.0, 5.0],
    'Hassan': [22.5, 1.4, 1050.0, 150.0, 71.0, 6.0],
    'Haveri': [25.2, 1.6, 730.0, 95.0, 63.0, 5.5],
    'Kodagu': [19.8, 2.0, 2600.0, 350.0, 84.0, 7.0],
    'Kolar': [23.8, 1.6, 710.0, 95.0, 60.0, 5.5],
    'Koppal': [27.8, 2.0, 600.0, 80.0, 52.0, 5.0],
    'Mandya': [24.2, 1.5, 700.0, 90.0, 65.0, 5.5],
    'Mysuru': [23.8, 1.5, 760.0, 110.0, 68.0, 6.0],
    'Raichur': [28.5, 2.0, 640.0, 90.0, 50.0, 5.0],
    'Ramanagara': [23.9, 1.5, 780.0, 100.0, 64.0, 5.5],
    'Shivamogga': [24.0, 1.8, 1750.0, 220.0, 74.0, 6.0],
    'Tumakuru': [24.0, 1.8, 690.0, 100.0, 62.0, 6.0],
    'Udupi': [27.6, 1.1, 4000.0, 420.0, 83.0, 5.0],
    'Uttara Kannada': [25.0, 1.5, 2900.0, 300.0, 80.0, 6.0],
    'Vijayapura': [27.2, 2.0, 580.0, 80.0, 48.0, 5.0],
    'Vijayanagara': [27.9, 1.9, 625.0, 85.0, 52.0, 5.0],
    'Yadgir': [28.3, 2.0, 680.0, 95.0, 50.0, 5.0]
}

# District crop probabilities
crop_probs = {
    'Bagalkot': (['Corn', 'Wheat', 'Vegetables', 'Rice', 'Soybeans'], [0.40, 0.30, 0.20, 0.05, 0.05]),
    'Bangalore Rural': (['Vegetables', 'Rice', 'Corn', 'Wheat', 'Soybeans'], [0.60, 0.15, 0.15, 0.05, 0.05]),
    'Bangalore Urban': (['Vegetables', 'Rice', 'Corn', 'Wheat', 'Soybeans'], [0.70, 0.10, 0.10, 0.05, 0.05]),
    'Belagavi': (['Rice', 'Vegetables', 'Soybeans', 'Wheat', 'Corn'], [0.35, 0.35, 0.20, 0.05, 0.05]),
    'Ballari': (['Rice', 'Corn', 'Vegetables', 'Wheat', 'Soybeans'], [0.45, 0.45, 0.05, 0.03, 0.02]),
    'Bidar': (['Soybeans', 'Wheat', 'Corn', 'Vegetables', 'Rice'], [0.40, 0.30, 0.20, 0.05, 0.05]),
    'Chamarajanagar': (['Vegetables', 'Corn', 'Rice', 'Wheat', 'Soybeans'], [0.50, 0.30, 0.10, 0.05, 0.05]),
    'Chikkaballapur': (['Vegetables', 'Corn', 'Wheat', 'Rice', 'Soybeans'], [0.60, 0.20, 0.10, 0.05, 0.05]),
    'Chikkamagaluru': (['Vegetables', 'Rice', 'Corn', 'Soybeans', 'Wheat'], [0.70, 0.15, 0.10, 0.05, 0.00]),
    'Chitradurga': (['Corn', 'Rice', 'Vegetables', 'Soybeans', 'Wheat'], [0.45, 0.20, 0.20, 0.10, 0.05]),
    'Dakshina Kannada': (['Vegetables', 'Rice', 'Corn', 'Wheat', 'Soybeans'], [0.80, 0.20, 0.00, 0.00, 0.00]),
    'Davanagere': (['Rice', 'Corn', 'Vegetables', 'Soybeans', 'Wheat'], [0.40, 0.40, 0.10, 0.05, 0.05]),
    'Dharwad': (['Wheat', 'Corn', 'Soybeans', 'Vegetables', 'Rice'], [0.30, 0.30, 0.30, 0.05, 0.05]),
    'Gadag': (['Wheat', 'Corn', 'Soybeans', 'Vegetables', 'Rice'], [0.35, 0.35, 0.20, 0.05, 0.05]),
    'Kalaburagi': (['Corn', 'Wheat', 'Vegetables', 'Rice', 'Soybeans'], [0.45, 0.35, 0.10, 0.05, 0.05]),
    'Hassan': (['Vegetables', 'Rice', 'Corn', 'Soybeans', 'Wheat'], [0.50, 0.25, 0.15, 0.05, 0.05]),
    'Haveri': (['Corn', 'Wheat', 'Soybeans', 'Vegetables', 'Rice'], [0.40, 0.25, 0.20, 0.10, 0.05]),
    'Kodagu': (['Vegetables', 'Rice', 'Corn', 'Wheat', 'Soybeans'], [0.85, 0.15, 0.00, 0.00, 0.00]),
    'Kolar': (['Vegetables', 'Corn', 'Rice', 'Wheat', 'Soybeans'], [0.65, 0.20, 0.05, 0.05, 0.05]),
    'Koppal': (['Corn', 'Vegetables', 'Rice', 'Wheat', 'Soybeans'], [0.50, 0.30, 0.10, 0.05, 0.05]),
    'Mandya': (['Rice', 'Vegetables', 'Corn', 'Wheat', 'Soybeans'], [0.55, 0.25, 0.15, 0.03, 0.02]),
    'Mysuru': (['Rice', 'Vegetables', 'Corn', 'Wheat', 'Soybeans'], [0.40, 0.40, 0.10, 0.05, 0.05]),
    'Raichur': (['Rice', 'Corn', 'Vegetables', 'Wheat', 'Soybeans'], [0.65, 0.20, 0.10, 0.03, 0.02]),
    'Ramanagara': (['Vegetables', 'Rice', 'Corn', 'Wheat', 'Soybeans'], [0.60, 0.15, 0.15, 0.05, 0.05]),
    'Shivamogga': (['Rice', 'Vegetables', 'Corn', 'Wheat', 'Soybeans'], [0.60, 0.30, 0.05, 0.03, 0.02]),
    'Tumakuru': (['Vegetables', 'Rice', 'Corn', 'Wheat', 'Soybeans'], [0.60, 0.20, 0.10, 0.05, 0.05]),
    'Udupi': (['Vegetables', 'Rice', 'Corn', 'Wheat', 'Soybeans'], [0.85, 0.15, 0.00, 0.00, 0.00]),
    'Uttara Kannada': (['Vegetables', 'Rice', 'Corn', 'Wheat', 'Soybeans'], [0.75, 0.25, 0.00, 0.00, 0.00]),
    'Vijayapura': (['Corn', 'Wheat', 'Vegetables', 'Rice', 'Soybeans'], [0.35, 0.40, 0.20, 0.02, 0.03]),
    'Vijayanagara': (['Rice', 'Corn', 'Vegetables', 'Wheat', 'Soybeans'], [0.45, 0.45, 0.05, 0.03, 0.02]),
    'Yadgir': (['Corn', 'Rice', 'Vegetables', 'Wheat', 'Soybeans'], [0.40, 0.40, 0.10, 0.05, 0.05])
}

# Carbon footprint calculation parameters (matches data_generator.py)
crop_baselines = {'Rice': 800.0, 'Corn': 350.0, 'Wheat': 250.0, 'Soybeans': 100.0, 'Vegetables': 300.0}
fert_factors = {'Urea': 2.3, 'Ammonium Nitrate': 2.9, 'NPK_15-15-15': 1.5, 'Organic': 0.4, 'None': 0.0}

def select_crop_by_prob(crop_list, prob_list):
    return random.choices(crop_list, weights=prob_list, k=1)[0]

def clip_value(val, min_val, max_val):
    return max(min_val, min(max_val, val))

def sample_fertilizer(crop):
    fert_options = ['Urea', 'Ammonium Nitrate', 'NPK_15-15-15', 'Organic', 'None']
    if crop == 'Soybeans':
        f_type = random.choices(fert_options, weights=[0.05, 0.05, 0.20, 0.40, 0.30], k=1)[0]
        f_amt = random.uniform(0, 100) if f_type != 'None' else 0.0
    elif crop == 'Rice':
        f_type = random.choices(fert_options, weights=[0.45, 0.20, 0.25, 0.05, 0.05], k=1)[0]
        f_amt = random.uniform(150, 450) if f_type != 'None' else 0.0
    elif crop == 'Corn':
        f_type = random.choices(fert_options, weights=[0.50, 0.25, 0.15, 0.05, 0.05], k=1)[0]
        f_amt = random.uniform(180, 450) if f_type != 'None' else 0.0
    elif crop == 'Wheat':
        f_type = random.choices(fert_options, weights=[0.35, 0.30, 0.25, 0.05, 0.05], k=1)[0]
        f_amt = random.uniform(100, 300) if f_type != 'None' else 0.0
    else:  # Vegetables
        f_type = random.choices(fert_options, weights=[0.10, 0.15, 0.45, 0.25, 0.05], k=1)[0]
        f_amt = random.uniform(100, 350) if f_type != 'None' else 0.0
    return f_type, round(f_amt, 1)

def calculate_footprint(crop, fert_type, fert_amount, temp, rain, hum, n, p, k, ph, soc):
    e_crop = crop_baselines[crop]
    e_fert = fert_factors[fert_type] * fert_amount
    e_weather = (temp * 6.0) + ((rain / 100.0) * 8.0) + (hum * 2.5)
    e_soil = (n * 0.45) + (p * 0.15) + (k * 0.10) + (((ph - 6.5) ** 2) * 12.0)
    carbon_sink = soc * 150.0
    net_emissions = e_crop + e_fert + e_weather + e_soil - carbon_sink
    noise = random.normalvariate(0, 25.0)
    return round(net_emissions + noise, 1)

def map_raw_crop(raw_crop):
    raw_crop = str(raw_crop).lower()
    if 'paddy' in raw_crop or 'rice' in raw_crop:
        return 'Rice'
    elif 'maize' in raw_crop or 'corn' in raw_crop or 'bajra' in raw_crop or 'sorghum' in raw_crop or 'jowar' in raw_crop:
        return 'Corn'
    elif 'wheat' in raw_crop:
        return 'Wheat'
    elif 'groundnut' in raw_crop or 'soy' in raw_crop or 'avare' in raw_crop or 'pulse' in raw_crop:
        return 'Soybeans'
    else:
        return 'Vegetables'

def generate_11_dist_data():
    compiled_rows = []
    
    # 1. READ CHITRADURGA REAL DATA
    print("Reading and cleaning raw Chitradurga soil data...")
    chitradurga_rows_count = 0
    
    # Pre-calculated averages for Chitradurga to impute missing chemical values
    ch_n_vals, ch_p_vals, ch_k_vals, ch_ph_vals, ch_oc_vals = [], [], [], [], []
    
    raw_records = []
    with open(SOIL_SAMPLE_PATH, 'r', encoding='utf-8', errors='replace') as f:
        reader = csv.reader(f)
        headers = next(reader)
        
        # Column index mapping
        idx_crop = headers.index('kharifcrop')
        idx_n = headers.index('avl_n')
        idx_p = headers.index('avl_p')
        idx_k = headers.index('avl_k')
        idx_oc = headers.index('avl_oc')
        idx_ph = headers.index('ph')
        
        for row in reader:
            if not row or len(row) < len(headers):
                continue
            
            # Extract values
            crop_raw = row[idx_crop]
            n_raw = row[idx_n]
            p_raw = row[idx_p]
            k_raw = row[idx_k]
            oc_raw = row[idx_oc]
            ph_raw = row[idx_ph]
            
            # Check for non-empty records and filter out completely un-tested entries
            if n_raw == 'N/A' and p_raw == 'N/A' and k_raw == 'N/A':
                continue
                
            try:
                n = float(n_raw) if n_raw not in ('N/A', '') else None
                p = float(p_raw) if p_raw not in ('N/A', '') else None
                k = float(k_raw) if k_raw not in ('N/A', '') else None
                oc = float(oc_raw) if oc_raw not in ('N/A', '') else None
                ph = float(ph_raw) if ph_raw not in ('N/A', '') else None
                
                if n is not None: ch_n_vals.append(n)
                if p is not None: ch_p_vals.append(p)
                if k is not None: ch_k_vals.append(k)
                if oc is not None: ch_oc_vals.append(oc)
                if ph is not None: ch_ph_vals.append(ph)
                
                raw_records.append({
                    'crop_raw': crop_raw,
                    'n': n, 'p': p, 'k': k, 'oc': oc, 'ph': ph
                })
            except ValueError:
                continue

    # Compute fallbacks
    fallback_n = sum(ch_n_vals)/len(ch_n_vals) if ch_n_vals else 85.0
    fallback_p = sum(ch_p_vals)/len(ch_p_vals) if ch_p_vals else 18.0
    fallback_k = sum(ch_k_vals)/len(ch_k_vals) if ch_k_vals else 92.0
    fallback_oc = sum(ch_oc_vals)/len(ch_oc_vals) if ch_oc_vals else 0.45
    fallback_ph = sum(ch_ph_vals)/len(ch_ph_vals) if ch_ph_vals else 7.1
    
    # Process Chitradurga records
    ch_weather = weather_stats['Chitradurga']
    for rec in raw_records:
        n = clip_value(rec['n'] if rec['n'] is not None else fallback_n, 10, 200)
        p = clip_value(rec['p'] if rec['p'] is not None else fallback_p, 5, 100)
        k = clip_value(rec['k'] if rec['k'] is not None else fallback_k, 10, 150)
        soc = clip_value(rec['oc'] if rec['oc'] is not None else fallback_oc, 0.5, 5.0)
        ph = clip_value(rec['ph'] if rec['ph'] is not None else fallback_ph, 4.5, 8.5)
        
        crop = map_raw_crop(rec['crop_raw'])
        fert_type, fert_amount = sample_fertilizer(crop)
        
        # Sample weather around Chitradurga climatology
        temp = clip_value(random.normalvariate(ch_weather[0], ch_weather[1]), 10, 38)
        rain = clip_value(random.normalvariate(ch_weather[2], ch_weather[3]), 200, 2000)
        hum = clip_value(random.normalvariate(ch_weather[4], ch_weather[5]), 30, 90)
        
        # Round parameters
        temp = round(temp, 1)
        rain = round(rain, 1)
        hum = round(hum, 1)
        n = round(n, 1)
        p = round(p, 1)
        k = round(k, 1)
        ph = round(ph, 2)
        soc = round(soc, 2)
        
        footprint = calculate_footprint(crop, fert_type, fert_amount, temp, rain, hum, n, p, k, ph, soc)
        
        compiled_rows.append([
            crop, soc, n, p, k, ph, fert_type, fert_amount, temp, rain, hum, footprint
        ])
        chitradurga_rows_count += 1
        
    print(f"Loaded {chitradurga_rows_count} real cleaned records for Chitradurga.")
    
    # 1.5 READ EXTERNAL REAL SOIL DATA
    external_rows_count = 0
    if os.path.exists(EXTERNAL_DATA_PATH):
        print("Reading and appending external real soil data (from Kaggle/Google)...")
        with open(EXTERNAL_DATA_PATH, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            headers = next(reader)
            for row in reader:
                if not row:
                    continue
                try:
                    crop = row[0]
                    soc = float(row[1])
                    n = float(row[2])
                    p = float(row[3])
                    k = float(row[4])
                    ph = float(row[5])
                    fert_type = row[6]
                    fert_amount = float(row[7])
                    temp = float(row[8])
                    rain = float(row[9])
                    hum = float(row[10])
                    footprint = float(row[11])
                    
                    compiled_rows.append([
                        crop, soc, n, p, k, ph, fert_type, fert_amount, temp, rain, hum, footprint
                    ])
                    external_rows_count += 1
                except Exception as e:
                    continue
        print(f"Loaded {external_rows_count} external real records.")
        
    # 2. GENERATE SAMPLED DATA FOR 10 OTHER DISTRICTS
    print("Generating sampled soil distributions for other 10 priority districts...")
    sampled_dist_count = 0
    samples_per_district = 2000
    
    for dist, stats in soil_stats.items():
        w_stats = weather_stats[dist]
        crop_list, crop_weight = crop_probs[dist]
        
        for _ in range(samples_per_district):
            # Sample soil metrics
            n = clip_value(random.normalvariate(stats[0], stats[1]), 10, 200)
            p = clip_value(random.normalvariate(stats[2], stats[3]), 5, 100)
            k = clip_value(random.normalvariate(stats[4], stats[5]), 10, 150)
            ph = clip_value(random.normalvariate(stats[6], stats[7]), 4.5, 8.5)
            soc = clip_value(random.normalvariate(stats[8], stats[9]), 0.5, 5.0)
            
            # Select Crop and Fertilizer
            crop = select_crop_by_prob(crop_list, crop_weight)
            fert_type, fert_amount = sample_fertilizer(crop)
            
            # Sample weather variables
            temp = clip_value(random.normalvariate(w_stats[0], w_stats[1]), 10, 38)
            rain = clip_value(random.normalvariate(w_stats[2], w_stats[3]), 200, 2000)
            hum = clip_value(random.normalvariate(w_stats[4], w_stats[5]), 30, 90)
            
            # Rounding
            temp = round(temp, 1)
            rain = round(rain, 1)
            hum = round(hum, 1)
            n = round(n, 1)
            p = round(p, 1)
            k = round(k, 1)
            ph = round(ph, 2)
            soc = round(soc, 2)
            
            footprint = calculate_footprint(crop, fert_type, fert_amount, temp, rain, hum, n, p, k, ph, soc)
            
            compiled_rows.append([
                crop, soc, n, p, k, ph, fert_type, fert_amount, temp, rain, hum, footprint
            ])
            sampled_dist_count += 1
            
    print(f"Generated {sampled_dist_count} sampled records across 10 districts.")
    
    # 3. WRITE TO THE MASTER FILE
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'Crop_Type', 'SOC', 'N_Content', 'P_Content', 'K_Content', 'pH', 
            'Fertilizer_Type', 'Fertilizer_Amount', 'Temperature', 'Rainfall', 'Humidity', 'Carbon_Footprint'
        ])
        writer.writerows(compiled_rows)
        
    print(f"\nCompleted! Combined 11-district dataset compiled successfully.")
    print(f"Total Rows: {len(compiled_rows)}")
    print(f"Dataset saved to: {OUTPUT_PATH}")

if __name__ == '__main__':
    generate_11_dist_data()
