import urllib.request
import json

def test_geocode(query):
    url = f"https://geocoding-api.open-meteo.com/v1/search?name={urllib.parse.quote(query)}&count=1&language=en&format=json"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            print(f"Query: {query} -> Results: {data.get('results')}")
    except Exception as e:
        print(f"Error for {query}: {e}")

test_geocode("Belagavi, Karnataka, India")
test_geocode("Belagavi")
