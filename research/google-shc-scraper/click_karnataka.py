import os
import sys
import asyncio
import pyppeteer

# Mock google cloud loggers to avoid ModuleNotFoundError
from unittest.mock import MagicMock
sys.modules['google.cloud'] = MagicMock()
sys.modules['google.cloud.logging'] = MagicMock()

async def click_karnataka():
    print("Launching browser...")
    browser = await pyppeteer.launch({
        'headless': True,
        'executablePath': r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        'args': ['--no-sandbox']
    })
    
    page = await browser.newPage()
    await page.setViewport({'width': 1280, 'height': 800})
    
    print("Navigating to legacy dashboard...")
    await page.goto("https://soilhealth.dac.gov.in/dashboard", {'waitUntil': 'networkidle2'})
    print("Waiting 10 seconds for dashboard to load...")
    await asyncio.sleep(10)
    
    # Check if we can find KARNATAKA element and click it
    clicked = await page.evaluate('''() => {
        // Look for any element containing the text "KARNATAKA"
        const elements = Array.from(document.querySelectorAll("*"));
        const target = elements.find(el => el.innerText && el.innerText.trim() === "KARNATAKA");
        if (target) {
            target.click();
            return true;
        }
        return false;
    }''')
    
    if clicked:
        print("Clicked KARNATAKA successfully! Waiting 10 seconds for district view to load...")
        await asyncio.sleep(10)
        
        # Save screenshot
        screenshot_path = 'research/google-shc-scraper/karnataka_districts.png'
        await page.screenshot({'path': screenshot_path})
        print(f"Saved screenshot to: {screenshot_path}")
        
        # Get page body text after click
        body_text = await page.evaluate('document.body.innerText')
        print("\n--- BODY TEXT AFTER CLICKING KARNATAKA ---")
        print(body_text[:2000])
    else:
        print("Could not find the element containing 'KARNATAKA'")
        
    await browser.close()

if __name__ == '__main__':
    asyncio.run(click_karnataka())
