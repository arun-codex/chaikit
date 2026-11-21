/**
 * Focus trapping and restoration for accessible WCAG 2.2 compliant modal dialogs.
 * Supports Shadow DOM activeElement encapsulation.
 */

export class FocusTrap {
  private container: HTMLElement;
  private previousActiveElement: HTMLElement | null = null;
  private keydownListener: ((e: KeyboardEvent) => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public activate(triggerElement?: HTMLElement | null): void {
    if (typeof document === 'undefined' || this.keydownListener) return;

    // Remember the trigger element, fallback to activeElement
    const rootNode = this.container.getRootNode() as Document | ShadowRoot;
    let currentActive: Element | null = null;
    try {
      currentActive = (rootNode && 'activeElement' in rootNode ? rootNode.activeElement : null) || document.activeElement;
    } catch {
      currentActive = (typeof document !== 'undefined' ? document.activeElement : null);
    }
    this.previousActiveElement = triggerElement || (currentActive as HTMLElement | null);

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

    // Restore focus to the trigger or previously active element
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

    const rootNode = this.container.getRootNode() as Document | ShadowRoot;
    const currentActive = (rootNode && 'activeElement' in rootNode ? rootNode.activeElement : null) || document.activeElement;

    if (e.shiftKey) {
      // Shift + Tab: wrap from first to last
      if (currentActive === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab: wrap from last to first
      if (currentActive === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const selector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(this.container.querySelectorAll<HTMLElement>(selector)).filter(
      (el) => el.offsetParent !== null && !el.hasAttribute('disabled')
    );
  }
}
