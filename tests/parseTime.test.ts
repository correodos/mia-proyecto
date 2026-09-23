import { parseTime } from '../src/utils/time/parseTime';

describe('parseTime', () => {
  // Formato válido
  it('parsea "08:30" correctamente', () => {
    expect(parseTime('08:30')).toEqual({ hours: 8, minutes: 30 });
  });
  it('parsea "0:00" correctamente', () => {
    expect(parseTime('0:00')).toEqual({ hours: 0, minutes: 0 });
  });
  it('parsea "23:59" correctamente', () => {
    expect(parseTime('23:59')).toEqual({ hours: 23, minutes: 59 });
  });
  it('acepta formato sin cero inicial "9:05"', () => {
    expect(parseTime('9:05')).toEqual({ hours: 9, minutes: 5 });
  });

  // Formato inválido
  it('devuelve null para string vacío', () => {
    expect(parseTime('')).toBeNull();
  });
  it('devuelve null para formato sin dos puntos "0830"', () => {
    expect(parseTime('0830')).toBeNull();
  });
  it('devuelve null para texto no numérico', () => {
    expect(parseTime('ab:cd')).toBeNull();
  });

  // Fuera de rango
  it('devuelve null para horas > 23', () => {
    expect(parseTime('24:00')).toBeNull();
  });
  it('devuelve null para minutos > 59', () => {
    expect(parseTime('08:60')).toBeNull();
  });
  it('devuelve null para null/undefined', () => {
    expect(parseTime(null as any)).toBeNull();
    expect(parseTime(undefined as any)).toBeNull();
  });
});
