/**
 * ChaiKit - The Universal Buy Me a Chai Widget
 * Universal Web Component and Embed Library
 */

import { ChaiSupportElement } from './elements/ChaiSupportElement.js';

// Auto-register custom element safely in browser environments
if (typeof window !== 'undefined' && 'customElements' in window) {
  if (!customElements.get('chai-support')) {
    customElements.define('chai-support', ChaiSupportElement);
  }
}

/**
 * Programmatic mounting helper for frameworks and dynamic scripts.
 */
export function mountChaiKit(
  config: import('@chaikit/core').ChaiKitConfig,
  container?: HTMLElement
): ChaiSupportElement | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const target = container || document.body;
  const el = document.createElement('chai-support') as ChaiSupportElement;
  if (config.creatorName) el.setAttribute('creator-name', config.creatorName);
  if (config.upiId) el.setAttribute('upi-id', config.upiId);
  if (config.description) el.setAttribute('description', config.description);
  if (config.theme) el.setAttribute('theme', config.theme);
  if (config.position) el.setAttribute('position', config.position);
  if (config.buttonText) el.setAttribute('button-text', config.buttonText);
  if (config.accentColor) el.setAttribute('accent-color', config.accentColor);
  if (config.headless) el.setAttribute('headless', '');
  if (config.note) el.setAttribute('note', config.note);
  if (config.defaultTierId) el.setAttribute('default-tier', config.defaultTierId);
  if (config.enable3D) el.setAttribute('enable-3d', '');

  // Configure while detached: demo mode must be active before the element is exposed.
  el.updateConfig(config);
  target.appendChild(el);
  return el;
}

export { ChaiSupportElement };
export * from '@chaikit/core';
