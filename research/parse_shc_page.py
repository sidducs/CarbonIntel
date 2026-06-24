import os
from bs4 import BeautifulSoup

def parse_html():
    file_path = 'research/react_rendered_print_shc.html'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
            
    soup = BeautifulSoup(content, 'html.parser')
    
    # Print basic details
    print(f"Page Title: {soup.title.string if soup.title else 'No Title'}")
    
    # Find all select boxes
    print("\n--- Select Dropdowns ---")
    for select in soup.find_all('select'):
        print(f"Select Name: {select.get('name')} | ID: {select.get('id')} | Classes: {select.get('class')}")
        options = select.find_all('option')
        print(f"  Options Count: {len(options)}")
        for opt in options[:5]:
            print(f"    - Value: {opt.get('value')} | Text: {opt.text.strip()}")
            
    # Find all input fields
    print("\n--- Input Fields ---")
    for ipt in soup.find_all('input'):
        print(f"Input Type: {ipt.get('type')} | Name: {ipt.get('name')} | ID: {ipt.get('id')} | Value: {ipt.get('value')}")
        
    # Find all buttons
    print("\n--- Buttons ---")
    for btn in soup.find_all('button'):
        print(f"Button Text: {btn.text.strip()} | ID: {btn.get('id')} | Type: {btn.get('type')}")
        
    # Find links
    print("\n--- Forms ---")
    for form in soup.find_all('form'):
        print(f"Form Action: {form.get('action')} | Method: {form.get('method')}")

if __name__ == '__main__':
    parse_html()
