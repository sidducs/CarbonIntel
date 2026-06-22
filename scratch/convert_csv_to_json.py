import csv
import json
import os

labs = []
csv_path = "downloads/dataset/Soil_Testing_Lab.CSV"
json_path = "frontend/src/services/soilLabs.json"

if not os.path.exists(csv_path):
    print("CSV not found!")
    exit(1)

with open(csv_path, mode="r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            lat = float(row.get("region_geolocation_coordinates_latitude", 0))
            lng = float(row.get("region_geolocation_coordinates_logitude", 0))
        except (ValueError, TypeError):
            continue
            
        # Ignore zero or invalid geolocations
        if lat == 0 or lng == 0:
            continue

        labs.append({
            "name": row.get("testcenter_name", "").strip(),
            "state": row.get("testcenter_state_name", "").strip(),
            "district": row.get("testcenter_district_name", "").strip(),
            "latitude": lat,
            "longitude": lng,
            "timing_from": row.get("testcenter_timing_from", "").strip(),
            "timing_to": row.get("testcenter_timing_to", "").strip(),
        })

print(f"Parsed {len(labs)} valid labs. Writing to {json_path}...")
os.makedirs(os.path.dirname(json_path), exist_ok=True)
with open(json_path, mode="w", encoding="utf-8") as f:
    json.dump(labs, f, indent=2, ensure_ascii=False)
print("Done!")
