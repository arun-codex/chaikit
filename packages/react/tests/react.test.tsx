import React, { createRef } from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChaiSupport, type ChaiSupportRef } from '../src/index.js';

describe('ChaiSupport React Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.innerHTML = '';
  });

  it('renders custom element <chai-support> with configured attributes', async () => {
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <ChaiSupport
          creatorName="Pooja Sharma"
          upiId="pooja@upi"
          theme="cream"
          position="bottom-left"
          buttonText="Treat Pooja to Chai"
        />
      );
    });

    const el = container.querySelector('chai-support');
    expect(el).not.toBeNull();
    expect(el?.getAttribute('creator-name')).toBe('Pooja Sharma');
    expect(el?.getAttribute('upi-id')).toBe('pooja@upi');
    expect(el?.getAttribute('theme')).toBe('cream');
    expect(el?.getAttribute('position')).toBe('bottom-left');
    expect(el?.getAttribute('button-text')).toBe('Treat Pooja to Chai');
  });

  it('exposes imperative open and close controls via ref', async () => {
    const ref = createRef<ChaiSupportRef>();
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <ChaiSupport
          ref={ref}
          creatorName="Pooja Sharma"
          upiId="pooja@upi"
        />
      );
    });

    expect(ref.current).not.toBeNull();
    expect(typeof ref.current?.open).toBe('function');
    expect(typeof ref.current?.close).toBe('function');
    expect(typeof ref.current?.setAmount).toBe('function');

    // Test calling open() through ref
    act(() => {
      ref.current?.open();
    });

    const el = container.querySelector('chai-support');
    const backdrop = el?.shadowRoot?.querySelector('.chai-backdrop');
    expect(backdrop?.classList.contains('open')).toBe(true);
  });

  it('binds custom event callbacks properly', async () => {
    const onOpen = vi.fn();
    const onTierSelected = vi.fn();
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <ChaiSupport
          creatorName="Pooja Sharma"
          upiId="pooja@upi"
          onOpen={onOpen}
          onTierSelected={onTierSelected}
        />
      );
    });

    const el = container.querySelector('chai-support');
    expect(el).not.toBeNull();

    // Trigger opened event
    el?.dispatchEvent(
      new CustomEvent('chai:opened', {
        bubbles: true,
        composed: true,
        detail: { creatorName: 'Pooja Sharma' },
      })
    );
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
