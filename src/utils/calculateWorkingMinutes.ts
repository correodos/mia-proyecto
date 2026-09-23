import { parseTime } from './time/parseTime';
import { diffMinutes } from './time/diffMinutes';
import { applyBreak } from './time/applyBreak';

/**
 * Motor de cálculo compartido: parsea → valida → difiere → aplica descanso.
 * Esta es la única función que debería usarse para calcular minutos trabajados.
 *
 * @param entryStr    - Hora de entrada "HH:MM"
 * @param exitStr     - Hora de salida  "HH:MM"
 * @param breakMinutes - Descanso en minutos (opcional, default 0)
 */
export function calculateWorkingMinutes(
  entryStr: string,
  exitStr: string,
  breakMinutes: number = 0
): { ok: true; minutes: number; isNightShift: boolean } | { ok: false; error: string } {
  if (!entryStr?.trim() || !exitStr?.trim()) {
    return { ok: false, error: 'Introduce una hora de entrada y una hora de salida.' };
  }

  const entry = parseTime(entryStr);
  const exit  = parseTime(exitStr);

  if (!entry) return { ok: false, error: 'Formato de hora de entrada inválido.' };
  if (!exit)  return { ok: false, error: 'Formato de hora de salida inválido.' };

  const shift = diffMinutes(entry, exit);
  if (!shift) return { ok: false, error: 'No se pudo calcular la duración del turno.' };

  const breakResult = applyBreak(shift, breakMinutes);
  if (!breakResult.ok) return { ok: false, error: breakResult.error };

  return { ok: true, minutes: breakResult.minutes, isNightShift: shift.isNightShift };
}
