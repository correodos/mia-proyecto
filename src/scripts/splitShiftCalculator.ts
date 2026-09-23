/**
 * Calculadora de jornada partida — adaptador DOM
 */

import { calculateWorkingMinutes } from '../utils/calculateWorkingMinutes';
import { formatShiftResult } from '../utils/formatShiftResult';
import { renderSuccess, renderError, clearResultArea } from '../utils/renderResult';

// ─── Lógica pura (exportada para tests) ──────────────────────────────────────

export interface SplitShiftResult {
  ok: boolean;
  duration1Minutes: number;
  duration2Minutes: number;
  breakMinutes: number;
  error?: string;
}

export function calculateSplitShift(
  part1EntryStr: string,
  part1ExitStr: string,
  part2EntryStr: string,
  part2ExitStr: string
): SplitShiftResult {
  const required: [string, string][] = [
    [part1EntryStr, 'Primer tramo - Entrada obligatoria'],
    [part1ExitStr,  'Primer tramo - Salida obligatoria'],
    [part2EntryStr, 'Segundo tramo - Entrada obligatoria'],
    [part2ExitStr,  'Segundo tramo - Salida obligatoria'],
  ];

  for (const [val, msg] of required) {
    if (!val?.trim()) return { ok: false, duration1Minutes: 0, duration2Minutes: 0, breakMinutes: 0, error: msg };
  }

  const tramo1 = calculateWorkingMinutes(part1EntryStr, part1ExitStr);
  if (!tramo1.ok) return { ok: false, duration1Minutes: 0, duration2Minutes: 0, breakMinutes: 0, error: tramo1.error };

  const tramo2 = calculateWorkingMinutes(part2EntryStr, part2ExitStr);
  if (!tramo2.ok) return { ok: false, duration1Minutes: 0, duration2Minutes: 0, breakMinutes: 0, error: tramo2.error };

  // Validar que no haya solapamiento entre los dos tramos
  const parse = (hmm: string | undefined): number | null => {
    if (!hmm) return null;
    const m = hmm.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  };

  const part1Exit = parse(part1ExitStr);
  const part2Entry = parse(part2EntryStr);
  
  if (part1Exit !== null && part2Entry !== null && part1Exit > part2Entry) {
    return { 
      ok: false, 
      duration1Minutes: 0, 
      duration2Minutes: 0, 
      breakMinutes: 0, 
      error: 'El segundo tramo comienza antes del final del primer tramo' 
    };
  }

  // Calcular descanso entre tramos (minutos entre salida1 y entrada2)
  const breakMinutes = getBreakBetweenShifts(part1ExitStr, part2EntryStr);

  return {
    ok: true,
    duration1Minutes: tramo1.minutes,
    duration2Minutes: tramo2.minutes,
    breakMinutes: Math.max(0, breakMinutes),
  };
}

export function getBreakBetweenShifts(exit1Str: string, entry2Str: string): number {
  // Import inline para evitar dependencia circular
  const parse = (s: string) => {
    const m = s.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    const h = parseInt(m[1], 10), min = parseInt(m[2], 10);
    if (h < 0 || h > 23 || min < 0 || min > 59) return null;
    return h * 60 + min;
  };
  const exit1  = parse(exit1Str);
  const entry2 = parse(entry2Str);
  if (exit1 === null || entry2 === null) return 0;
  return Math.max(0, entry2 - exit1);
}

// ─── Leer DOM ────────────────────────────────────────────────────────────────

function getInputs() {
  const v = (id: string) => (document.getElementById(id) as HTMLInputElement | null)?.value ?? '';
  return {
    part1Entry: v('part1-entry'),
    part1Exit:  v('part1-exit'),
    part2Entry: v('part2-entry'),
    part2Exit:  v('part2-exit'),
    resultArea: document.querySelector('.split-results') as HTMLElement | null,
  };
}

// ─── Calcular y pintar ───────────────────────────────────────────────────────

function handleCalculate(): void {
  const { part1Entry, part1Exit, part2Entry, part2Exit, resultArea } = getInputs();
  if (!resultArea) return;

  const result = calculateSplitShift(part1Entry, part1Exit, part2Entry, part2Exit);

  if (!result.ok) {
    renderError(resultArea, result.error ?? 'Error en el cálculo');
    return;
  }

  const fmt1   = formatShiftResult(result.duration1Minutes);
  const fmt2   = formatShiftResult(result.duration2Minutes);
  const total  = formatShiftResult(result.duration1Minutes + result.duration2Minutes);

  const breakText = result.breakMinutes > 0
    ? formatShiftResult(result.breakMinutes).formatted
    : '--';

  renderSuccess(resultArea, [
    { testId: 'part1-hours',    text: `Primer tramo: ${fmt1.formatted}` },
    { testId: 'part2-hours',    text: `Segundo tramo: ${fmt2.formatted}` },
    { testId: 'break-minutes',  text: `Descanso entre turnos: ${breakText}` },
    { testId: 'total-hours',    text: `Total trabajado: ${total.formatted}` },
    { testId: 'decimal-hours',  text: `${total.decimal}h` },
  ]);
}

function handleReset(): void {
  ['part1-entry', 'part1-exit', 'part2-entry', 'part2-exit'].forEach(id => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (el) el.value = '';
  });
  const resultArea = document.querySelector('.split-results') as HTMLElement | null;
  if (resultArea) clearResultArea(resultArea);
}

// ─── Eventos ─────────────────────────────────────────────────────────────────

export function attachButtonEventsForSplitShift(): void {
  document.querySelectorAll('[data-event-calculate-split-shift="true"]').forEach(btn => {
    btn.addEventListener('click', handleCalculate);
  });
  document.querySelectorAll('[data-event-reset-split-shift="true"]').forEach(btn => {
    btn.addEventListener('click', handleReset);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachButtonEventsForSplitShift);
} else {
  setTimeout(attachButtonEventsForSplitShift, 100);
}
