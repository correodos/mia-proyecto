/**
 * Calculadora de jornada partida - Componente Astro
 */

import type { Hour } from '../../types/index';

export interface DailyEntry {
  shifts: {
    part1: { entry: Hour; exit: Hour };
    part2: { entry: Hour; exit: Hour };
  };
  breakMinutes: number | null;
}
