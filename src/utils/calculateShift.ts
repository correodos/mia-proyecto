/**
 * Adaptador para la calculadora semanal.
 * Delega en calculateWorkingMinutes (motor compartido) y formatShiftResult.
 */

import { calculateWorkingMinutes } from './calculateWorkingMinutes';
import { formatShiftResult } from './formatShiftResult';

const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export interface DailyResult {
  dayName: string;
  minutes?: number;
  decimal?: string;
  formatted?: string;
  error?: string;
}

export function calculateDailyShift(
  dayIndex: number,
  entryStr: string,
  exitStr: string,
  breakMinutes: number = 0
): DailyResult {
  const dayName = DAY_NAMES[dayIndex] ?? `Día ${dayIndex + 1}`;

  // Día vacío → retornar sin error ni resultado
  if (!entryStr?.trim() || !exitStr?.trim()) {
    return { dayName };
  }

  const result = calculateWorkingMinutes(entryStr, exitStr, breakMinutes);

  if (!result.ok) {
    return { dayName, error: result.error };
  }

  const fmt = formatShiftResult(result.minutes);
  return {
    dayName,
    minutes:   fmt.totalMinutes,
    decimal:   fmt.decimal,
    formatted: fmt.formatted,
  };
}
