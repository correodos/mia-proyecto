/**
 * Calculadora de horas extra
 */

import { calculateWorkingHours } from './calculator';

/**
 * Convierte el valor de "jornada prevista" del input a minutos.
 * Acepta formatos flexibles: "5", "6", "8:00", "9:30"
 * @param timeString - Valor del input (ej: "5", "6", "8:00", "9:30")
 * @returns Horas en minutos o null si inválido
 */
export function parseExpectedShiftToMinutes(timeString: string): number | null {
  if (!timeString || typeof timeString !== 'string') {
    return null;
  }

  const trimmed = timeString.trim();

  const match = trimmed.match(/^([0-9]{1,2})(:\s*[0-9]{1,2})?$/);
  
  if (!match) {
    return null;
  }

  const hoursStr = match[1];
  const minutesPart = match[2];

  const hours = parseInt(hoursStr, 10);
  
  if (isNaN(hours) || hours < 0 || hours > 23) {
    return null;
  }

  if (!minutesPart || minutesPart === '') {
    return hours * 60;
  }

  const minutesStrRaw = minutesPart.replace(':', '').trim();
  
  if (minutesStrRaw === '') {
    return hours * 60;
  }

  const minutes = parseInt(minutesStrRaw, 10);
  
  if (isNaN(minutes) || minutes < 0 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

/**
 * Calcula horas extra: tiempo trabajado - jornada prevista (máximo 0)
 * @param workedMinutes - Tiempo trabajado en minutos (enteros)
 * @param expectedMinutes - Jornada prevista
 * @returns Horas extra en formato humano y decimal
 */
export function calculateExtraHours(
  workedMinutes: number,
  expectedMinutes: number
): { hoursFormatted: string; decimalHours: string } {
  if (workedMinutes <= expectedMinutes) {
    return { hoursFormatted: '0h 0m', decimalHours: '0.00 horas' };
  }

  const extraMinutes = workedMinutes - expectedMinutes;
  
  const hours = Math.floor(extraMinutes / 60);
  const minutes = extraMinutes % 60;
  const formattedDecimal = `${(extraMinutes / 60).toFixed(2)} horas`;

  return {
    hoursFormatted: `${hours}h ${minutes}m`,
    decimalHours: formattedDecimal,
  };
}

/**
 * Convierte formato HH:MM a minutos desde 00:00
 */
export function breakMinutesFromTime(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

/**
 * Extrae valores numéricos desde string "HH:MM"
 */
export function parseBreakMinutes(timeString: string | null): { hours: number; minutes: number } | null {
  if (!timeString || typeof timeString !== 'string') return null;

  const trimmed = timeString.trim();

  if (trimmed.includes(':')) {
    const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const [all, hoursStr, minutesStr] = match;
    if (isNaN(parseInt(hoursStr)) || isNaN(parseInt(minutesStr))) return null;
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (hours < 0 || hours > 23) return null;
    if (minutes < 0 || minutes > 59) return null;
    return { hours, minutes };
  }

  const num = parseInt(trimmed, 10);
  if (isNaN(num)) return null;

  if (num < 60) {
    return { hours: 0, minutes: num };
  }

  const hours = Math.floor(num / 60);
  const minutes = num % 60;
  return { hours, minutes };
}

/**
 * Vincula eventos para la calculadora de horas extra
 */
export const attachHorasExtraCalculatorEvents = () => {
  /**
   * Muestra errores en el área de resultados
   */
  const showErrorInResults = (resultArea: HTMLElement | null, message: string) => {
    if (!resultArea) return;
    
    resultArea.textContent = '';
    resultArea.style.color = '#ef4444';
    resultArea.innerHTML = `<p style="color: #ef4444;">${message}</p>`;
  };

  /**
   * Vincula eventos del botón calcular para horas extra
   */
  const calculateBtns = Array.from(document.querySelectorAll('[data-event-calculate-hours-extra="true"]')) as HTMLButtonElement[];
  
  if (calculateBtns.length > 0) {
    calculateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          console.log('[HORAS EXTRA] Click detectado en botón Calcular');
          
          const entryInput = document.getElementById('entry-time') as HTMLInputElement | null;
          const exitInput = document.getElementById('exit-time') as HTMLInputElement | null;
          const breakInput = document.getElementById('break-time') as HTMLInputElement | null;
          const expectedShiftInput = document.getElementById('expected-shift') as HTMLInputElement | null;
          const resultArea = document.querySelector('.results-area') as HTMLElement | null;

          if (!entryInput || !exitInput || !resultArea || !expectedShiftInput) {
            console.error('[HORAS EXTRA] Elementos del DOM no encontrados');
            if (resultArea) {
              resultArea.innerHTML = '<p style="color: #ef4444;">Error: elementos del formulario faltantes</p>';
            }
            return;
          }

          // Obtener valores
          const entryTimeStr = entryInput.value.trim();
          const exitTimeStr = exitInput.value.trim();
          
          let breakMinutes = 0;
          const breakValue = breakInput?.value || '';
          
          if (breakValue) {
            const parsedBreak = parseBreakMinutes(breakValue);
            if (parsedBreak) {
              breakMinutes = breakMinutesFromTime(parsedBreak.hours, parsedBreak.minutes);
            } else {
              // Formato inválido pero hay valor: usar 60 como fallback
              breakMinutes = 60;
            }
          } else {
            // Vacío explícito → mantener 0 minutos (sin restar descanso)
            breakMinutes = 0;
          }

          // Validar formato de hora
          if (!entryTimeStr.includes(':') || !exitTimeStr.includes(':')) {
            showErrorInResults(resultArea, 'Formato de hora inválido. Usa formato HH:MM.');
            return;
          }

          // Jornada prevista es OBLIGATORIA en esta calculadora
          const expectedShiftVal = expectedShiftInput.value.trim();
          
          if (!expectedShiftVal) {
            showErrorInResults(resultArea, 'Introduce la jornada prevista para calcular las horas extra.');
            return;
          }

          // Calcular horario de entrada/salida
          const hoursEntry = parseInt(entryTimeStr.split(':')[0]);
          const minutesEntry = parseInt(entryTimeStr.split(':')[1]);
          
          const hoursExit = parseInt(exitTimeStr.split(':')[0]);
          const minutesExit = parseInt(exitTimeStr.split(':')[1]);
          
          // Calcular duración
          let duration: number | null = null;

          if (minutesExit >= minutesEntry) {
            duration = (hoursExit - hoursEntry) * 60 + (minutesExit - minutesEntry);
          } else if (minutesExit < minutesEntry) {
            // Cruce medianoche
            duration = (24 * 60 - hoursEntry * 60 - minutesEntry) + (hoursExit * 60 + minutesExit);
          }

          const workingDuration = duration ? duration - breakMinutes : 0;

          if (duration !== null && workingDuration < 0) {
            showErrorInResults(resultArea, 'El tiempo de descanso no puede ser mayor que el tiempo trabajado.');
            return;
          }

          // Calcular jornada prevista
          const expectedMinutes = parseExpectedShiftToMinutes(expectedShiftVal);

          if (expectedMinutes === null) {
            console.log('[HORAS EXTRA] expectedMinutes es null - formato inválido');
            showErrorInResults(resultArea, 'Formato de jornada prevista inválido.');
            return;
          }

          if (expectedMinutes <= 0) {
            console.log('[HORAS EXTRA] expectedMinutes <= 0');
            showErrorInResults(resultArea, 'La jornada prevista debe ser mayor que 0 horas.');
            return;
          }

          // Calcular horas trabajadas usando la función compartida
          const calculationResult = calculateWorkingHours(entryTimeStr, exitTimeStr, breakMinutes);

           if (calculationResult.ok) {
             // Calcular minutos totales trabajados
             const workedMinutesTotal = calculationResult.hours * 60 + parseInt(calculationResult.minutes);
             
             // Limpiar color inline heredado de errores anteriores
             resultArea.style.color = '';
             
             // Comparar con jornada prevista
             const isExtra = workedMinutesTotal > expectedMinutes;
            
            // Crear elementos de resultado
            const li1 = document.createElement('li');
            li1.setAttribute('data-testid', 'total-hours');
            li1.textContent = `Horas trabajadas: ${calculationResult.hours}h ${calculationResult.minutes}m`;
            
            const li2 = document.createElement('li');
            li2.setAttribute('data-testid', 'total-minutes');
            li2.textContent = `Minutos totales: ${workedMinutesTotal} minutos`;
            
            // Mostrar horas extra o jornada cumplida
            const li3 = document.createElement('li');
            li3.setAttribute('data-testid', 'decimal-hours');
            
            if (isExtra) {
              const extraCalc = calculateExtraHours(workedMinutesTotal, expectedMinutes);
              li3.textContent = `Horas extra: ${extraCalc.hoursFormatted} (${extraCalc.decimalHours})`;
            } else {
              li3.textContent = `Jornada cumplida: ${calculationResult.decimal}h sin horas extra`;
            }
            
            // Crear lista y mostrar resultados
            const ul = document.createElement('ul');
            ul.className = 'result-list';
            ul.setAttribute('role', 'list');
            ul.appendChild(li1);
            ul.appendChild(li2);
            ul.appendChild(li3);

            resultArea.innerHTML = '<h3 id="result-heading">Resultados</h3>';
            resultArea.appendChild(ul);
          } else {
            showErrorInResults(resultArea, calculationResult.error || 'Error en el cálculo');
          }

        } catch (e) {
          console.error('[HORAS EXTRA] Error:', e);
          if (resultArea) {
            resultArea.innerHTML = '<p style="color: #ef4444;">Ocurrió un error interno.</p>';
          }
        }
      });
    });
  }

  /**
   * Vincula eventos del botón reiniciar
   */
  const resetBtns = document.querySelectorAll('[data-event-reset="true"]');
  
  if (resetBtns.length > 0) {
    Array.from(resetBtns).forEach(btn => {
      btn.addEventListener('click', () => {
        // Limpiar inputs
        const entryInput = document.getElementById('entry-time') as HTMLInputElement | null;
        const exitInput = document.getElementById('exit-time') as HTMLInputElement | null;
        const breakInput = document.getElementById('break-time') as HTMLInputElement | null;
        const expectedShiftInput = document.getElementById('expected-shift') as HTMLInputElement | null;

        if (entryInput) entryInput.value = '';
        if (exitInput) exitInput.value = '';
        if (breakInput) breakInput.value = '';
        if (expectedShiftInput) expectedShiftInput.value = '';
        
        // Limpiar área de resultados
        const resultArea = document.querySelector('.results-area') as HTMLElement | null;
        if (resultArea) {
          resultArea.innerHTML = '<h3 id="result-heading">Resultados</h3>';
        }
      });
    });
  }
};

// Inicializar listeners cuando el DOM está listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachHorasExtraCalculatorEvents);
} else {
  setTimeout(attachHorasExtraCalculatorEvents, 50);
}
