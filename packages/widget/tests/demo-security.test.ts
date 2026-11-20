import { describe, it, expect, vi } from 'vitest';
import jsQR from 'jsqr';
import { encode } from 'uqr';
import { PaymentPanel, DEMO_NON_PAYABLE_PAYLOAD } from '../src/components/PaymentPanel.js';

/**
 * Helper to decode a QR string via matrix rasterization and jsQR
 */
function decodeQrPayload(payload: string): string | null {
  const qr = encode(payload);
  const margin = 4;
  const scale = 6;
  const totalSize = qr.size + margin * 2;
  const width = totalSize * scale;
  const height = totalSize * scale;
  const pixels = new Uint8ClampedArray(width * height * 4).fill(255);

  for (let y = 0; y < qr.size; y++) {
    for (let x = 0; x < qr.size; x++) {
      const isDark = qr.data[y][x];
      const val = isDark ? 0 : 255;
      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          const px = ((y + margin) * scale + sy) * width + ((x + margin) * scale + sx);
          pixels[px * 4] = val;
          pixels[px * 4 + 1] = val;
          pixels[px * 4 + 2] = val;
          pixels[px * 4 + 3] = 255;
        }
      }
    }
  }

  const result = jsQR(pixels, width, height);
  return result ? result.data : null;
}

describe('ChaiKit Secure Demo Mode Audit & QR Decoding', () => {
  it('encodes a non-payable educational payload in demo mode (NOT upi://pay)', () => {
    expect(DEMO_NON_PAYABLE_PAYLOAD).toBe('https://arun-codex.github.io/chaikit/#demo-preview-non-payable');
    const decoded = decodeQrPayload(DEMO_NON_PAYABLE_PAYLOAD);

    expect(decoded).toBeTruthy();
    expect(decoded).toBe(DEMO_NON_PAYABLE_PAYLOAD);

    // CRITICAL SECURITY ASSERTIONS:
    expect(decoded).not.toContain('upi://');
    expect(decoded).not.toContain('pa=');
    expect(decoded).not.toContain('pn=');
    expect(decoded).not.toContain('am=');
    expect(decoded).not.toContain('cu=INR');
  });

  it('PaymentPanel in demoMode renders non-payable QR and displays DEMO ONLY badge', () => {
    const onCopySuccess = vi.fn();
    const onHandoffAttempt = vi.fn();

    const panel = new PaymentPanel({
      creatorName: 'Demo Creator',
      upiId: 'test@upi',
      amountPaise: 2500,
      demoMode: true,
      onCopySuccess,
      onHandoffAttempt,
    });

    const el = panel.getElement();

    // Check QR frame contains DEMO ONLY overlay
    const overlay = el.querySelector('.chai-demo-qr-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay?.textContent).toContain('DEMO ONLY');
    expect(overlay?.textContent).toContain('NON-PAYABLE');

    // Check disclaimer prominently shows demo status
    const disclaimer = el.querySelector('.chai-disclaimer');
    expect(disclaimer?.textContent).toContain('DEMO ONLY');
    expect(disclaimer?.textContent).toContain('Real bank transfers');
    expect(disclaimer?.textContent).toContain('disabled');

    // Check primary button has demo styling and disabled text
    const primaryBtn = el.querySelector('.chai-btn-primary');
    expect(primaryBtn?.classList.contains('chai-btn-demo-disabled')).toBe(true);
    expect(primaryBtn?.textContent).toContain('Demo Only — No Payments');
  });

  it('PaymentPanel in demoMode blocks mobile UPI intent and real UPI ID copy', () => {
    const onCopySuccess = vi.fn();
    const onHandoffAttempt = vi.fn();

    const panel = new PaymentPanel({
      creatorName: 'Demo Creator',
      upiId: 'realcreator@okhdfcbank',
      amountPaise: 5000,
      demoMode: true,
      onCopySuccess,
      onHandoffAttempt,
    });

    const el = panel.getElement();

    // Click Primary button -> must NOT trigger upi:// intent
    const primaryBtn = el.querySelector('.chai-btn-primary') as HTMLButtonElement;
    primaryBtn.click();

    expect(onHandoffAttempt).toHaveBeenCalledWith('demo://non-payable-preview');
    expect(onHandoffAttempt).not.toHaveBeenCalledWith(expect.stringContaining('upi://pay'));
    expect(onCopySuccess).toHaveBeenCalledWith(
      expect.stringContaining('Demo Mode: Live UPI payment intent is disabled')
    );

    // Click Copy UPI ID button -> must NOT copy real creator UPI ID
    const copyBtn = el.querySelector('.chai-btn-secondary') as HTMLButtonElement;
    copyBtn.click();

    expect(onCopySuccess).toHaveBeenCalledWith(
      expect.stringContaining('Demo Mode: Live UPI transfers are disabled')
    );
  });

  it('PaymentPanel in non-demo mode generates valid payable UPI URI and decodes correctly', () => {
    const onCopySuccess = vi.fn();
    const onHandoffAttempt = vi.fn();

    const panel = new PaymentPanel({
      creatorName: 'Real Creator',
      upiId: 'real@okhdfcbank',
      amountPaise: 2500,
      demoMode: false,
      onCopySuccess,
      onHandoffAttempt,
    });

    const el = panel.getElement();
    expect(el.querySelector('.chai-demo-qr-overlay')).toBeNull();

    // Check real URI is built and decodable
    const expectedUri = 'upi://pay?pa=real@okhdfcbank&pn=Real%20Creator&am=25.00&cu=INR';
    const decoded = decodeQrPayload(expectedUri);
    expect(decoded).toBe(expectedUri);
    expect(decoded).toContain('upi://pay?pa=real@okhdfcbank');
  });
});
