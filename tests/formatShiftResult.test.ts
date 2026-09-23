import { formatShiftResult } from '../src/utils/formatShiftResult';

describe('formatShiftResult', () => {
  it('formatea 0 minutos', () => {
    const r = formatShiftResult(0);
    expect(r).toEqual({ hours: 0, minutesLeft: 0, totalMinutes: 0, decimal: '0.00', formatted: '0h 00m' });
  });

  it('formatea exactamente 60 minutos', () => {
    const r = formatShiftResult(60);
    expect(r.hours).toBe(1);
    expect(r.minutesLeft).toBe(0);
    expect(r.decimal).toBe('1.00');
  });

  it('formatea 90 minutos', () => {
    const r = formatShiftResult(90);
    expect(r.hours).toBe(1);
    expect(r.minutesLeft).toBe(30);
    expect(r.decimal).toBe('1.50');
    expect(r.formatted).toBe('1h 30m');
  });

  it('formatea 480 minutos (8h)', () => {
    const r = formatShiftResult(480);
    expect(r.formatted).toBe('8h 00m');
    expect(r.decimal).toBe('8.00');
  });
});
