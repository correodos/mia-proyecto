/**
 * Calculadora de horas trabajadas — adaptador DOM
 */

import { formatTimeToHHMM } from '../utils/time/formatTimeInput';
import { calculateWorkingMinutes } from '../utils/calculateWorkingMinutes';
import { formatShiftResult } from '../utils/formatShiftResult';
import { renderSuccess, renderError, clearResultArea } from '../utils/renderResult';

// ─── Estado de sesión (necesario para que displayResults acceda a decimal) ───
let _lastDecimal = '0.00';

// ─── Leer DOM ────────────────────────────────────────────────────────────────

function getInputs() {
  return {
    entry:     document.getElementById('entry-time')  as HTMLInputElement | null,
    exit:      document.getElementById('exit-time')   as HTMLInputElement | null,
    breakEl:   document.getElementById('break-time')  as HTMLInputElement | null,
    resultArea: document.querySelector('.results-area') as HTMLElement | null,
  };
}

// ─── Calcular y pintar ───────────────────────────────────────────────────────

function handleCalculate(): void {
  const { entry, exit, breakEl, resultArea } = getInputs();
  if (!entry || !exit || !resultArea) return;

  const breakMinutes = parseFloat(breakEl?.value || '') || 0;
  const result = calculateWorkingMinutes(entry.value.trim(), exit.value.trim(), breakMinutes);

  if (!result.ok) {
    renderError(resultArea, result.error);
    return;
  }

  const fmt = formatShiftResult(result.minutes);
  _lastDecimal = fmt.decimal;

  renderSuccess(resultArea, [
    { testId: 'total-hours',   text: `Horas trabajadas: ${fmt.hours} horas` },
    { testId: 'total-minutes', text: `Minutos totales: ${fmt.totalMinutes} minutos` },
    { testId: 'decimal-hours', text: `Horas decimales: ${fmt.decimal}` },
  ]);
}

function handleReset(): void {
  const { entry, exit, breakEl, resultArea } = getInputs();
  if (entry)  entry.value  = '';
  if (exit)   exit.value   = '';
  if (breakEl) breakEl.value = '';
  if (resultArea) clearResultArea(resultArea);
}

// ─── Eventos ─────────────────────────────────────────────────────────────────

function attachEvents(): void {
  document.querySelectorAll('[data-event-calculate="true"]').forEach(btn => {
    btn.addEventListener('click', handleCalculate);
  });
  document.querySelectorAll('[data-event-reset="true"]').forEach(btn => {
    btn.addEventListener('click', handleReset);
  });
}

function setupTimeInputs(): void {
  const entry = document.getElementById('entry-time') as HTMLInputElement | null;
  const exit  = document.getElementById('exit-time')  as HTMLInputElement | null;
  if (entry) entry.addEventListener('input', () => { entry.value = formatTimeToHHMM(entry.value); });
  if (exit)  exit.addEventListener('input',  () => { exit.value  = formatTimeToHHMM(exit.value);  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { setupTimeInputs(); attachEvents(); });
} else {
  setTimeout(() => { setupTimeInputs(); attachEvents(); }, 50);
}

// ─── Exports públicos ────────────────────────────────────────────────────────
// attachButtonEvents: alias para compatibilidad con DailyCalculator.astro
export { attachEvents as attachButtonEvents };
export { handleCalculate as calculateWorkingHours };
