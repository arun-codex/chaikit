import { chromium } from '@playwright/test';
import path from 'path';

async function verifyLive() {
  console.log('--- Verifying Live GitHub Pages Deployment ---');
  const liveUrl = 'https://arun-codex.github.io/chaikit/';
  console.log(`Navigating to: ${liveUrl}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Listen for console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.goto(liveUrl, { waitUntil: 'networkidle' });

  const title = await page.title();
  console.log(`Page Title: ${title}`);

  // Check topbar brand
  const brandTitle = await page.locator('.pk-brand-title').textContent();
  console.log(`Brand: ${brandTitle}`);

  // Check widget exists and launcher is visible
  const widget = page.locator('#liveChaiWidget');
  await widget.waitFor({ state: 'attached' });
  const launcher = widget.locator('.chai-launcher-btn');
  await launcher.waitFor({ state: 'visible' });
  const launcherText = await launcher.textContent();
  console.log(`Widget Launcher Button: "${launcherText.trim()}"`);

  // Click launcher and verify modal opens
  await launcher.click();
  const modal = widget.locator('.chai-modal');
  await modal.waitFor({ state: 'visible' });
  const modalTitle = await widget.locator('.chai-title').textContent();
  console.log(`Modal Title: "${modalTitle.trim()}"`);

  // Verify demo watermark overlay
  const demoTag = widget.locator('.chai-demo-qr-overlay .chai-demo-tag');
  const demoText = await demoTag.textContent();
  console.log(`Demo QR Overlay: "${demoText.trim()}"`);

  // Capture screenshot of live production deployment
  const screenshotPath = path.join(process.cwd(), 'examples/playground/screenshots/live_github_pages_verified.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`✓ Live deployment screenshot saved to: ${screenshotPath}`);

  await browser.close();

  if (errors.length > 0) {
    console.warn('Console errors detected on live page:', errors);
  } else {
    console.log('✓ ZERO console errors on live production GitHub Pages!');
  }
}

verifyLive().catch(err => {
  console.error('Live verification failed:', err);
  process.exit(1);
});
