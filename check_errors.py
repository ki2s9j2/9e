import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--log-level=0')
driver = webdriver.Chrome(options=chrome_options)

try:
    driver.get('http://localhost:8000')
    time.sleep(1)
    # Get logs initially
    for entry in driver.get_log('browser'):
        print('LOG:', entry)
        
    # Simulate moving through the phases
    print("Clicking continueBtn")
    driver.execute_script("document.getElementById('continueBtn').click();")
    time.sleep(1.5)
    
    print("Clicking seal")
    driver.execute_script("document.getElementById('seal').click();")
    time.sleep(3) # Wait for typing to finish (might take longer but we can trigger giftBtn anyway)
    
    print("Clicking giftBtn")
    driver.execute_script("document.getElementById('giftBtn').click();")
    time.sleep(1.5)
    
    print("Checking final logs...")
    for entry in driver.get_log('browser'):
        print('LOG:', entry)
        
    print("DONE")
finally:
    driver.quit()
