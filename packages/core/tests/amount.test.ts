import { describe, expect, it } from 'vitest';
import {
  formatRupees,
  formatUpiAmount,
  paiseToRupees,
  rupeesToPaise,
} from '../src/amount/index.js';

describe('Amount Utilities', () => {
  describe('paiseToRupees', () => {
    it('converts integer paise to rupees correctly', () => {
      expect(paiseToRupees(1000)).toBe(10);
      expect(paiseToRupees(2500)).toBe(25);
      expect(paiseToRupees(2550)).toBe(25.5);
      expect(paiseToRupees(99)).toBe(0.99);
      expect(paiseToRupees(0)).toBe(0);
    });

    it('handles non-integer paise by rounding safely', () => {
      expect(paiseToRupees(2500.4)).toBe(25);
      expect(paiseToRupees(2500.6)).toBe(25.01);
    });
  });

  describe('rupeesToPaise', () => {
    it('converts number rupees to exact integer paise', () => {
      expect(rupeesToPaise(10)).toBe(1000);
      expect(rupeesToPaise(25)).toBe(2500);
      expect(rupeesToPaise(25.5)).toBe(2550);
      expect(rupeesToPaise(19.99)).toBe(1999);
      expect(rupeesToPaise(0)).toBe(0);
    });

    it('converts string rupees to exact integer paise without float drift', () => {
      expect(rupeesToPaise('10')).toBe(1000);
      expect(rupeesToPaise('25.00')).toBe(2500);
      expect(rupeesToPaise('25.50')).toBe(2550);
      expect(rupeesToPaise('25.5')).toBe(2550);
      expect(rupeesToPaise('100.99')).toBe(10099);
      expect(rupeesToPaise('  50  ')).toBe(5000);
    });

    it('safely handles invalid inputs', () => {
      expect(rupeesToPaise('')).toBe(0);
      expect(rupeesToPaise('abc')).toBe(0);
      expect(rupeesToPaise(NaN)).toBe(0);
      expect(rupeesToPaise(Infinity)).toBe(0);
    });
  });

  describe('formatRupees', () => {
    it('formats rupees with Indian currency symbol and commas', () => {
      expect(formatRupees(1000)).toBe('₹10');
      expect(formatRupees(2500)).toBe('₹25');
      expect(formatRupees(5000)).toBe('₹50');
      expect(formatRupees(100000)).toBe('₹1,000');
      expect(formatRupees(10000000)).toBe('₹1,00,000');
    });

    it('displays decimals when fractional paise exist', () => {
      expect(formatRupees(2550)).toBe('₹25.50');
      expect(formatRupees(99)).toBe('₹0.99');
    });

    it('respects showDecimalsIfZero flag', () => {
      expect(formatRupees(2500, true)).toBe('₹25.00');
      expect(formatRupees(2500, false)).toBe('₹25');
    });
  });

  describe('formatUpiAmount', () => {
    it('formats exact 2-decimal string for NPCI UPI URI specification', () => {
      expect(formatUpiAmount(1000)).toBe('10.00');
      expect(formatUpiAmount(2500)).toBe('25.00');
      expect(formatUpiAmount(2550)).toBe('25.50');
      expect(formatUpiAmount(100000)).toBe('1000.00');
      expect(formatUpiAmount(0)).toBe('0.00');
    });
  });
});
