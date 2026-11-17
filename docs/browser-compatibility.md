# Browser & Device Compatibility Matrix

ChaiKit is built upon modern Web Standards (Custom Elements v1, Shadow DOM v1, CSS Custom Properties, and ES2022).

---

## 1. Browser Support

| Browser | Minimum Version | Tested & Verified |
| :--- | :--- | :--- |
| **Chrome (Desktop & Android)** | 88+ | Full Support |
| **Firefox (Desktop & Android)** | 88+ | Full Support |
| **Safari / iOS Safari** | 14+ | Full Support |
| **Microsoft Edge** | 88+ | Full Support |
| **Samsung Internet** | 15+ | Full Support |
| **Opera (Desktop & Mobile)** | 74+ | Full Support |

---

## 2. In-App WebViews

When links are opened inside social apps (Instagram, LinkedIn, Twitter/X, Telegram):
- **Android WebViews:** Support Custom Elements and Shadow DOM. Deep links (`upi://`) may be restricted depending on the host application's security policy.
- **iOS WebViews:** In-app Safari blocks custom URL schemes (`upi://`) unless allowed by the host app.

**ChaiKit Resilience Strategy:**
When deep links are restricted, ChaiKit provides immediate fallback actions:
1. High-contrast scannable QR code.
2. One-click **"Copy UPI ID"** button with visual feedback.
3. Plain-text amount copy for manual entry in the user's UPI app.

---

## 3. Accessibility & Low-Power Hardware

- **Pre-rendered CSS / SVG:** Tier visuals are rendered as lightweight SVGs. No heavy WebGL overhead is imposed on mobile devices.
- **Reduced Motion Preference:** Respects `prefers-reduced-motion: reduce` by disabling floating animations and steam movement, replacing transitions with instant opacity fades.
- **High Zoom:** Tested up to 200% zoom without clipped QR codes or overflowing modal controls.
