# ChaiKit Physical UPI Device Testing Matrix

This document provides the standard operating procedure (SOP) and manual verification protocol for testing ChaiKit on physical mobile devices and real UPI applications in India.

> [!WARNING]
> **Simulation vs. Bank Settlement:** Browser E2E tests verify that the standard `upi://pay` URI is constructed accurately according to the NPCI specification and that intent handoff is dispatched. However, **browser intent handoff is not proof of bank settlement**. Real funds settlement occurs solely within the sender's and recipient's banking networks.

---

## 1. Test Environment Setup

1. **Test Recipient VPA:** A creator-controlled UPI ID (e.g. `creator@bank`).
2. **Test Sender Account:** A separate account controlled by the tester with active UPI access.
3. **Widget Configuration:**
   ```html
   <chai-support
     creator-name="Test Creator"
     upi-id="creator@bank"
     theme="classic"
     position="bottom-right">
   </chai-support>
   ```
   *(Ensure `demo-mode` is omitted for live transaction testing).*

---

## 2. Test Execution Matrix

| Test ID | Environment & Application | Test Action | Expected Result | Pass/Fail Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **UPI-01** | **Android 14+ Chrome** + Google Pay | Click launcher → Select Kadak (₹25) → Tap "Open in UPI App" | Android intent resolver launches Google Pay. Payee name and ₹25.00 pre-populated. | Amount & payee match exactly. |
| **UPI-02** | **Android 14+ Chrome** + PhonePe | Click launcher → Select Cutting (₹10) → Tap "Open in UPI App" | PhonePe opens payment screen with ₹10.00 and configured transaction note. | Note narration matches. |
| **UPI-03** | **Android 14+ Chrome** + Paytm UPI | Click launcher → Enter custom ₹15 → Tap "Open in UPI App" | Paytm opens with ₹15.00 populated. | Custom amount reflected. |
| **UPI-04** | **Android 14+ Chrome** + BHIM NPCI | Click launcher → Select Tandoori (₹50) → Tap "Open in UPI App" | BHIM launches directly, displaying recipient verified VPA. | Exact VPA match. |
| **UPI-05** | **iOS 17+ Safari** | Click launcher → Select ₹25 → Tap "Open in UPI App" | Safari prompts *"Open in [UPI App]?"* if supported app installed; fallback to QR/Copy. | Clear prompt or QR fallback. |
| **UPI-06** | **Desktop to Mobile QR Scan** | Desktop Chrome displaying QR → Scan with PhonePe / GPay scanner | Phone camera/scanner resolves `upi://pay` URI immediately. | Scan immediately prompts payment. |
| **UPI-07** | **Payment Cancellation** | In UPI app (GPay/PhonePe), tap Back / Cancel payment | UPI app cancels cleanly. Returning to browser leaves host website intact. | No website crash or loop. |
| **UPI-08** | **Device Without UPI Apps** | Open site on desktop or mobile device with no UPI apps installed | Clicking "Open in UPI App" fails gracefully or stays on page; QR code and "Copy UPI ID" available. | Toast alerts user; QR remains visible. |
| **UPI-09** | **In-App WebViews** (Instagram / LinkedIn / Twitter) | Open link inside Instagram / LinkedIn in-app browser | If in-app browser blocks `upi://` protocol, user uses visible QR or taps "Copy UPI ID". | Copy UPI ID toast confirms copy. |
| **UPI-10** | **Invalid Recipient VPA** | Configure widget with malformed VPA (e.g. `invalid_vpa`) | `@chaikit/core` validation rejects VPA during initialization; emits `chai:error`. | Malformed URI never generated. |

---

## 3. Real Pre-Launch ₹1 Transfer Protocol

To verify end-to-end bank crediting before public announcement:

1. Deploy ChaiKit to your live personal domain or staging URL.
2. Open the page on your smartphone browser.
3. Open the widget and enter custom amount `₹1.00`.
4. Tap **"Open in UPI App"** and choose your preferred app.
5. Authorize the ₹1 payment using your UPI PIN.
6. Verify SMS/push notification from your receiving bank confirming immediate credit of ₹1 from the sender with narration.
7. Record the Bank Reference Number (RRN) in your private testing notes.
