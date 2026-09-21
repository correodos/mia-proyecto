/**
 * Calculadora de horas trabajadas - MVP v1.0
 */

import type { Hour } from '../types/index';
import { parseTime } from '../utils/time/parseTime';

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
    
    resultArea.innerHTML = ''; 

    const ul = document.createElement('ul');
    ul.className = 'result-list';
    ul.setAttribute('role', 'list');

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

    resultArea.appendChild(ul);
};

/**
 * Mostrar error en el DOM
 */
export const showErrorInResults = (resultArea: HTMLElement | null, message: string) => {
    if (!resultArea) return;
    
    resultArea.textContent = '';
    resultArea.style.color = '#ef4444';
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
        if (resultArea && resultArea.querySelector('.result-list')) {
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

                const entryTimeStr = (entryInput.value.trim().replace(/:/g, '')) || '0900';
                const exitTimeStr = (exitInput.value.trim().replace(/:/g, '')) || '1800';
                
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

const formatTimeInputListener = (inputElement: HTMLInputElement) => {
    inputElement.addEventListener('input', (e) => {
        const target = e.target;
        
        if (target.value.length > 0 && target.placeholder === '') {
            target.placeholder = '--:--';
        }
        
        let value = target.value.replace(/\D/g, '');
        
        if (value.length > 4) {
            value = value.slice(0, 4);
        }
        
        if (value.length >= 2) {
            target.value = `${value.slice(0, 2)}:${value.slice(2, 4)}`;
        } else if (value.length === 1) {
            target.value = `${value}:`;
        } else {
            target.value = '';
        }
        
        if (target.value === ':') {
            target.value = '';
        }
        
        return value;
    });
};

const setupTimeInputs = () => {
    const entryInput = document.getElementById('entry-time') as HTMLInputElement | null;
    const exitInput = document.getElementById('exit-time') as HTMLInputElement | null;
    
    if (entryInput) formatTimeInputListener(entryInput);
    if (exitInput) formatTimeInputListener(exitInput);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setupTimeInputs();
    });
} else {
    setTimeout(setupTimeInputs, 50);
}
