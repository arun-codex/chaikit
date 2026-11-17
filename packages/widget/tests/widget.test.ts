import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/index.js';
import type { ChaiSupportElement } from '../src/elements/ChaiSupportElement.js';

describe('ChaiKit Web Component (<chai-support>)', () => {
  let element: ChaiSupportElement;

  beforeEach(() => {
    element = document.createElement('chai-support') as ChaiSupportElement;
    element.setAttribute('creator-name', 'Dev Sharma');
    element.setAttribute('upi-id', 'dev@okhdfcbank');
    element.setAttribute('button-text', 'Buy Me a Chai ☕');
    element.setAttribute('theme', 'classic');
    element.setAttribute('position', 'bottom-right');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.destroy();
    document.body.innerHTML = '';
  });

  it('registers custom element <chai-support> in customElements registry', () => {
    expect(customElements.get('chai-support')).toBeDefined();
  });

  it('creates an open Shadow DOM root and encapsulates styles', () => {
    expect(element.shadowRoot).not.toBeNull();
    const styleEl = element.shadowRoot?.querySelector('style');
    expect(styleEl).not.toBeNull();
    expect(styleEl?.textContent).toContain('--chai-bg');
  });

  it('renders floating launcher button by default with cup icon and text', () => {
    const launcher = element.shadowRoot?.querySelector('.chai-launcher-btn');
    expect(launcher).not.toBeNull();
    expect(launcher?.textContent).toContain('Buy Me a Chai ☕');

    const icon = element.shadowRoot?.querySelector('.chai-launcher-icon');
    expect(icon).not.toBeNull();
    expect(icon?.innerHTML).toContain('svg');
  });

  it('opens and closes modal programmatically and emits custom events', () => {
    const openSpy = vi.fn();
    const closeSpy = vi.fn();

    element.addEventListener('chai:opened', openSpy);
    element.addEventListener('chai:closed', closeSpy);

    const backdrop = element.shadowRoot?.querySelector('.chai-backdrop');
    expect(backdrop?.classList.contains('open')).toBe(false);

    // Open
    element.open();
    expect(backdrop?.classList.contains('open')).toBe(true);
    expect(openSpy).toHaveBeenCalledTimes(1);

    // Close
    element.close();
    expect(backdrop?.classList.contains('open')).toBe(false);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('renders 4 chai tier cards with correct amounts', () => {
    element.open();
    const tierCards = element.shadowRoot?.querySelectorAll('.chai-tier-card');
    expect(tierCards?.length).toBe(4);

    const textContents = Array.from(tierCards || []).map((card) => card.textContent);
    expect(textContents.some((t) => t?.includes('Cutting Chai') && t?.includes('₹10'))).toBe(true);
    expect(textContents.some((t) => t?.includes('Kadak Chai') && t?.includes('₹25'))).toBe(true);
    expect(textContents.some((t) => t?.includes('Tandoori Chai') && t?.includes('₹50'))).toBe(true);
    expect(textContents.some((t) => t?.includes('Premium Chai') && t?.includes('₹100'))).toBe(true);
  });

  it('dispatches chai:tier-selected and updates QR when a tier is clicked', () => {
    element.open();
    const tierSpy = vi.fn();
    element.addEventListener('chai:tier-selected', tierSpy);

    const cuttingCard = element.shadowRoot?.querySelectorAll('.chai-tier-card')[0] as HTMLElement;
    cuttingCard.click();

    expect(tierSpy).toHaveBeenCalledTimes(1);
    expect(cuttingCard.classList.contains('selected')).toBe(true);

    const qrFrame = element.shadowRoot?.querySelector('.chai-qr-frame');
    expect(qrFrame?.innerHTML).toContain('<svg');
  });

  it('supports inline mode without floating launcher', () => {
    const inlineEl = document.createElement('chai-support') as ChaiSupportElement;
    inlineEl.setAttribute('creator-name', 'Ananya');
    inlineEl.setAttribute('upi-id', 'ananya@upi');
    inlineEl.setAttribute('position', 'inline');
    document.body.appendChild(inlineEl);

    // Floating launcher should not exist in inline mode
    expect(inlineEl.shadowRoot?.querySelector('.chai-launcher-wrapper')).toBeNull();
    // Inline card should exist
    expect(inlineEl.shadowRoot?.querySelector('.chai-inline-card')).not.toBeNull();

    inlineEl.destroy();
  });

  it('dispatches chai:error on invalid configuration', () => {
    const errorSpy = vi.fn();
    const invalidEl = document.createElement('chai-support') as ChaiSupportElement;
    invalidEl.addEventListener('chai:error', errorSpy);
    invalidEl.setAttribute('creator-name', '');
    invalidEl.setAttribute('upi-id', 'not-a-valid-vpa');
    document.body.appendChild(invalidEl);

    expect(errorSpy).toHaveBeenCalled();
    invalidEl.destroy();
  });
});
