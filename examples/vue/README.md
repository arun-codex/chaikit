# Vue 3 Integration Guide for ChaiKit

In Vue 3, configure Vite/Vue compiler to recognize `chai-support` as a custom element so Vue doesn't attempt to resolve it as a Vue component.

## `vite.config.ts`

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Treat all tags starting with chai- as custom elements
          isCustomElement: (tag) => tag.startsWith('chai-'),
        },
      },
    }),
  ],
});
```

## In your Vue Component:

```vue
<script setup>
import 'chaikit';
</script>

<template>
  <chai-support
    creator-name="Vikram Rao"
    upi-id="vikram@upi"
    theme="auto"
    position="bottom-right"
  ></chai-support>
</template>
```
