import { parseExpectedShiftToMinutes } from '../src/utils/time/parseExpectedShift';

describe('parseExpectedShiftToMinutes', () => {
  it('parsea "8" como 480 minutos', () => {
    expect(parseExpectedShiftToMinutes('8')).toBe(480);
  });
  it('parsea "8:30" como 510 minutos', () => {
    expect(parseExpectedShiftToMinutes('8:30')).toBe(510);
  });
  it('parsea "08:00" como 480 minutos', () => {
    expect(parseExpectedShiftToMinutes('08:00')).toBe(480);
  });
  it('parsea "0" como 0 minutos', () => {
    expect(parseExpectedShiftToMinutes('0')).toBe(0);
  });
  it('devuelve null para horas > 23', () => {
    expect(parseExpectedShiftToMinutes('25')).toBeNull();
  });
  it('devuelve null para minutos > 59', () => {
    expect(parseExpectedShiftToMinutes('8:60')).toBeNull();
  });
  it('devuelve null para string vacío', () => {
    expect(parseExpectedShiftToMinutes('')).toBeNull();
  });
});
