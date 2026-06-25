import os
import sys
import asyncio
import pyppeteer

# Mock google cloud loggers to avoid ModuleNotFoundError
from unittest.mock import MagicMock
sys.modules['google.cloud'] = MagicMock()
sys.modules['google.cloud.logging'] = MagicMock()

async def inspect_network():
    print("Launching headless Chrome to inspect API requests...")
    # Monkey-patch launch to use local Chrome
    browser = await pyppeteer.launch({
        'headless': True,
        'executablePath': r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        'args': ['--no-sandbox']
    })
    
    page = await browser.newPage()
    
    # List to store API URLs
    api_requests = []
    
    # Intercept requests
    async def handle_request(request):
        url = request.url
        # If it's an API request (usually JSON or contains /api/ or has state/district lookups)
        if any(term in url for term in ['api', 'get', 'state', 'district', 'Search', 'master']):
            if not url.endswith('.js') and not url.endswith('.css') and not url.endswith('.png'):
                print(f"[API Request] {request.method} -> {url}")
                api_requests.append((request.method, url))
        await request.continue_()

    # Intercept responses
    async def handle_response(response):
        url = response.url
        if any(term in url for term in ['api', 'get', 'state', 'district', 'Search', 'master']):
            if not url.endswith('.js') and not url.endswith('.css') and not url.endswith('.png'):
                try:
                    text = await response.text()
                    print(f"[API Response] {url} -> Content Length: {len(text)} | Sample Content: {text[:100]}")
                except Exception:
                    pass

    await page.setRequestInterception(True)
    page.on('request', lambda r: asyncio.ensure_future(handle_request(r)))
    page.on('response', lambda r: asyncio.ensure_future(handle_response(r)))
    
    print("Navigating to https://soilhealth.dac.gov.in/print-shc...")
    try:
        await page.goto("https://soilhealth.dac.gov.in/print-shc", {'timeout': 60000, 'waitUntil': 'networkidle2'})
        print("Page loaded completely. Waiting 10 seconds for background calls...")
        await asyncio.sleep(10)
        
        # Dump fully rendered HTML
        html_rendered = await page.content()
        with open('research/react_rendered_print_shc.html', 'w', encoding='utf-8') as f:
            f.write(html_rendered)
        print("Wrote rendered HTML to research/react_rendered_print_shc.html")
    except Exception as e:
        print(f"Error during navigation: {e}")
    finally:
        print("Closing browser...")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_network())
