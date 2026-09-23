/**
 * Utilidades DOM compartidas entre todas las calculadoras.
 * Evita duplicar showError/renderSuccess en cada script.
 */

export interface ResultItem {
  testId: string;
  text: string;
}

/**
 * Pinta un conjunto de ítems en el área de resultados.
 */
export function renderSuccess(area: HTMLElement, items: ResultItem[]): void {
  area.innerHTML = '<h3 id="result-heading">Resultados</h3>';

  const ul = document.createElement('ul');
  ul.className = 'result-list';
  ul.setAttribute('role', 'list');

  for (const item of items) {
    const li = document.createElement('li');
    li.setAttribute('data-testid', item.testId);
    li.textContent = item.text;
    ul.appendChild(li);
  }

  area.appendChild(ul);
}

/**
 * Pinta un mensaje de error en el área de resultados.
 */
export function renderError(area: HTMLElement, message: string): void {
  area.innerHTML = '<h3 id="result-heading">Resultados</h3>';

  const ul = document.createElement('ul');
  ul.className = 'result-list';
  ul.setAttribute('role', 'list');

  const li = document.createElement('li');
  li.className = 'error-message';
  li.textContent = message;
  ul.appendChild(li);

  area.appendChild(ul);
}

/**
 * Limpia el área de resultados al estado inicial.
 */
export function clearResultArea(area: HTMLElement): void {
  area.innerHTML = '<h3 id="result-heading">Resultados</h3>';
}
