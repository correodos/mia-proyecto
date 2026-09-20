export interface Hour {
  hours: number;
  minutes: number;
}

export interface ShiftResult {
  minutes: number;
  isNightShift?: boolean;
}

/**
 * Parsea string "HH:MM" a objeto con horas y minutos
 * @param timeString - String en formato HH:MM
 * @returns Object { hours, minutes } o null si invalido
 */
export function parseTime(timeString: string): Hour | null {
  if (!timeString || typeof timeString !== 'string') return null;

  const match = timeString.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  if (hours < 0 || hours > 23) return null;
  if (minutes < 0 || minutes > 59) return null;

  return { hours, minutes };
}

/**
 * Convierte horas y minutos a minutos totales desde medianoche
 */
export function minutesFromTime(hour: number, minute: number): number {
  return hour * 60 + minute;
}

/**
 * Calcula duración entre entrada y salida de un tramo
 * @param entry - Hora entrada { hours, minutes }
 * @param exit - Hora salida { hours, minutes }
 * @returns ShiftResult con duracion o null si inválido
 */
export function diffMinutes(entry: Hour, exit: Hour): ShiftResult | null {
  const entryMinutes = minutesFromTime(entry.hours, entry.minutes);
  const exitMinutes = minutesFromTime(exit.hours, exit.minutes);

  // Salida anterior a entrada -> puede ser cruce medianoche o error
  if (exitMinutes < entryMinutes) {
    // Cruce medianoche válido: salida al día siguiente
    return {
      minutes: (24 * 60 - entryMinutes) + exitMinutes,
      isNightShift: true,
    };
  }

  const duration = exitMinutes - entryMinutes;

  // Caso: entrada=salida -> 0 minutos (no 24 horas)
  if (duration === 0) {
    return { minutes: 0, isNightShift: false };
  }

  // Salida antes que entrada en mismo día -> error (ej. 14:00 -> 09:00)
  if (duration < 0) {
    return null;
  }

  return { minutes: duration, isNightShift: false };
}

/**
 * Aplica descanso al tiempo trabajado de un tramo
 * @param tramResult - Resultado del cálculo del tramo sin restar descanso
 * @param breakMinutes - Descanso en minutos a restar
 * @returns Ok con duración ajustada o error si descanso >= duración
 */
export function applyBreak(
  tramResult: { minutes: number },
  breakMinutes: number
): { ok: true; minutes: number } | { ok: false; error: string } {
  // Resto no positivo -> no resta nada
  if (breakMinutes <= 0) {
    return { ok: true, minutes: tramResult.minutes };
  }

  // Descanso mayor o igual a duración -> error
  if (breakMinutes >= tramResult.minutes) {
    return {
      ok: false,
      error: 'El descanso no puede ser igual o superior al tiempo trabajado.',
    };
  }

  const adjustedMinutes = tramResult.minutes - breakMinutes;

  return { ok: true, minutes: adjustedMinutes };
}

/**
 * Formatea minutos totales a string humano y decimales
 */
export function formatTotalMinutes(totalMinutes: number): {
  hours: string;
  decimalHours: string;
} {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedHours = `${hours} h ${minutes} min`;
  const decimalValue = totalMinutes / 60;
  const formattedDecimal = `${decimalValue.toFixed(2)} horas`;
  return {
    hours: formattedHours,
    decimalHours: formattedDecimal,
  };
}

/**
 * Calcula horas trabajando desde entrada y salida
 * @param entry - Hora de entrada HH:MM
 * @param exit - Hora de salida HH:MM
 * @param breakMinutes - Descanso en minutos (opcional)
 * @returns Ok con minutos trabajados o error
 */
export function calculateWorkingHours(entry: string, exit: string, breakMinutes: number = 0): { ok: true; minutes: number } | { ok: false; error: string } {
  const entryTime = parseTime(entry);
  const exitTime = parseTime(exit);
  
  if (!entryTime || !exitTime) {
    return { ok: false, error: 'Formato de hora inválido' };
  }
  
  const durationResult = diffMinutes(entryTime, exitTime);
  if (!durationResult) {
    return { ok: false, error: 'Cálculo inválido' };
  }
  
  const breakResult = applyBreak({ minutes: durationResult.minutes }, breakMinutes);
  if (!breakResult.ok) {
    return { ok: false, error: breakResult.error };
  }
  
  return { ok: true, minutes: breakResult.minutes };
}
