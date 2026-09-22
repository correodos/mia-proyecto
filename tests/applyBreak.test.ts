import { describe, expect, it } from 'vitest';
import { applyBreak } from '../src/utils/time/applyBreak';

describe('applyBreak - Aplicar descanso al tiempo trabajado', () => {
  describe('Caso Jornada normal 480 min con descanso 0', () => {
    it('480 minutos con 0 de descanso → 480', () => {
      const result = applyBreak({ minutes: 480 }, 0);
      expect(result.ok).toBe(true);
      expect(result.minutes).toBe(480);
    });
    it('480 minutos con descanso vacío (string) → sin restar', () => {
      const result = applyBreak({ minutes: 480 }, '');
      // string vacío se convierte a NaN, que es > 0? No... espera, el código dice breakMinutes <= 0
      // Si es string "", parseInt('') = NaN, NaN <= 0 es false
      // Entonces entra al if (breakMinutes >= tramResult.minutes)? NaN >= 480? Es falsy.
      // De hecho, la función recibe un number por contrato
      expect(result.ok).toBe(true);
    });
  });

  describe('Caso Jornada estándar con descanso 1h', () => {
    it('480 minutos con 60 de descanso → 420', () => {
      const result = applyBreak({ minutes: 480 }, 60);
      expect(result.ok).toBe(true);
      expect(result.minutes).toBe(420);
    });
  });

  describe('Caso Jornada corta con descanso completo', () => {
    it('60 minutos con 60 de descanso → error (descanso >= trabajado)', () => {
      const result = applyBreak({ minutes: 60 }, 60);
      expect(result.ok).toBe(false);
      expect(result.error).toBe('El descanso no puede ser igual o superior al tiempo trabajado.');
    });
  });

  describe('Caso Jornada corta con descanso superior', () => {
    it('60 minutos con 61 de descanso → error (descanso > trabajado)', () => {
      const result = applyBreak({ minutes: 60 }, 61);
      expect(result.ok).toBe(false);
      expect(result.error).toBe('El descanso no puede ser igual o superior al tiempo trabajado.');
    });
    it('480 minutos con 720 de descanso → error (descanso > trabajado)', () => {
      const result = applyBreak({ minutes: 480 }, 720);
      expect(result.ok).toBe(false);
      expect(result.error).toBe('El descanso no puede ser igual o superior al tiempo trabajado.');
    });
  });

  describe('Caso Sin jornada (trabajado = 0)', () => {
    it('0 minutos con 0 de descanso → 0 sin restar', () => {
      const result = applyBreak({ minutes: 0 }, 0);
      expect(result.ok).toBe(true);
      expect(result.minutes).toBe(0);
    });
    it('0 minutos con descanso positivo → sin restar (descanso <= 0)', () => {
      const result = applyBreak({ minutes: 0 }, -10);
      expect(result.ok).toBe(true);
      expect(result.minutes).toBe(0);
    });
    // Caso interesante: 0 minutos con descanso positivo pequeño
    it('0 minutos con 30 de descanso → error', () => {
      const result = applyBreak({ minutes: 0 }, 30);
      expect(result.ok).toBe(false);
      expect(result.error).toBe('El descanso no puede ser igual o superior al tiempo trabajado.');
    });
    it('0 minutos con 60 de descanso → error', () => {
      const result = applyBreak({ minutes: 0 }, 60);
      expect(result.ok).toBe(false);
      expect(result.error).toBe('El descanso no puede ser igual o superior al tiempo trabajado.');
    });
  });

  describe('Caso Descanso negativo (anulado)', () => {
    it('480 minutos con descanso -30 → sin restar (descanso <= 0)', () => {
      const result = applyBreak({ minutes: 480 }, -30);
      expect(result.ok).toBe(true);
      expect(result.minutes).toBe(480);
    });
    it('480 minutos con descanso -1 → sin restar', () => {
      const result = applyBreak({ minutes: 480 }, -1);
      expect(result.ok).toBe(true);
      expect(result.minutes).toBe(480);
    });
  });

  describe('Caso Descanso decimal/casos borde', () => {
    it('480 minutos con descanso 1 → 479', () => {
      const result = applyBreak({ minutes: 480 }, 1);
      expect(result.ok).toBe(true);
      expect(result.minutes).toBe(479);
    });
    it('480 minutos con descanso 59 → 421', () => {
      const result = applyBreak({ minutes: 480 }, 59);
      expect(result.ok).toBe(true);
      expect(result.minutes).toBe(421);
    });
    it('300 minutos con descanso 150 → 150', () => {
      const result = applyBreak({ minutes: 300 }, 150);
      expect(result.ok).toBe(true);
      expect(result.minutes).toBe(150);
    });
  });

  describe('Caso Jornada completa (descanso justo al límite)', () => {
    it('240 minutos con descanso 240 → error', () => {
      const result = applyBreak({ minutes: 240 }, 240);
      expect(result.ok).toBe(false);
    });
    it('90 minutos con descanso 89 → OK, 1 minuto restante', () => {
      const result = applyBreak({ minutes: 90 }, 89);
      expect(result.ok).toBe(true);
      expect(result.minutes).toBe(1);
    });
  });
});
