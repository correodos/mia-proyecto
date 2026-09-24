import { formatTimeToHHMM } from '../utils/time/formatTimeInput.js';
import { parseTime as parseTimeString } from '../utils/time/parseTime.js';
import { calculateDateDiff } from '../utils/time/dateDiffMinutes.js';
import { renderSuccess, renderError, clearResultArea } from '../utils/renderResult.js';

const getInput = (id: string) => document.getElementById(id);

const formatDateES = (isoDate: string): string => {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return '';
  return `${String(parts[2]).padStart(2, '0')}/${String(parts[1]).padStart(2, '0')}/${parts[0]}`;
};

const formatTimeInput = (event: Event): void => {
  const target = event.target;
  if (target instanceof HTMLInputElement) {
    target.value = formatTimeToHHMM(target.value);
  }
};

const showErrorMessage = (element: HTMLElement, message: string): void => {
  if (!element || !message) return;
  element.innerHTML = `
    <h3 id="result-heading">Resultados</h3>
    <p class="error-message">${message}</p>
  `;
};

const resetCalculator = (): void => {
  const dateFrom = getInput('date-from');
  const dateTo = getInput('date-to');
  const timeFrom = getInput('time-from');
  const timeTo = getInput('time-to');

  if (dateFrom) dateFrom.value = '';
  if (dateTo) dateTo.value = '';
  if (timeFrom) timeFrom.value = '';
  if (timeTo) timeTo.value = '';

  const resultArea = document.querySelector('.between-dates-results-area');
  if (resultArea) {
    resultArea.innerHTML = `
      <h3 id="result-heading">Resultados</h3>
      <p class="empty-state placeholder-text">Selecciona las fechas para calcular el tiempo transcurrido.</p>
    `;
  }
};

const showCalculationResult = (resultArea: HTMLElement, result: { days: number; hours: number; minutes: number; totalHours: string }): void => {
  const totalHoursString = `${result.days} día${result.days !== 1 ? 's' : ''}, ${result.hours}h ${result.minutes.toString().padStart(2, '0')} min`;

  resultArea.innerHTML = `
    <h3 id="result-heading">Resultados</h3>
    <div class="time-spent-label">Tiempo transcurrido: <strong>${totalHoursString}</strong></div>
    <div class="total-hours-label">Total: <strong>${result.totalHours} horas</strong></div>
  `;
};

const attachTimeInputListeners = (): void => {
  const fromInput = getInput('time-from');
  const toInput = getInput('time-to');

  if (fromInput) fromInput.addEventListener('input', formatTimeInput);
  if (toInput) toInput.addEventListener('input', formatTimeInput);
};

const attachCalculateListeners = (): void => {
  const calculateBtns = document.querySelectorAll('[data-event-calculate-fdates="true"]');

  calculateBtns.forEach(button => {
    button.addEventListener('click', () => {
      const dateFromInput = getInput('date-from');
      const timeFromInput = getInput('time-from');
      const dateToInput = getInput('date-to');
      const timeToInput = getInput('time-to');
      const resultArea = document.querySelector('.between-dates-results-area');

      if (!resultArea) return;

      const fromDateISO = dateFromInput?.value || '';
      const toDateISO = dateToInput?.value || '';
      const fromHoursRaw = timeFromInput?.value || '';
      const toHoursRaw = timeToInput?.value || '';

      const isEmptyTime = (v: string) => !v || v === '--:--';

      if (!isEmptyTime(fromHoursRaw) && !parseTimeString(fromHoursRaw)) {
        showErrorMessage(resultArea, 'Formato de hora inicial inválido.');
        return;
      }

      if (!isEmptyTime(toHoursRaw) && !parseTimeString(toHoursRaw)) {
        showErrorMessage(resultArea, 'Formato de hora final inválido.');
        return;
      }

      const fromHoursEffective = isEmptyTime(fromHoursRaw) ? '00:00' : fromHoursRaw;
      const toHoursEffective = isEmptyTime(toHoursRaw) ? '00:00' : toHoursRaw;

      const result = calculateDateDiff(fromDateISO, fromHoursEffective, toDateISO, toHoursEffective);

      if (result.ok) {
        showCalculationResult(resultArea, result);
      } else {
        showErrorMessage(resultArea, result.error || 'Error en el cálculo');
      }
    });
  });
};

const attachResetListener = (): void => {
  const resetBtn = getInput('reset-btn-betweendates');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetCalculator);
  }
};

const init = (): void => {
  attachTimeInputListeners();
  attachCalculateListeners();
  attachResetListener();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { init as initBetweenDatesCalculator };