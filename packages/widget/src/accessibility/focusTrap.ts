/**
 * Focus trapping and restoration for accessible WCAG 2.2 compliant modal dialogs.
 */

export class FocusTrap {
  private container: HTMLElement;
  private previousActiveElement: HTMLElement | null = null;
  private keydownListener: ((e: KeyboardEvent) => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public activate(): void {
    if (typeof document === 'undefined') return;

    // Remember the previously focused element
    this.previousActiveElement = document.activeElement as HTMLElement | null;

    // Find focusable elements
    const focusable = this.getFocusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    // Attach key listener
    this.keydownListener = (e: KeyboardEvent) => this.handleKeyDown(e);
    this.container.addEventListener('keydown', this.keydownListener);
  }

  public deactivate(): void {
    if (this.keydownListener) {
      this.container.removeEventListener('keydown', this.keydownListener);
      this.keydownListener = null;
    }

    // Restore focus
    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      try {
        this.previousActiveElement.focus();
      } catch {
        // Element might no longer be in the DOM
      }
    }
    this.previousActiveElement = null;
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;

    const focusables = this.getFocusableElements();
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === first || this.container.shadowRoot?.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab
      if (document.activeElement === last || this.container.shadowRoot?.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const root = this.container.shadowRoot || this.container;
    const selector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
      (el) => el.offsetParent !== null && !el.hasAttribute('disabled')
    );
  }
}
