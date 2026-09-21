import { formatTotalMinutes } from './formatResult';

/**
 * Calcula horas extra: tiempo trabajado - jornada prevista (máximo 0)
 * @param workedMinutes - Tiempo trabajado en minutos (enteros)
 * @param expectedMinutes - Jornada prevista
 * @returns Horas extra en formato humano y decimal
 */
export function calculateExtraHours(
  workedMinutes: number,
  expectedMinutes: number
): { hoursFormatted: string; decimalHours: string } {
  // Si jornada prevista es mayor, no hay horas extra
  if (workedMinutes <= expectedMinutes) {
    return formatTotalMinutes(0);
  }

  const extraMinutes = workedMinutes - expectedMinutes;
  return formatTotalMinutes(extraMinutes);
}
