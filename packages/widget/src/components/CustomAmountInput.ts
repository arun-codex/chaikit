/**
 * Custom contribution amount input component.
 * Exact integer paise conversion, validation, and real-time updates.
 */

import {
  formatRupees,
  rupeesToPaise,
  validateAmount,
} from '@chaikit/core';

export interface CustomAmountInputOptions {
  minAmountPaise: number;
  maxAmountPaise: number;
  initialAmountPaise?: number;
  onAmountChange: (amountPaise: number, isValid: boolean) => void;
}

export class CustomAmountInput {
  private element: HTMLElement;
  private inputEl: HTMLInputElement;
  private errorEl: HTMLElement;
  private options: CustomAmountInputOptions;

  constructor(options: CustomAmountInputOptions) {
    this.options = options;
    const { element, inputEl, errorEl } = this.render();
    this.element = element;
    this.inputEl = inputEl;
    this.errorEl = errorEl;
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public setAmount(amountPaise: number): void {
    const rupees = amountPaise / 100;
    this.inputEl.value = rupees ? rupees.toString() : '';
    this.clearError();
  }

  public clear(): void {
    this.inputEl.value = '';
    this.clearError();
  }

  public clearError(): void {
    this.errorEl.textContent = '';
    this.errorEl.style.display = 'none';
  }

  public setError(msg: string): void {
    this.errorEl.textContent = msg;
    this.errorEl.style.display = 'block';
  }

  private render(): {
    element: HTMLElement;
    inputEl: HTMLInputElement;
    errorEl: HTMLElement;
  } {
    const wrapper = document.createElement('div');
    wrapper.className = 'chai-custom-amount-wrapper';

    const label = document.createElement('label');
    label.className = 'chai-section-label';
    label.htmlFor = 'chai-custom-input';
    label.textContent = `Or choose custom amount (${formatRupees(this.options.minAmountPaise)} - ${formatRupees(this.options.maxAmountPaise)})`;
    wrapper.appendChild(label);

    const inputGroup = document.createElement('div');
    inputGroup.className = 'chai-input-group';

    const symbol = document.createElement('span');
    symbol.className = 'chai-input-symbol';
    symbol.textContent = '₹';
    symbol.setAttribute('aria-hidden', 'true');
    inputGroup.appendChild(symbol);

    const input = document.createElement('input');
    input.id = 'chai-custom-input';
    input.type = 'text';
    input.className = 'chai-amount-input';
    input.inputMode = 'numeric';
    input.pattern = '[0-9]*';
    input.placeholder = 'Enter amount in ₹';
    input.setAttribute('aria-label', 'Custom contribution amount in rupees');

    if (this.options.initialAmountPaise) {
      input.value = (this.options.initialAmountPaise / 100).toString();
    }

    inputGroup.appendChild(input);
    wrapper.appendChild(inputGroup);

    const error = document.createElement('div');
    error.className = 'chai-input-error';
    error.style.display = 'none';
    error.setAttribute('role', 'alert');
    wrapper.appendChild(error);

    input.addEventListener('input', () => {
      const val = input.value.trim();
      if (!val) {
        this.clearError();
        this.options.onAmountChange(0, false);
        return;
      }

      const paise = rupeesToPaise(val);
      const validation = validateAmount(
        paise,
        this.options.minAmountPaise,
        this.options.maxAmountPaise
      );

      if (!validation.valid && validation.error) {
        this.setError(validation.error);
        this.options.onAmountChange(paise, false);
      } else {
        this.clearError();
        this.options.onAmountChange(paise, true);
      }
    });

    return { element: wrapper, inputEl: input, errorEl: error };
  }
}
