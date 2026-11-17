/**
 * Vector SVG illustrations for the 4 Indian chai tiers and mini launcher cup.
 * Crafted with warm tones, authentic details, and lively steam elements.
 */

export function renderSteamSvg(): string {
  return /* html */ `
    <g class="chai-steam-group" stroke="rgba(246, 232, 210, 0.75)" stroke-width="1.8" stroke-linecap="round" fill="none">
      <path class="steam-path-1" d="M12 11 Q10 7 12 3 Q14 -1 12 -5" />
      <path class="steam-path-2" d="M16 11 Q18 7 16 3 Q14 -1 16 -5" />
    </g>
  `;
}

/**
 * Mini cup icon for the floating button
 */
export function getMiniCupSvg(): string {
  return /* html */ `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chai cup icon">
      <defs>
        <linearGradient id="miniCupGrad" x1="7" y1="11" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stop-color="#E27D56" />
          <stop offset="1" stop-color="#B24B27" />
        </linearGradient>
        <linearGradient id="miniTeaGrad" x1="7" y1="11" x2="21" y2="13" gradientUnits="userSpaceOnUse">
          <stop stop-color="#D49352" />
          <stop offset="1" stop-color="#8C4320" />
        </linearGradient>
      </defs>
      ${renderSteamSvg()}
      <!-- Saucer -->
      <ellipse cx="14" cy="21.5" rx="8" ry="1.6" fill="#E9AE5B" opacity="0.45" />
      <!-- Cup Body -->
      <path d="M7 11 H21 L19.2 19.2 C19 20 18.2 20.6 17.3 20.6 H10.7 C9.8 20.6 9 20 8.8 19.2 L7 11 Z" fill="url(#miniCupGrad)" />
      <!-- Chai Liquid Surface -->
      <ellipse cx="14" cy="11" rx="7" ry="1.8" fill="url(#miniTeaGrad)" />
      <!-- Cup Rim -->
      <ellipse cx="14" cy="11" rx="7" ry="1.8" stroke="#F6E8D2" stroke-width="0.8" fill="none" opacity="0.8" />
      <!-- Cup Handle -->
      <path d="M7 12.5 C4 12.5 4 17.5 7 18" stroke="#E27D56" stroke-width="1.8" stroke-linecap="round" fill="none" />
    </svg>
  `;
}

/**
 * Tier 1: Cutting Chai (Roadside fluted glass)
 */
export function getCuttingChaiSvg(): string {
  return /* html */ `
    <svg width="44" height="44" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cutting Chai Glass">
      <defs>
        <linearGradient id="cutGlassGrad" x1="11" y1="8" x2="25" y2="30" gradientUnits="userSpaceOnUse">
          <stop stop-color="rgba(255, 255, 255, 0.22)" />
          <stop offset="0.5" stop-color="rgba(255, 255, 255, 0.08)" />
          <stop offset="1" stop-color="rgba(255, 255, 255, 0.18)" />
        </linearGradient>
        <linearGradient id="cutTeaGrad" x1="12" y1="16" x2="24" y2="29" gradientUnits="userSpaceOnUse">
          <stop stop-color="#E5A663" />
          <stop offset="0.6" stop-color="#C27536" />
          <stop offset="1" stop-color="#7A3916" />
        </linearGradient>
      </defs>
      <!-- Steam -->
      <g stroke="rgba(246, 232, 210, 0.7)" stroke-width="1.5" stroke-linecap="round" fill="none">
        <path class="steam-path-1" d="M15 8 Q13 4 15 1" />
        <path class="steam-path-2" d="M21 8 Q23 4 21 1" />
      </g>
      <!-- Shadow -->
      <ellipse cx="18" cy="32" rx="7" ry="1.5" fill="rgba(0, 0, 0, 0.25)" />
      <!-- Glass Base & Body -->
      <path d="M11 9 L13.8 29.5 C14 30.7 15 31.5 16.2 31.5 H19.8 C21 31.5 22 30.7 22.2 29.5 L25 9 Z" fill="url(#cutGlassGrad)" stroke="rgba(255, 255, 255, 0.5)" stroke-width="1.2" />
      <!-- Chai Tea Liquid -->
      <path d="M12.2 16.5 L14.2 29.2 C14.3 29.8 14.8 30.2 15.5 30.2 H20.5 C21.2 30.2 21.7 29.8 21.8 29.2 L23.8 16.5 Z" fill="url(#cutTeaGrad)" />
      <!-- Tea Froth Head -->
      <ellipse cx="18" cy="16.5" rx="5.8" ry="1.4" fill="#F8EADB" opacity="0.9" />
      <ellipse cx="18" cy="16.5" rx="3.5" ry="0.8" fill="#E2C19B" opacity="0.6" />
      <!-- Glass Vertical Ribs / Flutes -->
      <line x1="15.5" y1="12" x2="16.5" y2="29" stroke="rgba(255, 255, 255, 0.35)" stroke-width="0.9" />
      <line x1="20.5" y1="12" x2="19.5" y2="29" stroke="rgba(255, 255, 255, 0.35)" stroke-width="0.9" />
      <!-- Top Rim Ring -->
      <ellipse cx="18" cy="9" rx="7" ry="1.8" stroke="rgba(255, 255, 255, 0.7)" stroke-width="1.2" fill="rgba(255, 255, 255, 0.15)" />
    </svg>
  `;
}

/**
 * Tier 2: Kadak Chai (Fuller ceramic tea stall cup)
 */
export function getKadakChaiSvg(): string {
  return /* html */ `
    <svg width="44" height="44" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kadak Chai Cup">
      <defs>
        <linearGradient id="kadakCupGrad" x1="9" y1="12" x2="27" y2="28" gradientUnits="userSpaceOnUse">
          <stop stop-color="#D97047" />
          <stop offset="1" stop-color="#9E3B1C" />
        </linearGradient>
        <linearGradient id="kadakTeaGrad" x1="12" y1="12" x2="24" y2="15" gradientUnits="userSpaceOnUse">
          <stop stop-color="#C77D3D" />
          <stop offset="0.7" stop-color="#7F3514" />
          <stop offset="1" stop-color="#4F1D08" />
        </linearGradient>
      </defs>
      <!-- Steam -->
      <g stroke="rgba(246, 232, 210, 0.75)" stroke-width="1.6" stroke-linecap="round" fill="none">
        <path class="steam-path-1" d="M14 10 Q12 5 14 1" />
        <path class="steam-path-2" d="M20 10 Q22 5 20 1" />
      </g>
      <!-- Saucer Base -->
      <ellipse cx="18" cy="30" rx="13" ry="2.6" fill="#E9AE5B" opacity="0.35" />
      <ellipse cx="18" cy="29.2" rx="12" ry="2" stroke="#D49352" stroke-width="1" fill="#2B1D16" />
      <!-- Cup Handle -->
      <path d="M8 14 C4 14 4 21 8 22" stroke="#D97047" stroke-width="2.2" stroke-linecap="round" fill="none" />
      <!-- Cup Body -->
      <path d="M9 12 H27 L24.8 25.5 C24.5 26.8 23.4 27.8 22.1 27.8 H13.9 C12.6 27.8 11.5 26.8 11.2 25.5 L9 12 Z" fill="url(#kadakCupGrad)" />
      <!-- Tea Liquid Surface -->
      <ellipse cx="18" cy="12.5" rx="8.5" ry="2.2" fill="url(#kadakTeaGrad)" />
      <ellipse cx="18" cy="12.5" rx="6" ry="1.4" fill="#E8B078" opacity="0.4" />
      <!-- Rim Golden Accent -->
      <ellipse cx="18" cy="12" rx="9" ry="2.4" stroke="#E9AE5B" stroke-width="1.2" fill="none" />
    </svg>
  `;
}

/**
 * Tier 3: Tandoori Kulhad (Rustic earthen clay cup)
 */
export function getTandooriChaiSvg(): string {
  return /* html */ `
    <svg width="44" height="44" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tandoori Clay Kulhad">
      <defs>
        <linearGradient id="clayKulhadGrad" x1="10" y1="10" x2="26" y2="30" gradientUnits="userSpaceOnUse">
          <stop stop-color="#BF5D3B" />
          <stop offset="0.4" stop-color="#9C4425" />
          <stop offset="0.85" stop-color="#6E2C14" />
          <stop offset="1" stop-color="#4A1C0C" />
        </linearGradient>
        <radialGradient id="smokyTeaGrad" cx="18" cy="11" r="8" gradientUnits="userSpaceOnUse">
          <stop stop-color="#D9824C" />
          <stop offset="0.7" stop-color="#803518" />
          <stop offset="1" stop-color="#3D1507" />
        </radialGradient>
      </defs>
      <!-- Steam -->
      <g stroke="rgba(246, 232, 210, 0.8)" stroke-width="1.8" stroke-linecap="round" fill="none">
        <path class="steam-path-1" d="M14 9 Q11 4 14 0" />
        <path class="steam-path-2" d="M22 9 Q25 4 22 0" />
      </g>
      <!-- Ground Shadow -->
      <ellipse cx="18" cy="32.5" rx="8.5" ry="1.8" fill="rgba(0, 0, 0, 0.4)" />
      <!-- Clay Kulhad Body -->
      <path d="M10 11 L12.5 19 L13.5 29.5 C13.7 30.8 14.8 31.8 16.1 31.8 H19.9 C21.2 31.8 22.3 30.8 22.5 29.5 L23.5 19 L26 11 Z" fill="url(#clayKulhadGrad)" />
      <!-- Rustic Clay Texture Bands -->
      <path d="M11.5 15.5 Q18 18 24.5 15.5" stroke="#522110" stroke-width="1.4" fill="none" opacity="0.8" />
      <path d="M12.6 20.5 Q18 23 23.4 20.5" stroke="#522110" stroke-width="1.3" fill="none" opacity="0.75" />
      <path d="M13.5 25.5 Q18 27.5 22.5 25.5" stroke="#421A0C" stroke-width="1.2" fill="none" opacity="0.7" />
      <!-- Smoky Chai Liquid -->
      <ellipse cx="18" cy="11.5" rx="7.5" ry="2.1" fill="url(#smokyTeaGrad)" />
      <ellipse cx="17.5" cy="11.3" rx="4.5" ry="1.2" fill="#E8A370" opacity="0.45" />
      <!-- Clay Rim -->
      <ellipse cx="18" cy="11" rx="8" ry="2.3" stroke="#D97A52" stroke-width="1.4" fill="none" />
    </svg>
  `;
}

/**
 * Tier 4: Premium Chai (Ornate royal brass/ceramic cup with saffron)
 */
export function getPremiumChaiSvg(): string {
  return /* html */ `
    <svg width="44" height="44" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Premium Royal Chai Cup">
      <defs>
        <linearGradient id="royalGoldGrad" x1="8" y1="10" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFDF85" />
          <stop offset="0.3" stop-color="#E9AE5B" />
          <stop offset="0.7" stop-color="#BA7824" />
          <stop offset="1" stop-color="#78490B" />
        </linearGradient>
        <linearGradient id="saffronTeaGrad" x1="12" y1="11" x2="24" y2="14" gradientUnits="userSpaceOnUse">
          <stop stop-color="#E28938" />
          <stop offset="0.6" stop-color="#A85317" />
          <stop offset="1" stop-color="#5E2606" />
        </linearGradient>
      </defs>
      <!-- Saffron-tinted Golden Steam -->
      <g stroke="rgba(245, 197, 107, 0.85)" stroke-width="1.8" stroke-linecap="round" fill="none">
        <path class="steam-path-1" d="M14 9 Q11 4 14 0" />
        <path class="steam-path-2" d="M22 9 Q25 4 22 0" />
      </g>
      <!-- Royal Brass Saucer with Filigree Bevel -->
      <ellipse cx="18" cy="30" rx="14" ry="2.8" fill="url(#royalGoldGrad)" />
      <ellipse cx="18" cy="29.2" rx="12" ry="2.2" stroke="#FFE9A8" stroke-width="1" fill="#1C140E" />
      <!-- Pedestal Foot Base -->
      <path d="M14.5 26.5 H21.5 L20.5 29 H15.5 Z" fill="url(#royalGoldGrad)" stroke="#FFE9A8" stroke-width="0.8" />
      <!-- Ornate Royal Handle -->
      <path d="M7 12.5 C2.5 12.5 2 21 7 23 C5 18.5 5 15.5 7.5 14" fill="url(#royalGoldGrad)" stroke="#B37520" stroke-width="1" />
      <!-- Royal Cup Body -->
      <path d="M8 11 H28 L25 24 C24.7 25.8 23 27 21.2 27 H14.8 C13 27 11.3 25.8 11 24 L8 11 Z" fill="#1A120D" stroke="url(#royalGoldGrad)" stroke-width="1.5" />
      <!-- Golden Arabesque Cup Motif -->
      <path d="M14 18 Q18 21 22 18 Q18 24 14 18" stroke="url(#royalGoldGrad)" stroke-width="1.2" fill="none" opacity="0.9" />
      <!-- Saffron Chai Liquid -->
      <ellipse cx="18" cy="11.5" rx="9.5" ry="2.4" fill="url(#saffronTeaGrad)" />
      <!-- Saffron Strands Floating -->
      <path d="M15 11.2 Q16.5 10.7 17.5 11.4" stroke="#DC2626" stroke-width="1.2" stroke-linecap="round" fill="none" />
      <path d="M19 11.8 Q20 11.3 20.8 12" stroke="#DC2626" stroke-width="1.2" stroke-linecap="round" fill="none" />
      <path d="M16 12 Q17 12.4 18 12.1" stroke="#DC2626" stroke-width="1" stroke-linecap="round" fill="none" />
      <!-- Brilliant Gold Rim -->
      <ellipse cx="18" cy="11" rx="10" ry="2.6" stroke="#FFE9A8" stroke-width="1.6" fill="none" />
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
