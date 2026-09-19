// Tipos definitivos para lógica de tiempo
export interface Hour {
  hours: number;     // 0-23
  minutes: number;   // 0-59
}

export interface Shift {
  entry: Hour;
  exit: Hour;
}

export interface DailyEntry {
  shifts: Shift[];              // 1 o 2 tramos
  breakMinutes?: number | null; // Solo si hay 1 tramo
}

export interface ShiftResult {
  minutes: number;              // Duración en minutos (enteros)
  isNightShift: boolean;        // true si cruza medianoche
}

export interface DailyResult {
  shiftResults: ShiftResult[];
  totalMinutes: number;         // Suma de todos los tramos
  decimalHours: number;         // totalMinutes / 60
}

export type ValidationError =
  | { field: 'entry'; message: string }
  | { field: 'exit'; message: string }
  | { field: 'break'; message: string };

export type ValidationResult =
  | { isValid: true }
  | { isValid: false; errors: ValidationError[] };