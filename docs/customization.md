# Customization Guide

ChaiKit offers granular customization while keeping the widget completely isolated from your host site's CSS.

---

## 1. Built-in Themes

| Theme | Description | Recommended Context |
| :--- | :--- | :--- |
| `classic` | Warm terracotta, rich caramel, and espresso | Warm blogs, portfolios, personal sites |
| `dark` | Deep espresso, gold accents, high contrast | Developer portfolios, dark-themed sites |
| `cream` | Warm off-white, light cream, terracotta | Editorial blogs, publication sites |
| `minimal` | Monochrome slate and neutral grays | Modern SaaS docs, clean technical sites |
| `auto` | Dynamically adapts to system preference | General websites respecting OS color scheme |

---

## 2. Overriding Custom CSS Variables

You can customize the widget colors using CSS custom properties on the host element:

```css
chai-support {
  --chai-accent: #FF5722;       /* Custom brand highlight */
  --chai-radius: 12px;          /* Modal border radius */
  --chai-font: 'Inter', sans-serif;
}
```

---

## 3. Customizing Chai Tiers

Through JavaScript or the React wrapper, you can define custom tiers:

```ts
import { mountChaiKit } from '@chaikit/widget';

mountChaiKit({
  creatorName: 'Arjun',
  upiId: 'arjun@upi',
  tiers: [
    {
      id: 'masala',
      name: 'Masala Chai',
      amountPaise: 2000, // ₹20
      description: 'A spicy warm sip.',
      icon: 'cutting',
    },
    {
      id: 'kulhad',
      name: 'Special Kulhad',
      amountPaise: 6000, // ₹60
      description: 'Earthen pot delight.',
      icon: 'tandoori',
    },
    {
      id: 'pot',
      name: 'Chai Kettle',
      amountPaise: 20000, // ₹200
      description: 'Full kettle for the whole team!',
      icon: 'premium',
    },
  ],
});
```

---

## 4. Headless Trigger Mode

If you already have your own navigation button or hero action:

```html
<!-- 1. Your own custom button -->
<button id="my-chai-btn" class="my-custom-style">
  Buy Me a Chai ☕
</button>

<!-- 2. ChaiKit in headless mode -->
<chai-support
  id="chai-widget"
  creator-name="Arjun"
  upi-id="arjun@upi"
  headless
></chai-support>

<script>
  document.getElementById('my-chai-btn').addEventListener('click', () => {
    document.getElementById('chai-widget').open();
  });
</script>
```
