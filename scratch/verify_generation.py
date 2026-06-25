import random
import numpy as np
import pandas as pd

# District definitions and their official soil distributions (Mean, Std Dev)
# [N_mean, N_std, P_mean, P_std, K_mean, K_std, pH_mean, pH_std, OC_mean, OC_std]
soil_stats = {
    'Bagalkot': [140.0, 25.0, 20.0, 5.0, 320.0, 45.0, 8.0, 0.3, 0.45, 0.08],
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

def clip_value(v, min_v, max_v):
    return max(min(v, max_v), min_v)

print("Running statistical validation of generated soil properties vs configured targets...")
print("-" * 155)
print(f"{'District':<18} | {'N (Target)':<10} | {'N (Gen)':<8} | {'P (Target)':<10} | {'P (Gen)':<8} | {'K (Target)':<10} | {'K (Gen)':<8} | {'pH (Target)':<11} | {'pH (Gen)':<8} | {'SOC (Target)':<12} | {'SOC (Gen)':<8}")
print("-" * 155)

random.seed(42)
for dist, stats in soil_stats.items():
    n_samples = []
    p_samples = []
    k_samples = []
    ph_samples = []
    soc_samples = []
    
    # Simulate generating 2000 records
    for _ in range(2000):
        n_samples.append(clip_value(random.normalvariate(stats[0], stats[1]), 10, 200))
        p_samples.append(clip_value(random.normalvariate(stats[2], stats[3]), 5, 100))
        k_samples.append(clip_value(random.normalvariate(stats[4], stats[5]), 10, 150))
        ph_samples.append(clip_value(random.normalvariate(stats[6], stats[7]), 4.5, 8.5))
        soc_samples.append(clip_value(random.normalvariate(stats[8], stats[9]), 0.5, 5.0))
        
    n_mean_gen = np.mean(n_samples)
    p_mean_gen = np.mean(p_samples)
    k_mean_gen = np.mean(k_samples)
    ph_mean_gen = np.mean(ph_samples)
    soc_mean_gen = np.mean(soc_samples)
    
    print(f"{dist:<18} | {stats[0]:<10.1f} | {n_mean_gen:<8.2f} | {stats[2]:<10.1f} | {p_mean_gen:<8.2f} | {stats[4]:<10.1f} | {k_mean_gen:<8.2f} | {stats[6]:<11.2f} | {ph_mean_gen:<8.2f} | {stats[8]:<12.2f} | {soc_mean_gen:<8.2f}")

print("-" * 155)
