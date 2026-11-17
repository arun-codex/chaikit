import { describe, expect, it } from 'vitest';
import {
  buildUpiUri,
  isMobileDevice,
  parseUpiUri,
} from '../src/payment/index.js';

describe('UPI Payment Utilities', () => {
  describe('buildUpiUri', () => {
    it('constructs a valid upi://pay URI according to NPCI spec', () => {
      const uri = buildUpiUri({
        upiId: 'ananya@okhdfcbank',
        creatorName: 'Ananya Sharma',
        amountPaise: 2500, // ₹25
        note: 'Support for Ananya',
      });

      expect(uri).toContain('upi://pay?');
      expect(uri).toContain('pa=ananya%40okhdfcbank');
      expect(uri).toContain('pn=Ananya%20Sharma');
      expect(uri).toContain('am=25.00');
      expect(uri).toContain('cu=INR');
      expect(uri).toContain('tn=Support%20for%20Ananya');
    });

    it('defaults note if not provided', () => {
      const uri = buildUpiUri({
        upiId: 'vikram@upi',
        creatorName: 'Vikram',
        amountPaise: 5000,
      });

      expect(uri).toContain('pa=vikram%40upi');
      expect(uri).toContain('am=50.00');
      expect(uri).toContain('tn=Chai%20for%20Vikram');
    });

    it('throws error when UPI ID is invalid', () => {
      expect(() =>
        buildUpiUri({
          upiId: 'invalid-upi',
          creatorName: 'Test',
          amountPaise: 1000,
        })
      ).toThrowError(/Cannot build UPI URI/);
    });

    it('never injects fake merchant codes, transaction IDs or fake signatures', () => {
      const uri = buildUpiUri({
        upiId: 'creator@upi',
        creatorName: 'Creator',
        amountPaise: 1000,
      });

      expect(uri).not.toContain('mc=');
      expect(uri).not.toContain('tr=');
      expect(uri).not.toContain('sign=');
    });
  });

  describe('parseUpiUri', () => {
    it('parses valid UPI URI back into parameters', () => {
      const uri =
        'upi://pay?pa=creator%40bank&pn=Creator%20Name&am=25.00&cu=INR&tn=Buy%20Me%20a%20Chai';
      const parsed = parseUpiUri(uri);

      expect(parsed).not.toBeNull();
      expect(parsed?.pa).toBe('creator@bank');
      expect(parsed?.pn).toBe('Creator Name');
      expect(parsed?.am).toBe('25.00');
      expect(parsed?.cu).toBe('INR');
      expect(parsed?.tn).toBe('Buy Me a Chai');
    });

    it('returns null for non-UPI or malformed URIs', () => {
      expect(parseUpiUri('https://example.com')).toBeNull();
      expect(parseUpiUri('')).toBeNull();
      expect(parseUpiUri('upi://pay?invalid=true')).toBeNull();
    });
  });

  describe('isMobileDevice', () => {
    it('returns a boolean and does not throw in test/node/browser environment', () => {
      const result = isMobileDevice();
      expect(typeof result).toBe('boolean');
    });
  });
});
