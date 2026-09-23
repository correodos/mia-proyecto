import { calculateWorkingMinutes } from '../src/utils/calculateWorkingMinutes';

describe('calculateWorkingMinutes', () => {
  it('calcula una jornada normal', () => {
    const r = calculateWorkingMinutes('08:00', '16:30', 30);
    expect(r).toEqual({ ok: true, minutes: 480, isNightShift: false });
  });

  it('calcula cruce de medianoche', () => {
    const r = calculateWorkingMinutes('22:00', '06:00', 0);
    expect(r).toEqual({ ok: true, minutes: 480, isNightShift: true });
  });

  it('error si descanso consume toda la jornada', () => {
    const r = calculateWorkingMinutes('08:00', '09:00', 60);
    expect(r.ok).toBe(false);
  });

  it('error si entryStr vacío', () => {
    const r = calculateWorkingMinutes('', '16:00');
    expect(r.ok).toBe(false);
  });

  it('error si exitStr vacío', () => {
    const r = calculateWorkingMinutes('08:00', '');
    expect(r.ok).toBe(false);
  });

  it('error si formato inválido', () => {
    const r = calculateWorkingMinutes('8', '16');
    expect(r.ok).toBe(false);
  });

  it('breakMinutes undefined equivale a 0', () => {
    const r = calculateWorkingMinutes('08:00', '16:00');
    expect(r).toEqual({ ok: true, minutes: 480, isNightShift: false });
  });

  it('breakMinutes 0 explícito funciona igual', () => {
    const r = calculateWorkingMinutes('08:00', '16:00', 0);
    expect(r).toEqual({ ok: true, minutes: 480, isNightShift: false });
  });
});
