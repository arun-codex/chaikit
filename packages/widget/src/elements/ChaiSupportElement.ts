/**
 * <chai-support> Custom Element
 * Universal, framework-independent, standards-based Web Component.
 */

import {
  DEFAULT_MAX_AMOUNT_PAISE,
  DEFAULT_MIN_AMOUNT_PAISE,
  DEFAULT_TIERS,
  formatRupees,
  validateConfig,
  type ChaiEventDetailMap,
  type ChaiEventName,
  type ChaiKitConfig,
  type ChaiTier,
  type PaymentState,
} from '@chaikit/core';
import { ScreenAnnouncer } from '../accessibility/announcer.js';
import { FocusTrap } from '../accessibility/focusTrap.js';
import { FloatingLauncher } from '../components/FloatingLauncher.js';
import { SupportModal } from '../components/SupportModal.js';
import { WIDGET_STYLES } from '../styles/widget.css.js';

const SafeHTMLElement: typeof HTMLElement =
  typeof HTMLElement !== 'undefined'
    ? HTMLElement
    : (class {} as unknown as typeof HTMLElement);

export class ChaiSupportElement extends SafeHTMLElement {
  public static get observedAttributes(): string[] {
    return [
      'creator-name',
      'upi-id',
      'description',
      'theme',
      'position',
      'button-text',
      'accent-color',
      'headless',
      'min-amount',
      'max-amount',
      'default-tier',
      'note',
      'enable-3d',
    ];
  }

  private config: ChaiKitConfig = {
    creatorName: '',
    upiId: '',
    theme: 'classic',
    position: 'bottom-right',
    buttonText: 'Buy Me a Chai ☕',
  };

  private shadow: ShadowRoot;
  private launcher: FloatingLauncher | null = null;
  private modal: SupportModal | null = null;
  private focusTrap: FocusTrap | null = null;
  private announcer: ScreenAnnouncer | null = null;
  private paymentState: PaymentState = 'idle';
  private escapeListener: ((e: KeyboardEvent) => void) | null = null;
  private isRendered = false;

  constructor() {
    super();
    if (typeof this.attachShadow === 'function') {
      this.shadow = this.attachShadow({ mode: 'open' });
    } else {
      this.shadow = null as unknown as ShadowRoot;
    }
  }

  public connectedCallback(): void {
    this.readAttributes();
    this.render();
  }

  public disconnectedCallback(): void {
    this.cleanup();
  }

  public attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue || !this.isRendered) return;
    this.readAttributes();
    this.render();
  }

  /**
   * Opens the support modal programmatically.
   */
  public open(): void {
    if (!this.modal) return;
    this.modal.open();
    this.paymentState = 'modal_open';

    if (this.focusTrap) {
      this.focusTrap.activate(this.launcher?.getButtonElement());
    }

    this.announcer?.announce(`Opened support modal for ${this.config.creatorName}`);
    this.dispatchChaiEvent('chai:opened', { creatorName: this.config.creatorName });
  }

  /**
   * Closes the support modal programmatically.
   */
  public close(): void {
    if (!this.modal) return;
    this.modal.close();
    this.paymentState = 'closed';

    if (this.focusTrap) {
      this.focusTrap.deactivate();
    }

    this.announcer?.announce('Closed support modal');
    this.dispatchChaiEvent('chai:closed', {});
  }

  /**
   * Programmatic configuration updater.
   */
  public updateConfig(partial: Partial<ChaiKitConfig>): void {
    this.config = { ...this.config, ...partial };
    this.render();
  }

  /**
   * Programmatically set contribution amount in paise.
   */
  public setAmount(amountPaise: number): void {
    if (this.modal) {
      this.modal.setAmount(amountPaise);
    }
  }

  /**
   * Removes element and cleans up all listeners.
   */
  public destroy(): void {
    this.cleanup();
    this.remove();
  }

  private readAttributes(): void {
    const creatorName = this.getAttribute('creator-name') || this.config.creatorName || '';
    const upiId = this.getAttribute('upi-id') || this.config.upiId || '';
    const description = this.getAttribute('description') || this.config.description;
    const theme = (this.getAttribute('theme') as ChaiKitConfig['theme']) || this.config.theme || 'classic';
    const position = (this.getAttribute('position') as ChaiKitConfig['position']) || this.config.position || 'bottom-right';
    const buttonText = this.getAttribute('button-text') || this.config.buttonText || 'Buy Me a Chai ☕';
    const accentColor = this.getAttribute('accent-color') || this.config.accentColor;
    const headless = this.hasAttribute('headless') || this.config.headless || false;
    const note = this.getAttribute('note') || this.config.note;
    const defaultTierId = this.getAttribute('default-tier') || this.config.defaultTierId;
    const enable3D = this.hasAttribute('enable-3d') || Boolean(this.config.enable3D);

    const minAttr = this.getAttribute('min-amount');
    const maxAttr = this.getAttribute('max-amount');
    const minAmountPaise = minAttr ? parseInt(minAttr, 10) * 100 : this.config.minAmountPaise ?? DEFAULT_MIN_AMOUNT_PAISE;
    const maxAmountPaise = maxAttr ? parseInt(maxAttr, 10) * 100 : this.config.maxAmountPaise ?? DEFAULT_MAX_AMOUNT_PAISE;

    this.config = {
      ...this.config,
      creatorName,
      upiId,
      description,
      theme,
      position,
      buttonText,
      accentColor,
      headless,
      note,
      defaultTierId,
      enable3D,
      minAmountPaise,
      maxAmountPaise,
    };
  }

  private render(): void {
    this.cleanup();
    this.shadow.innerHTML = '';

    // Apply theme attribute on host
    if (this.config.theme) {
      this.setAttribute('theme', this.config.theme);
    }

    // Apply custom accent color if supplied
    if (this.config.accentColor) {
      this.style.setProperty('--chai-accent', this.config.accentColor);
    }

    // Validate configuration
    const validation = validateConfig(this.config);
    if (!validation.valid) {
      const errorMsg = `ChaiKit configuration error: ${validation.errors.join(' ')}`;
      console.error(errorMsg);
      this.dispatchChaiEvent('chai:error', { message: errorMsg, code: 'INVALID_CONFIG' });
    }

    // Inject encapsulated styles
    const styleEl = document.createElement('style');
    styleEl.textContent = WIDGET_STYLES;
    this.shadow.appendChild(styleEl);

    // Announcer for screen readers
    this.announcer = new ScreenAnnouncer(this.shadow);

    const isInline = this.config.position === 'inline';

    // Instantiate Modal
    this.modal = new SupportModal({
      creatorName: this.config.creatorName || 'Creator',
      upiId: this.config.upiId || 'creator@upi',
      description: this.config.description,
      tiers: this.config.tiers || DEFAULT_TIERS,
      defaultTierId: this.config.defaultTierId,
      allowCustomAmount: this.config.allowCustomAmount !== false,
      minAmountPaise: this.config.minAmountPaise,
      maxAmountPaise: this.config.maxAmountPaise,
      note: this.config.note,
      enable3D: this.config.enable3D,
      isInline,
      onClose: () => this.close(),
      onTierSelected: (tier: ChaiTier) => {
        this.paymentState = 'tier_selected';
        this.announcer?.announce(`Selected ${tier.name} for ${formatRupees(tier.amountPaise)}`);
        this.dispatchChaiEvent('chai:tier-selected', { tier, amountPaise: tier.amountPaise });
      },
      onAmountChanged: (amountPaise: number) => {
        this.dispatchChaiEvent('chai:amount-changed', {
          amountPaise,
          formattedRupees: formatRupees(amountPaise),
        });
      },
      onHandoffAttempt: (uri: string) => {
        this.paymentState = 'handoff_attempted';
        this.dispatchChaiEvent('chai:upi-handoff-attempted', {
          upiUri: uri,
          timestamp: Date.now(),
        });
      },
    });

    if (isInline) {
      // Inline mode: append directly into host flow
      this.shadow.appendChild(this.modal.getBackdropElement());
    } else {
      // Floating / Headless mode
      if (!this.config.headless) {
        this.launcher = new FloatingLauncher({
          buttonText: this.config.buttonText || 'Buy Me a Chai ☕',
          position: this.config.position || 'bottom-right',
          onOpen: () => this.open(),
        });
        this.shadow.appendChild(this.launcher.getElement());
      }

      this.shadow.appendChild(this.modal.getBackdropElement());

      // Focus trap on modal
      this.focusTrap = new FocusTrap(this.modal.getModalElement());

      // Escape key listener
      this.escapeListener = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.modal?.isOpen()) {
          this.close();
        }
      };
      window.addEventListener('keydown', this.escapeListener);
    }

    this.isRendered = true;
  }

  private dispatchChaiEvent<K extends ChaiEventName>(name: K, detail: ChaiEventDetailMap[K]): void {
    const event = new CustomEvent(name, {
      bubbles: true,
      composed: true, // Passes through shadow boundary
      detail,
    });
    this.dispatchEvent(event);
  }

  private cleanup(): void {
    if (this.modal) {
      this.modal.destroy();
    }
    if (this.escapeListener) {
      window.removeEventListener('keydown', this.escapeListener);
      this.escapeListener = null;
    }
    if (this.focusTrap) {
      this.focusTrap.deactivate();
      this.focusTrap = null;
    }
  }
}
