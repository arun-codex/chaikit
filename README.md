# ChaiKit ☕

> **Add a beautiful "Buy Me a Chai" supporter widget to any website.**  
> An open-source, lightweight, customizable widget powered by direct UPI payments.

---

## Why ChaiKit?

Most creator support widgets are built for Western payment gateways or require creators and supporters to create accounts on third-party platforms that charge platform commissions.

**ChaiKit** is an independently engineered, universal JavaScript library that allows Indian creators, bloggers, and open-source developers to receive direct UPI contributions straight to their own bank account:

- **Universal:** Works in plain HTML, React, Next.js, Vue, Svelte, Astro, WordPress, Jekyll, Hugo, and static sites.
- **Zero Middlemen & Zero Fees:** 100% of contributions go directly to your configured UPI ID.
- **No Backend Required:** Self-contained client-side library. Runs on static websites and GitHub Pages.
- **Ultra Lightweight:** Under **18 KB gzipped** for the complete bundle including SVG illustrations and QR generator.
- **Privacy-First:** Zero analytics, zero cookies, zero external network requests.
- **Accessible (WCAG 2.2 AA):** Fully keyboard navigable, focus trapped, screen-reader friendly, and respects reduced-motion preferences.
- **Payment Truthful:** Never fakes transaction verification or receipts.

---

## Quick Start

### 1. Plain HTML / Static Sites / WordPress Embed

Add the script and custom element before your closing `</body>` tag:

```html
<!-- Load ChaiKit from CDN -->
<script defer src="https://cdn.jsdelivr.net/npm/chaikit@1.0.0/dist/chaikit.iife.js"></script>

<!-- Place the widget -->
<chai-support
  creator-name="Ananya Sharma"
  upi-id="ananya@okhdfcbank"
  theme="auto"
  position="bottom-right"
></chai-support>
```

### 2. npm / Bundler Installation

```bash
npm install chaikit
```

In your main entry file:

```ts
import 'chaikit';
```

Then use `<chai-support>` in your HTML templates or JSX.

### 3. React / Next.js Integration

```bash
npm install @chaikit/react
```

```tsx
import { ChaiSupport } from '@chaikit/react';

export function Header() {
  return (
    <ChaiSupport
      creatorName="Pooja Sharma"
      upiId="pooja@upi"
      description="Enjoying my work? A little chai goes a long way!"
      theme="classic"
      position="bottom-right"
    />
  );
}
```

---

## Embedding Modes

### Mode A: Floating Widget (Default)
A subtle floating button appears in the corner with gentle steam animation:
```html
<chai-support creator-name="Dev" upi-id="dev@upi" position="bottom-right"></chai-support>
```

### Mode B: Inline Card
Embeds directly inside blog footers, author bios, or documentation:
```html
<chai-support creator-name="Dev" upi-id="dev@upi" position="inline"></chai-support>
```

### Mode C: Headless Trigger
Use your own custom button while ChaiKit manages the modal and UPI flow:
```html
<button onclick="document.getElementById('chai').open()">Support My Work ☕</button>
<chai-support id="chai" creator-name="Dev" upi-id="dev@upi" headless></chai-support>
```

---

## Contribution Tiers

| Tier | Name | Default Amount | Visual |
| :--- | :--- | :--- | :--- |
| 1 | **Cutting Chai** | ₹10 | Roadside fluted glass with rich tea foam |
| 2 | **Kadak Chai** | ₹25 | Classic spiced ceramic tea cup |
| 3 | **Tandoori Chai** | ₹50 | Rustic earthen clay kulhad |
| 4 | **Premium Chai** | ₹100 | Royal brass cup with saffron strands |

Supporters can also enter any custom amount between ₹10 and ₹10,000 (configurable).

---

## Configuration Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `creator-name` | `string` | *(Required)* | Display name of the creator. |
| `upi-id` | `string` | *(Required)* | Payee Virtual Payment Address (e.g. `name@bank`). |
| `description` | `string` | `"Enjoying my work?..."` | Short message shown in header. |
| `button-text` | `string` | `"Buy Me a Chai ☕"` | Text on the floating launcher button. |
| `theme` | `'classic' \| 'dark' \| 'cream' \| 'minimal' \| 'auto'` | `'classic'` | Visual color theme. |
| `position` | `'bottom-right' \| 'bottom-left' \| 'inline'` | `'bottom-right'` | Placement on screen or inline flow. |
| `accent-color` | `string` | Theme default | Custom accent color override. |
| `headless` | `boolean` | `false` | Suppresses floating button. |
| `min-amount` | `number` | `10` | Minimum custom contribution in ₹. |
| `max-amount` | `number` | `10000` | Maximum custom contribution in ₹. |

---

## Payment Truthfulness Policy

A browser script cannot independently confirm whether an ordinary direct peer-to-peer (P2P) UPI payment succeeded.

ChaiKit maintains strict transparency:
- **Never** shows a fake "Payment successful" screen.
- **Never** generates fake receipts or false supporter badges.
- Prominently advises supporters: *"Complete payment in your UPI app. Please verify the recipient name before confirming."*

---

## Project Structure

```
chaikit/
  packages/
    core/       # Core payment engine, exact paise math, UPI URI, QR generator
    widget/     # Web Component <chai-support> (Shadow DOM, illustrations, themes)
    react/      # React adapter component (<ChaiSupport />)
  examples/
    vanilla-html/ # Interactive showcase with theme & event controls
    react/        # React sandbox
    nextjs/       # Next.js App Router client boundary example
    vue/          # Vue 3 component example
    static-site/  # Jekyll, Hugo, GitHub Pages embed
  docs/         # In-depth technical guides
```

---

## Local Development

```bash
# Install dependencies
npm install --ignore-scripts

# Run test suite (Vitest)
npm test

# Build all packages
npm run build
```

---

## License

[MIT](file:///C:/User/OnlyChai/LICENSE) © 2026 ChaiKit Contributors
