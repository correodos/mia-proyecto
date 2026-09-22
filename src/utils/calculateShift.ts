import type { Hour } from '../types/index';
import { parseTime } from './time/parseTime';
import { diffMinutes } from './time/diffMinutes';


/**
 * Calcula el tramo de un día individual en la calculadora semanal.
 * Esta función usa parseTime() y diffMinutes() existentes sin duplicar lógica.
 * 
 * @param entry - Hora entrada como string "HH:MM"
 * @param exit - Hora salida como string "HH:MM"
 * @param breakMinutes - Descanso en minutos (0-480)
 * @returns Resultado del día con dayName, minutes, decimal, formatted, error
 */
export interface DailyResult {
  dayName: string;           // Lunes, Martes, etc.
  minutes?: number;          // Minutos trabajados
  decimal?: string;          // Horas decimales "X.XX"
  formatted?: string;        // Formato "8h 30m"
  error?: string;            // Mensaje de error o null
}

/**
 * Calcula la duración diurna aplicando descanso si existe.
 */
export function calculateDailyShift(
  dayIndex: number,
  entryStr: string,
  exitStr: string,
  breakMinutes: number = 0
): DailyResult {
  
  // Caso: día vacío (sin introducir valores)
  if (!entryStr.trim() || !exitStr.trim()) {
    return {
      dayName: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][dayIndex],
      minutes: undefined,
      decimal: undefined,
      formatted: undefined,
      error: null
    };
  }

  // Parsear entrada y salida usando parseTime() existente
  const entryHour = parseTime(entryStr);
  const exitHour = parseTime(exitStr);

  // Caso: formato inválido (una de las dos entradas no se parseó)
  if (!entryHour || !exitHour) {
    return {
      dayName: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][dayIndex],
      minutes: 0,
      decimal: '0.00',
      formatted: '0 h 0 min',
      error: 'Formato de hora inválido'
    };
  }

  // Calcular duración base usando diffMinutes() existente - retorna {minutes, isNightShift} o null
  const durationResult = diffMinutes(entryHour, exitHour);

  // Caso: resultado nulo (diffMinutes devuelve null cuando salida < entrada sin cruce medianoche válido)
  if (!durationResult || durationResult.minutes === undefined) {
    return {
      dayName: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][dayIndex],
      minutes: 0,
      decimal: '0.00',
      formatted: '0 h 0 min',
      error: 'Cálculo de duración inválido'
    };
  }

  const workedMinutes = durationResult.minutes - breakMinutes;

  // Caso: descanso superior o igual a distancia trabajada
  if (workedMinutes <= 0) {
    return {
      dayName: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][dayIndex],
      minutes: workedMinutes,
      decimal: '0.00',
      formatted: workedMinutes === 0 ? '0 h 0 min' : null,
      error: workedMinutes < 0 
        ? 'Descanso superior al tiempo trabajado' 
        : workedMinutes === 0 ? '0 h 0 min' : null,
    };
  }

  // Formato inline simple: horas decimales con toFixed(2) y formato compacto "Xh Ym"
  const decimalValue = (workedMinutes / 60).toFixed(2);
  const hrsWorked = Math.floor(workedMinutes / 60);
  const fractionalMinsWorked = workedMinutes % 60;
  
  // Formato compacto "8h 30m" o "8h 0m" si no hay minutos extra
  const formattedCompact = `${hrsWorked}h ${fractionalMinsWorked === 0 ? '0' : (fractionalMinsWorked < 10 ? `0${fractionalMinsWorked}` : fractionalMinsWorked)}m`;
  
  return {
    dayName: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][dayIndex],
    minutes: workedMinutes,
    decimal: decimalValue,
    formatted: formattedCompact,
    error: null
  };
}
