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

    // 1. Switch to Cream Theme in configurator
    await page.locator('.pk-theme-card[data-theme="cream"]').click();
    await expect(widget).toHaveAttribute('theme', 'cream');

    // Open modal to view Cream theme
    await widget.locator('.chai-launcher-btn').click();
    await expect(widget.locator('.chai-modal')).toBeVisible();
    await page.screenshot({ path: path.join(screenshotsDir, '07_cream_theme.png') });
    await widget.locator('.chai-close-btn').click();
    await expect(widget.locator('.chai-backdrop')).not.toHaveClass(/open/);

    // 2. Switch to Dark Theme in configurator
    await page.locator('.pk-theme-card[data-theme="dark"]').click();
    await expect(widget).toHaveAttribute('theme', 'dark');

    // Open modal to view Dark theme
    await widget.locator('.chai-launcher-btn').click();
    await expect(widget.locator('.chai-modal')).toBeVisible();
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
    await expect(demoOverlay).toContainText('DEMO ONLY • NON-PAYABLE');

    // Verify demo disclaimer
    const disclaimer = widget.locator('.chai-disclaimer');
    await expect(disclaimer).toContainText('DEMO ONLY • NO PAYMENTS');

    // Verify primary button has demo disabled state
    const handoffBtn = widget.locator('.chai-btn-primary');
    await expect(handoffBtn).toHaveClass(/chai-btn-demo-disabled/);
    await expect(handoffBtn).toContainText('Demo Only — No Payments');

    // Click handoff button -> triggers demo toast instead of intent
    await handoffBtn.click();
    const toast = widget.locator('.chai-toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Demo Mode: Live UPI payment intent is disabled');

    // Click Copy UPI ID button -> blocked in demo mode
    const copyBtn = widget.locator('.chai-qr-actions .chai-btn-secondary').first();
    await copyBtn.click();
    await expect(toast).toContainText('Demo Mode: Live UPI transfers are disabled');

    // Optically decode QR code from browser Shadow DOM SVG
    await page.addScriptTag({ path: 'node_modules/jsqr/dist/jsQR.js' });
    const decodedPayload = await page.evaluate(async () => {
      const host = document.getElementById('liveChaiWidget');
      const svg = host?.shadowRoot?.querySelector('.chai-qr-frame svg');
      if (!svg) return null;
      const xml = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0, 300, 300);
      const imgData = ctx.getImageData(0, 0, 300, 300);
      const qrResult = (window as any).jsQR(imgData.data, 300, 300);
      return qrResult ? qrResult.data : null;
    });

    expect(decodedPayload).toBeTruthy();
    expect(decodedPayload).not.toContain('upi://');
    expect(decodedPayload).not.toContain('pa=');
    expect(decodedPayload).toBe('https://arun-codex.github.io/chaikit/#demo-preview-non-payable');

    await page.screenshot({ path: path.join(screenshotsDir, '10_upi_demo_payment_layout.png') });
  });

  test('6. 3D procedural chai cup can be toggled', async ({ page }) => {
    // Enable 3D in configurator
    await page.evaluate(() => {
      const el = document.getElementById('cfgEnable3D') as HTMLInputElement;
      el.checked = true;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const widget = page.locator('#liveChaiWidget');
    await expect(widget).toHaveAttribute('enable-3d', '');

    await widget.locator('.chai-launcher-btn').click();
    const stage3D = widget.locator('.chai-3d-stage');
    await expect(stage3D).toBeAttached();

    // Verify WebGL active or graceful 2D fallback
    const hasCanvas = await stage3D.locator('canvas').count();
    if (hasCanvas > 0) {
      await expect(stage3D).toBeVisible();
    } else {
      await expect(stage3D).toHaveCSS('display', 'none');
    }

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

    // Verify release status banner is present
    const notice = page.locator('.pk-release-notice-banner');
    await expect(notice).toBeVisible();
    await expect(notice).toContainText('v1.0.0 CANDIDATE');

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

  test('8. Public showcase demo safeguard is permanently locked against tampering', async ({ page }) => {
    // 1. Verify permanent non-interactive safeguard badge exists
    const safeguardBadge = page.locator('#publicSafeguardBadge');
    await expect(safeguardBadge).toBeVisible();
    await expect(safeguardBadge).toContainText('Demo Safeguard Active');
    await expect(safeguardBadge).toContainText('Permanently Locked');

    // Verify there is no toggle or checkbox to disable demo mode
    await expect(page.locator('#cfgDemoMode')).toHaveCount(0);

    // 2. Attempt to bypass demo mode by setting localStorage with demoMode: false
    await page.evaluate(() => {
      localStorage.setItem(
        'chaikit_playground_config_v1',
        JSON.stringify({ demoMode: false, creatorName: 'Malicious Attacker' })
      );
    });

    // Reload page to verify safeguard resilience
    await page.reload();
    await page.waitForLoadState('networkidle');

    const widget = page.locator('#liveChaiWidget');
    // Ensure demo-mode is still strictly applied
    await expect(widget).toHaveAttribute('demo-mode', '');

    // Open modal and verify non-payable safeguards remain 100% active
    await widget.locator('.chai-launcher-btn').click();
    await expect(widget.locator('.chai-demo-qr-overlay')).toBeVisible();
    await expect(widget.locator('.chai-btn-primary')).toHaveClass(/chai-btn-demo-disabled/);
  });

  test('9. Creator Setup Guide walkthrough displays 7 steps, callouts, and closes properly', async ({ page }) => {
    const guideBtn = page.locator('#openGuideBtn');
    await expect(guideBtn).toBeVisible();
    await guideBtn.click();

    const guideModal = page.locator('#guideModalBackdrop');
    await expect(guideModal).toHaveClass(/open/);
    await expect(guideModal).toBeVisible();

    // Verify header and badge
    await expect(guideModal.locator('.pk-guide-header-badge')).toContainText('CREATOR QUICKSTART');
    await expect(guideModal.locator('#guideModalTitle')).toContainText('Creator Onboarding & Setup Guide');

    // Verify critical callouts (UPI Privacy & Direct P2P)
    const privacyCallout = guideModal.locator('.pk-callout-privacy');
    await expect(privacyCallout).toBeVisible();
    await expect(privacyCallout).toContainText('UPI Address Visibility');

    const directCallout = guideModal.locator('.pk-callout-direct');
    await expect(directCallout).toBeVisible();
    await expect(directCallout).toContainText('100% Direct P2P — Zero Gateway Fees');

    // Verify all 7 steps are present
    const steps = guideModal.locator('.pk-step-item');
    await expect(steps).toHaveCount(7);
    await expect(steps.nth(0)).toContainText('Enter Creator Name & Note');
    await expect(steps.nth(1)).toContainText('Enter & Verify Your UPI ID (VPA)');
    await expect(steps.nth(2)).toContainText('Customize Contribution Tiers');
    await expect(steps.nth(3)).toContainText('Select Theme & Placement');
    await expect(steps.nth(4)).toContainText('Preview Across Viewports');
    await expect(steps.nth(5)).toContainText('Copy Integration Code');
    await expect(steps.nth(6)).toContainText('Perform a ₹1 Pre-Launch Self-Test');

    // Capture screenshot of guide
    await page.screenshot({ path: path.join(screenshotsDir, '13_creator_setup_guide.png') });

    // Test acknowledge button dismisses modal
    const ackBtn = page.locator('#guideAcknowledgeBtn');
    await ackBtn.click();
    await expect(guideModal).not.toHaveClass(/open/);

    // Test reopening and dismissing with Escape key
    await guideBtn.click();
    await expect(guideModal).toHaveClass(/open/);
    await page.keyboard.press('Escape');
    await expect(guideModal).not.toHaveClass(/open/);
  });
});
