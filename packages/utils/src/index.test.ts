import { describe, it, expect } from 'vitest';
import { formatIndianCurrency, calcGrossPnl, parseToCents } from './index';

describe('packages/utils', () => {
  describe('formatIndianCurrency', () => {
    it('should format standard positive amount', () => {
      expect(formatIndianCurrency(123456)).toBe('₹1,23,456');
    });

    it('should format extra large amount (Cr)', () => {
      expect(formatIndianCurrency(1234567)).toBe('₹12,34,567');
    });

    it('should format negative amount with sign before ₹', () => {
      expect(formatIndianCurrency(-9876.5, { decimals: 1 })).toBe('-₹9,876.5');
    });

    it('should format zero correctly', () => {
      expect(formatIndianCurrency(0)).toBe('₹0');
    });

    it('should handle custom decimal places', () => {
      expect(formatIndianCurrency(1234.5678, { decimals: 2 })).toBe('₹1,234.57');
    });
  });

  describe('calcGrossPnl', () => {
    it('should calculate profit for LONG trade', () => {
      expect(calcGrossPnl('LONG', 1000 * 100, 1100 * 100, 10)).toBe(100 * 10 * 100);
    });

    it('should calculate loss for LONG trade', () => {
      expect(calcGrossPnl('LONG', 1100 * 100, 1000 * 100, 10)).toBe(-100 * 10 * 100);
    });

    it('should calculate profit for SHORT trade', () => {
      expect(calcGrossPnl('SHORT', 1100 * 100, 1000 * 100, 10)).toBe(100 * 10 * 100);
    });

    it('should calculate loss for SHORT trade', () => {
      expect(calcGrossPnl('SHORT', 1000 * 100, 1100 * 100, 10)).toBe(-100 * 10 * 100);
    });

    it('should return 0 for breakeven trade', () => {
      expect(calcGrossPnl('LONG', 1000 * 100, 1000 * 100, 10)).toBe(0);
    });
  });

  describe('parseToCents', () => {
    it('should parse standard string amount', () => {
      expect(parseToCents('1250.50')).toBe(125050);
    });

    it('should parse float amount', () => {
      expect(parseToCents(1250.5)).toBe(125050);
    });

    it('should handle zero string', () => {
      expect(parseToCents('0')).toBe(0);
    });

    it('should handle small decimal strings correctly', () => {
      expect(parseToCents('0.05')).toBe(5);
    });

    it('should handle large integer numbers', () => {
      expect(parseToCents(1000)).toBe(100000);
    });
  });
});
