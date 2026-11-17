/**
 * Toast notification for accessible clipboard and feedback confirmations.
 */

export class Toast {
  private element: HTMLElement;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'chai-toast';
    this.element.setAttribute('role', 'status');
    this.element.setAttribute('aria-live', 'polite');
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public show(message: string, durationMs = 2500): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.element.textContent = message;
    this.element.classList.add('visible');

    this.timeoutId = setTimeout(() => {
      this.element.classList.remove('visible');
      this.timeoutId = null;
    }, durationMs);
  }
}
