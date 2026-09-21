/**
 * Calculadora de tiempo entre fechas - Independiente (no conecta con otras calculadoras)
 * MVP v1.0  
 * 
 * Formatos soportados: dd/mm/yyyy o dd-mm-yyyy para input, HH:MM o H:M para horas
 */

import type { Hour } from '../types/index';
import { diffDateTimeMinutes } from '../utils/time/dateDiffMinutes';

/**
 * Cálculo principal de tiempo entre dos fechas con formato español dd/mm/yyyy
 */
export const calculateBetweenDates = (fromRawDate: string, toRawDate: string, 
    fromTime?: string, toTime?: string): 
    | { ok: true; days: number; hours: number; minutes: number; totalHours: string } 
    | { ok: false; error: string } => {
    
    try {
        // Validar fechas básicas
        if (!fromRawDate || !toRawDate) {
            throw new Error('Introduce las fechas inicial y final.');
        }

        // Convertir fechas desde formato dd/mm/yyyy a yyyy-mm-dd ISO
        const dateFromISO = parseDateESToISO(fromRawDate);
        const dateToISO = parseDateESToISO(toRawDate);

        if (!dateFromISO || !dateToISO) {
            throw new Error('Formato de fecha inválido. Usa dd/mm/yyyy o dd-mm-yyyy.');
        }

        // Combinar con hora si existe (sin formato, solo valores limpios)
        const fromTimeValue = fromTime?.trim() || '';
        const toTimeValue = toTime?.trim() || '';

        if (fromTimeValue) {
            // Validar y limpiar hora inicial
            const fromMatch = fromTimeValue.match(/^(\d{1,2}):?(\d{1,2})$/);
            if (!fromMatch) {
                throw new Error('Formato de hora inicial inválido. Usa HH:MM.');
            }
            
            // Si es solo "9" convierte a 09 para concatenar correctamente
            const [, hStr, minStr] = fromMatch;
            const hourNum = parseInt(hStr);
            const minNum = parseInt(minStr) || 0;

        if (toTimeValue) {
            // Mismo validador para hora final
            const toMatch = toTimeValue.match(/^(\d{1,2}):?(\d{1,2})$/);
            if (!toMatch) {
                throw new Error('Formato de hora final inválido. Usa HH:MM.');
            }

} else { // Sin horas especificadas
        const fromDate = new Date(dateFromISO + 'T00:00');
        const toDate = new Date(dateToISO + 'T00:00');

        if (isNaN(fromDate.getTime())) {
            throw new Error('Fecha inicial inválida. Revisa el formato dd/mm/yyyy.');
        }

        if (isNaN(toDate.getTime())) {
            throw new Error('Fecha final inválida. Usa dd/mm/yyyy al escribir.');
        }

        // Validar fecha final no anterior a inicial
        const fromTimestamp = fromDate.getTime();
        const toTimestamp = toDate.getTime();

        if (toTimestamp < fromTimestamp) {
            throw new Error('La fecha/hora final no puede ser anterior a la inicial');
        }

        const totalMinutes = Math.floor((toTimestamp - fromTimestamp) / 60000);
        const days = Math.floor(totalMinutes / (24 * 60));
        const remainingMinutes = totalMinutes % (24 * 60);
        const hours = Math.floor(remainingMinutes / 60);
        const minutesLeft = remainingMinutes % 60;

        return {
            ok: true,
            minutes: totalMinutes,
            days,
            hours,
            minutesLeft
        };
    } catch (error) {
        console.error('Error en calculateBetweenDates:', error);
        return {
            ok: false,
            error: error instanceof Error ? error.message : 'Error en el cálculo'
        };
    }
};

/**
 * Vincular eventos de botones para la calculadora entre fechas
 */
export const attachButtonEventsForBetweenDates = () => {
    const calculateBtns = Array.from(document.querySelectorAll('[data-event-calculate-fdates="true"]'));
    
    if (calculateBtns.length > 0) {
        calculateBtns.forEach(buttonElement => {
            /* @ts-ignore */
            buttonElement.onclick = null;

            buttonElement.addEventListener('click', () => {
                const dateFromInput = document.getElementById('date-from') as HTMLInputElement | null;
                const timeFromInput = document.getElementById('time-from') as HTMLInputElement | null;
                const dateToInput = document.getElementById('date-to') as HTMLInputElement | null;
                const timeToInput = document.getElementById('time-to') as HTMLInputElement | null;
                const resultArea = document.querySelector('.between-dates-results-area') as HTMLElement | null;

                if (!resultArea) {
                    console.error('Elemento de resultados no encontrado');
                    return;
                }

                // Obtener valores crudos del DOM
                const rawFromInputStr = dateFromInput?.value || '';
                const rawTimeFromStr = timeFromInput?.value || '';
                const rawToInputStr = dateToInput?.value || '';
                const rawTimeToStr = timeToInput?.value || '';

                /* Eliminar colon de la hora si está puesta */
                const fromRawStr = rawFromInputStr || '';
                const toRawStr = rawToInputStr || '';
                
                // Validar que haya al menos una fecha llena
                if (!fromRawStr && !rawTimeFromStr) {
                    showErrorBetweenDates(resultArea, 'Introduce una fecha inicial (con o sin hora).');
                    return;
                }
                if (!toRawStr && !rawTimeToStr) {
                    showErrorBetweenDates(resultArea, 'Introduce una fecha final (con o sin hora).');
                    return;
                }

                // Validar formato de hora si existe
                if (rawTimeFromStr) {
                    const fromMatch = rawTimeFromStr.match(/^(\d{1,2})[/:]([0-5][0-9])(?::([0-5][0-9]))?$/);
                    if (!fromMatch) {
                        showErrorBetweenDates(resultArea, 'Formato de hora inicial inválido. Usa HH:MM.');
                        return;
                    }
                }

                if (rawTimeToStr) {
                    const toMatch = rawTimeToStr.match(/^(\d{1,2})[/:]([0-5][0-9])(?::([0-5][0-9]))?$/);
                    if (!toMatch) {
                        showErrorBetweenDates(resultArea, 'Formato de hora final inválido. Usa HH:MM.');
                        return;
                    }
                }

                // Validar que sean números dentro de los rangos
                try {
                  const fromDateTimestamp = new Date(`${fromRawStr}T00:00`).getTime();
                  const toDateTimestamp = new Date(`${toRawStr}T00:00`).getTime();

                  if (isNaN(fromDateTimestamp) || isNaN(toDateTimestamp)) {
                    showErrorBetweenDates(resultArea, 'Formato de fecha inválido. Revisa el número.');
                    return;
                  }
                } catch (e) { /* Ignoramos error de parsar */ }

                // Obtener timestamps usando función existente ya ajustada
                const fromISO = parseDateESToISO(fromRawStr);
                const toISO = parseDateESToISO(toRawStr);
                
                if (!fromISO || !toISO) {
                  showErrorBetweenDates(resultArea, 'Error al convertir las fechas. Revisa el formato dd/mm/yyyy.');
                  return;
                }

                // Validar que fechas sean válidas dentro de rangos aceptables de Date.js
                const fromDate = new Date(fromISO + 'T00:00');
                const toDate = new Date(toISO + 'T00:00');

                if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
                  showErrorBetweenDates(resultArea, 'Fechas fuera de rango válido. Usa fechas entre 1980 y 2080.');
                  return;
                }

                // Validar cronología antes de llamar a diffDateTimeMinutes
                if (fromDate.getTime() > toDate.getTime()) {
                  showErrorBetweenDates(resultArea, 'La fecha final no puede ser anterior a la inicial');
                  return;
                }

                const calcResult = diffDateTimeMinutes(fromISO + 'T00:00', toISO + 'T00:00');
                
                if (calcResult.ok) {
                    const totalHoursDecimal = (calcResult.days * 24 + calcResult.hours + 
                          calcResult.minutes / 60).toFixed(2);
                    displayBetweenDatesResults(resultArea, calcResult.days, calcResult.hours, 
                            calcResult.minutes, totalHoursDecimal);
                } else {
                    showErrorBetweenDates(resultArea, calcResult.error || 'Error en el cálculo');
                }

            });
        });
    }

    const resetBtns = document.querySelectorAll('[data-event-reset-fdates="true"]');
    
    if (resetBtns.length > 0) {
        Array.from(resetBtns).forEach(btn => {
            btn.addEventListener('click', () => {
                resetBetweenDatesCalculator();
            });
        });
    }
};

/**
 * Convierte fecha dd/mm/yyyy o dd-mm-yyyy a yyyy-mm-dd ISO 8601
 */
export const parseDateESToISO = (rawDate: string): string => {
    if (!rawDate) return '';
    
    // Extraer partes del formato dd/mm/yyyy o dd-mm-yyyy
    let parts: string[];
    try {
        parts = rawDate.split(/[\/-]/);
    } catch (e) {
      return '';
    }

    if (parts.length !== 3) {
        return '';
    }

    // Asegurar que todos sean números y llenar con ceros
    const dayStr = parts[0].trim().replace(/[^0-9]/g, '');
    const monthStr = parts[1].trim().replace(/[^0-9]/g, '');
    const yearStr = parts[2].trim().replace(/[^0-9]/g, '');

    // Validar rangos básicos antes de convertir
    const dayNum = parseInt(dayStr, 10);
    const monthNum = parseInt(monthStr, 10);
    const yearNum = parseInt(yearStr, 10);

    if (dayNum === 0 || monthNum === 0 || isNaN(yearNum) || isNaN(dayNum) || isNaN(monthNum)) {
        return '';
    }

    // Validar días por mes (incluyendo años bisiestos)
    const maxDaysInMonth = new Date(yearNum, monthNum, 0).getDate();
    
    if (dayNum > maxDaysInMonth) {
        return '';
    }

    // Formatear con ceros a la izquierda
    const paddedDay = String(dayNum).padStart(2, '0');
    const paddedMonth = String(monthNum).padStart(2, '0');
    
    return `${yearStr}-${paddedMonth}-${paddedDay}`;
};
