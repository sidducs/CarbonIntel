import os
import sys
import asyncio
import pyppeteer

# Mock google cloud loggers to avoid ModuleNotFoundError
from unittest.mock import MagicMock
sys.modules['google.cloud'] = MagicMock()
sys.modules['google.cloud.logging'] = MagicMock()

async def click_print_card():
    print("Launching browser...")
    browser = await pyppeteer.launch({
        'headless': True,
        'executablePath': r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        'args': ['--no-sandbox']
    })
    
    page = await browser.newPage()
    await page.setViewport({'width': 1280, 'height': 800})
    
    page.on('console', lambda msg: print(f"[CONSOLE] {msg.text}"))
    page.on('pageerror', lambda err: print(f"[PAGE ERROR] {err}"))
    
    print("Navigating to homepage...")
    await page.goto("https://soilhealth.dac.gov.in/", {'waitUntil': 'networkidle2'})
    await asyncio.sleep(15)
    
    print("Looking for '/print-card' link...")
    # Find the link with the href including "/print-card" and click it
    link_clicked, found_links = await page.evaluate('''() => {
        const links = Array.from(document.getElementsByTagName("a"));
        const target = links.find(a => a.href && a.href.includes("/print-card"));
        
        // Debug info if not found
        const debug = [];
        if (!target) {
            links.forEach(a => {
                debug.push({ text: a.innerText, href: a.href });
            });
        }
        
        if (target) {
            target.click();
            return [true, debug];
        }
        return [false, debug];
    }''')
    
    print(f"Total links found: {len(found_links)}")
    for fl in found_links[:50]: # Print top 50 links for debugging
        print(f"  Debug Link - Text: {fl['text'].strip()} | Href: {fl['href']}")
    
    if link_clicked:
        print("Clicked 'Print Soil Health Card' link successfully. Waiting 10 seconds for page transition...")
        await asyncio.sleep(10)
        
        # Take screenshot of the new page state
        screenshot_path = 'research/google-shc-scraper/print_page_screenshot.png'
        await page.screenshot({'path': screenshot_path})
        print(f"Saved screenshot to: {screenshot_path}")
        
        # Get page body text after click
        body_text = await page.evaluate('document.body.innerText')
        print("\n--- BODY TEXT AFTER CLICK ---")
        print(body_text[:2000])
        
        # Dump root HTML
        root_html = await page.evaluate('document.getElementById("root").innerHTML')
        print("\n--- ROOT DIV HTML AFTER CLICK ---")
        print(root_html[:1000])
    else:
        print("Could not find the link with text 'Print Soil Health Card'")
        
    await browser.close()

if __name__ == '__main__':
    asyncio.run(click_print_card())
