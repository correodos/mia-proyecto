/**
 * Formatea minutos totales a string humano y decimales
 * @param totalMinutes - Duración acumulada en minutos (enteros)
 * @returns Object con formato "X h Y min" y horas decimales
 */
export function formatTotalMinutes(totalMinutes: number): {
  hours: string;       // Ej: "8 h 30 min", "0 h 0 min"
  decimalHours: string; // Ej: "8.50 horas", "0.00 horas"
} {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Formato: "X h Y min" (siempre mostrar ambas unidades)
  const formattedHours = `${hours} h ${minutes} min`;

  // Horas decimales: minutos totales / 60, 2 decimales para visualización
  const decimalValue = totalMinutes / 60;
  const formattedDecimal = `${decimalValue.toFixed(2)} horas`;

  return {
    hours: formattedHours,
    decimalHours: formattedDecimal,
  };
}