/**
 * Parsea string "HH:MM" a objeto Hour con validación de formato y rango
 * @param timeString - String en formato HH:MM
 * @returns Object { hours, minutes } o null si invalido
 */
export function parseTime(timeString: string): Hour | null {
  if (!timeString || typeof timeString !== 'string') return null;

  const match = timeString.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const [all, hoursStr, minutesStr] = match;

  // Validar números
  if (isNaN(parseInt(hoursStr)) || isNaN(parseInt(minutesStr))) return null;

  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Validar rangos
  if (hours < 0 || hours > 23) return null;
  if (minutes < 0 || minutes > 59) return null;

  return { hours, minutes };
}