# Installation Guide

ChaiKit is designed to be installed in under 60 seconds on any website.

---

## 1. Universal Script Embed (HTML / Static Sites / WordPress)

Add this script tag and custom element anywhere before your closing `</body>` tag:

```html
<!-- 1. Include ChaiKit from CDN -->
<script defer src="https://cdn.jsdelivr.net/npm/chaikit@1.0.0/dist/chaikit.iife.js"></script>

<!-- 2. Place the widget element -->
<chai-support
  creator-name="Your Name"
  upi-id="yourname@bank"
  theme="auto"
  position="bottom-right"
></chai-support>
```

> **Note on CDN Pinning:** Always pin your production version (e.g. `@1.0.0`) rather than using `@latest` to prevent unexpected breaking changes.

---

## 2. npm / pnpm / yarn Installation

For projects using a bundler (Vite, Webpack, Rollup, Parcel, etc.):

```bash
# Using npm
npm install chaikit

# Using pnpm
pnpm add chaikit

# Using yarn
yarn add chaikit
```

### Import in JavaScript or TypeScript

```ts
import 'chaikit';

// Now <chai-support> is registered and available in your HTML / DOM
```

---

## 3. React Installation

Install the official React wrapper:

```bash
npm install @chaikit/react
```

### Usage in React

```tsx
import { ChaiSupport } from '@chaikit/react';

export function App() {
  return (
    <ChaiSupport
      creatorName="Pooja Sharma"
      upiId="pooja@okhdfcbank"
      theme="classic"
      position="bottom-right"
      buttonText="Buy Me a Chai ☕"
      onOpened={() => console.log('Chai modal opened')}
    />
  );
}
```

---

## 4. Self-Hosting the Bundle

If your website has strict CSP policies or offline requirements, host `chaikit.iife.js` directly:

1. Download `chaikit.iife.js` from the release assets or copy from `node_modules/chaikit/dist/chaikit.iife.js`.
2. Place it in your public assets directory (e.g. `/assets/chaikit.iife.js`).
3. Load it locally:
   ```html
   <script defer src="/assets/chaikit.iife.js"></script>
   <chai-support creator-name="Your Name" upi-id="your@upi"></chai-support>
   ```
