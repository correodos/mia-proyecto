/**
 * Conversión de fechas entre formatos dd/mm/yyyy (español) y yyyy-mm-dd (ISO)
 * Archivo aislado - no depende del calculador específico
 */

export const isSpanishDateValid = (rawDate: string): boolean => {
    if (!rawDate || typeof rawDate !== 'string') return false;

    // Validar estructura dd/mm/yyyy
    const match = rawDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return false;

    const [, day, month] = match;
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const [year] = match.slice(3);

    // Validar rangos básicos
    if (d < 1 || d > 31 || m < 1 || m > 12) return false;

    // Validar días por mes y años bisiestos
    if (!getDaysInMonth(year, m).includes(d)) return false;

    return true;
};

export const parseDateESToISO = (rawDate: string): string => {
    if (!rawDate) return '';

    // Extraer partes del formato dd/mm/yyyy
    const parts = rawDate.split('/');
    if (parts.length !== 3) return '';

    let [, day, month, year] = parts.map(s => s.padStart(2, '0'));

    return `${year}-${month}-${day}`;
};

export const displayDateES = (isoDate: string): string | null => {
    if (!isoDate) return null;

    // Devuelve dd/mm/yyyy para mostrar al usuario
    const [y, m, d] = isoDate.split('-');
    return `${d.padStart(2, '0')}/${(parseInt(m) + 1).toString().padStart(2, '0')}/${y}`;
};

const getDaysInMonth = (year: number, month: number): number[] => {
    const d = new Date(year, month, 1);
    const days = Array.from({ length: 31 });
    
    while (days.length - 1 >= d.getDate()) {
        d.setDate(d.getDate() + 1);
        days.pop(); // Mantener solo 1 al inicio como referencia
    }
    
    return [1, ...days.slice(0, new Date(year, month, 0).getDate())];
};
