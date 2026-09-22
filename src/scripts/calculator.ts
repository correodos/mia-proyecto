/**
 * Calculadora de horas trabajadas - MVP v1.0
 */

import type { Hour } from '../types/index';
import { parseTime } from '../utils/time/parseTime';
import { formatTimeToHHMM } from '../utils/time/formatTimeInput';

interface ShiftEntry {
    entry: Hour;
    exit: Hour;
}

interface DailyEntry {
    shifts: ShiftEntry[];
    breakMinutes: number | null;
}

/**
 * Validación de entrada diario
 */
const validateDailyEntry = (entryTimeStr: string, exitTimeStr: string, breakMinutes: number) => {
    const errors: Array<{field: string; message: string}> = [];
    
    const entryMinutes = parseInt(entryTimeStr.split(':')[0]) * 60 + parseInt(entryTimeStr.split(':')[1]);
    const exitMinutes = parseInt(exitTimeStr.split(':')[0]) * 60 + parseInt(exitTimeStr.split(':')[1]);
    
    let duration: number | null = null;

    if (exitMinutes >= entryMinutes) {
        duration = exitMinutes - entryMinutes;
    } else if (exitMinutes < entryMinutes) {
        duration = (24 * 60 - entryMinutes) + exitMinutes;
    }

    if (duration !== null && breakMinutes >= duration) {
        errors.push({ field: 'break', message: 'El tiempo de descanso no puede ser igual o mayor al tiempo trabajado.' });
    }

    return { isValid: errors.length === 0, errors };
};

/**
 * Calcular horas trabajadas
 */
export const calculateWorkingHours = (entryTimeStr: string, exitTimeStr: string, breakMinutes?: number | null) => {
    try {
        if (!entryTimeStr || !exitTimeStr) {
            throw new Error('Introduce una hora de entrada y una hora de salida.');
        }

        const entryMinutes = parseInt(entryTimeStr.split(':')[0]) * 60 + parseInt(entryTimeStr.split(':')[1]);
        const exitMinutes = parseInt(exitTimeStr.split(':')[0]) * 60 + parseInt(exitTimeStr.split(':')[1]);

        if (entryMinutes < 0 || entryMinutes > 1439) {
            throw new Error('Formato de hora inválido.');
        }

        let duration: number | null = null;

        if (exitMinutes >= entryMinutes) {
            duration = exitMinutes - entryMinutes;
        } else if (exitMinutes < entryMinutes) {
            duration = (24 * 60 - entryMinutes) + exitMinutes;
        }

        const workingDuration = duration ? duration - breakMinutes : 0;

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

/**
 * Mostrar resultados en el DOM
 */
export const displayResults = (resultArea: HTMLElement | null, hours: number, minutes: number) => {
    if (!resultArea) return;
    
    // Restaurar color de fondo y quitar error previo
    resultArea.style.backgroundColor = '';
    resultArea.style.color = '';
    resultArea.className = 'results-area';
    
    // Eliminar mensajes de error anteriores antes de insertar resultados
    const errorEls = resultArea.querySelectorAll('.error-message');
    errorEls.forEach(el => el.remove());
    
    // Obtener o crear h3
    let h3 = resultArea.querySelector('h3#result-heading') as HTMLHeadingElement | null;
    
    if (!h3) {
        h3 = document.createElement('h3');
        h3.id = 'result-heading';
        h3.textContent = 'Resultados';
        // Insertar antes del ul existente o como primer hijo
        const existingUl = resultArea.querySelector('.result-list');
        if (existingUl) {
            resultArea.insertBefore(h3, existingUl);
        } else {
            resultArea.appendChild(h3);
        }
    }
    
    // Obtener o crear ul y limpiar resultados previos
    let ul = resultArea.querySelector('.result-list') as HTMLUListElement | null;
    
    if (!ul) {
        ul = document.createElement('ul');
        ul.className = 'result-list';
        ul.setAttribute('role', 'list');
        resultArea.appendChild(ul);
    } else {
        // Limpiar resultados previos sin borrar el h3
        ul.innerHTML = '';
    }

    const li1 = document.createElement('li');
    li1.setAttribute('data-testid', 'total-hours');
    
    const li2 = document.createElement('li');
    li2.setAttribute('data-testid', 'total-minutes');
    
    const li3 = document.createElement('li');
    li3.setAttribute('data-testid', 'decimal-hours');

    li1.textContent = `Horas trabajadas: ${hours} horas`;
    li2.textContent = `Minutos totales: ${minutes} minutos`;

    const globalResults = getGlobalResults();
    li3.textContent = `Horas decimales: ${globalResults.decimal}`;

    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);
};

/**
 * Mostrar error en el DOM
 */
export const showErrorInResults = (resultArea: HTMLElement | null, message: string) => {
    if (!resultArea) return;
    
    // Limpiar contenido previo pero mantener estructura
    resultArea.innerHTML = '';
    
    // Crear h3 si no existe
    let h3 = resultArea.querySelector('h3#result-heading') as HTMLHeadingElement | null;
    if (!h3) {
        h3 = document.createElement('h3');
        h3.id = 'result-heading';
        h3.textContent = 'Resultados';
        resultArea.appendChild(h3);
    }
    
    // Crear mensaje de error en li con clase error-message
    const errorEl = document.createElement('li');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    resultArea.appendChild(errorEl);
};

/**
 * Reiniciar la calculadora
 */
export const resetCalculatorState = () => {
    try {
        const entryInput = document.getElementById('entry-time') as HTMLInputElement | null;
        const exitInput = document.getElementById('exit-time') as HTMLInputElement | null;
        const breakInput = document.getElementById('break-time') as HTMLInputElement | null;

        if (entryInput) entryInput.value = '';
        if (exitInput) exitInput.value = '';
        if (breakInput) breakInput.value = '';
        
        const resultArea = document.querySelector('.results-area') as HTMLElement;
        if (!resultArea) return;
        
        // Restaurar estado visual del área de resultados
        resultArea.style.backgroundColor = '';
        resultArea.style.color = '';
        
        // Eliminar contenido pero mantener estructura base (h3 y ul se crean en displayResults/showErrorInResults)
        resultArea.innerHTML = '<h3 id="result-heading">Resultados</h3>';

    } catch (error) {
        console.error('Error al reiniciar:', error);
    }
};

/**
 * Vincular eventos de botones
 */
export const attachButtonEvents = () => {
    const calculateBtns = Array.from(document.querySelectorAll('[data-event-calculate="true"]'));
    
    if (calculateBtns.length > 0) {
        calculateBtns.forEach(btn => {
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

                const entryTimeStr = entryInput.value.trim().replace(/:/g, '');
                const exitTimeStr = exitInput.value.trim().replace(/:/g, '');
                
                if (entryInput) entryInput.placeholder = '--:--';
                if (exitInput) exitInput.placeholder = '--:--';

                if (!entryTimeStr || !exitTimeStr) {
                    showErrorInResults(resultArea, 'Introduce un horario válido.');
                    return;
                }

                let breakMinutes = 0;
                const breakValue = breakInput?.value || '';
                
                if (breakValue.trim()) {
                    const parsedBreak = parseInt(breakValue);
                    breakMinutes = isNaN(parsedBreak) ? 60 : parsedBreak;
                }

                if (!entryTimeStr || !exitTimeStr) {
                    showErrorInResults(resultArea, 'Formato de hora inválido.');
                    return;
                }

                const entryFormatted = `${entryTimeStr.slice(0, 2)}:${entryTimeStr.slice(2, 4)}`;
                const exitFormatted = `${exitTimeStr.slice(0, 2)}:${exitTimeStr.slice(2, 4)}`;

                try {
                    const calculationResult = calculateWorkingHours(entryFormatted, exitFormatted, breakMinutes);

                    if (calculationResult.ok) {
                        updateGlobalResults(calculationResult.hours, String(calculationResult.minutes).padStart(2, '0'), calculationResult.decimal);
                        
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

    const resetBtns = document.querySelectorAll('[data-event-reset="true"]');
    
    if (resetBtns.length > 0) {
        Array.from(resetBtns).forEach(btn => {
            btn.addEventListener('click', () => {
                resetCalculatorState();
                
                const entryInput = document.getElementById('entry-time') as HTMLInputElement | null;
                const exitInput = document.getElementById('exit-time') as HTMLInputElement | null;
                
                if (entryInput) entryInput.placeholder = '--:--';
                if (exitInput) exitInput.placeholder = '--:--';

            });
        });
    }
};

let globalResultHours = 0;
let globalResultMinutes = '00';
let globalResultDecimal = '0.00';

export const updateGlobalResults = (hours: number, minutes: string, decimal: string) => {
    globalResultHours = hours;
    globalResultMinutes = minutes;
    globalResultDecimal = decimal;
};

export const getGlobalResults = () => ({
    hours: globalResultHours,
    minutes: globalResultMinutes,
    decimal: globalResultDecimal
});

export const setupTimeInputs = () => {
    const entryInput = document.getElementById('entry-time') as HTMLInputElement | null;
    const exitInput = document.getElementById('exit-time') as HTMLInputElement | null;
    
    if (entryInput) entryInput.addEventListener('input', (e) => {
        entryInput.value = formatTimeToHHMM(entryInput.value);
    });
    
    if (exitInput) exitInput.addEventListener('input', (e) => {
        exitInput.value = formatTimeToHHMM(exitInput.value);
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setupTimeInputs();
    });
} else {
    setTimeout(setupTimeInputs, 50);
}
