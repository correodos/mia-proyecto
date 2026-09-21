/**
 * Formatea minutos totales a string humano y decimales
 * @param totalMinutes - Duración acumulada en minutos (enteros)
 * @returns Object con formato "X h Y min" y horas decimales
 */
export function formatTotalMinutes(totalMinutes: number): {
  hoursFormatted: string;       // Ej: "8h 30m", "0h 0m" (formato compacto)
  decimalHours: string;         // Ej: "8.50 horas", "0.00 horas"
} {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Formato: "Xh Ym" (compacto, sin espacios extra)
  const formattedHours = `${hours}h ${minutes}m`;

  // Horas decimales: minutos totales / 60, 2 decimales para visualización
  const decimalValue = totalMinutes / 60;
  const formattedDecimal = `${decimalValue.toFixed(2)} horas`;

  return {
    hoursFormatted: formattedHours,
    decimalHours: formattedDecimal,
  };
}
