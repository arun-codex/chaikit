# Direct UPI Payments & Truthfulness Policy

ChaiKit is engineered to provide direct peer-to-peer (P2P) or merchant UPI payment instructions without taking a platform commission, routing funds through a middleman wallet, or forcing visitors to register accounts.

---

## 1. NPCI UPI URI Specification

ChaiKit constructs standard Universal Payment Interface (UPI) URIs conforming to the National Payments Corporation of India (NPCI) specification:

```
upi://pay?pa={payee_vpa}&pn={payee_name}&am={amount_2_decimals}&cu=INR&tn={transaction_note}
```

### Parameter Breakdown:

- **`pa` (Payee Address):** The recipient's Virtual Payment Address (e.g. `creator@bank`).
- **`pn` (Payee Name):** The human-readable recipient name shown in the UPI app.
- **`am` (Amount):** Exact payment amount in rupees formatted with two decimal places (e.g. `25.00`).
- **`cu` (Currency):** Always `INR`.
- **`tn` (Transaction Note):** Plain text note accompanying the payment (e.g. `Chai for Dev Sharma`).

### Strict Field Integrity:
ChaiKit **never** fabricates or injects unauthorized merchant codes (`mc`), fake merchant transaction references (`tr`), or forged signatures (`sign`).

---

## 2. Scannable QR Codes

1. **Local Generation:** QR codes are rendered completely client-side in SVG format via `@chaikit/core`. No external network requests or third-party image generation APIs are ever used.
2. **Quiet Zone:** High contrast margins and quiet zones ensure scanning works reliably across phone camera angles and screen brightness levels.
3. **Downloadable:** Supporters on desktop can click "Save QR" to scan at their convenience.

---

## 3. Mobile Payment Handoff

On mobile devices, tapping **"Open in UPI App"** invokes the OS deep-link handler for `upi://pay?...`.
Depending on the user's device and installed apps:
- On Android, the OS displays the app chooser (Google Pay, PhonePe, Paytm, BHIM, CRED, Navi, etc.).
- On iOS, deep link handling depends on the installed bank/UPI apps that register `upi://` schema support.
- If deep link opening fails or is blocked by an in-app WebView, the scannable QR and **"Copy UPI ID"** options serve as robust immediate fallbacks.

---

## 4. Critical Payment Truthfulness

### Why Browser Scripts Cannot Confirm P2P Bank Transfers
A client-side JavaScript library executing in a visitor's browser **cannot** independently confirm whether an ordinary P2P UPI payment was executed, declined, or cancelled by the sender's bank.

True automated payment verification requires:
- An acquiring bank API or licensed payment gateway (e.g. Razorpay, Cashfree).
- Server-to-server signed webhooks.
- Merchant credentials and automated reconciliation.

### Our Non-Negotiable Transparency Rules
ChaiKit:
- **NEVER** displays a fake "Payment Successful" confirmation banner.
- **NEVER** issues fake payment receipts.
- **NEVER** increments artificial supporter counters or donation leaderboards.
- **NEVER** claims an unverified UPI ID is verified by NPCI.

Instead, the interface displays clear, truthful prompts:
> *"Complete your payment in your preferred UPI app. Please verify the recipient name and amount before confirming the transfer."*

---

## 5. Creator Setup & Verification Advice

1. **Format Validation Is Not Bank Validation:** Syntax validation confirms an address looks like `user@bank`, but cannot verify if the bank account is active.
2. **Perform a Test Transaction:** Always perform an initial small test contribution (e.g. ₹10) from another device to ensure your UPI ID receives funds correctly before public deployment.
3. **Banking Limits:** Note that individual banks and UPI apps impose daily transaction limits or velocity limits for P2P transfers.
