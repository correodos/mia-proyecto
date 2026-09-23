/**
 * Calculadora de horas extra — adaptador DOM
 */

import { calculateWorkingMinutes } from '../utils/calculateWorkingMinutes';
import { formatShiftResult } from '../utils/formatShiftResult';
import { parseExpectedShiftToMinutes } from '../utils/time/parseExpectedShift';
import { renderSuccess, renderError, clearResultArea } from '../utils/renderResult';
import { formatTimeToHHMM } from '../utils/time/formatTimeInput';

// ─── Leer DOM ────────────────────────────────────────────────────────────────

function getInputs() {
  return {
    entry:         document.getElementById('entry-time')      as HTMLInputElement | null,
    exit:          document.getElementById('exit-time')       as HTMLInputElement | null,
    breakEl:       document.getElementById('break-time')      as HTMLInputElement | null,
    expectedShift: document.getElementById('expected-shift')  as HTMLInputElement | null,
    resultArea:    document.querySelector('.results-area')    as HTMLElement | null,
  };
}

// ─── Calcular y pintar ───────────────────────────────────────────────────────

function handleCalculate(): void {
  const { entry, exit, breakEl, expectedShift, resultArea } = getInputs();
  if (!entry || !exit || !expectedShift || !resultArea) return;

  const breakMinutes   = parseFloat(breakEl?.value || '') || 0;
  const expectedVal    = expectedShift.value.trim();

  if (!expectedVal) {
    renderError(resultArea, 'Introduce la jornada prevista para calcular las horas extra.');
    return;
  }

  const expectedMinutes = parseExpectedShiftToMinutes(expectedVal);
  if (expectedMinutes === null || expectedMinutes <= 0) {
    renderError(resultArea, expectedMinutes === null
      ? 'Formato de jornada prevista inválido.'
      : 'La jornada prevista debe ser mayor que 0 horas.'
    );
    return;
  }

  const result = calculateWorkingMinutes(entry.value.trim(), exit.value.trim(), breakMinutes);
  if (!result.ok) {
    renderError(resultArea, result.error);
    return;
  }

  const fmt          = formatShiftResult(result.minutes);
  const workedMin    = result.minutes;
  const diff         = workedMin - expectedMinutes;

  let extraLine: string;
  if (diff > 0) {
    const extra = formatShiftResult(diff);
    extraLine = `Horas extra: ${extra.formatted} (${extra.decimal} horas)`;
  } else if (diff === 0) {
    extraLine = `Jornada cumplida: ${fmt.decimal}h`;
  } else {
    const missing = formatShiftResult(Math.abs(diff));
    extraLine = `Faltan para completar la jornada: ${missing.formatted} (${missing.decimal} horas)`;
  }

  renderSuccess(resultArea, [
    { testId: 'total-hours',   text: `Horas trabajadas: ${fmt.formatted}` },
    { testId: 'total-minutes', text: `Minutos totales: ${fmt.totalMinutes} minutos` },
    { testId: 'decimal-hours', text: extraLine },
  ]);
}

function handleReset(): void {
  const { entry, exit, breakEl, expectedShift, resultArea } = getInputs();
  if (entry)         entry.value         = '';
  if (exit)          exit.value          = '';
  if (breakEl)       breakEl.value       = '';
  if (expectedShift) expectedShift.value = '';
  if (resultArea)    clearResultArea(resultArea);
}

// ─── Formato automático de horas ────────────────────────────────────────────

function attachTimeFormatListeners(): void {
  const timeInputIds = ['entry-time', 'exit-time'];
  timeInputIds.forEach(id => {
    const input = document.getElementById(id) as HTMLInputElement | null;
    if (input) {
      input.addEventListener('input', () => {
        input.value = formatTimeToHHMM(input.value);
      });
    }
  });
}

// ─── Eventos ─────────────────────────────────────────────────────────────────

function attachHorasExtraCalculatorEvents(): void {
  attachTimeFormatListeners();
  document.querySelectorAll('[data-event-calculate-hours-extra="true"]').forEach(btn => {
    btn.addEventListener('click', handleCalculate);
  });
  document.querySelectorAll('[data-event-reset="true"]').forEach(btn => {
    btn.addEventListener('click', handleReset);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachHorasExtraCalculatorEvents);
} else {
  setTimeout(attachHorasExtraCalculatorEvents, 100);
}

export { attachHorasExtraCalculatorEvents };
