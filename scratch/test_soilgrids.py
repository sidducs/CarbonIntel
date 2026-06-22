import urllib.request
import json

def test_soilgrids():
    lat = 28.6139
    lon = 77.2090
    url = f"https://rest.isric.org/soilgrids/v2.0/properties/query?lat={lat}&lon={lon}&property=soc&property=phh2o&property=nitrogen&depth=0-5cm&value=mean"
    print(f"Querying: {url}")
    
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            status_code = response.getcode()
            print(f"Status Code: {status_code}")
            data = json.loads(response.read().decode('utf-8'))
            
            # Print structured layers
            layers = data.get("properties", {}).get("layers", [])
            print(f"Found {len(layers)} layers:")
            for l in layers:
                name = l.get("name")
                mean_val = l.get("depths", [{}])[0].get("values", {}).get("mean")
                print(f" - {name}: {mean_val}")
                
    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == "__main__":
    test_soilgrids()
