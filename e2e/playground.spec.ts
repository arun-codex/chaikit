import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('ChaiKit Interactive Playground & Visual Configurator', () => {
  const screenshotsDir = path.resolve(process.cwd(), 'examples/playground/screenshots');

  test.beforeAll(async () => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/playground/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('1. Playground loads properly with topbar, sidebar, simulated website, and real widget', async ({ page }) => {
    await expect(page.locator('.pk-brand-title')).toHaveText('ChaiKit');
    await expect(page.locator('.pk-brand-badge')).toHaveText('Playground');

    // Host site heading is visible
    await expect(page.locator('.devnotes-heading')).toContainText('Building Better Software');

    // Floating launcher button exists inside widget
    const widget = page.locator('#liveChaiWidget');
    const launcher = widget.locator('.chai-launcher-btn');
    await expect(launcher).toBeVisible();
    await expect(launcher).toContainText('Buy Me a Chai ☕');

    // Capture 01_desktop_showcase.png
    await page.screenshot({ path: path.join(screenshotsDir, '01_desktop_showcase.png'), fullPage: false });
  });

  test('2. Opening modal displays 4 tiers, authentic steam, and captures tier states', async ({ page }) => {
    const widget = page.locator('#liveChaiWidget');
    const launcher = widget.locator('.chai-launcher-btn');
    await launcher.click();

    const modal = widget.locator('.chai-modal');
    await expect(modal).toBeVisible();
    await expect(widget.locator('.chai-title')).toContainText('Buy Rohan Sen a Chai');

    // Capture 02_open_support_modal.png
    await page.screenshot({ path: path.join(screenshotsDir, '02_open_support_modal.png') });

    // 1. Select Cutting Chai
    const cuttingTier = widget.locator('.chai-tier-card[data-tier="cutting"]');
    await cuttingTier.click();
    await expect(widget.locator('.chai-payment-amount')).toContainText('₹10');
    await page.screenshot({ path: path.join(screenshotsDir, '03_cutting_chai_selected.png') });

    // 2. Select Kadak Chai
    const kadakTier = widget.locator('.chai-tier-card[data-tier="kadak"]');
    await kadakTier.click();
    await expect(widget.locator('.chai-payment-amount')).toContainText('₹25');
    await page.screenshot({ path: path.join(screenshotsDir, '04_kadak_chai_selected.png') });

    // 3. Select Tandoori Chai
    const tandooriTier = widget.locator('.chai-tier-card[data-tier="tandoori"]');
    await tandooriTier.click();
    await expect(widget.locator('.chai-payment-amount')).toContainText('₹50');
    await page.screenshot({ path: path.join(screenshotsDir, '05_tandoori_chai_selected.png') });

    // 4. Select Premium Chai
    const premiumTier = widget.locator('.chai-tier-card[data-tier="premium"]');
    await premiumTier.click();
    await expect(widget.locator('.chai-payment-amount')).toContainText('₹100');
    await page.screenshot({ path: path.join(screenshotsDir, '06_premium_chai_selected.png') });
  });

  test('3. Theme switching updates widget and captures Cream & Dark themes', async ({ page }) => {
    const widget = page.locator('#liveChaiWidget');

    // Open modal first
    await widget.locator('.chai-launcher-btn').click();
    await expect(widget.locator('.chai-modal')).toBeVisible();

    // 1. Switch to Cream Theme
    await page.locator('.pk-theme-card[data-theme="cream"]').click();
    await expect(widget).toHaveAttribute('theme', 'cream');
    await page.screenshot({ path: path.join(screenshotsDir, '07_cream_theme.png') });

    // 2. Switch to Dark Theme
    await page.locator('.pk-theme-card[data-theme="dark"]').click();
    await expect(widget).toHaveAttribute('theme', 'dark');
    await page.screenshot({ path: path.join(screenshotsDir, '08_dark_theme.png') });
  });

  test('4. Mobile preview switches viewport and captures mobile modal', async ({ page }) => {
    // Click mobile viewport button
    await page.locator('.pk-vp-btn[data-viewport="mobile"]').click();
    await expect(page.locator('#deviceContainer')).toHaveAttribute('data-viewport', 'mobile');
    await expect(page.locator('#viewportDimensionsLabel')).toContainText('390');

    const widget = page.locator('#liveChaiWidget');
    await widget.locator('.chai-launcher-btn').click();
    await expect(widget.locator('.chai-modal')).toBeVisible();

    await page.screenshot({ path: path.join(screenshotsDir, '09_mobile_support_modal.png') });
  });

  test('5. Demo Mode displays safe non-payable QR and captures payment layout', async ({ page }) => {
    const widget = page.locator('#liveChaiWidget');
    await widget.locator('.chai-launcher-btn').click();

    // Verify demo overlay is rendered
    const demoOverlay = widget.locator('.chai-demo-qr-overlay');
    await expect(demoOverlay).toBeVisible();
    await expect(demoOverlay).toContainText('DEMO QR • NON-PAYABLE');

    // Verify demo disclaimer
    const disclaimer = widget.locator('.chai-disclaimer');
    await expect(disclaimer).toContainText('Demo Mode Active');

    // Click handoff button -> triggers demo toast instead of intent
    const handoffBtn = widget.locator('.chai-btn-primary');
    await handoffBtn.click();
    const toast = widget.locator('.chai-toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Demo Mode: Live UPI payment intent is disabled');

    await page.screenshot({ path: path.join(screenshotsDir, '10_upi_demo_payment_layout.png') });
  });

  test('6. 3D procedural chai cup can be toggled', async ({ page }) => {
    // Enable 3D in configurator via force check (custom slider)
    const toggle3D = page.locator('#cfgEnable3D');
    await toggle3D.check({ force: true });

    const widget = page.locator('#liveChaiWidget');
    await expect(widget).toHaveAttribute('enable-3d', '');

    await widget.locator('.chai-launcher-btn').click();
    const stage3D = widget.locator('.chai-3d-stage');
    await expect(stage3D).toBeVisible();

    await page.screenshot({ path: path.join(screenshotsDir, '11_optional_3d_stage.png') });
  });

  test('7. Complete Visual Configurator and Code Generator modal', async ({ page }) => {
    // Change creator name
    const nameInput = page.locator('#cfgCreatorName');
    await nameInput.fill('Ananya Verma');

    const widget = page.locator('#liveChaiWidget');
    await expect(widget).toHaveAttribute('creator-name', 'Ananya Verma');

    // Capture complete configurator
    await page.screenshot({ path: path.join(screenshotsDir, '12_complete_visual_configurator.png') });

    // Open Code Modal
    await page.locator('#openCodeModalBtn').click();
    const codeModal = page.locator('#codeModalBackdrop');
    await expect(codeModal).toHaveClass(/open/);

    const codePre = page.locator('#codeSnippetContent');
    await expect(codePre).toContainText('creator-name="Ananya Verma"');

    // Switch to React tab
    await page.locator('.pk-code-tab[data-tab="react"]').click();
    await expect(codePre).toContainText('creatorName="Ananya Verma"');
    await expect(codePre).toContainText('@chaikit/react');

    // Switch to Vue tab
    await page.locator('.pk-code-tab[data-tab="vue"]').click();
    await expect(codePre).toContainText('<chai-support');

    // Test Copy button
    await page.locator('#copyCodeBtn').click();
    await expect(page.locator('#copyBtnText')).toHaveText(/Copied/);
  });
});
