/** Re-exportación de todas las utilidades de tiempo */

export * from './parseTime';
export * from './minutesFromTime';
export * from './diffMinutes';
export * from './applyBreak';
export * from './formatResult';
export * from './calculateExtraHours';
export * from './breakMinutesFromTime';
export * from './parseExpectedShift';

/** Re-exportación de validadores para uso externo */
// No re-exportamos validateExpectedShift porque no debería existir un duplicado confuso