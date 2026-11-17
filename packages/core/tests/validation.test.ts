import { describe, expect, it } from 'vitest';
import {
  DEFAULT_MAX_AMOUNT_PAISE,
  DEFAULT_MIN_AMOUNT_PAISE,
  sanitizeText,
  validateAmount,
  validateConfig,
  validateUpiId,
} from '../src/validation/index.js';

describe('Validation Utilities', () => {
  describe('validateUpiId', () => {
    it('accepts valid VPA formats', () => {
      expect(validateUpiId('creator@okhdfcbank').valid).toBe(true);
      expect(validateUpiId('john.doe@upi').valid).toBe(true);
      expect(validateUpiId('dev_99@paytm').valid).toBe(true);
      expect(validateUpiId('user-name@icici').valid).toBe(true);
    });

    it('rejects invalid or empty UPI IDs', () => {
      expect(validateUpiId('').valid).toBe(false);
      expect(validateUpiId('   ').valid).toBe(false);
      expect(validateUpiId('invalid').valid).toBe(false);
      expect(validateUpiId('@bank').valid).toBe(false);
      expect(validateUpiId('user@').valid).toBe(false);
      expect(validateUpiId('user @bank').valid).toBe(false);
      expect(validateUpiId('user<script>@bank').valid).toBe(false);
      expect(validateUpiId(12345).valid).toBe(false);
    });
  });

  describe('validateAmount', () => {
    it('accepts valid integer amounts within range', () => {
      expect(validateAmount(1000).valid).toBe(true);
      expect(validateAmount(2500).valid).toBe(true);
      expect(validateAmount(DEFAULT_MIN_AMOUNT_PAISE).valid).toBe(true);
      expect(validateAmount(DEFAULT_MAX_AMOUNT_PAISE).valid).toBe(true);
    });

    it('rejects amounts below minimum or above maximum', () => {
      expect(validateAmount(999).valid).toBe(false);
      expect(validateAmount(DEFAULT_MAX_AMOUNT_PAISE + 1).valid).toBe(false);
      expect(validateAmount(-100).valid).toBe(false);
    });

    it('rejects non-integer or invalid numbers', () => {
      expect(validateAmount(2500.5).valid).toBe(false);
      expect(validateAmount(NaN).valid).toBe(false);
      expect(validateAmount(Infinity).valid).toBe(false);
      expect(validateAmount('1000' as unknown as number).valid).toBe(false);
    });
  });

  describe('sanitizeText', () => {
    it('strips dangerous HTML tags and characters', () => {
      expect(sanitizeText('<script>alert(1)</script>Hello')).toBe('scriptalert(1)/scriptHello');
      expect(sanitizeText('Creator "Name" & co')).toBe('Creator Name  co');
    });

    it('enforces maxLength', () => {
      expect(sanitizeText('A very long string that exceeds limit', 10)).toBe('A very lon');
    });
  });

  describe('validateConfig', () => {
    it('passes for a valid minimal configuration', () => {
      const result = validateConfig({
        creatorName: 'Arjun Verma',
        upiId: 'arjun@upi',
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('fails when creatorName or upiId is missing', () => {
      const result = validateConfig({
        creatorName: '',
        upiId: '',
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('validates theme and position', () => {
      const result = validateConfig({
        creatorName: 'Arjun',
        upiId: 'arjun@upi',
        // @ts-expect-error Testing invalid runtime theme
        theme: 'neon-cyberpunk',
        // @ts-expect-error Testing invalid runtime position
        position: 'top-center',
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Invalid theme 'neon-cyberpunk'. Valid themes are: classic, dark, cream, minimal, auto."
      );
      expect(result.errors).toContain(
        "Invalid position 'top-center'. Valid positions are: bottom-right, bottom-left, inline."
      );
    });
  });
});
