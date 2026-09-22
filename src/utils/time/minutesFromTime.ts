/**
 * Convierte { hours, minutes } a minutos desde 00:00 del mismo día
 * @param hours - Hora entre 0-23
 * @param minutes - Minuto entre 0-59
 * @returns Minutos totales desde inicio de día
 */
export function minutesFromTime(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}