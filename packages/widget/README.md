# @chaikit/widget ☕

> Universal "Buy Me a Chai" supporter widget for Indian websites and creators, powered by direct UPI.

## Overview

`@chaikit/widget` is a framework-independent, standards-based Web Component (`<chai-support>`) that allows any creator to receive direct UPI contributions straight into their bank account without platform commissions, accounts, or mandatory backend infrastructure.

## Installation

### 1. Plain HTML / CDN Script Tag
```html
<!-- Load from version-pinned CDN -->
<script defer src="https://cdn.jsdelivr.net/npm/@chaikit/widget@1.0.0/dist/chaikit.iife.js"></script>

<!-- Place widget anywhere before </body> -->
<chai-support
  creator-name="Ananya Sharma"
  upi-id="ananya@okhdfcbank"
  theme="auto"
  position="bottom-right"
></chai-support>
```

### 2. npm Installation (Bundler / ES Modules)
```bash
npm install @chaikit/widget
```

In your application entry point:
```ts
import '@chaikit/widget';
```

## Features

- **Universal:** Works in HTML, React, Next.js, Vue, Nuxt, Svelte, Astro, WordPress, and static sites.
- **Shadow DOM Encapsulation:** Isolated styles ensure zero CSS bleed into or out of the widget.
- **Direct UPI Payments:** Generates local QR codes, provides mobile app handoff, and single-tap UPI ID copy.
- **Four Chai Tiers:** Cutting Chai (₹10), Kadak Chai (₹25), Tandoori Chai (₹50), and Premium Chai (₹100).
- **Custom Amount Field:** Real-time numeric validation with exact integer paise math.
- **WCAG 2.2 AA Accessible:** Modal focus trapping, screen-reader announcer, keyboard navigation, and reduced-motion compliance.
- **Optional 3D Visuals:** Optional 3D clay kulhad mode with dynamic lighting and hover interaction.
- **Payment Truthful:** Never fakes transaction verification or receipts.

## License

[MIT](file:///C:/User/OnlyChai/packages/widget/LICENSE) © 2026 ChaiKit Contributors
