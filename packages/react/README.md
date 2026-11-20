# @chaikit/react ☕

Official React wrapper component for **ChaiKit**, the universal Buy Me a Chai widget for direct UPI payments.

## Features

- **SSR-Safe:** Client boundary and hydration friendly — does not throw `HTMLElement is not defined` during server rendering in Next.js or Remix.
- **Typed Properties:** Full TypeScript types for all ChaiKit attributes, themes, positions, and tier options.
- **Imperative Ref Control:** Forwarded refs expose `.open()`, `.close()`, `.setAmount()`, and `.getElement()`.
- **Event Callbacks:** Native React callbacks for `onOpen`, `onClose`, `onTierSelected`, `onAmountChanged`, `onUpiHandoff`, and `onError`.

## Installation

```bash
npm install @chaikit/react
```

## Usage

```tsx
import React, { useRef } from 'react';
import { ChaiSupport, type ChaiSupportRef } from '@chaikit/react';

export function Header() {
  const chaiRef = useRef<ChaiSupportRef>(null);

  return (
    <>
      <button onClick={() => chaiRef.current?.open()}>
        Buy Me a Chai ☕
      </button>

      <ChaiSupport
        ref={chaiRef}
        creatorName="Pooja Sharma"
        upiId="pooja@upi"
        description="Enjoying my work? A little chai goes a long way!"
        theme="classic"
        position="bottom-right"
        buttonText="Buy Me a Chai ☕"
        onTierSelected={(tier) => console.log('Selected:', tier.name)}
      />
    </>
  );
}
```

## Next.js (App Router) Integration

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
      theme="auto"
      position="bottom-right"
    />
  );
}
```

## License

[MIT](LICENSE) © 2026 ChaiKit Contributors
