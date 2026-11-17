# Configuration Reference

ChaiKit supports declarative HTML attributes, JavaScript configuration objects, and programmatic methods.

---

## HTML Attributes

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `creator-name` | `string` | *(Required)* | Display name of the creator shown in the header and UPI payee name (`pn`). |
| `upi-id` | `string` | *(Required)* | Valid Virtual Payment Address (e.g. `creator@bank`). |
| `description` | `string` | `"Enjoying my work? A little chai goes a long way!"` | Short message displayed below the creator's name. |
| `button-text` | `string` | `"Buy Me a Chai ☕"` | Text on the floating launcher button. |
| `theme` | `'classic' \| 'dark' \| 'cream' \| 'minimal' \| 'auto'` | `'classic'` | Visual color theme. `'auto'` matches OS dark/light mode. |
| `position` | `'bottom-right' \| 'bottom-left' \| 'inline'` | `'bottom-right'` | Placement on page. `'inline'` embeds in document flow. |
| `accent-color` | `string` (CSS color) | Theme default | Custom accent color override (e.g. `#E9AE5B`). |
| `headless` | `boolean` (attribute presence) | `false` | Suppresses floating button. Used for custom trigger buttons. |
| `min-amount` | `number` (Rupees) | `10` | Minimum allowed custom contribution in ₹. |
| `max-amount` | `number` (Rupees) | `10000` | Maximum allowed custom contribution in ₹. |
| `default-tier` | `string` | `'kadak'` | ID of tier selected by default (`cutting`, `kadak`, `tandoori`, `premium`). |
| `note` | `string` | `"Chai for <name>"` | UPI transaction note (`tn` parameter). |

---

## Programmatic JavaScript API

```ts
const widget = document.querySelector('chai-support');

// Open the support modal
widget.open();

// Close the support modal
widget.close();

// Set contribution amount programmatically (in integer paise)
widget.setAmount(5000); // ₹50.00

// Update configuration dynamically
widget.updateConfig({
  theme: 'dark',
  buttonText: 'Support My Work ☕',
});

// Clean up and remove from DOM
widget.destroy();
```

---

## Custom Events

ChaiKit dispatches standard `CustomEvent` instances that bubble and compose across Shadow DOM boundaries:

```ts
widget.addEventListener('chai:opened', (event) => {
  console.log('Opened for:', event.detail.creatorName);
});

widget.addEventListener('chai:tier-selected', (event) => {
  console.log('Tier:', event.detail.tier.name, 'Paise:', event.detail.amountPaise);
});

widget.addEventListener('chai:amount-changed', (event) => {
  console.log('Amount:', event.detail.formattedRupees);
});

widget.addEventListener('chai:upi-handoff-attempted', (event) => {
  console.log('Handoff URI:', event.detail.upiUri);
});

widget.addEventListener('chai:closed', () => {
  console.log('Modal closed');
});

widget.addEventListener('chai:error', (event) => {
  console.error('Widget error:', event.detail.message);
});
```
