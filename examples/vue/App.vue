<template>
  <div class="vue-demo">
    <h1>ChaiKit Vue 3 Example</h1>
    <p>Using the native <code>&lt;chai-support&gt;</code> custom element in Vue 3.</p>

    <div class="actions">
      <button @click="openWidget">Open Support Modal</button>
      <button @click="toggleTheme">Toggle Theme (Current: {{ theme }})</button>
    </div>

    <!-- ChaiKit Custom Element -->
    <chai-support
      ref="widgetRef"
      :creator-name="creatorName"
      :upi-id="upiId"
      :theme="theme"
      position="bottom-right"
      button-text="Buy Me a Chai ☕"
      @chai:opened="onOpened"
      @chai:tier-selected="onTierSelected"
    ></chai-support>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import 'chaikit';

const creatorName = ref('Vikram Rao');
const upiId = ref('vikram@upi');
const theme = ref<'classic' | 'dark'>('classic');
const widgetRef = ref<any>(null);

function openWidget() {
  widgetRef.value?.open();
}

function toggleTheme() {
  theme.value = theme.value === 'classic' ? 'dark' : 'classic';
}

function onOpened(e: CustomEvent) {
  console.log('ChaiKit opened:', e.detail);
}

function onTierSelected(e: CustomEvent) {
  console.log('Tier selected:', e.detail);
}
</script>

<style scoped>
.vue-demo {
  max-width: 600px;
  margin: 50px auto;
  font-family: sans-serif;
  text-align: center;
}
.actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: center;
}
button {
  padding: 10px 18px;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
}
</style>
