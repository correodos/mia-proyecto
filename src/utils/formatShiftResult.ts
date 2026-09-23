/**
 * Formateador compartido: convierte minutos netos al objeto que pintan todas las calculadoras.
 */
export interface FormattedShiftResult {
  hours: number;
  minutesLeft: number;
  totalMinutes: number;
  decimal: string;     // "8.50"
  formatted: string;   // "8h 30m"
}

export function formatShiftResult(totalMinutes: number): FormattedShiftResult {
  const hours       = Math.floor(totalMinutes / 60);
  const minutesLeft = totalMinutes % 60;
  const decimal     = (totalMinutes / 60).toFixed(2);
  const formatted   = `${hours}h ${String(minutesLeft).padStart(2, '0')}m`;

  return { hours, minutesLeft, totalMinutes, decimal, formatted };
}
