/**
 * Calculadora de horas extra
 */

import { calculateWorkingHours } from './calculator';
import { parseExpectedShiftToMinutes, calculateExtraHours } from '../utils/time';

/**
 * Vincula eventos para la calculadora de horas extra
 */
export const attachHorasExtraCalculatorEvents = () => {
  /**
   * Muestra errores en el área de resultados
   */
  const showErrorInResults = (resultArea: HTMLElement | null, message: string) => {
    if (!resultArea) return;

    // Mantener estructura base pero limpiar contenido previo y mostrar error
    resultArea.innerHTML = '<h3 id="result-heading">Resultados</h3>';

    // Crear ul si no existe y añadir el mensaje de error como li
    let ul = resultArea.querySelector('.result-list');
    if (!ul) {
      ul = document.createElement('ul');
      ul.className = 'result-list';
      ul.setAttribute('role', 'list');
      resultArea.appendChild(ul);
    }

    // Crear li con clase error-message para el texto del error
    const errorLi = document.createElement('li');
    errorLi.className = 'error-message';
    errorLi.textContent = message;

    ul.appendChild(errorLi);
  };

  /**
   * Vincula eventos del botón calcular para horas extra
   */
  const calculateBtns = Array.from(document.querySelectorAll('[data-event-calculate-hours-extra="true"]')) as HTMLButtonElement[];

  if (calculateBtns.length > 0) {
    calculateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
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

        try {
          // Obtener valores
          const entryTimeStr = entryInput.value.trim();
          const exitTimeStr = exitInput.value.trim();

          // Descanso: campo vacío → 0 minutos (sin restar descanso)
          const breakValue = breakInput?.value || '';
          const breakMinutes = parseFloat(breakValue) || 0;

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

          // Calcular duración con cruce medianoche correcto
          const [hE, mE] = entryTimeStr.split(':').map(Number);
          const [hX, mX] = exitTimeStr.split(':').map(Number);
          const entryMins = hE * 60 + mE;
          const exitMins = hX * 60 + mX;

          let duration: number;
          if (exitMins > entryMins) {
            duration = exitMins - entryMins;
          } else if (exitMins < entryMins) {
            // cruce medianoche
            duration = (24 * 60 - entryMins) + exitMins;
          } else {
            duration = 0;
          }

          const workingDuration = duration - breakMinutes;

          if (workingDuration < 0) {
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
            const workedMinutesTotal = calculationResult.hours * 60 + calculationResult.minutes;

            // Crear elementos de resultado
            const li1 = document.createElement('li');
            li1.setAttribute('data-testid', 'total-hours');
            li1.textContent = `Horas trabajadas: ${calculationResult.hours}h ${calculationResult.minutes}m`;

            const li2 = document.createElement('li');
            li2.setAttribute('data-testid', 'total-minutes');
            li2.textContent = `Minutos totales: ${workedMinutesTotal} minutos`;

            // Crear elemento para mostrar estado según comparación con jornada prevista
            const li3 = document.createElement('li');
            li3.setAttribute('data-testid', 'decimal-hours');

            if (workedMinutesTotal > expectedMinutes) {
              // Jornada superada: mostrar horas extra
              const extraCalc = calculateExtraHours(workedMinutesTotal, expectedMinutes);
              li3.textContent = `Horas extra: ${extraCalc.hoursFormatted} (${extraCalc.decimalHours})`;
            } else if (workedMinutesTotal >= expectedMinutes) {
              // Jornada exacta o ligeramente superada por redondeo: jornada cumplida
              li3.textContent = `Jornada cumplida: ${calculationResult.decimal}h`;
            } else {
              // Jornada incompleta: calcular qué falta con formato de horas y minutos
              const missingMinutes = expectedMinutes - workedMinutesTotal;

              if (missingMinutes === 0) {
                li3.textContent = `Faltan para completar la jornada: 0h 0m (0.00 horas)`;
              } else {
                const hrs = Math.floor(missingMinutes / 60);
                const mins = missingMinutes % 60;
                const decimalMissing = (missingMinutes / 60).toFixed(2);

                li3.textContent = `Faltan para completar la jornada: ${hrs}h ${mins}m (${decimalMissing} horas)`;
              }
            }

            // Preparar lista y mostrar resultados
            const ul = document.createElement('ul');
            ul.className = 'result-list';
            ul.setAttribute('role', 'list');
            ul.appendChild(li1);
            ul.appendChild(li2);
            ul.appendChild(li3);

            resultArea.innerHTML = '<h3 id="result-heading">Resultados</h3>';
            resultArea.style.color = '';
            resultArea.appendChild(ul);
          } else {
            showErrorInResults(resultArea, calculationResult.error || 'Error en el cálculo');
          }
        } catch (e) {
          console.error('[HORAS EXTRA] Error:', e);
          showErrorInResults(resultArea, 'Ocurrió un error interno.');
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

        // Restaurar colores y limpiar área de resultados
        const resultArea = document.querySelector('.results-area') as HTMLElement | null;
        if (resultArea) {
          resultArea.style.backgroundColor = '';
          resultArea.style.color = '';
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
  setTimeout(attachHorasExtraCalculatorEvents, 100);
}
