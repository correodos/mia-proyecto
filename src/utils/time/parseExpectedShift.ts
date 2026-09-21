/**
 * Convierte el valor de "jornada prevista" del input a minutos.
 * Acepta formatos flexibles: "5", "6", "8:00", "9:30"
 * 
 * @param timeString - Valor del input (ej: "5", "6", "8:00", "9:30")
 * @returns Horas en minutos o null si inválido
 */
export function parseExpectedShiftToMinutes(timeString: string): number | null {
  if (!timeString || typeof timeString !== 'string') {
    return null;
  }

  const trimmed = timeString.trim();

  // Expresión regular para aceptar H o HH:MM (con ceros opcionales)
  // Acepta: "5", "05", "6", "06", "8:30", "8:00", "9:30", etc.
  // Rechaza: "8:60" (minutos >59), "25:00" (horas >23)
  
  const match = trimmed.match(/^([0-9]{1,2})(:\s*[0-9]{1,2})?$/);
  
  if (!match) {
    return null;
  }

  const hoursStr = match[1];
  const minutesPart = match[2]; // Puede ser ":30" o undefined (solo horas)

  // Validar que las horas sean números válidos (0-23)
  const hours = parseInt(hoursStr, 10);
  
  if (isNaN(hours) || hours < 0 || hours > 23) {
    return null;
  }

  // Si no hay minutos especificados (:MM), interpretar como XX horas completas
  if (!minutesPart || minutesPart === '') {
    // Era "8" o "5" o "12" - son horas completas
    return hours * 60;
  }

  // Hay :XX en el valor, validar formato HH:MM ó H:MM
  // El usuario puede escribir "8:30" => 480 + 30 = 510 minutos
  
  const minutesStrRaw = minutesPart.replace(':', '').trim(); // Eliminar ':' y espacios
  
  if (minutesStrRaw === '') {
    // Era algo como "8:" - inválido pero tratamos como horas sin minutos
    return hours * 60;
  }

  const minutes = parseInt(minutesStrRaw, 10);
  
  // Validar que los minutos estén en rango válido (0-59)
  if (isNaN(minutes) || minutes < 0 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

/**
 * Valida formato flexible de jornada prevista (H o HH:MM)
 * @param timeString - Valor del input (ej: "8", "8:30")
 * @returns Error message si inválido, null si válido
 */
export function validateExpectedShiftFormat(timeString: string): string | null {
  if (!timeString || typeof timeString !== 'string') {
    return 'Introduce una jornada en formato H o HH:MM (ej: 8\no 08:00).';
  }

  const trimmed = timeString.trim();

  // Aceptar H, HH, H:MM, HH:MM 
  if (!trimmed.match(/^(\d{1,2})(?::\d{1,2})?$/)) {
    return 'Formato inválido. Usa H (ej: 8)\no HH:MM (ej: 08:00).';
  }

  // Validar que las horas sean válidos (0-23)
  const hours = parseInt(trimmed.split(':')[0], 10);
  
  if (isNaN(hours) || hours > 23) {
    return 'Las horas deben estar entre 0 y 23.';
  }

  // Si hay minutos especificados (:MM), validar que sean válidos (0-59)
  if (trimmed.includes(':')) {
    const minutesPart = trimmed.split(':')[1] || '';
    const minutes = parseInt(minutesPart, 10);
    
    if (isNaN(minutes) || minutes > 59) {
      return 'Los minutos deben estar entre 0 y 59.';
    }
  }

  return null;
}
