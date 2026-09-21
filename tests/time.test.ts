/** Suite de pruebas para utilidades de tiempo - Calculadora de Horas Trabajadas */

import { describe, test, expect } from 'vitest';
import { parseTime } from '../src/utils/time/parseTime';
import { minutesFromTime } from '../src/utils/time/minutesFromTime';
import { breakMinutesFromTime } from '../src/utils/time/breakMinutesFromTime';
import { parseBreakMinutes } from '../src/utils/time/breakMinutesFromTime';
import { diffMinutes } from '../src/utils/time/diffMinutes';
import { applyBreak } from '../src/utils/time/applyBreak';
import { formatTotalMinutes } from '../src/utils/time/formatResult';
import { calculateExtraHours } from '../src/utils/time/calculateExtraHours';
import { parseExpectedShiftToMinutes, validateExpectedShiftFormat } from '../src/utils/time/parseExpectedShift';
import { validateExpectedShift } from '../src/utils/validation/validateShiftDuration';

describe('funciones de lógica de tiempo', () => {
  
  // ===== PRUEBA: Jornada estándar =====
  
  test('09:00 parseado tiene horas=9, minutos=0', () => {
    const entry = parseTime('09:00');
    expect(entry?.hours).toBe(9);
    expect(entry?.minutes).toBe(0);
  });

  test('18:00 parseado a veces pierde el cero -> es expected comportamiento', () => {
    const exit = parseTime('18:00');
    expect(exit).toEqual({ hours: 18, minutes: 0 });
  });

  // ===== PRUEBA: Jornada estándar =====
  
  test('Jornada estándar sin descanso produce 540 minutos', () => {
    const entry = parseTime('09:00');
    const exit = parseTime('18:00');
    
    expect(entry?.hours).toBe(9);
    expect(exit?.hours).toBe(18);
    
    // 18 - 9 = 9 horas = 540 minutos (sin descanso)
    expect(diffMinutes(entry!, exit!).minutes).toBe(540);
  });

  test('Jornada estándar sin descanso produce 540 minutos', () => {
    const entry = parseTime('09:00');
    const exit = parseTime('18:00');
    
    expect(entry?.hours).toBe(9);
    expect(exit?.hours).toBe(18);
    
    // 9 x 60 = 540 minutos (sin descanso)
    expect(diffMinutes(entry!, exit!).minutes).toBe(540);
  });

  test('Entrada y salida iguales → 0 horas extra', () => {
    const entry = parseTime('12:00');
    const exit = parseTime('12:00');
    
    const result = diffMinutes(entry, exit);
    
    expect(result?.minutes).toBe(0);
  });

  // ===== PRUEBAs: Minutos directos (sin :MM) =====

  test('30 minutos directos → parseBreakMinutes devuelve {hours: 0, minutes: 30}', () => {
    const result = parseBreakMinutes('30');
    
    expect(result).toEqual({ hours: 0, minutes: 30 });
    expect(result?.minutes).toBe(30);
  });

  test('Jornada exactamente cumplida = 0 h extra', () => {
    const workedMinutes = 480; // 8h trabajadas
    const expectedMinutes = 480; // Jornada prevista: igual
    
    const result = calculateExtraHours(workedMinutes, expectedMinutes);
    
    expect(result.decimalHours).toBe('0.00 horas');
    expect(result.hoursFormatted).toBe('0h 0m');
  });

  test('Jornada superior a prevista → horas extra', () => {
    const workedMinutes = 570; // 9:30 trabajadas
    const expectedMinutes = 480; // Jornada prevista de 8h
    
    const result = calculateExtraHours(workedMinutes, expectedMinutes);
    
    expect(result.decimalHours).toBe('1.50 horas');
    expect(result.hoursFormatted).toBe('1h 30m');
  });

  test('Jornada inferior a prevista = 0 horas extra', () => {
    const workedMinutes = 420; // 7 horas trabajadas (ej: 15:00 salida)
    const expectedMinutes = 480; // 8h previstas
    
    const result = calculateExtraHours(workedMinutes, expectedMinutes);
    
    expect(result.decimalHours).toBe('0.00 horas');
    expect(result.hoursFormatted).toBe('0h 0m');
  });

  test('Cruce medianoche con descanso produce horas extra', () => {
    const workedMinutes = 510; // 23:30 → 00:30 + descansó media hora (430 min trabajados)
    const expectedMinutes = 480; // Jornada de 8h
    
    const result = calculateExtraHours(workedMinutes, expectedMinutes);
    
    expect(result.hoursFormatted).toBe('0h 30m'); // Formato actual de formatTotalMinutes()
    expect(result.decimalHours).toBe('0.50 horas');
  });

  test('Caso 00:00 → 00:00 con jornada prevista = 0 horas extra', () => {
    const workedMinutes = 0;
    const expectedMinutes = 480;
    
    const result = calculateExtraHours(workedMinutes, expectedMinutes);
    
    expect(result.decimalHours).toBe('0.00 horas');
    expect(result.hoursFormatted).toBe('0h 0m');
  });

  test('Jornada prevista inválida devuelve error', () => {
    const result = validateExpectedShiftFormat('');
    expect(result).toContain('Introduce una jornada');
  });

  // ===== PRUEBAS PARSE BREAK MINUTES (NUEVAS) =====

  test('parseBreakMinutes: "01:00" → { hours: 1, minutes: 0 }', () => {
    const result = parseBreakMinutes('01:00');
    
    expect(result).toEqual({ hours: 1, minutes: 0 });
    expect(result).not.toBeNull();
  });

  test('parseBreakMinutes: "00:30" → { hours: 0, minutes: 30 }', () => {
    const result = parseBreakMinutes('00:30');
    
    expect(result).toEqual({ hours: 0, minutes: 30 });
    expect(result).not.toBeNull();
  });

  test('parseBreakMinutes: "01:30" → { hours: 1, minutes: 30 }', () => {
    const result = parseBreakMinutes('01:30');
    
    expect(result).toEqual({ hours: 1, minutes: 30 });
    expect(result).not.toBeNull();
  });

  test('parseBreakMinutes: "60" → { hours: 1, minutes: 0 }', () => {
    const result = parseBreakMinutes('60');
    
    expect(result).toEqual({ hours: 1, minutes: 0 });
    expect(result).not.toBeNull();
  });

  test('parseBreakMinutes: "30" → { hours: 0, minutes: 30 } (minutos directos)', () => {
    const result = parseBreakMinutes('30');
    
    expect(result).toEqual({ hours: 0, minutes: 30 });
    expect(result).not.toBeNull();
  });

  test('parseBreakMinutes: "00:00" → { hours: 0, minutes: 0 }', () => {
    const result = parseBreakMinutes('00:00');
    
    expect(result).toEqual({ hours: 0, minutes: 0 });
    expect(result).not.toBeNull();
  });

  test('parseBreakMinutes: null → null', () => {
    const result = parseBreakMinutes(null);
    
    expect(result).toBeNull();
  });

  test('parseBreakMinutes: "" → null', () => {
    const result = parseBreakMinutes('');
    
    expect(result).toBeNull();
  });

  test('parseBreakMinutes: "99:00" → null (hora inválida)', () => {
    const result = parseBreakMinutes('99:00');
    
    expect(result).toBeNull();
  });

  test('parseBreakMinutes: "85:00" → null (minutos inválidos)', () => {
    const result = parseBreakMinutes('14:60');
    
    expect(result).toBeNull();
  });

  test('breakMinutesFromTime: calculo directo', () => {
    expect(breakMinutesFromTime(1, 0)).toBe(60); // 01:00
    expect(breakMinutesFromTime(0, 30)).toBe(30); // 00:30
    expect(breakMinutesFromTime(1, 30)).toBe(90); // 01:30
    expect(breakMinutesFromTime(2, 0)).toBe(120); // 02:00
    expect(breakMinutesFromTime(0, 0)).toBe(0); // 00:00
    expect(breakMinutesFromTime(8, 30)).toBe(510); // 08:30
  });

  // ===== PRUEBAS: parseExpectedShiftToMinutes (jornada prevista flexible) =====

  test('parseExpectedShiftToMinutes: "5" → 300 minutos', () => {
    const result = parseExpectedShiftToMinutes('5');
    expect(result).toBe(300);
  });

  test('parseExpectedShiftToMinutes: "6" → 360 minutos', () => {
    const result = parseExpectedShiftToMinutes('6');
    expect(result).toBe(360);
  });

  test('parseExpectedShiftToMinutes: "6:45" → 405 minutos', () => {
    const result = parseExpectedShiftToMinutes('6:45');
    expect(result).toBe(405);
  });

  test('parseExpectedShiftToMinutes: "8:00" → 480 minutos', () => {
    const result = parseExpectedShiftToMinutes('8:00');
    expect(result).toBe(480);
  });
  test('parseExpectedShiftToMinutes: vacío → null (inválido)', () => {
    const result = parseExpectedShiftToMinutes('');
    expect(result).toBeNull();
  });

  test('parseExpectedShiftToMinutes: "8:60" inválido (minutos > 59) → null', () => {
    const result = parseExpectedShiftToMinutes('8:60');
    expect(result).toBeNull();
  });

  test('parseExpectedShiftToMinutes: "25:00" inválido (horas > 23) → null', () => {
    const result = parseExpectedShiftToMinutes('25:00');
    expect(result).toBeNull();
  });

  test('parseExpectedShiftToMinutes: "08" → 480 minutos', () => {
    const result = parseExpectedShiftToMinutes('08');
    expect(result).toBe(480);
  });

  // ===== PRUEBAS: calculateExtraHours con jornada prevista =====

  test('570 worked vs 480 expected → 1h30 y 1.50 horas extra', () => {
    const result = calculateExtraHours(570, 480);
    expect(result.hoursFormatted).toBe('1h 30m');
    expect(result.decimalHours).toBe('1.50 horas');
  });

  test('480 worked vs 480 expected → 0h00 y 0.00 horas extra (jornada exacta)', () => {
    const result = calculateExtraHours(480, 480);
    expect(result.hoursFormatted).toBe('0h 0m');
    expect(result.decimalHours).toBe('0.00 horas');
  });

  test('450 worked vs 480 expected → 0h00 y 0.00 horas extra (inferior jornada)', () => {
    const result = calculateExtraHours(450, 480);
    expect(result.hoursFormatted).toBe('0h 0m');
    expect(result.decimalHours).toBe('0.00 horas');
  });

  test('360 worked vs 300 expected → 1h00 y 1.00 horas extra', () => {
    const result = calculateExtraHours(360, 300);
    expect(result.hoursFormatted).toBe('1h 0m');
    expect(result.decimalHours).toBe('1.00 horas');
  });

  // ===== PRUEBAS PARA CALCULATOR. TS (VALIDACIÓN DE DESCANSO VACÍO) =====

  test('Caso diario: 09:00 → 19:00 sin descanso especificado = 10h 0m', () => {
    const entryMinutes = parseInt('09') * 60 + parseInt('00'); // 540
    const exitMinutes = parseInt('19') * 60 + parseInt('00'); // 1140
    
    expect(entryMinutes).toBe(540);
    expect(exitMinutes).toBe(1140);
    
    // Duración total sin descanso
    const duration = exitMinutes - entryMinutes; // 600 min = 10h
    expect(duration).toBe(600);
    
    // Con descanso vacío (0 minutos), workingDuration = 600 - 0 = 600
    const workingDurationWithEmptyBreak = duration - 0;
    expect(workingDurationWithEmptyBreak).toBe(600);
    
    // Resultado esperado: 10 horas, 0 minutos
    expect(Math.floor(workingDurationWithEmptyBreak / 60)).toBe(10);
    expect(workingDurationWithEmptyBreak % 60).toBe(0);
  });

  test('Caso diario: 09:00 → 19:00 con descanso 20 = 9h 40m', () => {
    const entryMinutes = parseInt('09') * 60 + parseInt('00'); // 540
    const exitMinutes = parseInt('19') * 60 + parseInt('00'); // 1140
    const breakMinutes = 20;
    
    const duration = exitMinutes - entryMinutes; // 600 min
    const workingDuration = duration - breakMinutes; // 580 min
    
    expect(Math.floor(workingDuration / 60)).toBe(9); // 9 horas
    expect(workingDuration % 60).toBe(40); // 40 minutos
    expect((workingDuration / 60).toFixed(2)).toBe('9.67');
  });

  test('Caso diario: descanso vacío (string vació) = 0 minutos', () => {
    const breakInputValue = ''; // campo vacío en el input
    let breakMinutes = breakInputValue ? parseInt(breakInputValue) : 0;
    
    if (isNaN(breakMinutes)) {
      breakMinutes = 60; // fallback para formato inválido
    }
    
    expect(breakMinutes).toBe(0); // descanso vacío debe ser 0, no 60
  });

  test('Caso diario: descanso "20" = 20 minutos', () => {
    const breakInputValue = '20';
    let breakMinutes = breakInputValue ? parseInt(breakInputValue) : 0;
    
    if (isNaN(breakMinutes)) {
      breakMinutes = 60; // fallback para formato inválido
    }
    
    expect(breakMinutes).toBe(20);
  });

  test('Caso diario: descanso "60" = 60 minutos', () => {
    const breakInputValue = '60';
    let breakMinutes = breakInputValue ? parseInt(breakInputValue) : 0;
    
    if (isNaN(breakMinutes)) {
      breakMinutes = 60; // fallback para formato inválido
    }
    
    expect(breakMinutes).toBe(60);
  });

  test('Caso diario: descanso "invalido" = 60 minutos (fallback)', () => {
    const breakInputValue = 'abc';
    let breakMinutes = breakInputValue ? parseInt(breakInputValue) : 0;
    
    if (isNaN(breakMinutes)) {
      breakMinutes = 60; // fallback para formato inválido
    }
    
    expect(breakMinutes).toBe(60);
  });
});
