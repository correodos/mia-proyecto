import type { ValidationResult, ValidationError, DailyEntry, Shift } from '../../types/index';
import { parseTime } from '../time/parseTime';

/**
 * Valida relaciones entre horarios y descanso (validación estructural)
 * Esta función recibe datos YA conversidos a tipos Hour/Shift
 */
export function validateDailyEntry(data: DailyEntry): ValidationResult {
  const errors: ValidationError[] = [];

  // Validar entrada primero si existe
  if (data.shifts.length > 0 && data.shifts[0].entry.hours < 0) {
    errors.push({ field: 'entry', message: 'Horario de entrada inválido.' });
  } else if (data.shifts.length > 0 && data.shifts[0].exit.hours < 0 || 
                         data.shifts.length > 0 && data.shifts[0].exit.minutes < 0) {

    errors.push({ field: 'entry', message: 'Horario de salida inválido.' });
  }

  // Si hay descanso, validar contra duración total del tramo
  if (data.breakMinutes !== null && data.breakMinutes!== undefined && data.shifts.length === 1) {
    // Calcular duración del primer tramo (simple para MVP)
    const entryMinutes = data.shifts[0].entry.hours * 60 + data.shifts[0].entry.minutes;
    const exitMinutes = data.shifts[0].exit.hours * 60 + data.shifts[0].exit.minutes;
    
    let duration: number | null = null;

    if (exitMinutes >= entryMinutes) {
      duration = exitMinutes - entryMinutes;
    } else if (exitMinutes < entryMinutes) {
      // Cruce medianoche válido
      duration = (24 * 60 - entryMinutes) + exitMinutes;
    }

    // Si hay duración y descanso >= duración total -> error
    if (duration !== null && data.breakMinutes! >= duration) {
      errors.push({ field: 'break', message: 'El descanso no puede ser igual o superior al tiempo trabajado.' });
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return { isValid: true };
}