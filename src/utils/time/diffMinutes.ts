import type { Hour } from '../../types/index';
import { minutesFromTime } from './minutesFromTime';

export interface ShiftResult {
  minutes: number;
  isNightShift: boolean;
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

  // Salida posterior o igual a entrada -> mismo día
  const duration = exitMinutes - entryMinutes;

  // Caso: salida=entrada -> 0 minutos (no 24 horas)
  if (duration === 0) {
    return { minutes: 0, isNightShift: false };
  }

  // Salida antes que entrada en mismo día -> error (ej. 14:00 -> 09:00)
  if (duration < 0) {
    return null;
  }

  return { minutes: duration, isNightShift: false };
}