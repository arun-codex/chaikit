/**
 * UPI URI builder, parser, and mobile handoff utilities.
 * Follows NPCI specifications without fabricating unauthorized merchant fields.
 */

import { formatUpiAmount } from '../amount/index.js';
import type { UpiParams } from '../types/index.js';
import { sanitizeText, validateUpiId } from '../validation/index.js';

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
 * NOTE: Never inject unauthorized merchant codes or fake signatures.
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

  const cleanUpi = params.upiId.trim();
  const cleanName = sanitizeText(params.creatorName, 60);
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
 */
export function attemptUpiHandoff(upiUri: string): { success: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Window environment not available.' };
  }

  try {
    // Open UPI link
    window.location.href = upiUri;
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to launch UPI application.',
    };
  }
}
