/**
 * Support Modal component.
 * Coordinates modal dialog, header, tier selector, custom amount input, and payment panel.
 */

import {
  DEFAULT_MAX_AMOUNT_PAISE,
  DEFAULT_MIN_AMOUNT_PAISE,
  DEFAULT_TIERS,
  type ChaiTier,
} from '@chaikit/core';
import { getMiniCupSvg } from './ChaiIllustration.js';
import { CustomAmountInput } from './CustomAmountInput.js';
import { PaymentPanel } from './PaymentPanel.js';
import { TierSelector } from './TierSelector.js';
import { Toast } from './Toast.js';

export interface SupportModalOptions {
  creatorName: string;
  upiId: string;
  description?: string;
  tiers?: ChaiTier[];
  defaultTierId?: string;
  allowCustomAmount?: boolean;
  minAmountPaise?: number;
  maxAmountPaise?: number;
  note?: string;
  isInline?: boolean;
  onClose: () => void;
  onTierSelected: (tier: ChaiTier) => void;
  onAmountChanged: (amountPaise: number) => void;
  onHandoffAttempt: (uri: string) => void;
}

export class SupportModal {
  private backdropEl: HTMLElement;
  private modalEl: HTMLElement;
  private tierSelector: TierSelector;
  private customAmountInput: CustomAmountInput | null = null;
  private paymentPanel: PaymentPanel;
  private toast: Toast;
  private options: SupportModalOptions;
  private currentAmountPaise: number = 2500; // default Kadak Chai ₹25

  constructor(options: SupportModalOptions) {
    this.options = {
      ...options,
      tiers: options.tiers || DEFAULT_TIERS,
      minAmountPaise: options.minAmountPaise ?? DEFAULT_MIN_AMOUNT_PAISE,
      maxAmountPaise: options.maxAmountPaise ?? DEFAULT_MAX_AMOUNT_PAISE,
      allowCustomAmount: options.allowCustomAmount !== false,
    };

    // Determine initial tier
    const initialTier =
      this.options.tiers?.find((t) => t.id === options.defaultTierId) ||
      this.options.tiers?.[1] ||
      this.options.tiers?.[0];

    if (initialTier) {
      this.currentAmountPaise = initialTier.amountPaise;
    }

    this.toast = new Toast();

    // Instantiate TierSelector
    this.tierSelector = new TierSelector({
      tiers: this.options.tiers || DEFAULT_TIERS,
      selectedTierId: initialTier ? initialTier.id : null,
      onSelect: (tier) => {
        this.currentAmountPaise = tier.amountPaise;
        this.paymentPanel.updatePaymentData(tier.amountPaise);
        if (this.customAmountInput) {
          this.customAmountInput.clear();
        }
        this.options.onTierSelected(tier);
        this.options.onAmountChanged(tier.amountPaise);
      },
    });

    // Instantiate PaymentPanel
    this.paymentPanel = new PaymentPanel({
      creatorName: this.options.creatorName,
      upiId: this.options.upiId,
      amountPaise: this.currentAmountPaise,
      note: this.options.note,
      onCopySuccess: (msg) => this.toast.show(msg),
      onHandoffAttempt: (uri) => this.options.onHandoffAttempt(uri),
    });

    // Instantiate CustomAmountInput if allowed
    if (this.options.allowCustomAmount) {
      this.customAmountInput = new CustomAmountInput({
        minAmountPaise: this.options.minAmountPaise ?? DEFAULT_MIN_AMOUNT_PAISE,
        maxAmountPaise: this.options.maxAmountPaise ?? DEFAULT_MAX_AMOUNT_PAISE,
        onAmountChange: (amountPaise, isValid) => {
          if (isValid && amountPaise > 0) {
            this.currentAmountPaise = amountPaise;
            this.tierSelector.selectTier(null); // Unselect predefined tier
            this.paymentPanel.updatePaymentData(amountPaise);
            this.options.onAmountChanged(amountPaise);
          }
        },
      });
    }

    const { backdrop, modal } = this.render();
    this.backdropEl = backdrop;
    this.modalEl = modal;
  }

  public getBackdropElement(): HTMLElement {
    return this.backdropEl;
  }

  public getModalElement(): HTMLElement {
    return this.modalEl;
  }

  public open(): void {
    this.backdropEl.classList.add('open');
    this.modalEl.setAttribute('aria-hidden', 'false');
  }

  public close(): void {
    this.backdropEl.classList.remove('open');
    this.modalEl.setAttribute('aria-hidden', 'true');
  }

  public isOpen(): boolean {
    return this.backdropEl.classList.contains('open');
  }

  public setAmount(amountPaise: number): void {
    this.currentAmountPaise = amountPaise;
    // Check if matches a predefined tier
    const matchedTier = this.options.tiers?.find((t) => t.amountPaise === amountPaise);
    if (matchedTier) {
      this.tierSelector.selectTier(matchedTier.id);
      if (this.customAmountInput) {
        this.customAmountInput.clear();
      }
    } else if (this.customAmountInput) {
      this.tierSelector.selectTier(null);
      this.customAmountInput.setAmount(amountPaise);
    }
    this.paymentPanel.updatePaymentData(amountPaise);
  }

  private render(): { backdrop: HTMLElement; modal: HTMLElement } {
    const backdrop = document.createElement('div');
    backdrop.className = this.options.isInline ? 'chai-inline-card' : 'chai-backdrop';

    if (!this.options.isInline) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.options.onClose();
        }
      });
    }

    const modal = document.createElement('div');
    modal.className = this.options.isInline ? 'chai-modal-inline' : 'chai-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', this.options.isInline ? 'false' : 'true');
    modal.setAttribute('aria-labelledby', 'chai-modal-title');
    modal.setAttribute('aria-describedby', 'chai-modal-desc');

    // Header
    const header = document.createElement('header');
    header.className = 'chai-header';

    const brand = document.createElement('div');
    brand.className = 'chai-header-brand';

    const cupIcon = document.createElement('div');
    cupIcon.className = 'chai-header-cup';
    cupIcon.setAttribute('aria-hidden', 'true');
    cupIcon.innerHTML = getMiniCupSvg();
    brand.appendChild(cupIcon);

    const titles = document.createElement('div');
    titles.className = 'chai-header-titles';

    const title = document.createElement('h2');
    title.id = 'chai-modal-title';
    title.className = 'chai-title';
    title.textContent = `Buy ${this.options.creatorName} a Chai ☕`;
    titles.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.id = 'chai-modal-desc';
    subtitle.className = 'chai-subtitle';
    subtitle.textContent =
      this.options.description || 'Enjoying my work? A little chai goes a long way!';
    titles.appendChild(subtitle);

    brand.appendChild(titles);
    header.appendChild(brand);

    if (!this.options.isInline) {
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'chai-close-btn';
      closeBtn.setAttribute('aria-label', 'Close support dialog');
      closeBtn.innerHTML = /* html */ `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
      closeBtn.addEventListener('click', () => this.options.onClose());
      header.appendChild(closeBtn);
    }

    modal.appendChild(header);

    // Body
    const body = document.createElement('div');
    body.className = 'chai-body';

    // Toast element for notifications
    body.appendChild(this.toast.getElement());

    // Tier Selector
    body.appendChild(this.tierSelector.getElement());

    // Custom Amount Input
    if (this.customAmountInput) {
      body.appendChild(this.customAmountInput.getElement());
    }

    // Payment Panel
    body.appendChild(this.paymentPanel.getElement());

    modal.appendChild(body);
    backdrop.appendChild(modal);

    return { backdrop, modal };
  }
}
