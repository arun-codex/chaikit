/**
 * Validation utilities for ChaiKit configuration, UPI ID, and amounts.
 */

import type { ChaiKitConfig, ChaiTier, ValidationResult } from '../types/index.js';

export const DEFAULT_MIN_AMOUNT_PAISE = 1000; // ₹10
export const DEFAULT_MAX_AMOUNT_PAISE = 1000000; // ₹10,000

export const DEFAULT_TIERS: ChaiTier[] = [
  {
    id: 'cutting',
    name: 'Cutting Chai',
    amountPaise: 1000, // ₹10
    description: 'A little sip of support.',
    icon: 'cutting',
  },
  {
    id: 'kadak',
    name: 'Kadak Chai',
    amountPaise: 2500, // ₹25
    description: 'Some extra energy to keep creating.',
    icon: 'kadak',
  },
  {
    id: 'tandoori',
    name: 'Tandoori Chai',
    amountPaise: 5000, // ₹50
    description: 'A warm boost for bigger ideas.',
    icon: 'tandoori',
  },
  {
    id: 'premium',
    name: 'Premium Chai',
    amountPaise: 10000, // ₹100
    description: 'An extra-special cup of appreciation.',
    icon: 'premium',
  },
];

/**
 * Validates a UPI ID (Virtual Payment Address).
 * Important: Validating the format does NOT prove the address exists or belongs to the creator!
 */
export function validateUpiId(upiId: unknown): { valid: boolean; error?: string } {
  if (typeof upiId !== 'string') {
    return { valid: false, error: 'UPI ID must be a string.' };
  }

  const trimmed = upiId.trim();
  if (!trimmed) {
    return { valid: false, error: 'UPI ID is required.' };
  }

  if (trimmed.length < 3 || trimmed.length > 70) {
    return { valid: false, error: 'UPI ID must be between 3 and 70 characters long.' };
  }

  // Check for invalid control characters or whitespace
  // eslint-disable-next-line no-control-regex
  if (/[\s\x00-\x1F\x7F]/.test(trimmed)) {
    return { valid: false, error: 'UPI ID must not contain spaces or control characters.' };
  }

  // Standard VPA structure: username@handle
  // NPCI allows alphanumeric characters, dots, dashes, underscores before @ and letters/alphanumerics after @
  const vpaRegex = /^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9.\-_]{2,32}$/;
  if (!vpaRegex.test(trimmed)) {
    return {
      valid: false,
      error: 'Invalid UPI ID format. Expected format: username@bank (e.g. name@okhdfcbank or user@upi).',
    };
  }

  return { valid: true };
}

/**
 * Validates a contribution amount in paise against configured limits.
 */
export function validateAmount(
  amountPaise: unknown,
  minPaise: number = DEFAULT_MIN_AMOUNT_PAISE,
  maxPaise: number = DEFAULT_MAX_AMOUNT_PAISE
): { valid: boolean; error?: string } {
  if (typeof amountPaise !== 'number' || isNaN(amountPaise) || !isFinite(amountPaise)) {
    return { valid: false, error: 'Amount must be a valid number.' };
  }

  if (!Number.isInteger(amountPaise)) {
    return { valid: false, error: 'Amount in paise must be an integer.' };
  }

  if (amountPaise < minPaise) {
    return {
      valid: false,
      error: `Amount must be at least ₹${minPaise / 100}.`,
    };
  }

  if (amountPaise > maxPaise) {
    return {
      valid: false,
      error: `Amount cannot exceed ₹${maxPaise / 100}.`,
    };
  }

  return { valid: true };
}

/**
 * Sanitizes plain text input to prevent HTML/XSS injection.
 */
export function sanitizeText(text: unknown, maxLength = 100): string {
  if (typeof text !== 'string') return '';
  return text
    .replace(/[<>'"&]/g, '') // remove HTML delimiters
    .replace(/[\x00-\x1F\x7F]/g, '') // remove control chars
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates complete ChaiKit configuration.
 */
export function validateConfig(config: ChaiKitConfig): ValidationResult {
  const errors: string[] = [];

  if (!config) {
    return { valid: false, errors: ['Configuration object is required.'] };
  }

  // Validate creatorName
  if (!config.creatorName || typeof config.creatorName !== 'string' || !config.creatorName.trim()) {
    errors.push('creatorName is required and must not be empty.');
  }

  // Validate upiId
  const upiCheck = validateUpiId(config.upiId);
  if (!upiCheck.valid && upiCheck.error) {
    errors.push(upiCheck.error);
  }

  // Validate limits
  const minPaise = config.minAmountPaise ?? DEFAULT_MIN_AMOUNT_PAISE;
  const maxPaise = config.maxAmountPaise ?? DEFAULT_MAX_AMOUNT_PAISE;

  if (!Number.isSafeInteger(minPaise) || minPaise <= 0) {
    errors.push('minAmountPaise must be a positive integer number of paise.');
  }
  if (!Number.isSafeInteger(maxPaise) || maxPaise <= 0 || maxPaise < minPaise) {
    errors.push('maxAmountPaise must be a positive integer and not less than minAmountPaise.');
  }

  // Validate tiers if provided
  if (config.tiers) {
    if (!Array.isArray(config.tiers) || config.tiers.length === 0) {
      errors.push('tiers must be a non-empty array of contribution tiers.');
    } else {
      const ids = new Set<string>();
      config.tiers.forEach((tier, index) => {
        if (!tier || typeof tier !== 'object') {
          errors.push(`Tier at index ${index} must be an object.`);
          return;
        }
        if (!tier.id || typeof tier.id !== 'string' || !tier.id.trim()) {
          errors.push(`Tier at index ${index} must have a valid string id.`);
        } else if (ids.has(tier.id)) {
          errors.push(`Duplicate tier id '${tier.id}'.`);
        } else {
          ids.add(tier.id);
        }
        if (!tier.name || typeof tier.name !== 'string' || !tier.name.trim()) {
          errors.push(`Tier at index ${index} must have a valid string name.`);
        }
        if (!validateAmount(tier.amountPaise, minPaise, maxPaise).valid) {
          errors.push(`Tier at index ${index} must have an integer paise amount within the configured limits.`);
        }
      });
    }
  }

  // Validate theme
  const validThemes = ['classic', 'dark', 'cream', 'minimal', 'auto'];
  if (config.theme && !validThemes.includes(config.theme)) {
    errors.push(`Invalid theme '${config.theme}'. Valid themes are: ${validThemes.join(', ')}.`);
  }

  // Validate position
  const validPositions = ['bottom-right', 'bottom-left', 'inline'];
  if (config.position && !validPositions.includes(config.position)) {
    errors.push(`Invalid position '${config.position}'. Valid positions are: ${validPositions.join(', ')}.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
