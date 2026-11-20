/**
 * ChaiKit Playground Controller
 * Manages configuration state, live widget updates, viewport simulation,
 * telemetry event logging, code generation, and local persistence.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'chaikit_playground_config_v1';

  // Default configuration state
  const DEFAULT_CONFIG = {
    creatorName: 'Rohan Sen',
    upiId: 'rohan@okhdfcbank',
    description: 'Enjoying my open-source projects? A little chai goes a long way!',
    note: 'Chai for Rohan Sen',
    theme: 'classic',
    position: 'bottom-right',
    buttonText: 'Buy Me a Chai ☕',
    accentColor: '#E9AE5B',
    enable3D: false,
    demoMode: true,
    defaultTier: 'kadak',
    tiers: [
      { id: 'cutting', name: 'Cutting Chai', amountPaise: 1000, icon: 'cutting', description: 'Quick sip of appreciation' },
      { id: 'kadak', name: 'Kadak Chai', amountPaise: 2500, icon: 'kadak', description: 'Extra energy to keep creating' },
      { id: 'tandoori', name: 'Tandoori Chai', amountPaise: 5000, icon: 'tandoori', description: 'Warm smoky boost for big ideas' },
      { id: 'premium', name: 'Premium Chai', amountPaise: 10000, icon: 'premium', description: 'Royal cup of saffron appreciation' },
    ],
    viewport: 'desktop',
    codeTab: 'html',
  };

  let state = { ...DEFAULT_CONFIG };
  let eventCounter = 0;

  // DOM Elements
  const widget = document.getElementById('liveChaiWidget');
  const deviceContainer = document.getElementById('deviceContainer');
  const inlineMountPoint = document.getElementById('inlineMountPoint');
  const headlessTriggerWrapper = document.getElementById('headlessTriggerWrapper');
  const customHeadlessTriggerBtn = document.getElementById('customHeadlessTriggerBtn');
  const telemetryLog = document.getElementById('telemetryLog');
  const telemetryCount = document.getElementById('telemetryCount');
  const codeModalBackdrop = document.getElementById('codeModalBackdrop');
  const codeSnippetContent = document.getElementById('codeSnippetContent');
  const codeLangBadge = document.getElementById('codeLangBadge');
  const copyCodeBtn = document.getElementById('copyCodeBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const viewportDimensionsLabel = document.getElementById('viewportDimensionsLabel');
  const safetyNotice = document.getElementById('safetyNotice');

  // Guide Modal Elements
  const guideModalBackdrop = document.getElementById('guideModalBackdrop');
  const openGuideBtn = document.getElementById('openGuideBtn');
  const closeGuideModalBtn = document.getElementById('closeGuideModalBtn');
  const guideAcknowledgeBtn = document.getElementById('guideAcknowledgeBtn');

  // Input Elements
  const inpCreatorName = document.getElementById('cfgCreatorName');
  const inpUpiId = document.getElementById('cfgUpiId');
  const inpDescription = document.getElementById('cfgDescription');
  const inpNote = document.getElementById('cfgNote');
  const inpButtonText = document.getElementById('cfgButtonText');
  const inpAccentColor = document.getElementById('cfgAccentColor');
  const inpAccentColorText = document.getElementById('cfgAccentColorText');
  const inpEnable3D = document.getElementById('cfgEnable3D');
  const inpDemoMode = document.getElementById('cfgDemoMode');
  const inpDefaultTier = document.getElementById('cfgDefaultTier');

  /**
   * Initializes playground
   */
  function init() {
    loadPersistedConfig();
    bindDomEvents();
    bindWidgetEvents();
    applyStateToInputs();
    updateLiveWidget();
    logEvent('SYSTEM', 'Playground initialized with live <chai-support> custom element.');
  }

  /**
   * Loads non-sensitive settings from localStorage
   */
  function loadPersistedConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Security safeguard: demoMode is permanently locked to true on public showcase
        delete parsed.demoMode;
        state = { ...DEFAULT_CONFIG, ...parsed, demoMode: true };
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Persists non-sensitive settings to localStorage
   */
  function savePersistedConfig() {
    try {
      const toSave = { ...state, demoMode: true };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Resets configuration to defaults
   */
  function resetConfig() {
    state = { ...DEFAULT_CONFIG };
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    applyStateToInputs();
    updateLiveWidget();
    logEvent('RESET', 'Restored all widget settings to factory defaults.');
  }

  /**
   * Binds UI controls
   */
  function bindDomEvents() {
    // Text Inputs
    inpCreatorName.addEventListener('input', (e) => {
      state.creatorName = e.target.value.trim() || 'Creator';
      debounceUpdate();
    });

    inpUpiId.addEventListener('input', (e) => {
      state.upiId = e.target.value.trim() || 'creator@upi';
      debounceUpdate();
    });

    inpDescription.addEventListener('input', (e) => {
      state.description = e.target.value.trim();
      debounceUpdate();
    });

    inpNote.addEventListener('input', (e) => {
      state.note = e.target.value.trim();
      debounceUpdate();
    });

    inpButtonText.addEventListener('input', (e) => {
      state.buttonText = e.target.value || 'Buy Me a Chai ☕';
      debounceUpdate();
    });

    // Accent Color
    inpAccentColor.addEventListener('input', (e) => {
      state.accentColor = e.target.value;
      inpAccentColorText.value = e.target.value;
      debounceUpdate();
    });

    inpAccentColorText.addEventListener('input', (e) => {
      if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
        state.accentColor = e.target.value;
        inpAccentColor.value = e.target.value;
        debounceUpdate();
      }
    });

    // Theme selector cards
    document.querySelectorAll('.pk-theme-card').forEach((card) => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.pk-theme-card').forEach((c) => {
          c.classList.remove('active');
          c.setAttribute('aria-checked', 'false');
        });
        card.classList.add('active');
        card.setAttribute('aria-checked', 'true');
        state.theme = card.dataset.theme;
        updateLiveWidget();
        logEvent('THEME', `Switched theme to "${state.theme}".`);
      });
    });

    // Position radio inputs
    document.querySelectorAll('input[name="positionMode"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        state.position = e.target.value;
        updateLiveWidget();
        logEvent('POSITION', `Placement mode set to "${state.position}".`);
      });
    });

    // Tiers Inputs
    document.querySelectorAll('.pk-tier-row').forEach((row) => {
      const tierId = row.dataset.tierId;
      const nameInp = row.querySelector('.pk-tier-name');
      const amtInp = row.querySelector('.pk-tier-amt');

      nameInp.addEventListener('input', (e) => {
        const tier = state.tiers.find((t) => t.id === tierId);
        if (tier) {
          tier.name = e.target.value || tierId;
          debounceUpdate();
        }
      });

      amtInp.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val > 0) {
          const tier = state.tiers.find((t) => t.id === tierId);
          if (tier) {
            tier.amountPaise = val * 100;
            debounceUpdate();
          }
        }
      });
    });

    // Reset Tiers Button
    document.getElementById('resetTiersBtn').addEventListener('click', () => {
      state.tiers = JSON.parse(JSON.stringify(DEFAULT_CONFIG.tiers));
      applyTiersToInputs();
      updateLiveWidget();
      logEvent('TIERS', 'Reset contribution tiers to default ₹10, ₹25, ₹50, ₹100.');
    });

    // Default tier select
    inpDefaultTier.addEventListener('change', (e) => {
      state.defaultTier = e.target.value;
      updateLiveWidget();
    });

    // 3D Toggle
    inpEnable3D.addEventListener('change', (e) => {
      state.enable3D = e.target.checked;
      updateLiveWidget();
      logEvent('3D_MODE', state.enable3D ? 'Enabled 3D WebGL procedural chai stage.' : 'Disabled 3D mode (using vector fallback).');
    });

    // Demo Mode Toggle (if present in custom/dev environments)
    if (inpDemoMode) {
      inpDemoMode.addEventListener('change', (e) => {
        state.demoMode = e.target.checked;
        updateSafetyNotice();
        updateLiveWidget();
        logEvent('SAFETY', state.demoMode ? 'Safe Demo Mode enabled (non-payable preview).' : 'Developer Test Mode enabled.');
      });
    }

    // Viewport switcher buttons
    document.querySelectorAll('.pk-vp-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pk-vp-btn').forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        const vp = btn.dataset.viewport;
        setViewport(vp);
      });
    });

    // Topbar Actions
    document.getElementById('resetConfigBtn').addEventListener('click', resetConfig);

    // Code Modal
    document.getElementById('openCodeModalBtn').addEventListener('click', openCodeModal);
    document.getElementById('closeCodeModalBtn').addEventListener('click', closeCodeModal);
    codeModalBackdrop.addEventListener('click', (e) => {
      if (e.target === codeModalBackdrop) closeCodeModal();
    });

    // Guide Modal
    if (openGuideBtn) openGuideBtn.addEventListener('click', openGuideModal);
    if (closeGuideModalBtn) closeGuideModalBtn.addEventListener('click', closeGuideModal);
    if (guideAcknowledgeBtn) guideAcknowledgeBtn.addEventListener('click', closeGuideModal);
    if (guideModalBackdrop) {
      guideModalBackdrop.addEventListener('click', (e) => {
        if (e.target === guideModalBackdrop) closeGuideModal();
      });
    }

    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCodeModal();
        closeGuideModal();
      }
    });

    document.querySelectorAll('.pk-code-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.pk-code-tab').forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        state.codeTab = tab.dataset.tab;
        renderGeneratedCode();
      });
    });

    copyCodeBtn.addEventListener('click', copyGeneratedCode);

    // Headless custom trigger button in DevNotes site
    customHeadlessTriggerBtn.addEventListener('click', () => {
      logEvent('HEADLESS', 'External trigger button clicked -> invoking widget.open() API.');
      if (widget && typeof widget.open === 'function') {
        widget.open();
      }
    });

    // Clear telemetry
    document.getElementById('clearTelemetryBtn').addEventListener('click', () => {
      telemetryLog.innerHTML = '';
      eventCounter = 0;
      telemetryCount.textContent = '(0 events)';
    });
  }

  /**
   * Binds custom events emitted by the real <chai-support> custom element
   */
  function bindWidgetEvents() {
    if (!widget) return;

    widget.addEventListener('chai:opened', (e) => {
      logEvent('OPENED', `Modal opened for ${e.detail?.creatorName || state.creatorName}`);
    });

    widget.addEventListener('chai:closed', () => {
      logEvent('CLOSED', 'Support modal closed by user.');
    });

    widget.addEventListener('chai:tier-selected', (e) => {
      const tier = e.detail?.tier;
      const amountPaise = e.detail?.amountPaise || 0;
      logEvent('TIER_SELECT', `Selected ${tier?.name || 'tier'} (₹${amountPaise / 100})`);
    });

    widget.addEventListener('chai:amount-changed', (e) => {
      logEvent('AMOUNT_CHANGE', `Custom amount changed to ${e.detail?.formattedRupees || '₹' + (e.detail?.amountPaise / 100)}`);
    });

    widget.addEventListener('chai:upi-handoff-attempted', (e) => {
      logEvent('HANDOFF', `UPI payment handoff attempted (URI: ${e.detail?.upiUri})`);
    });

    widget.addEventListener('chai:error', (e) => {
      logEvent('ERROR', `Widget error: ${e.detail?.message}`);
    });
  }

  /**
   * Updates state to reflect in input elements
   */
  function applyStateToInputs() {
    inpCreatorName.value = state.creatorName;
    inpUpiId.value = state.upiId;
    inpDescription.value = state.description;
    inpNote.value = state.note;
    inpButtonText.value = state.buttonText;
    inpAccentColor.value = state.accentColor;
    inpAccentColorText.value = state.accentColor;
    inpEnable3D.checked = state.enable3D;
    if (inpDemoMode) inpDemoMode.checked = state.demoMode;
    inpDefaultTier.value = state.defaultTier;

    // Theme cards
    document.querySelectorAll('.pk-theme-card').forEach((card) => {
      const match = card.dataset.theme === state.theme;
      card.classList.toggle('active', match);
      card.setAttribute('aria-checked', match ? 'true' : 'false');
    });

    // Position radios
    document.querySelectorAll('input[name="positionMode"]').forEach((radio) => {
      radio.checked = radio.value === state.position;
    });

    applyTiersToInputs();
    updateSafetyNotice();
    setViewport(state.viewport);
  }

  function applyTiersToInputs() {
    state.tiers.forEach((tier) => {
      const row = document.querySelector(`.pk-tier-row[data-tier-id="${tier.id}"]`);
      if (row) {
        row.querySelector('.pk-tier-name').value = tier.name;
        row.querySelector('.pk-tier-amt').value = tier.amountPaise / 100;
      }
    });
  }

  function updateSafetyNotice() {
    safetyNotice.innerHTML = /* html */ `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
      <span><strong>Safe Demo Safeguard Active:</strong> Non-payable QR overlay active. Live UPI intents and payment handoffs are permanently disabled on this public showcase.</span>
    `;
    safetyNotice.style.borderColor = 'rgba(233, 174, 91, 0.4)';
  }

  let debounceTimer = null;
  function debounceUpdate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      updateLiveWidget();
    }, 120);
  }

  /**
   * Applies the current state directly to the live <chai-support> custom element
   */
  function updateLiveWidget() {
    if (!widget) return;

    // Save non-sensitive config
    savePersistedConfig();

    // Handle placement positioning
    const isInline = state.position === 'inline';
    const isHeadless = state.position === 'headless';

    if (isInline) {
      if (widget.parentElement !== inlineMountPoint) {
        inlineMountPoint.appendChild(widget);
      }
      headlessTriggerWrapper.style.display = 'none';
    } else if (isHeadless) {
      if (widget.parentElement !== deviceContainer) {
        deviceContainer.appendChild(widget);
      }
      headlessTriggerWrapper.style.display = 'block';
    } else {
      if (widget.parentElement !== deviceContainer) {
        deviceContainer.appendChild(widget);
      }
      headlessTriggerWrapper.style.display = 'none';
    }

    // Apply attributes
    widget.setAttribute('creator-name', state.creatorName);
    widget.setAttribute('upi-id', state.upiId);
    if (state.description) widget.setAttribute('description', state.description);
    if (state.note) widget.setAttribute('note', state.note);
    widget.setAttribute('theme', state.theme);
    widget.setAttribute('button-text', state.buttonText);
    widget.setAttribute('accent-color', state.accentColor);
    widget.setAttribute('default-tier', state.defaultTier);

    if (isInline) {
      widget.setAttribute('position', 'inline');
      widget.removeAttribute('headless');
    } else if (isHeadless) {
      widget.setAttribute('position', 'bottom-right');
      widget.setAttribute('headless', '');
    } else {
      widget.setAttribute('position', state.position);
      widget.removeAttribute('headless');
    }

    if (state.enable3D) {
      widget.setAttribute('enable-3d', '');
    } else {
      widget.removeAttribute('enable-3d');
    }

    // Safety guarantee: public showcase is permanently locked to demo-mode
    widget.setAttribute('demo-mode', '');

    // Set custom tiers
    try {
      widget.setAttribute('tiers', JSON.stringify(state.tiers));
    } catch {
      // Ignore
    }
  }

  /**
   * Adjusts the device container dimensions
   */
  function setViewport(vp) {
    state.viewport = vp;
    deviceContainer.setAttribute('data-viewport', vp);

    if (vp === 'desktop') {
      viewportDimensionsLabel.innerHTML = '1440 &times; 900 (Desktop)';
    } else if (vp === 'tablet') {
      viewportDimensionsLabel.innerHTML = '768 &times; 1024 (iPad / Tablet)';
    } else if (vp === 'mobile') {
      viewportDimensionsLabel.innerHTML = '390 &times; 844 (iPhone 14 / Mobile)';
    }
  }

  /**
   * Logs an entry into the real-time event monitor
   */
  function logEvent(tag, message) {
    eventCounter++;
    telemetryCount.textContent = `(${eventCounter} event${eventCounter === 1 ? '' : 's'})`;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

    const entry = document.createElement('div');
    entry.className = 'pk-log-entry';
    entry.innerHTML = `
      <span class="pk-log-time">${timeStr}</span>
      <span class="pk-log-tag">${escapeHtml(tag)}</span>
      <span class="pk-log-msg">${escapeHtml(message)}</span>
    `;

    telemetryLog.appendChild(entry);
    telemetryLog.scrollTop = telemetryLog.scrollHeight;
  }

  /**
   * Code Generator Modal
   */
  function openCodeModal() {
    renderGeneratedCode();
    codeModalBackdrop.classList.add('open');
    codeModalBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeCodeModal() {
    codeModalBackdrop.classList.remove('open');
    codeModalBackdrop.setAttribute('aria-hidden', 'true');
  }

  /**
   * Creator Setup Guide Modal
   */
  function openGuideModal() {
    if (!guideModalBackdrop) return;
    guideModalBackdrop.classList.add('open');
    guideModalBackdrop.setAttribute('aria-hidden', 'false');
    logEvent('GUIDE', 'Opened creator onboarding & setup walkthrough.');
  }

  function closeGuideModal() {
    if (!guideModalBackdrop) return;
    guideModalBackdrop.classList.remove('open');
    guideModalBackdrop.setAttribute('aria-hidden', 'true');
  }

  function renderGeneratedCode() {
    const tab = state.codeTab;
    let code = '';
    let lang = 'HTML';

    const creator = escapeAttr(state.creatorName);
    const upi = escapeAttr(state.upiId);
    const theme = escapeAttr(state.theme);
    const pos = state.position === 'headless' ? 'bottom-right' : escapeAttr(state.position);
    const btnText = escapeAttr(state.buttonText);
    const accent = escapeAttr(state.accentColor);
    const is3D = state.enable3D ? '\n  enable-3d' : '';
    const isHeadless = state.position === 'headless' ? '\n  headless' : '';

    // Check if tiers are customized
    const defaultTiers = DEFAULT_CONFIG.tiers;
    const isTiersCustomized = JSON.stringify(state.tiers) !== JSON.stringify(defaultTiers);
    const tiersAttr = isTiersCustomized ? `\n  tiers='${JSON.stringify(state.tiers).replace(/'/g, '&#39;')}'` : '';

    if (tab === 'html') {
      lang = 'HTML (Universal Embed)';
      code = `<!-- ================= CHAIKIT SUPPORTER WIDGET ================= -->
<!-- Release Status: v1.0.0 Candidate (Pending npm Registry Indexation) -->
<!-- Pre-Release / Self-Hosted: Include chaikit.iife.js from GitHub Releases -->
<!-- Production CDN: https://cdn.jsdelivr.net/npm/@chaikit/widget@1.0.0/dist/chaikit.iife.js -->
<script defer src="https://cdn.jsdelivr.net/npm/@chaikit/widget@1.0.0/dist/chaikit.iife.js"></script>

<!-- Note: demo-mode is omitted here so your live supporters can pay via direct UPI.
     To test safely in staging environments, add the 'demo-mode' attribute. -->
<chai-support
  creator-name="${creator}"
  upi-id="${upi}"
  theme="${theme}"
  position="${pos}"
  button-text="${btnText}"
  accent-color="${accent}"${is3D}${isHeadless}${tiersAttr}>
</chai-support>`;
    } else if (tab === 'react') {
      lang = 'TypeScript / React / Next.js';
      code = `// ================= CHAIKIT REACT INTEGRATION =================
// Release Status: v1.0.0 Candidate. Install once published to npm:
// npm install @chaikit/react
// (Or test pre-release: npm install github:arun-codex/chaikit#packages/react)

'use client'; // Required for Next.js App Router

import React from 'react';
import { ChaiSupport } from '@chaikit/react';

export default function SupporterWidget() {
  return (
    <ChaiSupport
      creatorName="${creator}"
      upiId="${upi}"
      theme="${theme}"
      position="${pos}"
      buttonText="${btnText}"
      accentColor="${accent}"${state.enable3D ? '\n      enable3D={true}' : ''}${state.position === 'headless' ? '\n      headless={true}' : ''}
      onTierSelected={(tier) => console.log('Chai tier selected:', tier.name)}
      onHandoffAttempt={(uri) => console.log('UPI payment initiated:', uri)}
    />
  );
}`;
    } else if (tab === 'vue') {
      lang = 'Vue 3 Single File Component';
      code = `<!-- ================= CHAIKIT VUE 3 INTEGRATION ================= -->
<!-- Release Status: v1.0.0 Candidate. Install once published: npm install @chaikit/widget -->
<template>
  <chai-support
    creator-name="${creator}"
    upi-id="${upi}"
    theme="${theme}"
    position="${pos}"
    button-text="${btnText}"
    accent-color="${accent}"${is3D}${isHeadless}${tiersAttr}
  />
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(async () => {
  // Dynamically import the ChaiKit Web Component
  await import('@chaikit/widget');
});
</script>`;
    } else if (tab === 'wordpress') {
      lang = 'WordPress / Static CMS';
      code = `<!-- ================= CHAIKIT WORDPRESS / STATIC SITE ================= -->
<!-- Add to Theme Settings -> Header/Footer Scripts or Custom HTML block -->
<script defer src="https://cdn.jsdelivr.net/npm/@chaikit/widget@1.0.0/dist/chaikit.iife.js"></script>

<chai-support
  creator-name="${creator}"
  upi-id="${upi}"
  theme="${theme}"
  position="${pos}"
  button-text="${btnText}"${is3D}>
</chai-support>`;
    }

    codeLangBadge.textContent = lang;
    codeSnippetContent.textContent = code;
  }

  function copyGeneratedCode() {
    const text = codeSnippetContent.textContent || '';
    if (!text) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showCopyFeedback();
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showCopyFeedback();
    } catch {
      alert('Code copied to clipboard!');
    }
    document.body.removeChild(ta);
  }

  function showCopyFeedback() {
    copyBtnText.textContent = 'Copied! ✓';
    copyCodeBtn.style.background = '#10B981';
    copyCodeBtn.style.color = '#FFFFFF';
    setTimeout(() => {
      copyBtnText.textContent = 'Copy Code';
      copyCodeBtn.style.background = '';
      copyCodeBtn.style.color = '';
    }, 2000);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(str) {
    if (!str) return '';
    return String(str).replace(/"/g, '&quot;');
  }

  // Launch on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
