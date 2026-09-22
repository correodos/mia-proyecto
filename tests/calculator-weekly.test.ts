import { describe, expect, it } from 'vitest';
import { calculateDailyShift } from '../src/utils/calculateShift';

describe('Calculadora Semanal - Funcion Real Extraida', () => {
  describe('Caso Vacio - Dia no completado', () => {
    it('Lunes sin horarios retorna resultado vacio', () => {
      const result = calculateDailyShift(0, '', '');
      expect(result.minutes).toBeUndefined();
    });
    it('Martes solo entrada retorna null', () => {
      const result = calculateDailyShift(1, '09:00', '');
      expect(result.minutes).toBeUndefined();
    });
    it('Jueves sin entradas devuelve resultado vacio valido', () => {
      const result = calculateDailyShift(3, '', '');
      expect(result.minutes).toBeUndefined();
    });
  });
  describe('Caso Formato Invalido - Error de entrada', () => {
    it('Entrada sin formato correcto retorna error', () => {
      const result = calculateDailyShift(0, '0900', '18:00');
      expect(result.error).toBe('Formato de hora inválido');
    });
    it('Ambos inputs inválidos retornan error', () => {
      const result = calculateDailyShift(0, 'abcde', 'xyzzy');
      expect(result.error).toBe('Formato de hora inválido');
    });
  });
  describe('Caso Jornada Normal - Sin cruce medianoche', () => {
    it('Lunes jornada estandar 8h (09:00->17:00)', () => {
      const result = calculateDailyShift(0, '09:00', '17:00');
      expect(result.minutes).toBe(480);
    });
    it('Lunes jornada con descanso: 09:00->18:00 con 60 min = 8h (no 9h)', () => {
      const result = calculateDailyShift(0, '09:00', '18:00', 60);
      expect(result.minutes).toBe(480); // 9horas - 1hora descanso = 8horas
      expect(result.formatted).toBe('8h 0m');
    });
    it('Martes jornada 5h (08:00->13:00)', () => {
      const result = calculateDailyShift(1, '08:00', '13:00');
      expect(result.decimal).toBe('5.00');
    });
    it('Miercoles jornada de 2h (14:00->16:00)', () => {
      const result = calculateDailyShift(2, '14:00', '16:00');
      expect(result.decimal).toBe('2.00');
    });
    it('Jueves jornada corta 1h (15:30->16:30)', () => {
      const result = calculateDailyShift(3, '15:30', '16:30');
      expect(result.decimal).toBe('1.00');
    });
    it('Viernes jornada 7h (08:30->15:30)', () => {
      const result = calculateDailyShift(4, '08:30', '15:30');
      expect(result.decimal).toBe('7.00');
    });
    it('Sabado jornada 9h (08:00->17:00)', () => {
      const result = calculateDailyShift(5, '08:00', '17:00');
      expect(result.minutes).toBe(540);
    });
    it('Domingo jornada 2h (10:00->12:00)', () => {
      const result = calculateDailyShift(6, '10:00', '12:00');
      expect(result.decimal).toBe('2.00');
    });
    it('Jornada con 30 minutos exactos (10:00->11:30)', () => {
      const result = calculateDailyShift(6, '10:00', '11:30');
      expect(result.decimal).toBe('1.50');
    });
    it('Jornada de 3h 45min exactas (12:15->16:00)', () => {
      const result = calculateDailyShift(0, '12:15', '16:00');
      expect(result.minutes).toBe(225);
    });
  });
  describe('Caso Cruce Medianoche - Noches continuas', () => {
    it('Viernes tardio: 23:00->03:00 = 4h con cruce medianoche', () => {
      const result = calculateDailyShift(4, '23:00', '03:00');
      expect(result.minutes).toBe(240);
    });
    it('Sabado muy tarde: 22:30->05:00 = 6h 30min con cruce', () => {
      const result = calculateDailyShift(5, '22:30', '05:00');
      expect(result.minutes).toBe(390);
    });
    it('Domingo madrugada temprana: 02:00->08:00 = 6h', () => {
      const result = calculateDailyShift(6, '02:00', '08:00');
      expect(result.decimal).toBe('6.00');
    });
    it('Domingo madrugada completa: 00:00->08:00 = 8h', () => {
      const result = calculateDailyShift(6, '00:00', '08:00');
      expect(result.decimal).toBe('8.00');
    });
    it('Sabado salida igual entrada: 00:00->00:00 = 0 min', () => {
      const result = calculateDailyShift(5, '00:00', '00:00');
      expect(result.minutes).toBe(0);
    });
    it('Martes salida proxima a entrada: 23:58->00:02 = 4min', () => {
      const result = calculateDailyShift(1, '23:58', '00:02');
      expect(result.minutes).toBe(4);
    });
    it('Lunes cruce medianoche sin descanso: 23:30->06:30 (de 23:30 a 06:30)', () => {
      const result = calculateDailyShift(0, '23:30', '06:30');
      // De 23:30 a 24:00 = 30 min (0.5h) + de 00:00 a 06:30 = 6.5h = 7h total
      expect(result.decimal).toBe('7.00'); // 7 horas trabajadas exactas, no 7.5
    });
    it('Domingo jornada nocturna completa: 01:00->10:00 = 9h con cruce', () => {
      const result = calculateDailyShift(6, '01:00', '10:00');
      expect(result.minutes).toBe(540);
    });
  });
});
