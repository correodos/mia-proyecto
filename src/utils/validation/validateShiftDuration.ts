/**
 * Valida formato HH:MM básico (sin restricción de rango horario)
 * @param timeString - String en formato HH:MM
 * @returns Error message si inválido, null si válido
 */
export function validateTimeFormat(timeString: string): string | null {
  if (!timeString || typeof timeString !== 'string') {
    return 'Introduce una hora en formato HH:MM.';
  }

  const trimmed = timeString.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  
  if (!match) {
    return 'Formato inválido. Usa formato HH:MM (ej: 08:30).';
  }

  const [, hoursStr, minutesStr] = match;

  // Validar que sean números
  if (isNaN(parseInt(hoursStr)) || isNaN(parseInt(minutesStr))) {
    return 'Las horas y minutos deben ser números.';
  }

  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Validar rango (0-23 para horas, 0-59 para minutos)
  if (hours < 0 || hours > 23) {
    return 'Las horas deben estar entre 00 y 23.';
  }

  if (minutes < 0 || minutes > 59) {
    return 'Los minutos deben estar entre 00 y 59.';
  }

  return null;
}

/**
 * Valida jornada prevista (HH:MM válido, valores no negativos)
 */
export function validateExpectedShift(timeString: string): string | null {
  const error = validateTimeFormat(timeString);
  if (error) return error;

  // Jornada prevista debe ser valor razonable (no negativo implícito por parseTime)
  return null;
}

/**
 * Valida descanso (HH:MM válido, valores no negativos)
 */
export function validateBreak(timeString: string): string | null {
  const error = validateTimeFormat(timeString);
  if (error) return error;

  // Restringir a máximo 12 horas de descanso continuo
  const match = timeString.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return 'El descanso debe tener formato HH:MM.';
  }

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const totalMinutes = hours * 60 + minutes;

  if (totalMinutes > 720) { // 12 horas máximo de descanso
    return 'El descanso no puede superar las 12 horas.';
  }

  return null;
}
