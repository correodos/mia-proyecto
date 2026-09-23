import { diffMinutes } from '../src/utils/time/diffMinutes';

const h = (hours: number, minutes: number) => ({ hours, minutes });

describe('diffMinutes', () => {
  it('calcula duración normal mismo día', () => {
    expect(diffMinutes(h(8, 0), h(16, 30))).toEqual({ minutes: 510, isNightShift: false });
  });

  it('detecta cruce de medianoche', () => {
    expect(diffMinutes(h(22, 0), h(6, 0))).toEqual({ minutes: 480, isNightShift: true });
  });

  it('devuelve 0 minutos cuando salida == entrada', () => {
    expect(diffMinutes(h(9, 0), h(9, 0))).toEqual({ minutes: 0, isNightShift: false });
  });

  it('calcula turno que empieza tarde y acaba pronto (cruce medianoche corto)', () => {
    expect(diffMinutes(h(23, 30), h(0, 30))).toEqual({ minutes: 60, isNightShift: true });
  });
});
