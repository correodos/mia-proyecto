/**
 * Formatea entrada de hora en inputs HH:MM - Extraído de DailyEntry.astro
 * Responsabilidad exclusiva: formatear input sin validar horas aún.
 * 
 * Comportamiento (exacto de DailyEntry.astro):
 * - Extrae solo dígitos del valor actual
 * - Limita a 4 dígitos máximos
 * - Añade ':' después de los dos primeros dígitos cuando hay > 2 dígitos
 * 
 * Ejemplos (formato correcto):
 * '0700' → '07:00'
 * '0730' → '07:30'
 * '07:00' → '07:00'
 * '0000' → '00:00'
 * '2359' → '23:59'
 */

/**
 * Ejecuta auto-formato en un input de hora
 * @param event - Evento DOM que disparó el listener
 */
export function formatInputElement(event: Event): void {
  const input = event.target;
  if (input instanceof HTMLInputElement) {
    input.value = formatTimeToHHMM(input.value);
  }
}

/**
 * Aplica formato de tiempo a valor string
 * 
 * Lógica real extraída de DailyEntry.astro (líneas 368-378):
 * - Extrae solo dígitos: replace(/\D/g, '').slice(0, 4)
 * - Añade ':' si hay MÁS de 2 dígitos
 * - Si ≤ 2 dígitos, mantiene sin separador para permitir borrar con retroceso
 */
export function formatTimeToHHMM(value: string): string {
  // Extraer solo dígitos, limitar a 4 caracteres máximo (input maxlength="5" permite 1 char extra)
  const digits = value.replace(/\D/g, '').slice(0, 4);
  
  // Añadir ':' únicamente cuando hay MÁS de 2 dígitos
  // Esto permite borrar con retroceso sin que el ':' reaparezca prematuramente
  if (digits.length > 2) {
    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  } else {
    return digits;
  }
}
