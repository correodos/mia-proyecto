/**
 * Calculadora de jornada partida - Script independiente v3.0 corregido
 */

interface ParseTimeResult {
    minutes: number;
    ok: boolean;
    error?: string;
}

interface SplitShiftResult {
    ok: boolean;
    part1Hours: number | null;
    part1Minutes: number | null;
    part2Hours: number | null;
    part2Minutes: number | null;
    breakMinutes: number;
}

/** Parsear string HH:MM a minutos */
export const parseTime = (timeStr: string): ParseTimeResult => {
    // Entrada vacía o undefined es válida (ej: 00:00-00:00)
    if (!timeStr || timeStr.trim() === '') return { minutes: 0, ok: true };

    const trimmed = timeStr.trim();
    let parts: number[] | undefined;
    
    // Intentar parsear con formato HH:MM
    if (trimmed.includes(':')) {
        try {
            const splitParts = trimmed.split(':');
            const [hoursStr, minutesStr] = splitParts;
            
            // Validar que ambos campos existen y tienen formato numérico
            if (!hoursStr || !minutesStr) {
                return { minutes: -1, ok: false, error: 'Formato de hora inválido' };
            }
            
            // Eliminar espacios y otros caracteres no numéricos
            const hoursNum = hoursStr.replace(/[^0-9]/g, '');
            const minutesNum = minutesStr.replace(/[^0-9]/g, '');
            
            // Validar que la conversión fue exitosa (no NaN)
            if (!hoursNum || !minutesNum) {
                return { minutes: -1, ok: false, error: 'Formato de hora inválido' };
            }

            const hours = parseInt(hoursNum, 10);
            const minutes = parseInt(minutesNum, 10);

            // Validar que la conversión fue exitosa (no NaN)
            if (isNaN(hours) || isNaN(minutes)) {
                return { minutes: -1, ok: false, error: 'Formato de hora inválido' };
            }

            // Validar rango de minutos 0-59
            if (minutes < 0 || minutes > 59) {
                return { minutes: -1, ok: false, error: 'Minutos fuera de rango (0-59)' };
            }
            
            parts = [hours, minutes];
        } catch (e) {
            return { minutes: -1, ok: false, error: 'Formato de hora inválido' };
        }
    } 
    // Si no tiene dos puntos, intentar como string de 4 dígitos
    else if (trimmed.length > 0 && !trimmed.includes(':')) {
        const digits = trimmed.replace(/[:.]/g, ''); // Eliminar tanto : como .
        
        if (digits.length === 4) {
            parts = [parseInt(digits.slice(0, 2), 10), parseInt(digits.slice(2), 10)];
        } 
        else if (trimmed.includes('.')) 
        {
            // Formato decimal "9.30" -> tratar como horas:минutos no estándar
            return { minutes: -1, ok: false, error: 'Formato de hora inválido' };
        }
        else {
            // Formato incompleto o inválido
            return { minutes: -1, ok: false, error: 'Formato de hora inválido' };
        }
    } 
    else {
        return { minutes: 0, ok: true };
    }
    
    const [hours, minutes] = parts;
    
    // Validar rango de horas 0-23
    if (hours < 0 || hours > 23) {
        return { minutes: -1, ok: false, error: 'Hora fuera de rango' };
    }

    const totalMinutes = hours * 60 + minutes;
    
    // Caso especial: 00:00 es válido  
    if (hours === 0 && minutes === 0) return { minutes: 0, ok: true };
    
    return { minutes: totalMinutes, ok: true };
};

/** Calcular jornada partida */
export const calculateSplitShift = (
    part1EntryStr: string,  
    part1ExitStr: string,   
    part2EntryStr: string,  
    part2ExitStr: string    
): SplitShiftResult => {
    try 
    {
        // Validar que las 4 horas son obligatorias
        if (!part1EntryStr?.trim()) return { ok: false, error: 'Primer tramo - Entrada obligatoria' };
        if (!part1ExitStr?.trim()) return { ok: false, error: 'Primer tramo - Salida obligatoria' };
        if (!part2EntryStr?.trim()) return { ok: false, error: 'Segundo tramo - Entrada obligatoria' };
        if (!part2ExitStr?.trim()) return { ok: false, error: 'Segundo tramo - Salida obligatoria' };

        const parseEntry1 = parseTime(part1EntryStr);
        const parseExit1 = parseTime(part1ExitStr);
        const parseEntry2 = parseTime(part2EntryStr);
        const parseExit2 = parseTime(part2ExitStr);

        // Validar que todos los campos sean válidos
        if (!parseEntry1.ok) return { ok: false, error: 'Entrada primer tramo inválida' };
        if (!parseExit1.ok) return { ok: false, error: 'Salida primer tramo inválida' };
        if (!parseEntry2.ok) return { ok: false, error: 'Entrada segundo tramo inválida' };
        if (!parseExit2.ok) return { ok: false, error: 'Salida segundo tramo inválida' };

        // Calcular duración primer tramo - lógica medianoche correcta  
        const entry1Min = parseEntry1.minutes;
        const exit1Min = parseExit1.minutes;

        // Caso especial: si entry == exit, duración = 0 (incluso 00:00)
        let duration1: number = 0;
        if (entry1Min !== undefined && exit1Min !== undefined) {
            if (entry1Min === exit1Min) {
                duration1 = 0; // Same time = 0 hours
            } else if (exit1Min > entry1Min) {
                // Salida después de entrada mismo día
                duration1 = exit1Min - entry1Min;
            } else {
                // Cruce de medianoche: salida siguiente día
                duration1 = (24 * 60 - entry1Min) + exit1Min;
            }
        }

        // Calcular duración segundo tramo - lógica medianoche  
        const entry2Min = parseEntry2.minutes;
        const exit2Min = parseExit2.minutes;

        let duration2: number = 0;
        if (entry2Min !== undefined && exit2Min !== undefined) {
            if (entry2Min === exit2Min) {
                duration2 = 0; // Same time = 0 hours
            } else if (exit2Min > entry2Min) {
                // Salida después de entrada mismo día
                duration2 = exit2Min - entry2Min;
            } else {
                // Cruce de medianoche: salida siguiente día
                duration2 = (24 * 60 - entry2Min) + exit2Min;
            }
        }

// Validar que las duraciones no sean negativas  
const validDuration1: number = Math.max(0, duration1);
const validDuration2: number = Math.max(0, duration2);

// Total trabajado: SUMA pura sin restar descanso informativo
const totalTimeWorked = validDuration1 + validDuration2;

/**
 * Validación de solapamiento con línea temporal absoluta
 * 
 * Lógica: Un tramo que cruza medianoche termina al día siguiente.
 * Para evitar solapamientos, debemos convertir todo a minutos del día 0 absoluto.
 * 
 * Caso común (sin medianoche): primer tramo termina en exit1Min del día D1
 *                             segundo tramo entra en entry2Min del día D1
 *                             válido: entry2Min >= exit1Min (misma línea temporal)
 * 
 * Si el primer tramo cruza medianoche (ej: 23:00-01:00), termina en 01:00 del día D1+1
 * El segundo tramo siempre comienza el día D1+1 o posterior, por lo que es válido.
 * 
 * Conclusión: NO necesitamos lógica especial de medianoche para solapamiento
 * porque un tramo nocturno termina al día siguiente, y el segundo tramo empezará
 * en ese mismo o día posterior automáticamente.
 */
// Validar tramos solapados (entrada2 debe ser >= salida1 en misma línea temporal)
if (exit1Min !== undefined && entry2Min !== undefined) 
{
    // Solapamiento solo si ambos están en la misma "sesión" del día
    // Caso solapado: segundo turno empieza antes que termine el primero (misma mañana/tarde)
    if (entry2Min < exit1Min) return {
        ok: false,
        error: 'El segundo turno comienza antes de que termine el primero'
    };
}

// Calcular descanso entre tramos (puede ser 0 si son seguidos)
const breakMinutes = getBreakBetweenShifts(part1ExitStr, part2EntryStr);

const result: SplitShiftResult = {
    ok: true,
    part1Hours: Math.floor(validDuration1 / 60),
    part1Minutes: validDuration1 % 60,
    part2Hours: Math.floor(validDuration2 / 60),
    part2Minutes: validDuration2 % 60,
    breakMinutes: Math.max(0, breakMinutes)  
};

        return result;

    } 
    catch (error) {
      console.error('Error en cálculo:', error);
      return { ok: false, error: 'Error en el cálculo' };
    }
};

/** Obtener descanso automático entre tramos */
export const getBreakBetweenShifts = (
    part1ExitStr: string,  
    part2EntryStr: string  
): number => {
    const parse = (timeStr: string) => {
        if (!timeStr?.trim()) return null;
        try 
        {
            const parts = timeStr.split(':').map(Number);
            // Validar que se obtuvieron dos números válidos
            if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
                return null;
            }
            return parts[0] * 60 + parts[1];
        } catch (e) {
            return null;
        }
    };

    const exit1Min = parse(part1ExitStr);
    const entry2Min = parse(part2EntryStr);
    
    if (exit1Min === null || entry2Min === null) return 0;
    
    // Calcular descanso entre tramos
    // El descanso es siempre positivo o 0
    const breakMins = Math.max(0, entry2Min - exit1Min);
    
    return breakMins;
};

/** Mostrar resultados */
export const displaySplitResults = (
    resultArea: HTMLElement | null, 
    part1Hours: number | null,
    part1Minutes: number | null,  
    part2Hours: number | null,  
    part2Minutes: number | null, 
    breakMinutes: number,  // Informativo automáticamente calculado por getBreakBetweenShifts
    duration1Minutes: number,     // Duración tramo 1 en minutos
    duration2Minutes: number      // Duración tramo 2 en minutos      
): void => {
    if (!resultArea) return;

    resultArea.innerHTML = '';

    const ul = document.createElement('ul');
    ul.className = 'result-list';
    ul.setAttribute('role', 'list');
    
// Primer tramo  
const li1 = document.createElement('li');
li1.setAttribute('data-testid', 'part1-hours');
if (part1Hours !== null) {
    // Mostrar minutos siempre con formato 00m/xxm
    li1.textContent = `Primer tramo: ${part1Hours}h ${String(part1Minutes).padStart(2, '0')}m`;
} else {
    li1.textContent = '--';
}

// Segundo tramo  
const li2 = document.createElement('li');
li2.setAttribute('data-testid', 'part2-hours');
if (part2Hours !== null) {
    // Mostrar minutos siempre con formato 00m/xxm
    li2.textContent = `Segundo tramo: ${part2Hours}h ${String(part2Minutes).padStart(2, '0')}m`;
} else {
    li2.textContent = '--';
}

// Descanso automático calculado (NO afecta el cálculo de total)  
const li3 = document.createElement('li');
li3.setAttribute('data-testid', 'break-minutes');
const hours = Math.floor(breakMinutes / 60);  
const minutes = breakMinutes % 60;
let formatted: string;

if (hours > 0 && minutes > 0) 
{
    formatted = `${String(hours).padStart(2, '0')}h ${minutes}m`;
} else if (hours > 0) 
{
    formatted = `${String(hours).padStart(2, '0')}h 00m`;
} else {
    formatted = `${String(minutes).padStart(2, '0')}m`;
}

if (breakMinutes > 0) {
    li3.textContent = `Descanso entre turnos: ${formatted}`;
} else {
    li3.textContent = 'Descanso entre turnos: --';
}

// Calcular total trabajado: suma de duraciones exactas  
const tDur = duration1Minutes + duration2Minutes;
const totalH = Math.floor(tDur / 60);  
const totalM = tDur % 60;

// Formato: Xh YYm (siempre mostrar minutos con dos dígitos)
const liTotal = document.createElement('li');
liTotal.setAttribute('data-testid', 'total-hours');
liTotal.textContent = `Total trabajado: ${totalH}h ${String(totalM).padStart(2, '0')}m`;

// Horas decimales: solo tiempo trabajado, con formato 2 decimales
const decimalHours = parseFloat((tDur / 60).toFixed(2));  
const liDecimal = document.createElement('li');
liDecimal.setAttribute('data-testid', 'decimal-hours');
liDecimal.textContent = `${decimalHours.toFixed(2)}h`;

ul.appendChild(li1);
ul.appendChild(li2);
ul.appendChild(li3);
ul.appendChild(liTotal);
ul.appendChild(liDecimal);

resultArea.appendChild(ul);
};

/** Versión Test de calculateSplitShift para compatibilidad con tests */
export const calculateSplitShiftTest = (
    part1EntryStr: string,  
    part1ExitStr: string,   
    part2EntryStr: string,  
    part2ExitStr: string    
): SplitShiftResult => {
    // Wrapper identico a calculateSplitShift para uso en tests
    return calculateSplitShift(part1EntryStr, part1ExitStr, part2EntryStr, part2ExitStr);
};

/** Vincular eventos de botones para jornada partida */
export const attachButtonEventsForSplitShift = () => {
    try 
    {
        const calculateBtns = document.querySelectorAll('[data-event-calculate-split-shift="true"]');
        
        if (calculateBtns.length > 0) 
        {
            Array.from(calculateBtns).forEach(btn => {
                btn.addEventListener('click', () => {
                    const resultArea = document.querySelector('.split-results');
                    
                    if (!resultArea || !resultArea.matches('.results-area:not([aria-hidden="true"])')) 
                    {
                        console.error('No se encontró la zona de resultados para jornada partida');
                        return;
                    }

                    // Obtener valores de los inputs
                    const part1Entry = document.getElementById('part1-entry')?.value || '';
                    const part1Exit = document.getElementById('part1-exit')?.value || '';
                    const part2Entry = document.getElementById('part2-entry')?.value || '';
                    const part2Exit = document.getElementById('part2-exit')?.value || '';

                    // Calcular jornada partida
                    const result = calculateSplitShift(part1Entry, part1Exit, part2Entry, part2Exit);

                    if (!result.ok) 
                    {
                        showError(result.error);
                        return;
                    }

                    // Calcular duraciones para display
                    const parseDisplay = (timeStr: string): number => {
                        if (!timeStr?.trim()) return 0;
                        try {
                            const parts = timeStr.split(':').map(Number);
                            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                                return parts[0] * 60 + parts[1];
                            }
                            return 0;
                        } catch (e) {
                            return 0;
                        }
                    };

                    const entry1Min = parseDisplay(part1Entry);
                    const exit1Min = parseDisplay(part1Exit);
                    const entry2Min = parseDisplay(part2Entry);
                    const exit2Min = parseDisplay(part2Exit);

                    let duration1Minutes: number = 0;
                    if (entry1Min !== undefined && exit1Min !== undefined) {
                        if (entry1Min === exit1Min) {
                            duration1Minutes = 0;
                        } else if (exit1Min > entry1Min) {
                            duration1Minutes = exit1Min - entry1Min;
                        } else {
                            duration1Minutes = (24 * 60 - entry1Min) + exit1Min;
                        }
                    }

                    let duration2Minutes: number = 0;
                    if (entry2Min !== undefined && exit2Min !== undefined) {
                        if (entry2Min === exit2Min) {
                            duration2Minutes = 0;
                        } else if (exit2Min > entry2Min) {
                            duration2Minutes = exit2Min - entry2Min;
                        } else {
                            duration2Minutes = (24 * 60 - entry2Min) + exit2Min;
                        }
                    }

                    // Calcular descanso automáticamente entre tramos
                    let breakMinutes: number = Math.max(0, entry2Min - exit1Min);
                    
                    displaySplitResults(
                        resultArea.querySelector('.result-list'),
                        result.part1Hours,
                        result.part1Minutes,
                        result.part2Hours,
                        result.part2Minutes,
                        breakMinutes,
                        duration1Minutes,
                        duration2Minutes
                    );
                });
            });
        }

        // Botón reset
        const resetBtns = document.querySelectorAll('[data-event-reset-split-shift="true"]');
        Array.from(resetBtns).forEach(btn => {
            btn.addEventListener('click', () => {
                // Limpiar todos los inputs de jornada partida
                ['part1-entry', 'part1-exit', 'part2-entry', 'part2-exit'].forEach(id => {
                    const el = document.getElementById(id) as HTMLInputElement | null;
                    if (el) el.value = '';
                });

                // Limpiar resultado y resetear input de descanso
                const resultArea = document.querySelector('.split-results');
                const breakInfo = document.getElementById('break-time') as HTMLInputElement | null;

                if (resultArea && resultArea.querySelector('.result-list')) 
                {
                    resultArea.innerHTML = '<h3 id="result-heading">Resultados</h3><ul class="result-list" role="list"></ul>';
                }

                if (breakInfo) breakInfo.value = '';
            });
        });

    } catch (error) 
    {
        console.error('Error al adjuntar eventos:', error);
    }
};

/** Mostrar error */
const showError = (message: string) => {
    if (!document.querySelector('.split-results')) return;
    
    const ul = document.querySelector('.split-results .result-list');
    if (ul) 
    {
        // Limpiar resultados anteriores y mostrar error
        ul.innerHTML = '';
        
        const liError = document.createElement('li');
        liError.textContent = 'Error: ' + message;
        liError.style.color = '#ef4444';
        liError.classList.add('error-message');
        
        ul.appendChild(liError);
    }
};
