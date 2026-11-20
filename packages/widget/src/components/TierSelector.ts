/**
 * Chai Tier Selector component.
 * Displays interactive cards for each chai tier with unique cup illustrations.
 */

import { formatRupees, type ChaiTier } from '@chaikit/core';
import { getTierIconSvg } from './ChaiIllustration.js';

export interface TierSelectorOptions {
  tiers: ChaiTier[];
  selectedTierId: string | null;
  onSelect: (tier: ChaiTier) => void;
}

export class TierSelector {
  private element: HTMLElement;
  private options: TierSelectorOptions;
  private cards: Map<string, HTMLElement> = new Map();

  constructor(options: TierSelectorOptions) {
    this.options = options;
    this.element = this.render();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public selectTier(tierId: string | null): void {
    this.options.selectedTierId = tierId;
    this.cards.forEach((card, id) => {
      const isSelected = id === tierId;
      card.classList.toggle('selected', isSelected);
      card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });
  }

  public updateTiers(tiers: ChaiTier[]): void {
    this.options.tiers = tiers;
    const parent = this.element.parentElement;
    const next = this.render();
    if (parent) {
      parent.replaceChild(next, this.element);
    }
    this.element = next;
  }

  private render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'chai-tiers-container';

    const label = document.createElement('div');
    label.className = 'chai-section-label';
    label.textContent = 'Choose your chai';
    container.appendChild(label);

    const grid = document.createElement('div');
    grid.className = 'chai-tiers-grid';
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', 'Contribution chai tiers');

    this.cards.clear();

    this.options.tiers.forEach((tier) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'chai-tier-card';
      card.setAttribute('data-tier', tier.id);
      card.setAttribute('data-tier-id', tier.id);
      const isSelected = tier.id === this.options.selectedTierId;
      if (isSelected) {
        card.classList.add('selected');
      }
      card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      card.setAttribute(
        'aria-label',
        `${tier.name}: ${formatRupees(tier.amountPaise)}. ${tier.description || ''}`
      );

      card.innerHTML = /* html */ `
        <div class="chai-tier-icon" aria-hidden="true">
          ${getTierIconSvg(tier.icon || tier.id)}
        </div>
        <div class="chai-tier-name">${tier.name}</div>
        <div class="chai-tier-amount">${formatRupees(tier.amountPaise)}</div>
        ${tier.description ? `<div class="chai-tier-desc">${tier.description}</div>` : ''}
      `;

      card.addEventListener('click', () => {
        this.selectTier(tier.id);
        this.options.onSelect(tier);
      });

      this.cards.set(tier.id, card);
      grid.appendChild(card);
    });

    container.appendChild(grid);
    return container;
  }
}
