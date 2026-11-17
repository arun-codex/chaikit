/**
 * Payment Panel component.
 * Displays scannable UPI QR code, mobile intent handoff, copy actions, and honest payment instructions.
 */

import {
  attemptUpiHandoff,
  buildUpiUri,
  formatRupees,
  generateQrSvg,
  isMobileDevice,
  svgToDataUrl,
} from '@chaikit/core';

export interface PaymentPanelOptions {
  creatorName: string;
  upiId: string;
  amountPaise: number;
  note?: string;
  onCopySuccess: (text: string) => void;
  onHandoffAttempt: (uri: string) => void;
}

export class PaymentPanel {
  private element: HTMLElement;
  private options: PaymentPanelOptions;
  private qrFrameEl: HTMLElement;
  private amountLabelEl: HTMLElement;
  private upiUri: string = '';

  constructor(options: PaymentPanelOptions) {
    this.options = options;
    const { element, qrFrameEl, amountLabelEl } = this.render();
    this.element = element;
    this.qrFrameEl = qrFrameEl;
    this.amountLabelEl = amountLabelEl;
    this.updatePaymentData(options.amountPaise);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public updatePaymentData(amountPaise: number): void {
    this.options.amountPaise = amountPaise;
    this.amountLabelEl.textContent = formatRupees(amountPaise);

    if (amountPaise <= 0) {
      this.qrFrameEl.innerHTML = '<div style="padding: 24px; color: var(--chai-text-muted);">Please select or enter an amount to generate payment QR.</div>';
      this.upiUri = '';
      return;
    }

    try {
      this.upiUri = buildUpiUri({
        upiId: this.options.upiId,
        creatorName: this.options.creatorName,
        amountPaise,
        note: this.options.note,
      });

      const qrSvg = generateQrSvg(this.upiUri, {
        size: 190,
        margin: 3,
        foreground: '#1B1410',
        background: '#FFFFFF',
      });

      this.qrFrameEl.innerHTML = qrSvg;
    } catch {
      this.qrFrameEl.innerHTML = '<div style="padding: 20px; color: #EF4444;">Could not generate QR. Please check UPI configuration.</div>';
    }
  }

  private async copyText(text: string, successMessage: string): Promise<void> {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        this.options.onCopySuccess(successMessage);
        return;
      }
    } catch {
      // Fallback
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (successful) {
        this.options.onCopySuccess(successMessage);
      } else {
        this.options.onCopySuccess(`UPI: ${text}`);
      }
    } catch {
      this.options.onCopySuccess(`UPI: ${text}`);
    }
  }

  private render(): {
    element: HTMLElement;
    qrFrameEl: HTMLElement;
    amountLabelEl: HTMLElement;
  } {
    const container = document.createElement('div');
    container.className = 'chai-payment-panel';

    const label = document.createElement('div');
    label.className = 'chai-section-label';
    label.style.alignSelf = 'flex-start';
    label.textContent = 'Scan or pay via UPI';
    container.appendChild(label);

    // QR Code Frame
    const qrFrame = document.createElement('div');
    qrFrame.className = 'chai-qr-frame';
    qrFrame.setAttribute('role', 'region');
    qrFrame.setAttribute('aria-label', 'UPI Payment QR Code');
    container.appendChild(qrFrame);

    // UPI Summary Details
    const details = document.createElement('div');
    details.className = 'chai-upi-details';

    const amountWrapper = document.createElement('div');
    amountWrapper.innerHTML = /* html */ `
      <span class="chai-upi-label">Amount: </span>
      <span class="chai-upi-value chai-payment-amount">${formatRupees(this.options.amountPaise)}</span>
    `;

    const upiWrapper = document.createElement('div');
    upiWrapper.innerHTML = /* html */ `
      <span class="chai-upi-label">UPI ID: </span>
      <span class="chai-upi-value">${this.options.upiId}</span>
    `;

    details.appendChild(amountWrapper);
    details.appendChild(upiWrapper);
    container.appendChild(details);

    // Actions Row
    const actions = document.createElement('div');
    actions.className = 'chai-qr-actions';

    // Copy UPI ID Button
    const copyUpiBtn = document.createElement('button');
    copyUpiBtn.type = 'button';
    copyUpiBtn.className = 'chai-btn-secondary';
    copyUpiBtn.setAttribute('aria-label', `Copy UPI ID: ${this.options.upiId}`);
    copyUpiBtn.innerHTML = /* html */ `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span>Copy UPI ID</span>
    `;
    copyUpiBtn.addEventListener('click', async () => {
      await this.copyText(this.options.upiId, 'UPI ID copied to clipboard!');
    });
    actions.appendChild(copyUpiBtn);

    // Download QR Button
    const downloadQrBtn = document.createElement('button');
    downloadQrBtn.type = 'button';
    downloadQrBtn.className = 'chai-btn-secondary';
    downloadQrBtn.setAttribute('aria-label', 'Download UPI QR Code');
    downloadQrBtn.innerHTML = /* html */ `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      <span>Save QR</span>
    `;
    downloadQrBtn.addEventListener('click', () => {
      if (!this.upiUri) return;
      const qrSvg = generateQrSvg(this.upiUri, { size: 300 });
      const dataUrl = svgToDataUrl(qrSvg);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `chai-qr-${this.options.amountPaise / 100}rs.svg`;
      a.click();
    });
    actions.appendChild(downloadQrBtn);

    container.appendChild(actions);

    // Mobile "Open in UPI App" Action
    const isMobile = isMobileDevice();
    const openAppBtn = document.createElement('button');
    openAppBtn.type = 'button';
    openAppBtn.className = 'chai-btn-primary';
    openAppBtn.setAttribute('aria-label', 'Open UPI payment in installed mobile app');
    openAppBtn.innerHTML = /* html */ `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
      </svg>
      <span>${isMobile ? 'Open in UPI App' : 'Pay via UPI App'}</span>
    `;
    openAppBtn.addEventListener('click', () => {
      if (!this.upiUri) return;
      this.options.onHandoffAttempt(this.upiUri);
      attemptUpiHandoff(this.upiUri);
    });
    container.appendChild(openAppBtn);

    // Transparent, Honest Payment Disclaimer
    const disclaimer = document.createElement('div');
    disclaimer.className = 'chai-disclaimer';
    disclaimer.innerHTML = /* html */ `
      Complete payment in Google Pay, PhonePe, Paytm, or BHIM. Direct P2P transfer &mdash; <strong>verify recipient name before confirming</strong> in your UPI app.
    `;
    container.appendChild(disclaimer);

    const amountLabel = amountWrapper.querySelector('.chai-payment-amount') as HTMLElement;
    return { element: container, qrFrameEl: qrFrame, amountLabelEl: amountLabel };
  }
}
