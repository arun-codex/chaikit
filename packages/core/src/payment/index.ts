/**
 * UPI URI builder, parser, and mobile handoff utilities.
 * Follows NPCI specifications without fabricating unauthorized merchant fields.
 */

import { formatUpiAmount } from '../amount/index.js';
import type { UpiParams } from '../types/index.js';
import { sanitizeText, validateUpiId } from '../validation/index.js';

export interface UpiHandoffResult {
  /**
   * Whether the upi:// intent dispatch was attempted in the browser.
   * NOTE: This only confirms intent dispatch, NOT that the user approved or completed the transfer!
   */
  dispatched: boolean;
  /** Backwards compatibility alias for dispatched */
  success: boolean;
  error?: string;
  note: string;
}

/**
 * Builds a standard UPI payment URI (`upi://pay?...`).
 *
 * Supported NPCI parameters:
 * - pa: Payee VPA / UPI ID
 * - pn: Payee Name
 * - am: Amount (2 decimal digits)
 * - cu: Currency (INR)
 * - tn: Transaction note (optional)
 *
 * NOTE: Never inject unauthorized merchant codes (`mc`), fake transaction IDs (`tr`),
 * or fabricated signatures (`sign`). Doing so triggers bank security blocks.
 */
export function buildUpiUri(params: {
  upiId: string;
  creatorName: string;
  amountPaise: number;
  note?: string;
}): string {
  const upiCheck = validateUpiId(params.upiId);
  if (!upiCheck.valid) {
    throw new Error(`Cannot build UPI URI: ${upiCheck.error}`);
  }

  if (!Number.isSafeInteger(params.amountPaise) || params.amountPaise <= 0) {
    throw new Error('Cannot build UPI URI: Amount must be a positive number of paise (greater than 0).');
  }

  const cleanUpi = params.upiId.trim();
  let cleanName = sanitizeText(params.creatorName, 60);
  if (!cleanName) {
    cleanName = 'Creator';
  }

  const formattedAmount = formatUpiAmount(params.amountPaise);
  const cleanNote = sanitizeText(params.note || `Chai for ${cleanName}`, 80);

  const queryParts: string[] = [
    `pa=${encodeURIComponent(cleanUpi)}`,
    `pn=${encodeURIComponent(cleanName)}`,
    `am=${encodeURIComponent(formattedAmount)}`,
    `cu=INR`,
  ];

  if (cleanNote) {
    queryParts.push(`tn=${encodeURIComponent(cleanNote)}`);
  }

  return `upi://pay?${queryParts.join('&')}`;
}

/**
 * Parses a UPI URI into structured parameters.
 */
export function parseUpiUri(uri: string): UpiParams | null {
  try {
    if (!uri || !uri.startsWith('upi://pay?')) {
      return null;
    }
    const queryString = uri.replace('upi://pay?', '');
    const searchParams = new URLSearchParams(queryString);

    const pa = searchParams.get('pa');
    const pn = searchParams.get('pn');
    const am = searchParams.get('am');
    const cu = searchParams.get('cu');
    const tn = searchParams.get('tn');

    if (!pa || !pn || !am || cu !== 'INR') {
      return null;
    }

    const numAm = Number(am);
    if (!validateUpiId(pa).valid || !/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(am) || !Number.isFinite(numAm) || numAm <= 0) {
      return null;
    }

    return {
      pa,
      pn,
      am,
      cu: 'INR',
      tn: tn || undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Detects whether the current client is a mobile device capable of handling upi:// deep links.
 * SSR-safe.
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const ua = navigator.userAgent || navigator.vendor || '';
  const isTouchDevice =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Common mobile UA patterns
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return isTouchDevice && mobileRegex.test(ua);
}

/**
 * Attempts mobile UPI app handoff via window.location.href or direct intent link.
 * Must only be called within a user-initiated event (click/tap).
 *
 * CRITICAL PAYMENT TRUTHFULNESS:
 * A returned `dispatched: true` does NOT mean the user paid.
 * Only an acquiring bank or webhook can confirm transfer completion.
 */
export function attemptUpiHandoff(upiUri: string): UpiHandoffResult {
  if (typeof window === 'undefined') {
    return {
      dispatched: false,
      success: false,
      error: 'Window environment not available.',
      note: 'UPI handoff can only be executed in a browser environment.',
    };
  }

  // Never navigate to an arbitrary URL or javascript: scheme through this public API.
  if (!parseUpiUri(upiUri)) {
    return {
      dispatched: false,
      success: false,
      error: 'Invalid UPI payment URI.',
      note: 'Only valid upi://pay links may be dispatched.',
    };
  }

  try {
    // Open UPI link
    window.location.href = upiUri;
    return {
      dispatched: true,
      success: true,
      note: 'Dispatched upi:// intent. This does not confirm payment completion; the supporter must complete the transfer in their banking app.',
    };
  } catch (err) {
    return {
      dispatched: false,
      success: false,
      error: err instanceof Error ? err.message : 'Failed to launch UPI application.',
      note: 'Failed to dispatch upi:// intent.',
    };
  }
}
