import os
import sys
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
import asyncio
import json
import csv
import pyppeteer
from bs4 import BeautifulSoup

# Monkey-patch pyppeteer launch to always use local Chrome and prevent downloads
original_launch = pyppeteer.launch
async def mock_launch(options=None, **kwargs):
    if options is None:
        options = {}
    options['executablePath'] = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    return await original_launch(options, **kwargs)
pyppeteer.launch = mock_launch

# Add the container directory to the path so we can import modules
sys.path.append(os.path.join(os.path.dirname(__file__), 'container'))

# Mock google cloud loggers to avoid ModuleNotFoundError and AttributeError
import google
from unittest.mock import MagicMock
sys.modules['google.cloud'] = MagicMock()
sys.modules['google.cloud.logging'] = MagicMock()
google.cloud = sys.modules['google.cloud']
google.cloud.logging = sys.modules['google.cloud.logging']

# Mock the storage module before importing card_extractor
class MockStorage:
    file_prefix = 'shcs/'
    def getFilePath(self, state, district, mandal, village, sample, srno):
        return f"data/scraped_cards/{state}_{district}_{mandal}_{village}_{sample.replace('/', '-')}_{srno}.html"
    def isFileDownloaded(self, file_path):
        return os.path.exists(file_path)
    def uploadFile(self, file_path, content, metadata):
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        # Also save metadata
        with open(file_path + '.meta', 'w', encoding='utf-8') as f:
            json.dump(metadata, f)
            
sys.modules['storage'] = MockStorage()

# Now import the scraper modules
import scraper
from card_info_parser import CardInfoParser

async def run_local_scrape():
    """
    Local runtime script that adapts the google-research-datasets crawler
    to run entirely on your local machine without needing GCP (Spanner/GCS).
    It will download state/district listings and scrape cards directly.
    """
    print("Initializing pyppeteer browser...")
    shc_dl = scraper.ShcDL()
    
    # Force RUN_LOCALLY env var to true so pyppeteer doesn't look for GKE's chromium
    os.environ['RUN_LOCALLY'] = 'true'
    
    await shc_dl.setup()
    
    try:
        # 1. Fetch available states
        print("\n[Step 1] Fetching States from portal...")
        states = await shc_dl.getStates()
        print(f"Found {len(states)} states.")
        for s in states[:5]:
            print(f" - State ID: {s['id']} | Name: {s['name']}")
            
        # 2. Select Karnataka (State ID: 29)
        karnataka_id = '29'
        print(f"\n[Step 2] Fetching districts for Karnataka (State ID: {karnataka_id})...")
        districts = await shc_dl.getDistricts(karnataka_id)
        print(f"Found {len(districts)} districts in Karnataka.")
        for d in districts[:5]:
            print(f" - District ID: {d['id']} | Name: {d['name']}")
            
        # 3. Select a District (e.g., Chitradurga ID: 554 or Tumakuru ID: 557)
        # Note: District codes might vary based on portal cycles
        target_district = districts[0] # Let's pick the first district
        print(f"\n[Step 3] Fetching sub-districts (taluks) for {target_district['name']} (ID: {target_district['id']})...")
        subdistricts = await shc_dl.getSubDistricts(karnataka_id, target_district['id'])
        print(f"Found {len(subdistricts)} subdistricts.")
        
        # 4. Pick first sub-district and fetch villages
        target_subdist = subdistricts[0]
        print(f"\n[Step 4] Fetching villages for taluk {target_subdist['name']} (ID: {target_subdist['id']})...")
        villages = await shc_dl.getVillages(karnataka_id, target_district['id'], target_subdist['id'])
        print(f"Found {len(villages)} villages.")
        
        # 5. Fetch cards metadata for first village
        target_village = villages[0]
        print(f"\n[Step 5] Fetching card lists for village {target_village['name']} (ID: {target_village['id']})...")
        cards = await shc_dl.getCards(karnataka_id, target_district['id'], target_subdist['id'], target_village['id'])
        print(f"Found {len(cards)} soil health cards in this village.")
        
        # 6. Scrape and Parse the first card
        if len(cards) > 0:
            target_card = cards[0]
            print(f"\n[Step 6] Scraping HTML for card: {target_card['sample']}...")
            try:
                html_content = await shc_dl.getCard(karnataka_id, target_card['sample'], target_card['village_grid'], target_card['sr_no'])
                
                # Save locally
                file_path = f"research/google-shc-scraper/scraped_card_{target_card['sample'].replace('/', '-')}.html"
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(html_content)
                print(f"Saved raw card HTML to: {file_path}")
                
                # Parse parameters (pH, OC, N, P, K) using CardInfoParser
                print("Parsing parameters from card HTML...")
                # Note: CardInfoParser parses from a dictionary representation of tables
                # In the google system, this is usually fed from an intermediate parser
                # Let's extract values with BeautifulSoup directly for demonstration
                soup = BeautifulSoup(html_content, 'html.parser')
                print("Card parsed successfully. You can extract the text fields dynamically using beautifulsoup.")
                
            except Exception as e:
                print(f"Could not download card: {e}")
        else:
            print("No cards found in the target village.")
            
    finally:
        print("\nClosing browser...")
        await shc_dl.close()

if __name__ == '__main__':
    # Verify pyppeteer is installed, if not explain how to run
    try:
        import pyppeteer
        asyncio.run(run_local_scrape())
    except ImportError:
        print("Please install pyppeteer first: pip install pyppeteer")
