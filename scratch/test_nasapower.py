import urllib.request
import json

def test_nasapower():
    # Belagavi coordinates
    lat = 15.8497
    lon = 74.4977
    url = f"https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M,RH2M,PRECTOTCORR&community=AG&longitude={lon}&latitude={lat}&format=JSON"
    
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode('utf-8'))
            params = data["properties"]["parameter"]
            for name, val in params.items():
                ann_val = val.get('ANN')
                if name == "PRECTOTCORR":
                    print(f"{name} -> ANN: {ann_val} mm/day (Annual: {ann_val * 365:.2f} mm)")
                else:
                    print(f"{name} -> ANN: {ann_val}")
                
    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == "__main__":
    test_nasapower()
