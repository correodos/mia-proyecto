import { calculateDailyShift } from '../utils/calculateShift.js';
import { formatTimeToHHMM } from '../utils/time/formatTimeInput.js';

const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const dayPrefixes = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];

const formatCompact = (minutes: number): string => {
  if (!minutes || minutes <= 0) return '0 h 0 min';
  const hrs = Math.floor(minutes / 60);
  const fractionalMinutes = Math.round(minutes % 60);
  return `${hrs}h ${fractionalMinutes < 10 ? '0' : ''}${fractionalMinutes} min`;
};

const calculateWeekly = (): (Record<string, unknown> | null)[] => {
  const dailyResults: (Record<string, unknown> | null)[] = [];

  dayPrefixes.forEach((prefix, index) => {
    const entryInput = document.getElementById(prefix + '-entry');
    const exitInput = document.getElementById(prefix + '-exit');
    const breakInput = document.getElementById(prefix + '-break');

    if (!entryInput || !exitInput) {
      dailyResults.push(null);
      return;
    }

    const entryVal = entryInput.value.trim();
    const exitVal = exitInput.value.trim();

    if (!entryVal || !exitVal) {
      dailyResults.push(null);
      return;
    }

    const breakMinutes = breakInput?.value !== '' ? Number(breakInput.value) || 0 : 0;
    const result = calculateDailyShift(index, entryVal, exitVal, breakMinutes);

    if (result) {
      dailyResults.push(result);
    } else {
      dailyResults.push(null);
    }
  });

  return dailyResults;
};

const displayResults = (dailyResults: (Record<string, unknown> | null)[]): void => {
  const resultArea = document.getElementById('results-area');
  if (!resultArea) return;

  const validDays = dailyResults.filter((d): d is Record<string, unknown> => d !== null);
  const totalMinutes = validDays.reduce((sum, d) => sum + (Number(d.minutes) || 0), 0);

  resultArea.innerHTML = '';

  const h3 = document.createElement('h3');
  h3.style.marginTop = '0';
  h3.style.marginBottom = '.5rem';
  h3.textContent = 'Resultados';
  resultArea.appendChild(h3);

  if (totalMinutes === 0 && validDays.length === 0) {
    const p = document.createElement('p');
    p.style.margin = '0.5rem auto';
    p.textContent = '0 h 0 min (0.00 horas)';
    resultArea.appendChild(p);
    return;
  }

  const ul = document.createElement('ul');
  ul.id = 'result-list';
  ul.className = 'result-list';
  ul.setAttribute('role', 'list');

  validDays.forEach((dayData) => {
    const li = document.createElement('li');
    
    if (dayData.error) {
      li.style.color = '#ef4444';
      li.textContent = `${dayData.dayName}: ${dayData.error}`;
    } else if (dayData.formatted && typeof dayData.formatted === 'string') {
      li.textContent = `${dayData.dayName}: ${dayData.formatted}`;
    } else if (Number(dayData.minutes) > 0) {
      const formatted = dayData.formatted as string || formatCompact(Number(dayData.minutes));
      li.textContent = `${dayData.dayName}: ${formatted}`;
    }
    
    ul.appendChild(li);
  });
  
  resultArea.appendChild(ul);

  if (totalMinutes > 0) {
    const summary = document.createElement('p');
    summary.style.marginTop = '1rem';
    summary.style.fontWeight = 'bold';
    
    const hoursTotal = Math.floor(totalMinutes / 60);
    const fractionalTotal = totalMinutes % 60;
    
    summary.textContent = `Total semanal: ${hoursTotal}h ${fractionalTotal < 10 ? '0' : ''}${fractionalTotal} min`;
    resultArea.appendChild(summary);
  } else if (validDays.length > 0) {
    const errors = validDays.filter(d => d.error);
    if (errors.length === validDays.length) {
      const pAllErrors = document.createElement('p');
      pAllErrors.style.marginTop = '1rem';
      pAllErrors.style.color = '#ef4444';
      pAllErrors.textContent = `Días con errores:`;
      resultArea.appendChild(pAllErrors);
    }
  }
};

const setupTimeInputs = (): void => {
  dayPrefixes.forEach((prefix) => {
    const entryInput = document.getElementById(prefix + '-entry');
    const exitInput = document.getElementById(prefix + '-exit');

    if (entryInput) applyFormatToHHMM(entryInput);
    if (exitInput) applyFormatToHHMM(exitInput);
  });
};

const applyFormatToHHMM = (inputElement: HTMLInputElement): void => {
  if (!inputElement) return;
  
  const originalPlaceholder = inputElement.placeholder ?? '--:--';
  
  inputElement.addEventListener('input', () => {
    if (inputElement.value === '') {
      inputElement.placeholder = originalPlaceholder;
    } else {
      inputElement.value = formatTimeToHHMM(inputElement.value);
    }
  });
};

const handleCalculate = (): void => {
  const dailyResults = calculateWeekly();
  displayResults(dailyResults);
};

const handleReset = (): void => {
  dayPrefixes.forEach((prefix) => {
    const entryInput = document.getElementById(prefix + '-entry');
    const exitInput = document.getElementById(prefix + '-exit');
    const breakInput = document.getElementById(prefix + '-break');

    if (entryInput) entryInput.value = '';
    if (exitInput) exitInput.value = '';
    if (breakInput) breakInput.value = '';
  });
  
  const resultArea = document.getElementById('results-area');
  if (resultArea) {
    resultArea.innerHTML = '<h3 style="margin-top:0;margin-bottom:.5rem">Resultados</h3>';
  }
};

const init = (): void => {
  setupTimeInputs();
  const calculateBtn = document.getElementById('calculate-weekly-btn');
  const resetBtn = document.getElementById('reset-weekly-btn');

  if (calculateBtn) {
    calculateBtn.addEventListener('click', handleCalculate);
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', handleReset);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { init as initWeeklyCalculator };