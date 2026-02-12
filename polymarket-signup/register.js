const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function registerOnPolymarket() {
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  try {
    // Navigate to Polymarket
    console.log('Navigating to Polymarket...');
    await page.goto('https://polymarket.com', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, '01-homepage.png') });
    console.log('✓ Screenshot 1: Homepage');

    // Wait for and click the sign up / register button
    console.log('Looking for sign up button...');
    await page.waitForTimeout(2000);

    // Try to find sign up button - might be "Sign Up", "Register", or in a menu
    let signUpButton = await page.locator('button:has-text("Sign Up")').first().isVisible().catch(() => false);

    if (!signUpButton) {
      // Try alternative selectors
      signUpButton = await page.locator('a:has-text("Sign Up")').first().isVisible().catch(() => false);
    }

    if (signUpButton) {
      console.log('Clicking sign up button...');
      await page.click('button:has-text("Sign Up"), a:has-text("Sign Up")');
    } else {
      console.log('Sign up button not found, trying to look for auth modal or link...');
      await page.screenshot({ path: path.join(screenshotsDir, '02-looking-for-signup.png') });
    }

    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '02-after-signup-click.png') });
    console.log('✓ Screenshot 2: After sign up click');

    // Fill in email field
    console.log('Filling in email address...');
    const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
    await emailInput.click();
    await emailInput.fill('clob@elitecurrensea.com');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '03-email-filled.png') });
    console.log('✓ Screenshot 3: Email filled in');

    // Look for and click continue or next button
    console.log('Looking for continue/next button...');
    const continueButton = page.locator('button:has-text("Continue"), button:has-text("Next"), button:has-text("Sign Up")').first();
    const isVisible = await continueButton.isVisible().catch(() => false);

    if (isVisible) {
      await continueButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(screenshotsDir, '04-after-continue.png') });
      console.log('✓ Screenshot 4: After clicking continue');
    }

    // Check for any form fields that appeared
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '05-final-state.png') });
    console.log('✓ Screenshot 5: Final state');

    console.log('\n✓ Registration process completed');
    console.log(`✓ Screenshots saved to: ${screenshotsDir}`);

  } catch (error) {
    console.error('Error during registration:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error.png') });
  } finally {
    await browser.close();
  }
}

registerOnPolymarket();
