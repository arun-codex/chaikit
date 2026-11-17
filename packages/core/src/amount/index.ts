/**
 * Amount manipulation and formatting in exact integer paise.
 * Never relies on floating point arithmetic for currency logic.
 */

/**
 * Converts integer paise to whole or decimal rupees.
 * e.g. 2500 -> 25, 2550 -> 25.5
 */
export function paiseToRupees(paise: number): number {
  if (!Number.isInteger(paise)) {
    paise = Math.round(paise);
  }
  return paise / 100;
}

/**
 * Converts a rupee amount (number or string) to exact integer paise.
 * Safe against floating point drift:
 * e.g. "25" -> 2500, 25.50 -> 2550, "19.99" -> 1999
 */
export function rupeesToPaise(rupees: number | string): number {
  if (typeof rupees === 'string') {
    rupees = rupees.trim();
    if (rupees === '' || isNaN(Number(rupees))) {
      return 0;
    }
    const parts = rupees.split('.');
    const whole = parseInt(parts[0] || '0', 10);
    let fraction = 0;
    if (parts.length > 1) {
      const fracStr = (parts[1] + '00').slice(0, 2);
      fraction = parseInt(fracStr, 10);
    }
    return whole * 100 + fraction;
  }

  if (typeof rupees === 'number') {
    if (isNaN(rupees) || !isFinite(rupees)) {
      return 0;
    }
    return Math.round(rupees * 100);
  }

  return 0;
}

/**
 * Formats paise as human-readable INR string.
 * e.g. 2500 -> "₹25", 2550 -> "₹25.50", 100000 -> "₹1,000"
 */
export function formatRupees(paise: number, showDecimalsIfZero = false): string {
  const isNegative = paise < 0;
  const absPaise = Math.abs(paise);
  const rupeesPart = Math.floor(absPaise / 100);
  const paisePart = absPaise % 100;

  // Indian number formatting for rupeesPart (lakhs/crores)
  const rupeesStr = formatIndianNumber(rupeesPart);

  let formatted = '';
  if (paisePart > 0 || showDecimalsIfZero) {
    formatted = `₹${rupeesStr}.${paisePart.toString().padStart(2, '0')}`;
  } else {
    formatted = `₹${rupeesStr}`;
  }

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Formats paise as NPCI UPI URI amount string (always 2 decimals).
 * e.g. 2500 -> "25.00", 1000 -> "10.00"
 */
export function formatUpiAmount(paise: number): string {
  const safePaise = Math.max(0, Math.floor(paise));
  const rupees = Math.floor(safePaise / 100);
  const remainder = safePaise % 100;
  return `${rupees}.${remainder.toString().padStart(2, '0')}`;
}

/**
 * Helper to format integer with Indian comma grouping: 1,00,000 etc.
 */
function formatIndianNumber(num: number): string {
  const str = num.toString();
  if (str.length <= 3) return str;

  const lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  const withCommas = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${withCommas},${lastThree}`;
}
