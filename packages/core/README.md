# @chaikit/core ☕

The core payment, validation, exact integer paise math, and UPI QR engine for ChaiKit.

## Features

- **Exact Integer Paise Math:** Never uses floating-point math for financial amounts (`rupeesToPaise`, `paiseToRupees`, `formatRupees`).
- **NPCI Specification Conformance:** Generates valid, strict `upi://pay?` URIs without fake merchant credentials.
- **Client-Side QR Code Engine:** Generates high-contrast SVG QR codes locally using `uqr`. Zero external network calls.
- **Strict VPA & Input Validation:** Prevents parameter injection and validates format without claiming unverified UPI addresses exist.
- **Zero Runtime Dependencies:** Ultra lightweight and portable across Node.js, browsers, and edge environments.

## Installation

```bash
npm install @chaikit/core
```

## Basic Usage

```ts
import { buildUpiUri, generateQrSvg, rupeesToPaise, formatRupees } from '@chaikit/core';

// 1. Calculate amount in exact integer paise
const paise = rupeesToPaise('25.00'); // 2500

// 2. Build standard NPCI UPI payment URI
const upiUri = buildUpiUri({
  upiId: 'creator@bank',
  creatorName: 'Arjun Verma',
  amountPaise: paise,
  note: 'Chai for Arjun',
});

// 3. Render local SVG QR code
const qrSvg = generateQrSvg(upiUri, { size: 200 });
```

## License

[MIT](file:///C:/User/OnlyChai/packages/core/LICENSE) © 2026 ChaiKit Contributors
