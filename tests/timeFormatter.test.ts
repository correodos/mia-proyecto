/**
 * Test suite para validación de formatTimeToHHMM
 */

import { describe, it, expect } from 'vitest';
import { formatTimeToHHMM } from '../src/utils/time/formatTimeInput';

describe('formatTimeToHHMM - Tests para la utilidad compartida', () => {
  
  describe('Formato básico con entrada limpia', () => {
    
    it('0700 should format to 07:00 automatically', () => {
      const result = formatTimeToHHMM('0700');
      expect(result).toBe('07:00');
    });

    it('0730 should format to 07:30 automatically', () => {
      const result = formatTimeToHHMM('0730');
      expect(result).toBe('07:30');
    });

    it('07:00 should remain unchanged after format', () => {
      const result = formatTimeToHHMM('07:00');
      expect(result).toBe('07:00');
    });

    it('0000 midnight support', () => {
      const result = formatTimeToHHMM('0000');
      expect(result).toBe('00:00');
    });

    it('2359 max valid time', () => {
      const result = formatTimeToHHMM('2359');
      expect(result).toBe('23:59');
    });

    it('keeps empty string when no input', () => {
      const result = formatTimeToHHMM('');
      expect(result).toBe('');
    });

    it('limits to 4 digits max (e.g. 07001)', () => {
      const result = formatTimeToHHMM('07001');
      expect(result).toBe('07:00');
    });

    it('handles partial 123', () => {
      const result = formatTimeToHHMM('123');
      expect(result).toBe('12:3');
    });

    it('keeps single digit 7 without auto-format', () => {
      const result = formatTimeToHHMM('7');
      expect(result).toBe('7');
    });

    it('handles 1234 standard input', () => {
      const result = formatTimeToHHMM('1234');
      expect(result).toBe('12:34');
    });
  });

  describe('Formato con separador existente', () => {
    
    it('09:00 with colon remains unchanged', () => {
      const result = formatTimeToHHMM('09:00');
      expect(result).toBe('09:00');
    });

    it(': as partial input after stripping', () => {
      const result = formatTimeToHHMM('12:');
      expect(result).toBe('12');
    });
  });

  describe('Validación después del formato', () => {
    
    it('07:00 is valid HH:MM format', () => {
      const result = formatTimeToHHMM('0700');
      expect(result).toMatch(/^[\d]{2}:[\d]{2}$/);
    });

    it('parses 14:30 to correct minutes', () => {
      const time = formatTimeToHHMM('1430');
      const parts = time.split(':');
      expect(parseInt(parts[0])).toBe(14);
      expect(parseInt(parts[1])).toBe(30);
    });

    it('parses 23:59 to 1439 minutes', () => {
      const time = formatTimeToHHMM('2359');
      const parts = time.split(':');
      expect(parseInt(parts[0]) * 60 + parseInt(parts[1])).toBe(1439);
    });

    it('returns string for invalid input', () => {
      const result = formatTimeToHHMM('invalid');
      expect(result).not.toBeNull();
    });
  });

  describe('Edge cases en edição paso a paso', () => {
    
    it('User types 7 without formatting', () => {
      const result = formatTimeToHHMM('7');
      expect(result).toBe('7');
    });

    it('User completes 73 as 2 digits', () => {
      const result = formatTimeToHHMM('73');
      expect(result).toBe('73');
    });

    it('handles 12 without formatting', () => {
      const result = formatTimeToHHMM('12');
      expect(result).toBe('12');
    });

    it('handles hour=24 edge case', () => {
      const result = formatTimeToHHMM('2400');
      // Will be caught by parseTime validation later
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Cruce medianoche', () => {
    
    it('allows 23h for midnight crossing', () => {
      const result = formatTimeToHHMM('2300');
      expect(result).toBe('23:00');
    });

    it('allows 00h after valid crossing', () => {
      const result = formatTimeToHHMM('0000');
      expect(result).toBe('00:00');
    });

    it('validates overnight shift correctly', () => {
      const entry = formatTimeToHHMM('2359');
      const exit = formatTimeToHHMM('0001');
      
      expect(entry).toBe('23:59');
      expect(exit).toBe('00:01');
    });
  });

  describe('Compatibilidad con calculadoras', () => {
    
    it('compatible with calculator.ts split parsing', () => {
      const testInputs = ['07:00', '14:30', '23:59'];
      
      testInputs.forEach(input => {
        const formatted = formatTimeToHHMM(input);
        if (formatted.includes(':')) {
          const [h, m] = formatted.split(':');
          expect(parseInt(h) + parseInt(m)).toBeGreaterThan(0);
        }
      });
    });

    it('maintains HH:MM pattern', () => {
      const validFormats = ['09:00', '14:30', '23:59', '00:00'];
      
      validFormats.forEach(format => {
        const formatted = formatTimeToHHMM(format);
        expect(formatted).toMatch(/^\d{1,2}:\d{1,2}$/);
      });
    });

    it('compatible with hoursExtraCalculator', () => {
      const entry = formatTimeToHHMM('08:00');
      const exit = formatTimeToHHMM('16:30');
      
      expect(entry).toBe('08:00');
      expect(exit).toBe('16:30');
    });

    it('standard times maintain pattern', () => {
      const standardTimes = ['07:00', '08:00', '12:30', '14:30', '23:00', '23:59'];
      
      standardTimes.forEach(time => {
        const formatted = formatTimeToHHMM(time);
        expect(formatted).toMatch(/^\d{1,2}:\d{1,2}$/);
      });
    });
  });

});
