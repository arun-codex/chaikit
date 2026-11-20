/**
 * Encapsulated CSS styles for the ChaiKit Web Component shadow root.
 * Completely isolated from host page styles.
 */

export const WIDGET_STYLES = /* css */ `
:host {
  --chai-font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --chai-bg: #2B1D16;
  --chai-card-bg: rgba(43, 29, 22, 0.85);
  --chai-surface: #38251C;
  --chai-surface-hover: #483024;
  --chai-text: #F6E8D2;
  --chai-text-muted: #B39E8F;
  --chai-border: rgba(199, 139, 82, 0.28);
  --chai-border-hover: rgba(233, 174, 91, 0.6);
  --chai-accent: #E9AE5B;
  --chai-accent-hover: #F2BD72;
  --chai-accent-text: #1B1410;
  --chai-shadow: 0 14px 40px rgba(0, 0, 0, 0.45);
  --chai-radius: 18px;
  --chai-radius-sm: 10px;
  --chai-qr-bg: #FFFFFF;
  --chai-qr-fg: #1B1410;
  font-family: var(--chai-font);
  font-size: 14px;
  line-height: 1.5;
  color: var(--chai-text);
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:host([theme="cream"]) {
  --chai-bg: #FFFDF9;
  --chai-card-bg: #FFFFFF;
  --chai-surface: #F6E8D2;
  --chai-surface-hover: #EEDABE;
  --chai-text: #1B1410;
  --chai-text-muted: #735D4F;
  --chai-border: rgba(199, 139, 82, 0.35);
  --chai-border-hover: #C78B52;
  --chai-accent: #C66B45;
  --chai-accent-hover: #B85B35;
  --chai-accent-text: #FFFFFF;
  --chai-shadow: 0 14px 40px rgba(27, 20, 16, 0.16);
}

:host([theme="dark"]) {
  --chai-bg: #140E0B;
  --chai-card-bg: #1D1510;
  --chai-surface: #271C16;
  --chai-surface-hover: #33251E;
  --chai-text: #F8EFE4;
  --chai-text-muted: #9F8A7D;
  --chai-border: rgba(233, 174, 91, 0.2);
  --chai-border-hover: rgba(233, 174, 91, 0.5);
  --chai-accent: #E9AE5B;
  --chai-accent-hover: #F4C47E;
  --chai-accent-text: #1B1410;
  --chai-shadow: 0 16px 44px rgba(0, 0, 0, 0.65);
}

:host([theme="minimal"]) {
  --chai-bg: #18181B;
  --chai-card-bg: #27272A;
  --chai-surface: #3F3F46;
  --chai-surface-hover: #52525B;
  --chai-text: #F4F4F5;
  --chai-text-muted: #A1A1AA;
  --chai-border: rgba(255, 255, 255, 0.15);
  --chai-border-hover: rgba(255, 255, 255, 0.35);
  --chai-accent: #FAFAFA;
  --chai-accent-hover: #FFFFFF;
  --chai-accent-text: #18181B;
  --chai-shadow: 0 14px 40px rgba(0, 0, 0, 0.4);
}

@media (prefers-color-scheme: light) {
  :host([theme="auto"]) {
    --chai-bg: #FFFDF9;
    --chai-card-bg: #FFFFFF;
    --chai-surface: #F6E8D2;
    --chai-surface-hover: #EEDABE;
    --chai-text: #1B1410;
    --chai-text-muted: #735D4F;
    --chai-border: rgba(199, 139, 82, 0.35);
    --chai-border-hover: #C78B52;
    --chai-accent: #C66B45;
    --chai-accent-hover: #B85B35;
    --chai-accent-text: #FFFFFF;
    --chai-shadow: 0 14px 40px rgba(27, 20, 16, 0.16);
  }
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Accessibility utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ---------------- FLOATING LAUNCHER ---------------- */
.chai-launcher-wrapper {
  position: fixed;
  z-index: 2147483640;
  bottom: max(20px, env(safe-area-inset-bottom, 20px));
}

.chai-launcher-wrapper[data-position="bottom-right"] {
  right: max(20px, env(safe-area-inset-right, 20px));
}

.chai-launcher-wrapper[data-position="bottom-left"] {
  left: max(20px, env(safe-area-inset-left, 20px));
}

.chai-launcher-wrapper[data-position="inline"] {
  position: static;
  display: block;
  margin: 16px 0;
}

.chai-launcher-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--chai-bg);
  color: var(--chai-text);
  border: 1px solid var(--chai-border);
  border-radius: 9999px;
  padding: 10px 18px 10px 14px;
  font-family: var(--chai-font);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25), 0 0 12px rgba(233, 174, 91, 0.15);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
  user-select: none;
  outline: none;
}

.chai-launcher-btn:hover {
  transform: translateY(-2px) scale(1.02);
  border-color: var(--chai-border-hover);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35), 0 0 18px rgba(233, 174, 91, 0.25);
}

.chai-launcher-btn:active {
  transform: translateY(0) scale(0.98);
}

.chai-launcher-btn:focus-visible {
  outline: 2px solid var(--chai-accent);
  outline-offset: 3px;
}

.chai-launcher-icon {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.chai-launcher-text {
  letter-spacing: 0.01em;
}

/* ---------------- STEAM ANIMATION ---------------- */
@keyframes steam-rise-1 {
  0% { transform: translateY(0) scaleX(1); opacity: 0; }
  15% { opacity: 0.7; }
  50% { transform: translateY(-7px) scaleX(1.15) translateX(1px); opacity: 0.5; }
  100% { transform: translateY(-14px) scaleX(1.3) translateX(-1px); opacity: 0; }
}

@keyframes steam-rise-2 {
  0% { transform: translateY(0) scaleX(1); opacity: 0; }
  20% { opacity: 0.8; }
  60% { transform: translateY(-8px) scaleX(1.2) translateX(-1.5px); opacity: 0.4; }
  100% { transform: translateY(-15px) scaleX(1.4) translateX(1px); opacity: 0; }
}

.steam-path-1 {
  animation: steam-rise-1 2.2s infinite ease-out;
  transform-origin: center bottom;
}

.steam-path-2 {
  animation: steam-rise-2 2.6s infinite ease-out 0.7s;
  transform-origin: center bottom;
}

/* ---------------- MODAL BACKDROP & CONTAINER ---------------- */
.chai-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147483645;
  background: rgba(15, 10, 8, 0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.chai-backdrop.open {
  opacity: 1;
  pointer-events: auto;
}

.chai-modal {
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  background: var(--chai-bg);
  border: 1px solid var(--chai-border);
  border-radius: var(--chai-radius);
  box-shadow: var(--chai-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateY(20px) scale(0.96);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.chai-backdrop.open .chai-modal {
  transform: translateY(0) scale(1);
}

/* Inline Card Mode */
.chai-inline-card {
  width: 100%;
  max-width: 480px;
  background: var(--chai-bg);
  border: 1px solid var(--chai-border);
  border-radius: var(--chai-radius);
  box-shadow: var(--chai-shadow);
  overflow: hidden;
  margin: 16px 0;
}

/* ---------------- HEADER ---------------- */
.chai-header {
  padding: 18px 20px 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--chai-border);
  background: linear-gradient(180deg, rgba(233, 174, 91, 0.08) 0%, transparent 100%);
}

.chai-header-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chai-header-cup {
  width: 36px;
  height: 36px;
  border-radius: var(--chai-radius-sm);
  background: var(--chai-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--chai-border);
  flex-shrink: 0;
}

.chai-header-titles {
  display: flex;
  flex-direction: column;
}

.chai-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--chai-text);
  line-height: 1.25;
}

.chai-subtitle {
  font-size: 12px;
  color: var(--chai-text-muted);
  margin-top: 2px;
}

.chai-close-btn {
  background: transparent;
  border: 1px solid transparent;
  color: var(--chai-text-muted);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.chai-close-btn:hover {
  background: var(--chai-surface);
  color: var(--chai-text);
  border-color: var(--chai-border);
}

.chai-close-btn:focus-visible {
  outline: 2px solid var(--chai-accent);
}

/* ---------------- BODY & SECTIONS ---------------- */
.chai-body {
  padding: 18px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.chai-section-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--chai-text-muted);
  margin-bottom: 8px;
}

/* ---------------- 3D STAGE (OPTIONAL) ---------------- */
.chai-3d-stage {
  width: 100%;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, rgba(233, 174, 91, 0.15) 0%, rgba(43, 29, 22, 0.4) 65%, transparent 100%);
  border-radius: var(--chai-radius-sm);
  margin-bottom: 2px;
  border: 1px solid var(--chai-border);
  overflow: hidden;
  position: relative;
}

.chai-3d-canvas {
  width: 100%;
  height: 100%;
  touch-action: none;
  cursor: grab;
}

.chai-3d-canvas:active {
  cursor: grabbing;
}

/* ---------------- TIERS GRID ---------------- */
.chai-tiers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.chai-tier-card {
  background: var(--chai-surface);
  border: 1px solid var(--chai-border);
  border-radius: var(--chai-radius-sm);
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
  user-select: none;
  outline: none;
}

.chai-tier-card:hover {
  background: var(--chai-surface-hover);
  border-color: var(--chai-border-hover);
  transform: translateY(-2px);
}

.chai-tier-card.selected {
  border-color: var(--chai-accent);
  background: linear-gradient(180deg, rgba(233, 174, 91, 0.12) 0%, var(--chai-surface) 100%);
  box-shadow: 0 0 16px rgba(233, 174, 91, 0.2);
}

.chai-tier-card:focus-visible {
  outline: 2px solid var(--chai-accent);
  outline-offset: 2px;
}

.chai-tier-icon {
  width: 44px;
  height: 44px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chai-tier-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--chai-text);
}

.chai-tier-amount {
  font-size: 15px;
  font-weight: 700;
  color: var(--chai-accent);
  margin-top: 2px;
}

.chai-tier-desc {
  font-size: 11px;
  color: var(--chai-text-muted);
  margin-top: 4px;
  line-height: 1.25;
}

/* ---------------- CUSTOM AMOUNT INPUT ---------------- */
.chai-custom-amount-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.chai-input-group {
  display: flex;
  align-items: center;
  background: var(--chai-surface);
  border: 1px solid var(--chai-border);
  border-radius: var(--chai-radius-sm);
  padding: 0 12px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.chai-input-group:focus-within {
  border-color: var(--chai-accent);
  box-shadow: 0 0 0 2px rgba(233, 174, 91, 0.25);
}

.chai-input-symbol {
  font-size: 16px;
  font-weight: 700;
  color: var(--chai-accent);
  margin-right: 6px;
}

.chai-amount-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--chai-text);
  font-family: var(--chai-font);
  font-size: 15px;
  font-weight: 600;
  padding: 10px 0;
  width: 100%;
}

.chai-input-error {
  font-size: 11px;
  color: #EF4444;
  margin-top: 2px;
}

/* ---------------- PAYMENT PANEL ---------------- */
.chai-payment-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  background: var(--chai-surface);
  border: 1px solid var(--chai-border);
  border-radius: var(--chai-radius-sm);
  padding: 16px;
  text-align: center;
}

.chai-qr-frame {
  position: relative;
  background: var(--chai-qr-bg);
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.chai-qr-frame:hover {
  transform: scale(1.02);
}

.chai-qr-frame svg {
  display: block;
  border-radius: 6px;
}

.chai-demo-qr-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(27, 20, 16, 0.68);
  border-radius: 12px;
  backdrop-filter: blur(2px);
  pointer-events: none;
}

.chai-demo-tag {
  background: #E9AE5B;
  color: #1B1410;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  padding: 6px 12px;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
  text-transform: uppercase;
  text-align: center;
}

.chai-qr-actions {
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: center;
}

.chai-btn-secondary {
  background: transparent;
  border: 1px solid var(--chai-border);
  color: var(--chai-text);
  border-radius: var(--chai-radius-sm);
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
}

.chai-btn-secondary:hover {
  background: var(--chai-surface-hover);
  border-color: var(--chai-border-hover);
}

.chai-btn-secondary:focus-visible {
  outline: 2px solid var(--chai-accent);
}

.chai-btn-primary {
  width: 100%;
  background: var(--chai-accent);
  color: var(--chai-accent-text);
  border: none;
  border-radius: var(--chai-radius-sm);
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(233, 174, 91, 0.35);
  transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
  outline: none;
}

.chai-btn-primary:hover {
  background: var(--chai-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(233, 174, 91, 0.45);
}

.chai-btn-primary:active {
  transform: translateY(0);
}

.chai-btn-primary:focus-visible {
  outline: 2px solid var(--chai-accent);
  outline-offset: 2px;
}

.chai-upi-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
}

.chai-upi-label {
  color: var(--chai-text-muted);
}

.chai-upi-value {
  font-family: monospace;
  font-weight: 600;
  color: var(--chai-text);
}

/* ---------------- HONEST PAYMENT DISCLAIMER ---------------- */
.chai-disclaimer {
  font-size: 11px;
  color: var(--chai-text-muted);
  line-height: 1.4;
  padding: 4px 6px;
  text-align: center;
}

.chai-disclaimer strong {
  color: var(--chai-text);
}

/* ---------------- TOAST NOTIFICATION ---------------- */
.chai-toast {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%) translateY(-10px);
  background: #10B981;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 9999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.2s ease, opacity 0.2s ease;
  z-index: 10;
}

.chai-toast.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ---------------- REDUCED MOTION ---------------- */
@media (prefers-reduced-motion: reduce) {
  .steam-path-1, .steam-path-2 {
    animation: none !important;
    opacity: 0.6;
  }
  .chai-launcher-btn,
  .chai-backdrop,
  .chai-modal,
  .chai-tier-card,
  .chai-btn-primary,
  .chai-qr-frame,
  .chai-toast {
    transition: opacity 0.05s linear !important;
    transform: none !important;
  }
}

/* ---------------- MOBILE RESPONSIVENESS ---------------- */
@media (max-width: 480px) {
  .chai-backdrop {
    padding: 0;
    align-items: flex-end;
  }

  .chai-modal {
    max-width: 100%;
    max-height: 85vh;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .chai-header {
    padding: 16px 18px 12px 18px;
  }

  .chai-body {
    padding: 14px 16px 24px 16px;
  }
}
`;
