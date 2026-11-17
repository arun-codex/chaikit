/**
 * Core type definitions for ChaiKit
 */

export type ChaiKitTheme = 'classic' | 'dark' | 'cream' | 'minimal' | 'auto';

export type ChaiKitPosition = 'bottom-right' | 'bottom-left' | 'inline';

export type ChaiKitAnimation = 'none' | 'subtle' | 'premium';

export interface ChaiTier {
  id: string;
  name: string;
  amountPaise: number; // Exact integer paise (e.g. 1000 = ₹10.00)
  description?: string;
  icon?: 'cutting' | 'kadak' | 'tandoori' | 'premium' | string;
}

export interface ChaiKitConfig {
  creatorName: string;
  upiId: string;
  description?: string;
  buttonText?: string;
  theme?: ChaiKitTheme;
  position?: ChaiKitPosition;
  accentColor?: string;
  animation?: ChaiKitAnimation;
  enable3D?: boolean;
  defaultTierId?: string;
  tiers?: ChaiTier[];
  allowCustomAmount?: boolean;
  minAmountPaise?: number; // default: 1000 (₹10)
  maxAmountPaise?: number; // default: 1000000 (₹10,000)
  note?: string; // UPI transaction note
  headless?: boolean; // if true, suppresses floating button
}

/**
 * Interface states for the payment UI state machine.
 * NOTE: These are purely UI/client states, NEVER verified financial transaction states!
 */
export type PaymentState =
  | 'idle'
  | 'modal_open'
  | 'tier_selected'
  | 'payment_ready'
  | 'qr_displayed'
  | 'handoff_attempted'
  | 'handoff_unavailable'
  | 'instructions_displayed'
  | 'error'
  | 'closed';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface UpiParams {
  pa: string; // Payee address (VPA / UPI ID)
  pn: string; // Payee display name
  am: string; // Formatted amount e.g. "25.00"
  cu: 'INR';  // Currency
  tn?: string; // Transaction note
}

export interface QrOptions {
  size?: number;
  margin?: number;
  foreground?: string;
  background?: string;
  ecc?: 'L' | 'M' | 'Q' | 'H';
}

export type ChaiEventName =
  | 'chai:opened'
  | 'chai:closed'
  | 'chai:tier-selected'
  | 'chai:amount-changed'
  | 'chai:payment-instructions-viewed'
  | 'chai:upi-handoff-attempted'
  | 'chai:error';

export interface ChaiEventDetailMap {
  'chai:opened': { creatorName: string };
  'chai:closed': Record<string, never>;
  'chai:tier-selected': { tier: ChaiTier; amountPaise: number };
  'chai:amount-changed': { amountPaise: number; formattedRupees: string };
  'chai:payment-instructions-viewed': { upiId: string; amountPaise: number };
  'chai:upi-handoff-attempted': { upiUri: string; timestamp: number };
  'chai:error': { message: string; code: string };
}
