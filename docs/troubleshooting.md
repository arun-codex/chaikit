# Troubleshooting Guide

Common installation and runtime issues and their solutions.

---

## 1. Widget Does Not Appear

### Check Script Loading
Make sure the ChaiKit script is loaded before or after the `<chai-support>` custom element:
```html
<script defer src="https://cdn.jsdelivr.net/npm/chaikit@1.0.0/dist/chaikit.iife.js"></script>
```

### Check Browser Console
Open Developer Tools (`F12`) and check the Console tab:
- If you see `ChaiKit configuration error: creatorName is required`, verify that `creator-name` is non-empty.
- If you see `Invalid UPI ID format`, confirm your UPI ID adheres to `username@bank`.

---

## 2. Content Security Policy (CSP) Restrictions

If your website enforces a strict Content Security Policy:

1. **Script Source:** Allow jsDelivr if loading from CDN:
   ```http
   Content-Security-Policy: script-src 'self' https://cdn.jsdelivr.net;
   ```
   Or self-host `chaikit.iife.js` on your own domain.
2. **Style Source:** ChaiKit injects its styles into its internal Shadow Root using text nodes (`styleEl.textContent`). It does not require `'unsafe-inline'` for external stylesheets.
3. **Data URLs:** For QR code SVG downloads:
   ```http
   Content-Security-Policy: img-src 'self' data:;
   ```

---

## 3. Duplicate Custom Element Registration Errors

If your Single Page Application (SPA) reloads the script during client-side navigation:
ChaiKit guards against duplicate registrations automatically:
```ts
if (!customElements.get('chai-support')) {
  customElements.define('chai-support', ChaiSupportElement);
}
```
Multiple `<chai-support>` elements on the same page are fully supported and operate independently without state collision.

---

## 4. Mobile Deep Link Fails to Open UPI App

1. Ensure the user interacted directly (tap/click). Mobile browsers block programmatic deep-link redirects without direct user interaction.
2. If using an in-app browser (e.g. Instagram browser), use the "Copy UPI ID" button or scan the QR code using another phone.
