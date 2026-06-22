import csv

karnataka_labs = []
with open("downloads/dataset/Soil_Testing_Lab.CSV", mode="r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        state = row.get("testcenter_state_name", "").strip().upper()
        if "KARNATAKA" in state:
            karnataka_labs.append(row)

print(f"Total Karnataka labs: {len(karnataka_labs)}")
for lab in karnataka_labs[:5]:
    print(lab["testcenter_name"], lab["testcenter_district_name"], lab["region_geolocation_coordinates_latitude"], row.get("region_geolocation_coordinates_logitude"))
