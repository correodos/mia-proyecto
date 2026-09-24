import { describe, it, expect, beforeEach, vi } from 'vitest';

const CONSENT_KEY = 'cookie_consent_v1';
const CONSENT_VERSION = 'v1';

function getDefaultConsent() {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: null,
    timestamp: Date.now(),
  };
}

function loadConsent() {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return getDefaultConsent();
    const parsed = JSON.parse(stored);
    if (parsed.version !== CONSENT_VERSION) return getDefaultConsent();
    if (typeof parsed.necessary !== 'boolean') return getDefaultConsent();
    if (parsed.analytics !== true && parsed.analytics !== false && parsed.analytics !== null) {
      return getDefaultConsent();
    }
    return { ...getDefaultConsent(), ...parsed };
  } catch {
    return getDefaultConsent();
  }
}

function saveConsent(consent) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // Ignorar errores
  }
}

function hasDecision() {
  const consent = loadConsent();
  return consent.analytics !== null;
}

function isAnalyticsAllowed() {
  const consent = loadConsent();
  return consent.analytics === true;
}

function clearConsent() {
  localStorage.removeItem(CONSENT_KEY);
}

describe('Cookie Consent Logic', () => {
  beforeEach(() => {
    clearConsent();
    vi.useFakeTimers();
  });

  it('estado inicial sin consentimiento devuelve valores por defecto', () => {
    const consent = loadConsent();
    expect(consent).toEqual({
      version: 'v1',
      necessary: true,
      analytics: null,
      timestamp: expect.any(Number),
    });
  });

  it('aceptar analíticas guarda consentimiento correctamente', () => {
    const consent = {
      version: 'v1',
      necessary: true,
      analytics: true,
      timestamp: Date.now(),
    };
    saveConsent(consent);
    const loaded = loadConsent();
    expect(loaded.analytics).toBe(true);
    expect(loaded.necessary).toBe(true);
    expect(loaded.version).toBe('v1');
    expect(hasDecision()).toBe(true);
    expect(isAnalyticsAllowed()).toBe(true);
  });

  it('rechazar analíticas guarda consentimiento correctamente', () => {
    const consent = {
      version: 'v1',
      necessary: true,
      analytics: false,
      timestamp: Date.now(),
    };
    saveConsent(consent);
    const loaded = loadConsent();
    expect(loaded.analytics).toBe(false);
    expect(isAnalyticsAllowed()).toBe(false);
    expect(hasDecision()).toBe(true);
  });

  it('guardado de preferencia persiste entre cargas', () => {
    const consent = {
      version: 'v1',
      necessary: true,
      analytics: true,
      timestamp: Date.now(),
    };
    saveConsent(consent);
    // Simular nueva carga
    const loaded = loadConsent();
    expect(loaded.analytics).toBe(true);
  });

  it('lectura de preferencia existente funciona correctamente', () => {
    const consent = {
      version: 'v1',
      necessary: true,
      analytics: false,
      timestamp: Date.now(),
    };
    saveConsent(consent);
    const loaded = loadConsent();
    expect(loaded.analytics).toBe(false);
    expect(isAnalyticsAllowed()).toBe(false);
  });

  it('cambio posterior de preferencias actualiza correctamente', () => {
    // Primero aceptar
    saveConsent({ version: 'v1', necessary: true, analytics: true, timestamp: Date.now() });
    expect(isAnalyticsAllowed()).toBe(true);

    // Luego rechazar
    saveConsent({ version: 'v1', necessary: true, analytics: false, timestamp: Date.now() });
    expect(isAnalyticsAllowed()).toBe(false);
    expect(hasDecision()).toBe(true);
  });

  it('valores desconocidos o corruptos en storage no provocan errores', () => {
    // JSON inválido
    localStorage.setItem(CONSENT_KEY, 'invalid json');
    expect(() => loadConsent()).not.toThrow();
    expect(loadConsent()).toEqual(getDefaultConsent());

    // Versión incorrecta
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: 'v2', necessary: true, analytics: true, timestamp: Date.now() }));
    expect(loadConsent()).toEqual(getDefaultConsent());

    // Estructura inválida
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: 'v1', necessary: 'yes', analytics: 'maybe' }));
    expect(loadConsent()).toEqual(getDefaultConsent());

    // analytics con valor inválido
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: 'v1', necessary: true, analytics: 'yes', timestamp: Date.now() }));
    expect(loadConsent()).toEqual(getDefaultConsent());
  });

  it('ausencia de consentimiento no rompe la lógica', () => {
    clearConsent();
    expect(hasDecision()).toBe(false);
    expect(isAnalyticsAllowed()).toBe(false);
    expect(loadConsent()).toEqual(getDefaultConsent());
  });

  it('guarda timestamp en cada cambio', () => {
    const before = Date.now();
    saveConsent({ version: 'v1', necessary: true, analytics: true, timestamp: before });
    const loaded = loadConsent();
    expect(loaded.timestamp).toBeGreaterThanOrEqual(before);
  });
});