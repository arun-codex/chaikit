import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { ChaiSupport } from '../src/index.js';

describe('React payment safety options', () => {
  it('honors demoMode and keeps payable details out of the modal', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(<ChaiSupport creatorName="Creator" upiId="creator@upi" demoMode />);
    });

    const el = container.querySelector('chai-support');
    expect(el).not.toBeNull();
    expect(el?.hasAttribute('demo-mode')).toBe(true);
    expect(el?.shadowRoot?.querySelector('.chai-demo-qr-overlay')).not.toBeNull();
    expect(el?.shadowRoot?.textContent).not.toContain('creator@upi');

    await act(async () => root.unmount());
    container.remove();
  });
});
