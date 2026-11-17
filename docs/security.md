# Security & Privacy Policy

ChaiKit is built upon a strict privacy-first, zero-telemetry architecture.

---

## 1. Data Privacy Principles

- **Zero Tracking:** ChaiKit contains no analytics trackers, pixel beacons, session recorders, or telemetry pings.
- **Zero Third-Party Network Requests:** The core widget makes **zero external HTTP requests** during runtime. QR codes, SVG graphics, and amount conversions execute entirely inside the visitor's local browser runtime.
- **No Secret Storage:** ChaiKit does not write to `localStorage`, `sessionStorage`, or `cookies`.

---

## 2. Payment Security Guidelines

### What We NEVER Collect:
ChaiKit is an interface generator, NOT a banking portal. The library **never** prompts for or stores:
- UPI PINs
- Net Banking passwords
- Debit / Credit card numbers
- CVVs / Expiry dates
- OTPs (One Time Passwords)
- Government IDs (PAN, Aadhaar)

All actual payment authorizations occur inside the user's official UPI application (Google Pay, PhonePe, Paytm, BHIM, etc.) under bank-grade device security.

---

## 3. Public UPI ID Visibility

To generate direct UPI payment instructions and QR codes, the creator's configured UPI address (`pa`) must be rendered in the browser.

> **Important:** Your UPI ID is public information when you embed ChaiKit on your website. Do not use a personal UPI ID if you do not want your VPA to be publicly visible to website visitors. Consider using a dedicated creator or merchant VPA.

---

## 4. XSS & Input Sanitization

To protect host websites from DOM-based Cross-Site Scripting (DOM XSS):
- All creator inputs (`creator-name`, `description`, `note`, `button-text`) are sanitized to strip HTML angle brackets, script delimiters, and control characters before rendering.
- Element texts are assigned via `textContent` rather than `innerHTML` where user input is present.

---

## 5. Responsible Disclosure

If you discover a security vulnerability in ChaiKit:
1. Do NOT open a public GitHub issue.
2. Email security details to `security@chaikit.org` (or contact maintainers via GitHub private advisory).
3. We acknowledge reports within 48 hours and work on verified patches before public disclosure.
