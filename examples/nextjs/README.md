# Next.js Integration Guide for ChaiKit

ChaiKit is a standard Web Component that executes in the browser. When using Next.js (App Router or Pages Router), client-side boundary and SSR safety must be respected.

## App Router Example (`app/layout.tsx` or `app/page.tsx`)

### Method 1: Using `@chaikit/react` with `'use client'`

Create a client wrapper component `components/ChaiSupport.tsx`:

```tsx
'use client';

import dynamic from 'next/dynamic';

const ChaiSupport = dynamic(
  () => import('@chaikit/react').then((mod) => mod.ChaiSupport),
  { ssr: false }
);

export function SupporterWidget() {
  return (
    <ChaiSupport
      creatorName="Pooja Sharma"
      upiId="pooja@upi"
      description="Enjoying my articles? Buy me a chai to keep them free!"
      theme="auto"
      position="bottom-right"
    />
  );
}
```

Then place `<SupporterWidget />` in your `app/layout.tsx`.

---

### Method 2: Script Tag Embed in `app/layout.tsx`

Using Next.js's built-in `<Script />`:

```tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Load ChaiKit script */}
        <Script
          src="https://cdn.jsdelivr.net/npm/chaikit@1.0.0/dist/chaikit.iife.js"
          strategy="lazyOnload"
        />

        {/* Custom Element */}
        <chai-support
          creator-name="Pooja Sharma"
          upi-id="pooja@upi"
          theme="auto"
          position="bottom-right"
        />
      </body>
    </html>
  );
}
```
