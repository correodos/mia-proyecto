import { describe, it, expect } from 'vitest';
import { calculateWorkingHours } from '../src/scripts/calculator';

describe('calculateWorkingHours', () => {
  it('Jornada normal: 09:00 → 18:00, descanso 60 → 8h', () => {
    const result = calculateWorkingHours('09:00', '18:00', 60);
    expect(result.ok).toBe(true);
    expect(result.hours).toBe(8);
    expect(result.minutes).toBe(0);
    expect(result.decimal).toBe('8.00');
  });

  it('Sin descanso: 09:00 → 17:00, descanso 0 → 8h', () => {
    const result = calculateWorkingHours('09:00', '17:00', 0);
    expect(result.ok).toBe(true);
    expect(result.hours).toBe(8);
    expect(result.minutes).toBe(0);
    expect(result.decimal).toBe('8.00');
  });

  it('Cruce de medianoche: 23:00 → 05:00, descanso 60 → 5h', () => {
    const result = calculateWorkingHours('23:00', '05:00', 60);
    expect(result.ok).toBe(true);
    expect(result.hours).toBe(5);
    expect(result.minutes).toBe(0);
    expect(result.decimal).toBe('5.00');
  });

  it('00:00 → 00:00 con descanso 0 → 0h', () => {
    const result = calculateWorkingHours('00:00', '00:00', 0);
    expect(result.ok).toBe(true);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.decimal).toBe('0.00');
  });

  it('Entrada igual a salida con descanso positivo (comportamiento real)', () => {
    const result = calculateWorkingHours('09:00', '09:00', 30);
    expect(result.ok).toBe(true);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.decimal).toBe('0.00');
  });

  it('Descanso igual a la duración (comportamiento real)', () => {
    const result = calculateWorkingHours('09:00', '10:00', 60);
    expect(result.ok).toBe(true);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.decimal).toBe('0.00');
  });

  it('Descanso superior a la duración (comportamiento real)', () => {
    const result = calculateWorkingHours('09:00', '10:00', 120);
    expect(result.ok).toBe(false);
    expect(result.error).toContain('descanso no puede ser mayor');
  });

  it('Formato inválido (comportamiento real)', () => {
    const result = calculateWorkingHours('', '18:00', 0);
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Introduce una hora de entrada y una hora de salida');
  });

  it('Valores con minutos: 08:30 → 17:15', () => {
    const result = calculateWorkingHours('08:30', '17:15', 0);
    expect(result.ok).toBe(true);
    expect(result.hours).toBe(8);
    expect(result.minutes).toBe(45);
    expect(result.decimal).toBe('8.75');
  });

  it('Horas decimales', () => {
    const result = calculateWorkingHours('09:00', '12:30', 0);
    expect(result.ok).toBe(true);
    expect(result.decimal).toBe('3.50');
  });
});
