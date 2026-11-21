import { describe, expect, it } from 'vitest';
import { rupeesToPaise } from '../src/amount/index.js';
import { attemptUpiHandoff, buildUpiUri, parseUpiUri } from '../src/payment/index.js';
import { validateConfig } from '../src/validation/index.js';

describe('Strict currency and UPI safety regressions', () => {
  it('preserves the sign for negative string decimals', () => {
    expect(rupeesToPaise('-1.50')).toBe(-150);
    expect(rupeesToPaise('-0.99')).toBe(-99);
    expect(rupeesToPaise('+10.01')).toBe(1001);
  });

  it('rejects malformed currency strings instead of silently truncating', () => {
    for (const value of ['1.234', '12.3.4', '1e2', 'Infinity', '1abc', '3.', '--1']) {
      expect(rupeesToPaise(value)).toBe(0);
    }
  });

  it('rejects fractional, unsafe and non-positive paise when building payment URLs', () => {
    for (const amountPaise of [10.5, NaN, Infinity, -1, 0, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => buildUpiUri({ upiId: 'creator@upi', creatorName: 'Creator', amountPaise })).toThrow();
    }
  });

  it('rejects malformed, unsafe, or non-UPI URI inputs', () => {
    expect(parseUpiUri('upi://pay?pa=creator%40upi&pn=Creator&am=Infinity&cu=INR')).toBeNull();
    expect(parseUpiUri('upi://pay?pa=creator%40upi&pn=Creator&am=1e2&cu=INR')).toBeNull();
    expect(parseUpiUri('upi://pay?pa=invalid&pn=Creator&am=10.00&cu=INR')).toBeNull();
    expect(attemptUpiHandoff('javascript:alert(1)').dispatched).toBe(false);
    expect(attemptUpiHandoff('https://example.com').dispatched).toBe(false);
  });

  it('rejects invalid amount limits and invalid tier amounts', () => {
    expect(validateConfig({ creatorName: 'Creator', upiId: 'creator@upi', minAmountPaise: NaN }).valid).toBe(false);
    expect(validateConfig({ creatorName: 'Creator', upiId: 'creator@upi', maxAmountPaise: Infinity }).valid).toBe(false);
    expect(validateConfig({ creatorName: 'Creator', upiId: 'creator@upi', tiers: [{ id: 'test', name: 'Test', amountPaise: 2500.5 }] }).valid).toBe(false);
    expect(validateConfig({ creatorName: 'Creator', upiId: 'creator@upi', tiers: [{ id: 'same', name: 'One', amountPaise: 1000 }, { id: 'same', name: 'Two', amountPaise: 2500 }] }).valid).toBe(false);
  });
});
