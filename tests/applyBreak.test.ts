import { applyBreak } from '../src/utils/time/applyBreak';

describe('applyBreak', () => {
  it('devuelve los mismos minutos si breakMinutes = 0', () => {
    expect(applyBreak({ minutes: 480 }, 0)).toEqual({ ok: true, minutes: 480 });
  });

  it('resta el descanso correctamente', () => {
    expect(applyBreak({ minutes: 480 }, 30)).toEqual({ ok: true, minutes: 450 });
  });

  it('error si descanso >= duración', () => {
    const r = applyBreak({ minutes: 30 }, 30);
    expect(r.ok).toBe(false);
  });

  it('error si descanso > duración', () => {
    const r = applyBreak({ minutes: 30 }, 60);
    expect(r.ok).toBe(false);
  });

  it('descanso negativo se ignora (no resta)', () => {
    expect(applyBreak({ minutes: 480 }, -10)).toEqual({ ok: true, minutes: 480 });
  });
});
