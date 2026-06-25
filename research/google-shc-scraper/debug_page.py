import os
import sys
import asyncio
import pyppeteer

# Mock google cloud loggers to avoid ModuleNotFoundError
from unittest.mock import MagicMock
sys.modules['google.cloud'] = MagicMock()
sys.modules['google.cloud.logging'] = MagicMock()

async def debug_page():
    print("Launching browser...")
    browser = await pyppeteer.launch({
        'headless': True,
        'executablePath': r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        'args': ['--no-sandbox']
    })
    
    page = await browser.newPage()
    await page.setViewport({'width': 1280, 'height': 800})
    
    # Catch console logs and page errors
    page.on('console', lambda msg: print(f"[CONSOLE] {msg.text}"))
    page.on('pageerror', lambda err: print(f"[PAGE ERROR] {err}"))
    
    print("Navigating to legacy dashboard...")
    await page.goto("https://soilhealth.dac.gov.in/dashboard", {'waitUntil': 'networkidle2'})
    
    print("Waiting 10 seconds...")
    await asyncio.sleep(10)
    
    # Take screenshot
    screenshot_path = 'research/google-shc-scraper/screenshot.png'
    await page.screenshot({'path': screenshot_path})
    print(f"Saved screenshot to: {screenshot_path}")
    
    # Get page body text
    body_text = await page.evaluate('document.body.innerText')
    print("\n--- BODY TEXT ---")
    print(body_text[:2000])
    
    # Get all links
    links = await page.evaluate('''() => {
        return Array.prototype.slice.call(document.getElementsByTagName("a")).map(a => {
            return { text: a.innerText, href: a.href };
        });
    }''')
    print("\n--- ALL LINKS ---")
    for link in links:
        print(f"Text: {link['text'].strip()} | Href: {link['href']}")
        
    # Get root children structure
    root_html = await page.evaluate('document.getElementById("root").innerHTML')
    print("\n--- ROOT DIV HTML ---")
    print(root_html[:1000])
    
    await browser.close()

if __name__ == '__main__':
    asyncio.run(debug_page())
