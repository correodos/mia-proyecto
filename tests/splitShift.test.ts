import { calculateSplitShift, getBreakBetweenShifts } from '../src/scripts/splitShiftCalculator';

describe('calculateSplitShift', () => {
  it('calcula dos tramos válidos', () => {
    const r = calculateSplitShift('08:00', '12:00', '13:00', '17:00');
    expect(r.ok).toBe(true);
    expect(r.duration1Minutes).toBe(240);
    expect(r.duration2Minutes).toBe(240);
    expect(r.breakMinutes).toBe(60);
  });

  it('error si el segundo tramo solapa con el primero', () => {
    // salida1=13:00, entrada2=12:00 → solapamiento
    const r = calculateSplitShift('08:00', '13:00', '12:00', '17:00');
    expect(r.ok).toBe(false);
  });

  it('error si falta entrada del primer tramo', () => {
    const r = calculateSplitShift('', '12:00', '13:00', '17:00');
    expect(r.ok).toBe(false);
  });

  it('error si falta salida del segundo tramo', () => {
    const r = calculateSplitShift('08:00', '12:00', '13:00', '');
    expect(r.ok).toBe(false);
  });
});

describe('getBreakBetweenShifts', () => {
  it('calcula el descanso entre tramos', () => {
    expect(getBreakBetweenShifts('12:00', '13:30')).toBe(90);
  });

  it('devuelve 0 si no hay descanso (salida == entrada)', () => {
    expect(getBreakBetweenShifts('12:00', '12:00')).toBe(0);
  });

  it('devuelve 0 si los strings son inválidos', () => {
    expect(getBreakBetweenShifts('', '')).toBe(0);
  });
});
