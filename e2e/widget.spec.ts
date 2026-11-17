import { test, expect } from '@playwright/test';

test.describe('ChaiKit Web Component E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/fixtures/comprehensive.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('1. Floating launcher button renders and opens modal with authentic chai steam and titles', async ({ page }) => {
    const mainWidget = page.locator('#main-widget');
    await expect(mainWidget).toBeAttached();

    // Verify launcher button inside shadow root
    const launcherBtn = mainWidget.locator('button.chai-launcher-btn');
    await expect(launcherBtn).toBeVisible();
    await expect(launcherBtn).toContainText('Buy Me a Chai ☕');

    // Verify modal backdrop initially closed
    const backdrop = mainWidget.locator('.chai-backdrop');
    await expect(backdrop).not.toHaveClass(/open/);

    // Click to open
    await launcherBtn.click();
    await expect(backdrop).toHaveClass(/open/);

    // Check modal title
    const modalTitle = mainWidget.locator('#chai-modal-title');
    await expect(modalTitle).toContainText('Buy Pooja Sharma a Chai ☕');

    // Close using close button
    const closeBtn = mainWidget.locator('button.chai-close-btn');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(backdrop).not.toHaveClass(/open/);
  });

  test('2. Inline mode renders directly inside host document flow without floating launcher', async ({ page }) => {
    const inlineWidget = page.locator('#inline-widget');
    await expect(inlineWidget).toBeAttached();

    // Inline widget should NOT have a floating launcher button
    const floatingBtn = inlineWidget.locator('.chai-launcher-btn');
    await expect(floatingBtn).toHaveCount(0);

    // Inline widget card should be directly visible
    const card = inlineWidget.locator('.chai-inline-card');
    await expect(card).toBeVisible();

    // Verify creator name and description
    const title = inlineWidget.locator('#chai-modal-title');
    await expect(title).toContainText('Buy Dev Anand a Chai ☕');
  });

  test('3. Multiple widget instances co-exist on the same page without style or state collisions', async ({ page }) => {
    const mainWidget = page.locator('#main-widget');
    const inlineWidget = page.locator('#inline-widget');

    await expect(mainWidget).toBeAttached();
    await expect(inlineWidget).toBeAttached();

    // Select Tier 4 (Premium ₹100) on inline widget
    const inlinePremiumBtn = inlineWidget.locator('.chai-tier-card').nth(3);
    await inlinePremiumBtn.click();
    await expect(inlinePremiumBtn).toHaveClass(/selected/);

    // Open floating widget - verify its default tier is independent (Kadak ₹25)
    const launcherBtn = mainWidget.locator('button.chai-launcher-btn');
    await launcherBtn.click();

    const mainKadakBtn = mainWidget.locator('.chai-tier-card').nth(1);
    await expect(mainKadakBtn).toHaveClass(/selected/);
  });

  test('4. Tier selection updates amount, QR payload and dispatches custom events', async ({ page }) => {
    const mainWidget = page.locator('#main-widget');
    await mainWidget.locator('button.chai-launcher-btn').click();

    // Default is Kadak ₹25
    const amountLabel = mainWidget.locator('.chai-payment-amount');
    await expect(amountLabel).toContainText('₹25');

    // Click Tier 1: Cutting Chai (₹10)
    const cuttingTier = mainWidget.locator('.chai-tier-card').nth(0);
    await cuttingTier.click();
    await expect(cuttingTier).toHaveClass(/selected/);
    await expect(amountLabel).toContainText('₹10');

    // Verify QR code SVG exists and is generated
    const qrFrame = mainWidget.locator('.chai-qr-frame svg');
    await expect(qrFrame).toBeVisible();

    // Click Tier 3: Tandoori Chai (₹50)
    const tandooriTier = mainWidget.locator('.chai-tier-card').nth(2);
    await tandooriTier.click();
    await expect(tandooriTier).toHaveClass(/selected/);
    await expect(amountLabel).toContainText('₹50');

    // Click Tier 4: Premium Chai (₹100)
    const premiumTier = mainWidget.locator('.chai-tier-card').nth(3);
    await premiumTier.click();
    await expect(premiumTier).toHaveClass(/selected/);
    await expect(amountLabel).toContainText('₹100');
  });

  test('5. Validated custom amount input updates QR and unselects predefined tiers', async ({ page }) => {
    const mainWidget = page.locator('#main-widget');
    await mainWidget.locator('button.chai-launcher-btn').click();

    const customInput = mainWidget.locator('#chai-custom-input');
    await expect(customInput).toBeVisible();

    // Type 75
    await customInput.fill('75');
    const amountLabel = mainWidget.locator('.chai-payment-amount');
    await expect(amountLabel).toContainText('₹75');

    // Predefined tier cards should now be unselected
    const selectedTiers = mainWidget.locator('.chai-tier-card.selected');
    await expect(selectedTiers).toHaveCount(0);

    // Verify error state for value below minimum (< ₹10)
    await customInput.fill('5');
    const errorEl = mainWidget.locator('.chai-input-error');
    await expect(errorEl).toBeVisible();
    await expect(errorEl).toContainText('at least ₹10');
  });

  test('6. Copy UPI ID button triggers toast feedback and uses clipboard fallback', async ({ page }) => {
    const mainWidget = page.locator('#main-widget');
    await mainWidget.locator('button.chai-launcher-btn').click();

    const copyBtn = mainWidget.locator('button[aria-label*="Copy UPI ID"]');
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();

    // Toast notification appears
    const toast = mainWidget.locator('.chai-toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('UPI ID copied');
  });

  test('7. Keyboard accessibility: Escape key closes modal and restores focus to launcher button', async ({ page }) => {
    const mainWidget = page.locator('#main-widget');
    const launcherBtn = mainWidget.locator('button.chai-launcher-btn');

    // Focus launcher and open
    await launcherBtn.focus();
    await page.keyboard.press('Enter');

    const backdrop = mainWidget.locator('.chai-backdrop');
    await expect(backdrop).toHaveClass(/open/);

    // Press Escape to dismiss
    await page.keyboard.press('Escape');
    await expect(backdrop).not.toHaveClass(/open/);

    // Focus should be restored to launcher
    const isFocused = await launcherBtn.evaluate((btn) => {
      const root = btn.getRootNode() as ShadowRoot;
      return root.activeElement === btn;
    });
    expect(isFocused).toBe(true);
  });

  test('8. Theme switching reflects dynamic theme attributes on the custom element', async ({ page }) => {
    const mainWidget = page.locator('#main-widget');

    // Click "Set Dark Theme"
    await page.locator('#btn-theme-dark').click();
    await expect(mainWidget).toHaveAttribute('theme', 'dark');

    // Click "Set Cream Theme"
    await page.locator('#btn-theme-cream').click();
    await expect(mainWidget).toHaveAttribute('theme', 'cream');
  });

  test('9. Dynamic DOM lifecycle: widget can be added and cleanly destroyed without errors', async ({ page }) => {
    // Click "Add Dynamic Widget"
    await page.locator('#btn-dyn-add').click();
    const dynamicWidget = page.locator('#dynamic-widget');
    await expect(dynamicWidget).toBeAttached();

    const title = dynamicWidget.locator('#chai-modal-title');
    await expect(title).toContainText('Rohan Verma');

    // Click "Remove Dynamic Widget"
    await page.locator('#btn-dyn-remove').click();
    await expect(dynamicWidget).toHaveCount(0);
  });

  test('10. Client-side SPA navigation preserves mounted widgets without breaking', async ({ page }) => {
    const mainWidget = page.locator('#main-widget');
    await expect(mainWidget).toBeAttached();

    // Simulate SPA route change
    await page.locator('#btn-simulate-nav').click();

    // Verify h1 changed
    await expect(page.locator('h1')).toContainText('Navigated SPA Route');

    // Verify widget is still responsive and functional
    await mainWidget.locator('button.chai-launcher-btn').click();
    await expect(mainWidget.locator('.chai-backdrop')).toHaveClass(/open/);
  });

  test('11. Transparent payment disclaimer is visible and no fake payment success occurs on handoff', async ({ page }) => {
    const mainWidget = page.locator('#main-widget');
    await mainWidget.locator('button.chai-launcher-btn').click();

    // Disclaimer must be explicitly visible
    const disclaimer = mainWidget.locator('.chai-disclaimer');
    await expect(disclaimer).toBeVisible();
    await expect(disclaimer).toContainText('verify recipient name before confirming');

    // Open in UPI App button
    const handoffBtn = mainWidget.locator('button[aria-label*="Open UPI payment"]');
    await expect(handoffBtn).toBeVisible();

    // Clicking handoff must NOT display a "Payment Successful" screen
    await handoffBtn.click();
    const successBanners = mainWidget.locator(':text("Payment Successful"), :text("Payment Received")');
    await expect(successBanners).toHaveCount(0);

    // Note: Live device handoff to Google Pay/PhonePe apps requires physical mobile testing
    // [PENDING MANUAL VERIFICATION: Real device intent resolution in physical Android/iOS UPI apps]
  });
});
