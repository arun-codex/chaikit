/**
 * Vector SVG illustrations for the 4 Indian chai tiers and mini launcher cup.
 * Crafted with warm tones, authentic details, and lively steam elements.
 */

export function renderSteamSvg(): string {
  return /* html */ `
    <g class="chai-steam-group" stroke="rgba(246, 232, 210, 0.65)" stroke-width="1.8" stroke-linecap="round" fill="none">
      <path class="steam-path-1" d="M12 11 Q10.5 7 12 4 Q13.5 1 12 -2" />
      <path class="steam-path-2" d="M16 11 Q17.5 7 16 4 Q14.5 1 16 -2" />
    </g>
  `;
}

/**
 * Mini cup icon for the floating button
 */
export function getMiniCupSvg(): string {
  return /* html */ `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chai cup icon">
      ${renderSteamSvg()}
      <!-- Saucer -->
      <ellipse cx="14" cy="21" rx="8" ry="1.5" fill="#E9AE5B" opacity="0.4" />
      <!-- Cup Body -->
      <path d="M7 11 H21 L19.2 19 C19 19.8 18.2 20.5 17.3 20.5 H10.7 C9.8 20.5 9 19.8 8.8 19 L7 11 Z" fill="#C66B45" />
      <!-- Chai Liquid Surface -->
      <ellipse cx="14" cy="11" rx="7" ry="1.8" fill="#C78B52" />
      <!-- Cup Rim -->
      <ellipse cx="14" cy="11" rx="7" ry="1.8" stroke="#E9AE5B" stroke-width="0.8" fill="none" />
      <!-- Cup Handle -->
      <path d="M7 12.5 C4.5 12.5 4.5 17 7 17.5" stroke="#C66B45" stroke-width="1.6" stroke-linecap="round" fill="none" />
    </svg>
  `;
}

/**
 * Tier 1: Cutting Chai (Roadside fluted glass)
 */
export function getCuttingChaiSvg(): string {
  return /* html */ `
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cutting Chai Glass">
      <g stroke="rgba(246, 232, 210, 0.6)" stroke-width="1.4" stroke-linecap="round" fill="none">
        <path class="steam-path-1" d="M14 8 Q12.5 5 14 2" />
        <path class="steam-path-2" d="M18 8 Q19.5 5 18 2" />
      </g>
      <!-- Glass Outline -->
      <path d="M10 8 L12.5 27 C12.7 28.1 13.6 29 14.8 29 H17.2 C18.4 29 19.3 28.1 19.5 27 L22 8 Z" fill="rgba(255, 255, 255, 0.12)" stroke="rgba(255, 255, 255, 0.45)" stroke-width="1.2" />
      <!-- Chai Tea Level -->
      <path d="M11 15 L12.8 26.5 C12.9 27.2 13.5 27.8 14.3 27.8 H17.7 C18.5 27.8 19.1 27.2 19.2 26.5 L21 15 Z" fill="#C78B52" opacity="0.9" />
      <!-- Tea Foam / Cream Top -->
      <ellipse cx="16" cy="15" rx="5" ry="1.2" fill="#F6E8D2" opacity="0.85" />
      <!-- Glass Flutes / Ribs -->
      <line x1="14" y1="12" x2="15" y2="26" stroke="rgba(255, 255, 255, 0.3)" stroke-width="0.8" />
      <line x1="18" y1="12" x2="17" y2="26" stroke="rgba(255, 255, 255, 0.3)" stroke-width="0.8" />
      <!-- Rim -->
      <ellipse cx="16" cy="8" rx="6" ry="1.5" stroke="rgba(255, 255, 255, 0.6)" stroke-width="1.2" fill="none" />
    </svg>
  `;
}

/**
 * Tier 2: Kadak Chai (Fuller ceramic tea stall cup)
 */
export function getKadakChaiSvg(): string {
  return /* html */ `
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kadak Chai Cup">
      <g stroke="rgba(246, 232, 210, 0.65)" stroke-width="1.5" stroke-linecap="round" fill="none">
        <path class="steam-path-1" d="M13 10 Q11.5 6 13 3" />
        <path class="steam-path-2" d="M18 10 Q19.5 6 18 3" />
      </g>
      <!-- Saucer -->
      <ellipse cx="16" cy="27" rx="11" ry="2" fill="#E9AE5B" opacity="0.35" />
      <ellipse cx="16" cy="26.5" rx="10" ry="1.6" stroke="#C78B52" stroke-width="0.8" fill="none" />
      <!-- Cup Body -->
      <path d="M8 11 H24 L22 23 C21.8 24.1 20.8 25 19.7 25 H12.3 C11.2 25 10.2 24.1 10 23 L8 11 Z" fill="#C66B45" />
      <!-- Cup Handle -->
      <path d="M7 13 C4 13 4 19 7 20" stroke="#C66B45" stroke-width="2" stroke-linecap="round" fill="none" />
      <!-- Tea Liquid -->
      <ellipse cx="16" cy="11.5" rx="7.5" ry="2" fill="#9A4726" />
      <ellipse cx="16" cy="11.5" rx="5.5" ry="1.4" fill="#C78B52" />
      <!-- Rim Highlight -->
      <ellipse cx="16" cy="11" rx="8" ry="2.2" stroke="#E9AE5B" stroke-width="1" fill="none" />
    </svg>
  `;
}

/**
 * Tier 3: Tandoori Kulhad (Rustic earthen clay cup)
 */
export function getTandooriChaiSvg(): string {
  return /* html */ `
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tandoori Clay Kulhad">
      <g stroke="rgba(246, 232, 210, 0.7)" stroke-width="1.6" stroke-linecap="round" fill="none">
        <path class="steam-path-1" d="M13 9 Q11 5 13 1" />
        <path class="steam-path-2" d="M19 9 Q21 5 19 1" />
      </g>
      <!-- Earth Shadow -->
      <ellipse cx="16" cy="28.5" rx="7.5" ry="1.5" fill="rgba(0, 0, 0, 0.3)" />
      <!-- Clay Kulhad Body -->
      <path d="M9 10 L11 17 L12 26 C12.2 27 13.1 27.8 14.2 27.8 H17.8 C18.9 27.8 19.8 27 20 26 L21 17 L23 10 Z" fill="#B35334" />
      <!-- Clay texture bands -->
      <path d="M10.2 14 Q16 16 21.8 14" stroke="#8C3E25" stroke-width="1.2" fill="none" />
      <path d="M11.2 18 Q16 20 20.8 18" stroke="#8C3E25" stroke-width="1.2" fill="none" />
      <!-- Rich Smoky Tea Surface -->
      <ellipse cx="16" cy="10.5" rx="6.5" ry="1.8" fill="#5C2B1B" />
      <ellipse cx="16" cy="10.5" rx="4.5" ry="1.2" fill="#C78B52" />
      <!-- Clay Rim -->
      <ellipse cx="16" cy="10" rx="7" ry="2" stroke="#E28965" stroke-width="1.2" fill="none" />
    </svg>
  `;
}

/**
 * Tier 4: Premium Chai (Ornate royal brass/ceramic cup with saffron)
 */
export function getPremiumChaiSvg(): string {
  return /* html */ `
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Premium Royal Chai Cup">
      <g stroke="rgba(233, 174, 91, 0.8)" stroke-width="1.6" stroke-linecap="round" fill="none">
        <path class="steam-path-1" d="M13 9 Q11 5 13 2" />
        <path class="steam-path-2" d="M19 9 Q21 5 19 2" />
      </g>
      <!-- Royal Brass Saucer with filigree rim -->
      <ellipse cx="16" cy="27" rx="12" ry="2.5" fill="#E9AE5B" />
      <ellipse cx="16" cy="26.5" rx="10.5" ry="2" fill="#D49137" />
      <!-- Pedestal Foot -->
      <path d="M13 24 H19 L18 26 H14 Z" fill="#E9AE5B" />
      <!-- Royal Cup Body -->
      <path d="M7 10 H25 L22.5 21 C22.2 22.8 20.6 24 18.8 24 H13.2 C11.4 24 9.8 22.8 9.5 21 L7 10 Z" fill="#1B1410" stroke="#E9AE5B" stroke-width="1.2" />
      <!-- Ornate Handle -->
      <path d="M6.5 11.5 C2.5 11.5 2 19 6.5 21 C5 17 5 14 7 13" fill="#E9AE5B" stroke="#D49137" stroke-width="0.8" />
      <!-- Tea Liquid Surface with Saffron Strands -->
      <ellipse cx="16" cy="10.5" rx="8.5" ry="2.2" fill="#C78B52" />
      <path d="M14 10.2 Q15 9.8 16 10.4" stroke="#DC2626" stroke-width="0.9" fill="none" stroke-linecap="round" />
      <path d="M17 10.8 Q18 10.4 18.5 11" stroke="#DC2626" stroke-width="0.9" fill="none" stroke-linecap="round" />
      <!-- Gold Rim Trim -->
      <ellipse cx="16" cy="10" rx="9" ry="2.4" stroke="#FFD700" stroke-width="1.4" fill="none" />
    </svg>
  `;
}

/**
 * Returns the appropriate SVG for a given tier icon identifier
 */
export function getTierIconSvg(iconName?: string): string {
  switch (iconName) {
    case 'cutting':
      return getCuttingChaiSvg();
    case 'kadak':
      return getKadakChaiSvg();
    case 'tandoori':
      return getTandooriChaiSvg();
    case 'premium':
      return getPremiumChaiSvg();
    default:
      return getKadakChaiSvg();
  }
}
