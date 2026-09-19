/**
 * Aplica descanso al tiempo trabajado de un tramo (solo jornada simple)
 * @param tramResult - Resultado del cálculo del tramo sin restar descanso
 * @param breakMinutes - Descanso en minutos a restar
 * @returns Ok con duración ajustada o error si descanso >= duración
 */
export function applyBreak(
  tramResult: { minutes: number },
  breakMinutes: number
):
  | { ok: true; minutes: number }
  | { ok: false; error: string } {

  // Descanso debe ser positivo para restar
  if (breakMinutes <= 0) {
    return { ok: true, minutes: tramResult.minutes };
  }

  // Descanso mayor o igual a duración -> error, NO mostrar resultado negativo
  if (breakMinutes >= tramResult.minutes) {
    return {
      ok: false,
      error: 'El descanso no puede ser igual o superior al tiempo trabajado.',
    };
  }

  // Válido: restar descanso del tiempo total
  const adjustedMinutes = tramResult.minutes - breakMinutes;

  return { ok: true, minutes: adjustedMinutes };
}