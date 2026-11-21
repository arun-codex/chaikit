import { afterEach, describe, expect, it, vi } from 'vitest';
import '../src/index.js';
import { mountChaiKit } from '../src/index.js';
import { PaymentPanel } from '../src/components/PaymentPanel.js';
import type { ChaiSupportElement } from '../src/elements/ChaiSupportElement.js';

const elements: ChaiSupportElement[] = [];
afterEach(() => {
  for (const element of elements) element.destroy();
  elements.length = 0;
  document.body.innerHTML = '';
});

function addWidget(attributes: Record<string, string>): ChaiSupportElement {
  const el = document.createElement('chai-support') as ChaiSupportElement;
  for (const [key, value] of Object.entries(attributes)) el.setAttribute(key, value);
  document.body.appendChild(el);
  elements.push(el);
  return el;
}

describe('Configurable input and payment safety regressions', () => {
  it('renders launcher text without treating it as HTML', () => {
    const payload = '<img src=x onerror=alert(1)>';
    const el = addWidget({
      'creator-name': 'Creator',
      'upi-id': 'creator@upi',
      'button-text': payload,
    });
    expect(el.shadowRoot?.querySelector('.chai-launcher-text')?.textContent).toBe(payload);
    expect(el.shadowRoot?.querySelector('.chai-launcher-btn img')).toBeNull();
  });

  it('treats custom tier names and descriptions as plain text', () => {
    const payload = '<img src=x onerror=alert(1)>';
    const el = addWidget({
      'creator-name': 'Creator',
      'upi-id': 'creator@upi',
      tiers: JSON.stringify([{ id: 'custom', name: payload, description: payload, amountPaise: 1000 }]),
    });
    const tier = el.shadowRoot?.querySelector('.chai-tier-card');
    expect(tier?.querySelector('.chai-tier-name')?.textContent).toBe(payload);
    expect(tier?.querySelector('.chai-tier-desc')?.textContent).toBe(payload);
    expect(tier?.querySelector('img')).toBeNull();
  });

  it('does not inject raw UPI IDs as HTML in direct payment panels', () => {
    const payload = '<img src=x onerror=alert(1)>';
    const panel = new PaymentPanel({
      creatorName: 'Creator',
      upiId: payload,
      amountPaise: 1000,
      onCopySuccess: vi.fn(),
      onHandoffAttempt: vi.fn(),
    });
    const el = panel.getElement();
    expect(el.querySelector('.chai-upi-details .chai-upi-value')?.textContent).toBe('₹10');
    expect(el.querySelector('.chai-upi-details div:nth-child(2) .chai-upi-value')?.textContent).toBe(payload);
    expect(el.querySelector('.chai-upi-details img')).toBeNull();
  });

  it('does not render pay or copy actions for invalid recipient configurations', () => {
    const el = addWidget({ 'creator-name': 'Creator', 'upi-id': 'not-a-vpa' });
    expect(el.shadowRoot?.querySelector('[role="alert"]')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.chai-payment-panel')).toBeNull();
    expect(el.shadowRoot?.querySelector('.chai-launcher-btn')).toBeNull();
    expect(() => el.open()).not.toThrow();
  });

  it('rejects invalid programmatic amounts without changing the displayed value', () => {
    const el = addWidget({ 'creator-name': 'Creator', 'upi-id': 'creator@upi' });
    const spy = vi.fn();
    el.addEventListener('chai:error', spy);
    const before = el.shadowRoot?.querySelector('.chai-payment-amount')?.textContent;
    el.setAmount(9);
    el.setAmount(Number.NaN);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(el.shadowRoot?.querySelector('.chai-payment-amount')?.textContent).toBe(before);
  });

  it('applies demoMode in the programmatic mount API before any live payment controls are exposed', () => {
    const el = mountChaiKit({ creatorName: 'Creator', upiId: 'creator@upi', demoMode: true });
    expect(el).not.toBeNull();
    if (!el) return;
    elements.push(el);
    expect(el.shadowRoot?.querySelector('.chai-demo-qr-overlay')).not.toBeNull();
    expect(el.shadowRoot?.textContent).not.toContain('creator@upi');
  });

  it('rejects malformed amounts in custom amount inputs', () => {
    const el = addWidget({ 'creator-name': 'Creator', 'upi-id': 'creator@upi' });
    const input = el.shadowRoot?.querySelector('.chai-amount-input') as HTMLInputElement;
    const before = el.shadowRoot?.querySelector('.chai-payment-amount')?.textContent;
    input.value = '100.999';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(el.shadowRoot?.querySelector('.chai-input-error')?.textContent).toContain('at most two decimal places');
    expect(el.shadowRoot?.querySelector('.chai-payment-amount')?.textContent).toBe(before);
  });
});
