import { describe, it, expect } from 'vitest';
import { parseTime, calculateSplitShift, getBreakBetweenShifts } from '../src/scripts/splitShiftCalculator.js';

describe('Calculadora jornada partida', () => {
  describe('Parsear horas', () => {
    it('HH:MM valido', () => {
      const r = parseTime('09:00');
      expect(r.ok).toBe(true);
      expect(r.minutes).toBe(540);
    });

    it('HHMM sin puntos', () => {
      const r = parseTime('0900');
      expect(r.ok).toBe(true);
    });

    it('00:00 es valido', () => {
      const r = parseTime('00:00');
      expect(r.ok).toBe(true);
      expect(r.minutes).toBe(0);
    });

    it('25:00 fuera de rango', () => {
      const r = parseTime('25:00');
      expect(r.ok).toBe(false);
    });

    it('Formato invalido 09:75', () => {
      const r = parseTime('09:75');
      expect(r.ok).toBe(false);
    });

    it('Formato incompleto 09 solo', () => {
      const r = parseTime('09');
      expect(r.ok).toBe(false);
    });

    it('Formato decimal 9.30 invalido', () => {
      const r = parseTime('9.30');
      expect(r.ok).toBe(false);
    });
  });

  describe('Calculos basicos de jornada partida', () => {
    it('09:00-14:00 + 16:00-19:00 = 8h trabajadas', () => {
      const r = calculateSplitShift('09:00', '14:00', '16:00', '19:00');
      expect(r.ok).toBe(true);
      expect(r.part1Hours).toBe(5);
      expect(r.part2Hours).toBe(3);
    });

    it('08:00-13:00 + 14:00-18:00 = 9h trabajadas', () => {
      const r = calculateSplitShift('08:00', '13:00', '14:00', '18:00');
      expect(r.ok).toBe(true);
      expect(r.part1Hours).toBe(5);
      expect(r.part2Hours).toBe(4);
    });

    it('Tramos seguidos sin descanso 09:00-12:00 + 12:00-15:00', () => {
      const r = calculateSplitShift('09:00', '12:00', '12:00', '15:00');
      expect(r.ok).toBe(true);
    });

    it('Primer tramo medianoche 23:00-01:00 = 2h', () => {
      const r = calculateSplitShift('23:00', '01:00', '04:00', '07:00');
      expect(r.ok).toBe(true);
      expect(r.part1Hours).toBe(2);
    });

    it('Segundo tramo cruzando medianoche', () => {
      const r = calculateSplitShift('08:00', '13:00', '23:00', '02:00');
      expect(r.ok).toBe(true);
      expect(r.part2Hours).toBe(3);
    });

    it('Tramos consecutivos validos', () => {
      const r = calculateSplitShift('09:00', '14:00', '14:00', '17:00');
      expect(r.ok).toBe(true);
    });

    it('Tramo de 1 minuto', () => {
      const r = calculateSplitShift('09:00', '09:01', '18:00', '21:00');
      expect(r.ok).toBe(true);
      expect(r.part1Minutes).toBe(1);
    });
  });

  describe('Calculo de descanso automatico', () => {
    it('09:00-14:00 + 16:00-19:00 -> descanso 2h 00m = 120 min', () => {
      // Salida 14:00 (840 min), Entrada 16:00 (960 min)
      // Descanso automatico = max(0, 960-840) = 120 min
      const breakMins = getBreakBetweenShifts('14:00', '16:00');
      expect(breakMins).toBe(120);
    });

    it('08:00-13:00 + 14:00-18:00 -> descanso 1h 00m = 60 min', () => {
      // Salida 13:00 (780 min), Entrada 14:00 (840 min)
      // Descanso automatico = max(0, 840-780) = 60 min
      const breakMins = getBreakBetweenShifts('13:00', '14:00');
      expect(breakMins).toBe(60);
    });

    it('Tramos seguidos sin descanso 12:00-12:00', () => {
      // Salida 12:00 (720 min), Entrada 12:00 (720 min)
      // Descanso automatico = max(0, 720-720) = 0 min
      const breakMins = getBreakBetweenShifts('12:00', '12:00');
      expect(breakMins).toBe(0);
    });

    it('Descanso de 30 minutos 12:00-12:30', () => {
      // Salida 12:00 (720 min), Entrada 12:30 (750 min)
      // Descanso automatico = max(0, 750-720) = 30 min
      const breakMins = getBreakBetweenShifts('12:00', '12:30');
      expect(breakMins).toBe(30);
    });

    it('Descanso de 45 minutos 11:30-12:15', () => {
      // Salida 11:30 (690 min), Entrada 12:15 (735 min)
      // Descanso automatico = max(0, 735-690) = 45 min
      const breakMins = getBreakBetweenShifts('11:30', '12:15');
      expect(breakMins).toBe(45);
    });

    it('Descanso de 60 minutos 11:00-12:00', () => {
      // Salida 11:00 (660 min), Entrada 12:00 (720 min)
      // Descanso automatico = max(0, 720-660) = 60 min
      const breakMins = getBreakBetweenShifts('11:00', '12:00');
      expect(breakMins).toBe(60);
    });

    it('Descanso de 90 minutos 10:00-11:30', () => {
      // Salida 10:00 (600 min), Entrada 11:30 (690 min)
      // Descanso automatico = max(0, 690-600) = 90 min
      const breakMins = getBreakBetweenShifts('10:00', '11:30');
      expect(breakMins).toBe(90);
    });

    it('Tramos medianoche sin descanso', () => {
      // Salida 01:00 (60 min), Entrada 04:00 (240 min) - tramo que cruza medianoche
      // Descanso automatico = max(0, 240-60) = 180 min = 3h descanso
      const breakMins = getBreakBetweenShifts('01:00', '04:00');
      expect(breakMins).toBe(180);
    });

    it('Tramos consecutivos con 0 minutos', () => {
      // Salida 09:00 (540 min), Entrada 09:00 (540 min)
      // Descanso automatico = max(0, 540-540) = 0 min
      const breakMins = getBreakBetweenShifts('09:00', '09:00');
      expect(breakMins).toBe(0);
    });

    it('Tramos con descanso de 2 horas', () => {
      // Salida 08:30 (510 min), Entrada 10:30 (630 min)
      // Descanso automatico = max(0, 630-510) = 120 min = 2h descanso
      const breakMins = getBreakBetweenShifts('08:30', '10:30');
      expect(breakMins).toBe(120);
    });

    it('Descanso de 15 minutos 07:45-08:00', () => {
      // Salida 07:45 (465 min), Entrada 08:00 (480 min)
      // Descanso automatico = max(0, 480-465) = 15 min
      const breakMins = getBreakBetweenShifts('07:45', '08:00');
      expect(breakMins).toBe(15);
    });

    it('Descanso de 1h 30m 06:00-07:30', () => {
      // Salida 06:00 (360 min), Entrada 07:30 (450 min)
      // Descanso automatico = max(0, 450-360) = 90 min = 1h 30m
      const breakMins = getBreakBetweenShifts('06:00', '07:30');
      expect(breakMins).toBe(90);
    });

    it('Descanso de 2 horas exactas 07:00-09:00', () => {
      // Salida 07:00 (420 min), Entrada 09:00 (540 min)
      // Descanso automatico = max(0, 540-420) = 120 min = 2h
      const breakMins = getBreakBetweenShifts('07:00', '09:00');
      expect(breakMins).toBe(120);
    });
  });

  describe('Validaciones', () => {
    it('Campos vacios error', () => {
      const r = calculateSplitShift('', '', '18:00', '22:00');
      expect(r.ok).toBe(false);
    });

    it('Formato invalido 09:75', () => {
      const r = calculateSplitShift('09:75', '14:00', '16:00', '19:00');
      expect(r.ok).toBe(false);
    });

    it('Tramos solapados error', () => {
      const r = calculateSplitShift('09:00', '14:00', '13:00', '16:00');
      expect(r.ok).toBe(false);
    });

    it('Ejemplo tipico 09:00-14:00 + 16:00-19:00', () => {
      const r = calculateSplitShift('09:00', '14:00', '16:00', '19:00');
      expect(r.ok).toBe(true);
      expect(r.part1Hours).toBe(5);
      expect(r.part2Hours).toBe(3);
    });

    it('Ejemplo 08:00-13:00 + 14:00-18:00', () => {
      const r = calculateSplitShift('08:00', '13:00', '14:00', '18:00');
      expect(r.ok).toBe(true);
      expect(r.part1Hours).toBe(5);
      expect(r.part2Hours).toBe(4);
    });

    it('Tramos consecutivos sin descanso', () => {
      const r = calculateSplitShift('09:00', '12:00', '12:00', '15:00');
      expect(r.ok).toBe(true);
    });
  });
});
