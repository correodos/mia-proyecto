import { calculateExtraHours } from '../src/utils/time/calculateExtraHours';

describe('calculateExtraHours', () => {
  it('devuelve 0 si trabajado < previsto', () => {
    const r = calculateExtraHours(450, 480);
    expect(r.hoursFormatted).toBe('0h 0m');
  });

  it('devuelve 0 si trabajado == previsto', () => {
    const r = calculateExtraHours(480, 480);
    expect(r.hoursFormatted).toBe('0h 0m');
  });

  it('calcula horas extra correctamente', () => {
    const r = calculateExtraHours(510, 480);
    expect(r.hoursFormatted).toBe('0h 30m');
    expect(r.decimalHours).toBe('0.50 horas');
  });

  it('calcula horas extra de más de 1 hora', () => {
    const r = calculateExtraHours(600, 480);
    expect(r.hoursFormatted).toBe('2h 0m');
  });
});
