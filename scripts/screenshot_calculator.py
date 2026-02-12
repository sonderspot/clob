#!/usr/bin/env python3
"""Take screenshot of waitingformacguffin public calculator with PTA $1000 bet on Best Director."""

from playwright.sync_api import sync_playwright
import time

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 900})
        
        print("Loading waitingformacguffin.com/calculator...")
        page.goto("https://waitingformacguffin.com/calculator", timeout=30000)
        page.wait_for_load_state("networkidle")
        time.sleep(2)
        
        # Click Best Director tab
        print("Selecting Best Director category...")
        page.click("text=Best Director")
        time.sleep(1.5)
        
        # Click the $5,000 preset button to get close, then adjust
        print("Setting amount to $1000...")
        try:
            # Try clicking a preset first
            page.click("text=$500")
            time.sleep(0.5)
        except:
            pass
        
        # Find the amount input field and change it
        # The input should be near "Amount" label
        amount_input = page.locator("input").nth(0)  # First input on page
        amount_input.click()
        amount_input.fill("")
        time.sleep(0.3)
        amount_input.type("1000")
        time.sleep(0.5)
        
        # Press Tab to trigger recalculation
        page.keyboard.press("Tab")
        time.sleep(1.5)
        
        # Take screenshot
        print("Taking screenshot...")
        page.screenshot(
            path="/root/projects/waitingforamacguffin/public/images/blog/calculator-pta-director.png",
            full_page=False
        )
        
        print("Done!")
        browser.close()

if __name__ == "__main__":
    main()
