import type { Hour } from '../../types/index';
import { minutesFromTime } from './minutesFromTime';

export interface ShiftResult {
  minutes: number;
  isNightShift: boolean;
}

/**
 * Calcula duración entre entrada y salida de un tramo
 * @param entry - Hora entrada { hours, minutes }
 * @param exit  - Hora salida  { hours, minutes }
 * @returns ShiftResult con duración o null si inválido
 */
export function diffMinutes(entry: Hour, exit: Hour): ShiftResult | null {
  const entryMinutes = minutesFromTime(entry.hours, entry.minutes);
  const exitMinutes  = minutesFromTime(exit.hours,  exit.minutes);

  // Salida anterior a entrada → cruce de medianoche
  if (exitMinutes < entryMinutes) {
    return {
      minutes: (24 * 60 - entryMinutes) + exitMinutes,
      isNightShift: true,
    };
  }

  // Mismo día (incluye salida == entrada → 0 minutos)
  return {
    minutes: exitMinutes - entryMinutes,
    isNightShift: false,
  };
}
