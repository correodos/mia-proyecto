// Cookie Consent Logic - Consent Mode v2 for GA4
// Este archivo contiene la lógica de consentimiento separada del componente Astro

const CONSENT_KEY = 'cookie_consent_v1';
const CONSENT_VERSION = 'v1';
const GA_ID = 'G-3PEHEG5Z29';

// Estado por defecto
function getDefaultConsent() {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: null, // null = no decidido, true = aceptado, false = rechazado
    timestamp: Date.now(),
  };
}

// Cargar consentimiento guardado
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

// Guardar consentimiento
function saveConsent(consent) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // Ignorar errores (modo privado, quota, etc.)
  }
}

// Verificar si hay decisión
function hasDecision() {
  const consent = loadConsent();
  return consent.analytics !== null;
}

// Verificar si analytics permitido
function isAnalyticsAllowed() {
  const consent = loadConsent();
  return consent.analytics === true;
}

// Consent Mode v2 - Estado inicial (antes de carga gtag)
// IMPORTANTE: Se ejecuta ANTES de que se cargue gtag.js
// analytics_storage='denied' = no cookies analíticas hasta consentimiento
// ad_storage='denied' = no cookies publicitarias (futuro AdSense)
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  wait_for_update: 500, // ms para esperar actualización de consentimiento
});
gtag('js', new Date());

// Configurar GA4 con Consent Mode
gtag('config', 'G-3PEHEG5Z29', {
  // No enviar page_view automático hasta consentimiento
  send_page_view: false,
});

// Actualizar Consent Mode según decisión guardada
function updateConsentMode(consent) {
  const analyticsGranted = consent.analytics === true ? 'granted' : 'denied';
  gtag('consent', 'update', {
    analytics_storage: analyticsGranted,
  });
  // Si se concede consentimiento, enviar page_view
  if (consent.analytics === true) {
    gtag('event', 'page_view');
  }
}

// Aplicar consentimiento al cargar
const initialConsent = loadConsent();
updateConsentMode(initialConsent);

// ============================================
// UI - Banner y Panel
// ============================================
const banner = document.getElementById('cookie-banner');
const panel = document.getElementById('cookie-panel');
const analyticsToggle = document.getElementById('analytics-toggle');
const root = document.getElementById('cookie-consent-root');

// Mostrar banner si no hay decisión
function showBanner() {
  if (banner && !hasDecision()) {
    banner.hidden = false;
    // Focus en primer botón para accesibilidad
    setTimeout(() => {
      const acceptBtn = banner.querySelector('[data-action="accept-all"]');
      if (acceptBtn) acceptBtn.focus();
    }, 100);
  }
}

// Ocultar banner
function hideBanner() {
  if (banner) banner.hidden = true;
}

// Mostrar panel
function showPanel() {
  if (panel) {
    panel.hidden = false;
    document.body.style.overflow = 'hidden';
    // Sync toggle con estado actual
    if (analyticsToggle) {
      analyticsToggle.checked = isAnalyticsAllowed();
    }
    // Focus en cerrar para accesibilidad
    setTimeout(() => {
      const closeBtn = panel.querySelector('[data-action="close-panel"]');
      if (closeBtn) closeBtn.focus();
    }, 100);
  }
}

// Ocultar panel
function hidePanel() {
  if (panel) {
    panel.hidden = true;
    document.body.style.overflow = '';
  }
}

// Guardar preferencias del panel
function savePanelPreferences() {
  const consent = loadConsent();
  consent.analytics = analyticsToggle ? analyticsToggle.checked : false;
  consent.timestamp = Date.now();
  saveConsent(consent);
  updateConsentMode(consent);
  hidePanel();
}

// Aceptar todo
function acceptAll() {
  const consent = {
    version: 'v1',
    necessary: true,
    analytics: true,
    timestamp: Date.now(),
  };
  saveConsent(consent);
  updateConsentMode(consent);
  hideBanner();
  hidePanel();
}

// Rechazar todo (solo necesarias)
function rejectAll() {
  const consent = {
    version: 'v1',
    necessary: true,
    analytics: false,
    timestamp: Date.now(),
  };
  saveConsent(consent);
  updateConsentMode(consent);
  hideBanner();
  hidePanel();
}

// Event listeners (delegación en root)
if (root) {
  root.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.dataset.action;
    if (!action) return;

    switch (action) {
      case 'accept-all':
        acceptAll();
        break;
      case 'reject-all':
        rejectAll();
        break;
      case 'configure':
        showPanel();
        break;
      case 'save-preferences':
        savePanelPreferences();
        break;
      case 'close-panel':
        hidePanel();
        break;
    }
  });

  // Toggle analytics en panel
  if (analyticsToggle) {
    analyticsToggle.addEventListener('change', () => {
      // No guardar automáticamente, esperar a "Guardar preferencias"
    });
  }
}

// Enlace en footer para reabrir panel
document.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.id === 'cookie-settings-link' || target.closest('#cookie-settings-link')) {
    e.preventDefault();
    showPanel();
  }
});

// Tecla Escape para cerrar panel
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && panel && !panel.hidden) {
    hidePanel();
  }
});

// Inicialización
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', showBanner);
} else {
  showBanner();
}

// Exportar funciones para tests
export {
  getDefaultConsent,
  loadConsent,
  saveConsent,
  hasDecision,
  isAnalyticsAllowed,
  updateConsentMode,
  acceptAll,
  rejectAll,
  showPanel,
  hidePanel,
};