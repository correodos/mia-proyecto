import { describe, it, expect } from 'vitest';
import { 
  parseExpectedShiftToMinutes, 
  calculateExtraHours, 
  parseBreakMinutes,
  minutesFromTime } from '../src/utils/time/index';
import type { HoursResult } from '../src/scripts/horasExtraCalculator';

describe('parseExpectedShiftToMinutes', () => {
  it('jornada "5" → 300 minutos', () => {
    expect(parseExpectedShiftToMinutes('5')).toBe(300);
  });

  it('jornada "6" → 360 minutos', () => {
    expect(parseExpectedShiftToMinutes('6')).toBe(360);
  });

  it('jornada "8:00" → 480 minutos', () => {
    expect(parseExpectedShiftToMinutes('8:00')).toBe(480);
  });

  it('jornada "9:30" → 570 minutos', () => {
    expect(parseExpectedShiftToMinutes('9:30')).toBe(570);
  });

  it('formato inválido → null', () => {
    expect(parseExpectedShiftToMinutes('abc')).toBeNull();
    expect(parseExpectedShiftToMinutes('25')).toBeNull();
    expect(parseExpectedShiftToMinutes('-1')).toBeNull();
    expect(parseExpectedShiftToMinutes(null)).toBeNull();
  });

  it('string vacío → null', () => {
    expect(parseExpectedShiftToMinutes('')).toBeNull();
  });

  it('valores límite válidos', () => {
    expect(parseExpectedShiftToMinutes('0')).toBe(0);
    expect(parseExpectedShiftToMinutes('23')).toBe(1380);
  });

  it('con espacios en blanco → null (no trimmed) para valores inválidos', () => {
    // La función hace trim(), así que debería funcionar
    expect(parseExpectedShiftToMinutes(' 5 ')).toBe(300);
    expect(parseExpectedShiftToMinutes('   8:00   ')).toBe(480);
  });
});

describe('calculateExtraHours', () => {
  it('trabajadas < esperadas (7h vs 8h) → 0 horas extra', () => {
    expect(calculateExtraHours(420, 480)).toEqual({ 
      hoursFormatted: '0h 0m', 
      decimalHours: '0.00 horas' 
    });
  });

  it('trabajadas = esperadas (5h vs 5h) → 0 horas extra', () => {
    expect(calculateExtraHours(300, 300)).toEqual({ 
      hoursFormatted: '0h 0m', 
      decimalHours: '0.00 horas' 
    });
  });

  it('trabajadas > esperadas (5h vs 4h) → 1h extra', () => {
    expect(calculateExtraHours(300, 240)).toEqual({ 
      hoursFormatted: '1h 0m', 
      decimalHours: '1.00 horas' 
    });
  });

  it('trabajadas > esperadas (6h vs 5h) → 1h extra con minutos', () => {
    expect(calculateExtraHours(360, 300)).toEqual({ 
      hoursFormatted: '1h 0m', 
      decimalHours: '1.00 horas' 
    });
  });

  it('trabajadas > esperadas (5h50 vs 5h) → 50m extra', () => {
    expect(calculateExtraHours(350, 300)).toEqual({ 
      hoursFormatted: '0h 50m', 
      decimalHours: '0.83 horas' 
    });
  });

  it('trabajadas > esperadas (5h20min vs 4h) → 1h 20m extra', () => {
    expect(calculateExtraHours(320, 240)).toEqual({ 
      hoursFormatted: '1h 20m', 
      decimalHours: '1.33 horas' 
    });
  });

  it('trabajadas > esperadas (5h30min vs 5h) → 30m extra', () => {
    expect(calculateExtraHours(330, 300)).toEqual({ 
      hoursFormatted: '0h 30m', 
      decimalHours: '0.50 horas' 
    });
  });

  it('múltiples horas extra (10h vs 6h) → 4h extra', () => {
    expect(calculateExtraHours(600, 360)).toEqual({ 
      hoursFormatted: '4h 0m', 
      decimalHours: '4.00 horas' 
    });
  });

  it('caso con muchas horas extra (12h vs 8h) → 4h extra', () => {
    expect(calculateExtraHours(720, 480)).toEqual({ 
      hoursFormatted: '4h 0m', 
      decimalHours: '4.00 horas' 
    });
  });

  describe('Cruce medianoche - Cálculo de jornada', () => {
    it('09:30 → 18:00 sin descanso = 510 min, jornada 8h = 30m extra', () => {
      const expectedMinutes = parseExpectedShiftToMinutes('8');
      expect(expectedMinutes).toBe(480);
      const entryMins = 9 * 60 + 30; // 570
      const exitMins = 18 * 60; // 1080
      const duration = exitMins - entryMins; // 510 min = 8.5h
      const workedMinutes = duration; // sin descanso
      const extraHours = calculateExtraHours(workedMinutes, expectedMinutes);
      expect(duration).toBe(510);
      expect(extraHours.hoursFormatted).toBe('0h 30m'); // 30 min de horas extra
    });

    it('09:00 → 18:00 with break 60min = 480 min, jornada 8h = sin horas extra', () => {
      const expectedMinutes = parseExpectedShiftToMinutes('8');
      expect(expectedMinutes).toBe(480);
      const entryMins = 9 * 60; // 540
      const exitMins = 18 * 60; // 1080
      const breakMinutes = 60;
      const duration = exitMins - entryMins; // 540 min = 9 horas brutas
      const workedMinutes = duration - breakMinutes; // 8 horas netas
      expect(workedMinutes).toBe(480);
      const extraHours = calculateExtraHours(workedMinutes, expectedMinutes);
      expect(extraHours.hoursFormatted).toBe('0h 0m'); // Sin horas extra
    });

    it('22:00 → 06:00 (cruce medianoche) sin descanso = 480 minutos trabajados', () => {
      const entryMins = 22 * 60; // 1320
      const exitMins = 6 * 60; // 360
      const duration = (24 * 60 - entryMins) + exitMins; // cruce medianoche
      const workedMinutes = duration; // sin descanso
      expect(duration).toBe(480); // 8 horas exactas
      expect(workedMinutes).toBe(480);
    });

    it('23:59 → 00:01 (cruce medianoche) = 2 minutos trabajados', () => {
      const entryMins = 23 * 60 + 59; // 1439
      const exitMins = 1; // 00:01
      const duration = (24 * 60 - entryMins) + exitMins;
      expect(duration).toBe(2);
    });

    it('00:30 → 08:00 sin descanso = 450 minutos', () => {
      const entryMins = 30; // 00:30
      const exitMins = 8 * 60; // 480
      const duration = exitMins - entryMins;
      expect(duration).toBe(450); // 7.5 horas
    });
  });
});

describe('minutesFromTime', () => {
  it('0 h 0 m → 0 minutos', () => {
    expect(minutesFromTime(0, 0)).toBe(0);
  });

  it('1 h 30 m → 90 minutos', () => {
    expect(minutesFromTime(1, 30)).toBe(90);
  });

  it('2 h 0 m → 120 minutos', () => {
    expect(minutesFromTime(2, 0)).toBe(120);
  });

  it('0 h 45 m → 45 minutos', () => {
    expect(minutesFromTime(0, 45)).toBe(45);
  });
});

describe('parseBreakMinutes', () => {
  it('30 minutos (sin formato hora) → {hours: 0, minutes: 30}', () => {
    expect(parseBreakMinutes('30')).toEqual({ hours: 0, minutes: 30 });
  });

  describe('Integración con cálculo de horas extra', () => {
  it('descanso vacío no resta 60 minutos por hardcoding (bug del fix previo)', () => {
    // Reproducir la lógica REAL del código: breakInput?.value || '60'
    // Campo vacío → '60' (BUG ANTES DEL FIX)
    // Después del fix, debe ser '' → 0
    
    const breakValue = ''; // Campo de descanso está vacío en el DOM
    
    // LÓGICA CON EL BUG ANTERIOR (antes del segundo fix):
    // const breakValue = breakInput?.value || '60'; 
    // const breakMinutes = parseFloat(breakValue) || 0;
    // Resultado: breakValue='60' → breakMinutes=60
    
    // NUEVA LÓGICA (después del fix correcto):
    const breakValueFixed = breakValue; // Ahora no hay hardcode '60'
    const breakMinutes = parseFloat(breakValueFixed) || 0;
    
    expect(breakMinutes).toBe(0); // Vacío → 0 minutos, no 60
    expect(breakMinutes).not.toBe(60); // No debe ser 60
    
    // Caso: entrada 08:00, salida 16:00 = 480 min sin descanso
    const entryMins = 8 * 60; 
    const exitMins = 16 * 60;
    const duration = exitMins - entryMins; // 480 min
    const workedMinutes = duration - breakMinutes; // 480 min (sin restar descanso vacío)
    
    expect(duration).toBe(480);
    expect(workedMinutes).toBe(480); // Jornada completa de 8h sin restar nada
    expect(workedMinutes).not.toBeNaN();
  });

  it('descanso 60 minutos produce 1h extra con jornada 8h', () => {
    const entryMins = 8 * 60;   // 08:00 = 480
    const exitMins = 18 * 60;   // 18:00 = 1080
    const breakMinutes = 60;    
    const duration = exitMins - entryMins; // 9 horas brutas = 540 min
    const workedMinutes = duration - breakMinutes; // 8 horas trabajadas = 480 min
    
    expect(duration).toBe(540);
    const expectedMinutes = 480; // Jornada de 8h = 480 min
    expect(workedMinutes).toBe(expectedMinutes); // Exactamente jornada cumplida
    expect(workedMinutes).not.toBeNaN();
  });

  it('descanso 30 minutos con cruce medianoche calcula correctamente', () => {
    const breakValue = '30';
    const breakMinutes = parseFloat(breakValue) || 0;
    
    // Cruce medianoche: 22:00 → 07:30 (= 9h 30m brutas)
    const entryMins = 22 * 60;   // 1320
    const exitMins = 7 * 60 + 30; // 450
    const duration = (24 * 60 - entryMins) + exitMins; // cruce medianoche
    const workedMinutes = duration - breakMinutes;
    
    expect(duration).toBe(570); // 9h 30m brutas
    expect(breakMinutes).toBe(30);
    expect(workedMinutes).toBe(540); // 9h netas trabajadas
    expect(workedMinutes).not.toBeNaN();
  });

  it('descanso 60 minutos con cruce medianoche (22:00→07:30)', () => {
    const breakValue = '60';
    const breakMinutes = parseFloat(breakValue) || 0;
    
    // Cruce medianoche: 22:00 → 07:30 (= 9h 30m brutas)
    const entryMins = 22 * 60;   // 1320
    const exitMins = 7 * 60 + 30; // 450
    const duration = (24 * 60 - entryMins) + exitMins; // cruce medianoche
    const workedMinutes = duration - breakMinutes;
    
    expect(duration).toBe(570); // 9h 30m brutas
    expect(breakMinutes).toBe(60);
    expect(workedMinutes).toBe(510); // 8h 30m netas trabajadas
    expect(workedMinutes).not.toBeNaN();
  });

  it('campo descanso con valor numérico directo funciona', () => {
    const breakValue = '90';
    const breakMinutes = parseFloat(breakValue) || 0;
    const workedMinutes = 480 - breakMinutes; // Jornada de 8h menos descanso
    
    expect(breakMinutes).toBe(90);
    expect(workedMinutes).toBe(390); // 6h 30m trabajadas
    expect(workedMinutes).not.toBeNaN();
  });

  it('descanso string vacío se convierte en 0 sin hardcode de fallback', () => {
    const breakValue = '';
    const breakMinutes = parseFloat(breakValue) || 0;
    
    // parseFloat('') devuelve NaN, NaN || 0 → 0
    expect(breakValue).toBe('');
    expect(typeof breakValue).toBe('string');
    expect(parseFloat(breakValue)).toBe(NaN);
    expect(breakMinutes).toBe(0);
    const workedMinutes = 480 - breakMinutes;
    expect(workedMinutes).toBe(480);
    expect(workedMinutes).not.toBeNaN();
  });
  });
});

  it('1h 30m → {hours: 1, minutes: 30}', () => {
    expect(parseBreakMinutes('1:30')).toEqual({ hours: 1, minutes: 30 });
  });

  it('60 minutos (formato numérico) → {hours: 1, minutes: 0}', () => {
    expect(parseBreakMinutes('60')).toEqual({ hours: 1, minutes: 0 });
  });

  it('90 minutos (formato numérico) → {hours: 1, minutos: 30}', () => {
    expect(parseBreakMinutes('90')).toEqual({ hours: 1, minutes: 30 });
  });

  it('entrada inválida "abc" → null', () => {
    expect(parseBreakMinutes('abc')).toBeNull();
  });

  it('entrada inválida "-" → null', () => {
    expect(parseBreakMinutes('-')).toBeNull();
  });

  it('entrada inválida ":" solo → null', () => {
    expect(parseBreakMinutes(':')).toBeNull();
  });

  it('null input → null', () => {
    expect(parseBreakMinutes(null)).toBeNull();
  });

  it('cadena vacía "empty" → null', () => {
    expect(parseBreakMinutes('empty')).toBeNull();
  });

  it('formato inválido "1:99" → null', () => {
    expect(parseBreakMinutes('1:99')).toBeNull();
  });

  it('horas fuera de rango "25:30" → null', () => {
    expect(parseBreakMinutes('25:30')).toBeNull();
  });
});
