/**
* Extrae valores numéricos desde string "HH:MM"
* @param timeString - Hora "HH:MM", minutos puros, o null
* @returns {hours, minutes} | null si inválido
*/
export function parseBreakMinutes(timeString: string | null): { hours: number; minutes: number } | null {
  if (!timeString || typeof timeString !== 'string') return null;

  const trimmed = timeString.trim();

  if (trimmed.includes(':')) {
    const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const [all, hoursStr, minutesStr] = match;
    if (isNaN(parseInt(hoursStr)) || isNaN(parseInt(minutesStr))) return null;
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (hours < 0 || hours > 23) return null;
    if (minutes < 0 || minutes > 59) return null;
    return { hours, minutes };
  }

  const num = parseInt(trimmed, 10);
  if (isNaN(num)) return null;

  if (num < 60) {
    return { hours: 0, minutes: num };
  }

  const hours = Math.floor(num / 60);
  const minutes = num % 60;
  return { hours, minutes };
}
