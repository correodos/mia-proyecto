import type { Hour } from '../../types/index';

export interface DateDiffResult {
  ok: true;
  days: number;
  hours: number;
  minutes: number;
  totalMinutes: number;
  totalHours: string;
}

export interface DateDiffError {
  ok: false;
  error: string;
}

export type DateDiffReturn = DateDiffResult | DateDiffError;

/**
 * Calcula la diferencia entre dos fechas con horas opcionales
 * @param dateFromStr - Fecha inicial en formato YYYY-MM-DD
 * @param timeFromStr - Hora inicial en formato HH:MM (opcional, default 00:00)
 * @param dateToStr - Fecha final en formato YYYY-MM-DD
 * @param timeToStr - Hora final en formato HH:MM (opcional, default 00:00)
 * @returns DateDiffResult con días, horas, minutos y total en horas decimales, o DateDiffError
 */
export function calculateDateDiff(
  dateFromStr: string,
  timeFromStr: string,
  dateToStr: string,
  timeToStr: string
): DateDiffReturn {
  try {
    if (!dateFromStr) {
      return { ok: false, error: 'Selecciona una fecha inicial.' };
    }

    if (!dateToStr) {
      return { ok: false, error: 'Selecciona una fecha final.' };
    }

    // Parsear horas
    const parseTime = (timeStr: string): Hour | null => {
      if (!timeStr || timeStr === '00:00') return { hours: 0, minutes: 0 };
      const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
      if (!match) return null;
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
      return { hours, minutes };
    };

    const fromTime = parseTime(timeFromStr);
    const toTime = parseTime(timeToStr);

    if (!fromTime || !toTime) {
      return { ok: false, error: 'Formato de hora inválido. Usa HH:MM con horas entre 00 y 23.' };
    }

    // Crear objetos Date
    const fromDate = new Date(`${dateFromStr}T${String(fromTime.hours).padStart(2, '0')}:${String(fromTime.minutes).padStart(2, '0')}`);
    const toDate = new Date(`${dateToStr}T${String(toTime.hours).padStart(2, '0')}:${String(toTime.minutes).padStart(2, '0')}`);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return { ok: false, error: 'Fechas fuera de rango válido.' };
    }

    // Validar cronología
    if (toDate.getTime() < fromDate.getTime()) {
      return { ok: false, error: 'La fecha/hora final no puede ser anterior a la inicial.' };
    }

    // Calcular diferencia en minutos totales
    const diffMs = toDate.getTime() - fromDate.getTime();
    const totalMinutes = Math.floor(diffMs / 1000 / 60);

    const days = Math.floor(totalMinutes / (24 * 60));
    const remainingAfterDays = totalMinutes % (24 * 60);
    const hours = Math.floor(remainingAfterDays / 60);
    const minutes = remainingAfterDays % 60;

    const totalHoursDecimal = (days * 24 + hours + minutes / 60).toFixed(2);

    return { ok: true, days, hours, minutes, totalMinutes, totalHours: totalHoursDecimal };
  } catch (error) {
    console.error('Error en cálculo entre fechas:', error);
    return { ok: false, error: 'Error en el cálculo' };
  }
}