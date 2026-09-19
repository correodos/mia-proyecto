/**
 * Calculadora de horas trabajadas - MVP v1.0
 */

// Importaciones de la lógica de cálculo (separación de preocupaciones)
import type { Hour } from '../types/index';
import { parseTime } from '../utils/time/parseTime';

// Interfaces internas
export interface ShiftEntry {
  entry: Hour;
  exit: Hour;
}

export interface DailyEntry {
  shifts: ShiftEntry[];
  breakMinutes: number | null;
}

/**
 * Cálculo de horas trabajadas - Funciones puras sin dependencias del DOM
 */

// Función interna: Validación de entrada diario
const validateDailyEntry = (entryTimeStr: string, exitTimeStr: string, breakMinutes: number) => {
  const errors: Array<{field: string; message: string}> = [];

  // Calcular duración del tramo para validar descanso
  const entryMinutes = parseInt(entryTimeStr.split(':')[0]) * 60 + parseInt(entryTimeStr.split(':')[1]);
  const exitMinutes = parseInt(exitTimeStr.split(':')[0]) * 60 + parseInt(exitTimeStr.split(':')[1]);
  
  let duration: number | null = null;

  if (exitMinutes >= entryMinutes) {
    duration = exitMinutes - entryMinutes;
  } else if (exitMinutes < entryMinutes) {
    // Cruce medianoche válido
    duration = (24 * 60 - entryMinutes) + exitMinutes;
  }

  // Si hay duración y descanso >= duración total -> error
  if (duration !== null && breakMinutes >= duration) {
    errors.push({ field: 'break', message: 'El tiempo de descanso no puede ser igual o mayor al tiempo trabajado.' });
  }

  return { isValid: errors.length === 0, errors };
};

// Función principal: calcular horas trabajadas (devuelve objeto con resultado)
export const calculateWorkingHours = (entryTimeStr: string, exitTimeStr: string, breakMinutes?: number | null) => {
  try {
    // Validar campos obligatorios básicos
    if (!entryTimeStr || !exitTimeStr) {
      throw new Error('Introduce una hora de entrada y una hora de salida.');
    }

    if (breakMinutes !== undefined && breakMinutes !== null) {
      if (isNaN(parseInt(breakMinutes.toString()))) {
        throw new Error('Introduce un número válido para el descanso.');
      }
    } else {
      breakMinutes = 60; // Valor por defecto si no se especifica
    }

    // Parsear horas
    const entryMinutes = parseInt(entryTimeStr.split(':')[0]) * 60 + parseInt(entryTimeStr.split(':')[1]);
    const exitMinutes = parseInt(exitTimeStr.split(':')[0]) * 60 + parseInt(exitTimeStr.split(':')[1]);

    // Validar rango de valores
    if (entryMinutes < 0 || entryMinutes > 1439) {
      throw new Error('Formato de hora inválido.');
    }

    // Calcular duración y minutos trabajados restando descanso
    let duration: number | null = null;

    if (exitMinutes >= entryMinutes) {
      duration = exitMinutes - entryMinutes;
    } else if (exitMinutes < entryMinutes) {
      // Cruce medianoche válido
      duration = (24 * 60 - entryMinutes) + exitMinutes;
    }

    // Calcular total restando descanso
    const workingDuration = duration ? duration - breakMinutes : 0;

    // Permitir trabajar 0 minutos (caso límite: horas iguales o entrada == salida)
    // Solo lanzar error si el descanso es mayor que la duración (trabajo negativo)
    if (duration !== null && workingDuration < 0) {
      throw new Error('El tiempo de descanso no puede ser mayor que el tiempo trabajado.');
    }

    return {
      ok: true,
      hours: Math.floor(workingDuration / 60),
      minutes: workingDuration % 60,
      decimal: (workingDuration / 60).toFixed(2)
    };

  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Error en el cálculo'
    };
  }
};

// Función para mostrar resultados en el DOM
export const displayResults = (resultArea: HTMLElement | null, hours: number, minutes: number) => {
  if (!resultArea) return;

  // Limpiar resultados anteriores si existen
  resultArea.innerHTML = ''; 

  // Crear la estructura de lista <ul>
  const ul = document.createElement('ul');
  ul.className = 'result-list';
  ul.setAttribute('role', 'list');

  const li1 = document.createElement('li');
  li1.setAttribute('data-testid', 'total-hours');
  
  const li2 = document.createElement('li');
  li2.setAttribute('data-testid', 'total-minutes');
  
  const li3 = document.createElement('li');
  li3.setAttribute('data-testid', 'decimal-hours');

  // Llenar cada elemento con el texto correcto
  li1.textContent = `Horas trabajadas: ${hours} horas`;
  li2.textContent = `Minutos totales: ${minutes} minutos`;
  
  // Obtener datos globales para horas decimales
  const globalResults = getGlobalResults();
  li3.textContent = `Horas decimales: ${globalResults.decimal}`;
  
  ul.appendChild(li1);
  ul.appendChild(li2);
  ul.appendChild(li3);

  resultArea.appendChild(ul);
};

// Función para mostrar error en el DOM
export const showErrorInResults = (resultArea: HTMLElement | null, message: string) => {
  if (!resultArea) return;
  
  // Limpiar resultados anteriores
  resultArea.textContent = '';
  resultArea.style.color = '#ef4444';
};

/**
 * Reiniciar la calculadora a su estado inicial
 */
export const resetCalculatorState = () => {
  try {
    const entryInput = document.getElementById('entry-time') as HTMLInputElement | null;
    const exitInput = document.getElementById('exit-time') as HTMLInputElement | null;
    const breakInput = document.getElementById('break-time') as HTMLInputElement | null;

    // Limpiar todos los campos vaciando sus valores (estado inicial sin valores predefinidos)
    if (entryInput) entryInput.value = '';
    if (exitInput) exitInput.value = '';
    if (breakInput) breakInput.value = '';
    
    // Limpiar área de resultados restaurando el título y eliminando contenido previo
    const resultArea = document.querySelector('.results-area') as HTMLElement;
    if (resultArea) {
      resultArea.innerHTML = '<h3 id="result-heading">Resultados</h3>';
    }

  } catch (error) {
    console.error('Error al reiniciar:', error);
  }
};

/**
 * Vincular eventos de botones
 */
export const attachButtonEvents = () => {
  // Botón Calcular - elemento existe en DailyCalculator.astro pero sin ID explícito
  // Usamos selectores de clase para encontrar el botón
  
  const calculateBtns = Array.from(document.querySelectorAll('[data-event-calculate="true"]')) as HTMLButtonElement[];
  
  if (calculateBtns.length > 0) {
    calculateBtns.forEach(btn => {
      // Eliminar listeners anteriores si existen
      btn.onclick = null;
      
      btn.addEventListener('click', () => {
        const entryInput = document.getElementById('entry-time') as HTMLInputElement | null;
        const exitInput = document.getElementById('exit-time') as HTMLInputElement | null;
        const breakInput = document.getElementById('break-time') as HTMLInputElement | null;
        const resultArea = document.querySelector('.results-area') as HTMLElement | null;

        if (!entryInput || !exitInput || !resultArea) {
          console.error('Elementos del DOM no encontrados');
          return;
        }

        // Obtener valores
        const entryTimeStr = entryInput.value.trim() || '09:00';
        const exitTimeStr = exitInput.value.trim() || '18:00';
        let breakMinutes = parseTime(breakInput?.value)?.minutes || 60;

        // Validar
        if (!entryTimeStr.includes(':') || !exitTimeStr.includes(':')) {
          showErrorInResults(resultArea, 'Formato de hora inválido. Usa formato HH:MM.');
          return;
        }

        try {
          breakMinutes = parseInt(breakInput?.value) || 60;
          
          const calculationResult = calculateWorkingHours(entryTimeStr, exitTimeStr, breakMinutes);

          if (calculationResult.ok) {
            
            // Actualizar datos globales para acceso posterior
            updateGlobalResults(calculationResult.hours, String(calculationResult.minutes).padStart(2, '0'), calculationResult.decimal);
          
            
            // Mostrar resultados en el DOM
            displayResults(resultArea, calculationResult.hours, calculationResult.minutes);
          } else {
            showErrorInResults(resultArea, calculationResult.error || 'Error en el cálculo');
          }

        } catch (e) {
          console.error('Error:', e);
          showErrorInResults(resultArea, 'Ocurrió un error interno.');
        }
      });
    });
  }

  // Botón Reiniciar
  const resetBtns = document.querySelectorAll('[data-event-reset="true"]');
  
  if (resetBtns.length > 0) {
    Array.from(resetBtns).forEach(btn => {
      btn.addEventListener('click', () => {
        resetCalculatorState();
        
        // Limpiar área de resultados correctamente
        const resultArea = document.querySelector('.results-area') as HTMLElement;
        if (resultArea && resultArea.querySelector('.result-list')) {
          resultArea.innerHTML = '<h3 id="result-heading">Resultados</h3>';
        }

      });
    });
  }
};

/**
 * Actualizar resultados globales mantenidos en el componente Astro
 */
let globalResultHours = 0;
let globalResultMinutes = '00';
let globalResultDecimal = '0.00';

export const updateGlobalResults = (hours: number, minutes: string, decimal: string) => {
  globalResultHours = hours;
  globalResultMinutes = minutes;
  globalResultDecimal = decimal;
};

/**
 * Obtener resultados globales para acceso externo si es necesario
 */
export const getGlobalResults = () => ({
  hours: globalResultHours,
  minutes: globalResultMinutes,
  decimal: globalResultDecimal
});

// Inicializar listeners cuando el DOM está listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachButtonEvents);
} else {
  // Ejecutar inmediatamente si el DOM ya está cargado
  setTimeout(attachButtonEvents, 50);
}

