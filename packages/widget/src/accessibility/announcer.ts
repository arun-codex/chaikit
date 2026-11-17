/**
 * Accessible screen-reader live announcer for ChaiKit state updates.
 */

export class ScreenAnnouncer {
  private element: HTMLElement | null = null;

  constructor(shadowRoot: ShadowRoot) {
    let el = shadowRoot.querySelector<HTMLElement>('.chai-announcer');
    if (!el) {
      el = document.createElement('div');
      el.className = 'chai-announcer sr-only';
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('aria-atomic', 'true');
      shadowRoot.appendChild(el);
    }
    this.element = el;
  }

  public announce(message: string): void {
    if (!this.element) return;
    // Clear and set new text after a microtask to trigger screen reader announcement
    this.element.textContent = '';
    setTimeout(() => {
      if (this.element) {
        this.element.textContent = message;
      }
    }, 50);
  }
}
