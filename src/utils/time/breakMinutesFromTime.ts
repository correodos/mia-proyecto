/**
 * Convierte formato HH:MM a minutos desde 00:00
 * @param hours - Hora entre 0-23
 * @param minutes - Minuto entre 0-59
 * @returns Minutos totales
 */
export function breakMinutesFromTime(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

/**
 * Extrae valores numéricos desde string "HH:MM"
 * Devuelve null si formato inválido (sin dos puntos)
 * @param timeString - String "HH:MM" o solo números
 * @returns Objeto {hours, minutes} o null
 */
export function parseBreakMinutes(timeString: string | null): { hours: number; minutes: number } | null {
  if (!timeString || typeof timeString !== 'string') return null;

  const trimmed = timeString.trim();

  // Si hay dos puntos, tratar como "HH:MM"
  if (trimmed.includes(':')) {
    const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const [all, hoursStr, minutesStr] = match;
    if (isNaN(parseInt(hoursStr)) || isNaN(parseInt(minutesStr))) return null;
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    // Validar rangos
    if (hours < 0 || hours > 23) return null;
    if (minutes < 0 || minutes > 59) return null;
    return { hours, minutes };
  }

  // Sin dos puntos: intentamos interpretar como minutos puros o HH
  const num = parseInt(trimmed, 10);
  if (isNaN(num)) return null;

  // Si es menor que 60, asumimos que son minutos directos (para compatibilidad)
  // Si es mayor, dividimos por 60 para obtener horas completas y resto minutos
  if (num < 60) {
    return { hours: 0, minutes: num };
  }

  const hours = Math.floor(num / 60);
  const minutes = num % 60;
  return { hours, minutes };
}
