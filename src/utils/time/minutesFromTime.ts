/**
 * Convierte { hours, minutes } a minutos desde 00:00 del mismo día
 * @param hour - Hora entre 0-23
 * @param minute - Minuto entre 0-59
 * @returns Minutos totales desde inicio de día
 */
export function minutesFromTime(hour: number, minute: number): number {
  return hour * 60 + minute;
}