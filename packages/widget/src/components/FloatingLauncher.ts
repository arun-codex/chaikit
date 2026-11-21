/**
 * Floating launcher button component.
 */

import { getMiniCupSvg } from './ChaiIllustration.js';

export interface FloatingLauncherOptions {
  buttonText: string;
  position: 'bottom-right' | 'bottom-left' | 'inline';
  onOpen: () => void;
}

export class FloatingLauncher {
  private element: HTMLElement;
  private buttonEl: HTMLButtonElement | null = null;
  private options: FloatingLauncherOptions;

  constructor(options: FloatingLauncherOptions) {
    this.options = options;
    this.element = this.render();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getButtonElement(): HTMLButtonElement | null {
    return this.buttonEl;
  }

  public updateText(text: string): void {
    this.options.buttonText = text;
    const textEl = this.element.querySelector('.chai-launcher-text');
    if (textEl) {
      textEl.textContent = text;
    }
  }

  public updatePosition(position: 'bottom-right' | 'bottom-left' | 'inline'): void {
    this.options.position = position;
    this.element.setAttribute('data-position', position);
  }

  private render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'chai-launcher-wrapper';
    wrapper.setAttribute('data-position', this.options.position);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chai-launcher-btn';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-label', `${this.options.buttonText} - open support dialog`);

    btn.innerHTML = /* html */ `
      <span class="chai-launcher-icon" aria-hidden="true">
        ${getMiniCupSvg()}
      </span>
      <span class="chai-launcher-text"></span>
    `;
    const launcherText = btn.querySelector('.chai-launcher-text');
    if (launcherText) launcherText.textContent = this.options.buttonText;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.options.onOpen();
    });

    this.buttonEl = btn;
    wrapper.appendChild(btn);
    return wrapper;
  }
}
