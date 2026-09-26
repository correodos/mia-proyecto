# MiA - Herramientas de Tiempo

Calculadoras gratuitas en español para horas trabajadas, jornadas y turnos. Sin registro, sin instalación, cálculos en el navegador.

## 🛠 Herramientas

### Calculadoras

| Herramienta | Descripción |
|-------------|-------------|
| [Calculadora de horas trabajadas](/calculadora-horas/) | Entrada, salida y descanso → tiempo neto (horas/minutos/decimal) |
| [Calculadora semanal](/calculadora-semanal-horas/) | Suma jornadas L–D con múltiples tramos por día |
| [Calculadora de horas extra](/calculadora-horas-extra/) | Extra vs jornada prevista, incluye turnos nocturnos |
| [Calculadora de jornada partida](/calculadora-jornada-partida/) | Turnos divididos en 2+ tramos con descanso automático |
| [Calculadora entre fechas](/calculadora-entre-fechas/) | Días, horas y minutos entre dos fechas con horas opcionales |

### Guías

| Guía | Tema |
|------|------|
| [Cómo calcular las horas trabajadas](/como-calcular-horas-trabajadas/) | Paso a paso, ejemplos, jornada nocturna |
| [Cómo calcular jornada partida](/guias/calcular-jornada-partida/) | Dos tramos, descanso automático, medianoche |
| [Cómo calcular horas extra](/guias/calcular-horas-extra/) | Fórmula, jornada prevista, errores comunes |
| [Cómo calcular tiempo entre fechas](/guias/calcular-entre-fechas/) | Días/horas/minutos entre fechas con horas |
| [Cómo calcular horas semanales](/guias/calcular-semanal-horas/) | Jornadas variables, descansos por día, total decimal |

## 🚀 Inicio rápido

```bash
npm install
npm run dev
```

## 📦 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build estático para producción |
| `npm run preview` | Previsualiza el build localmente |
| `npm run test:run` | Ejecuta tests unitarios (vitest) |

## 🏗 Arquitectura

- **Framework:** Astro (generación estática)
- **Lenguaje:** TypeScript estricto
- **Principio:** Separación clara entre lógica de cálculo, componentes UI, páginas y estilos
- **Renderizado:** HTML estático + JS interactivo solo en calculadoras (islas)

### Utilidades compartidas (`src/utils/`)

| Archivo | Responsabilidad |
|---------|-----------------|
| `time/calculateWorkingMinutes.ts` | Motor de cálculo: entrada, salida, descanso → minutos netos |
| `formatShiftResult.ts` | Formatea minutos netos → {horas, minutos, decimal, formatted} |
| `renderResult.ts` | Utilidades DOM: renderSuccess, renderError, clearResultArea |

Los scripts en `src/scripts/` son adaptadores finos: leen DOM → llaman utilidades → pintan resultado.

## ✅ Calidad

- **58 tests unitarios** (vitest): casos normales, límite, medianoche, jornadas partidas, descansos, conversiones
- **Build estático:** 15 páginas generadas sin errores
- **Mobile-first**, HTML semántico, accesible (foco visible, navegación teclado, ARIA)
- **SEO técnico:** sitemap, robots.txt, canonical, JSON-LD (WebSite/WebPage), Open Graph, Twitter Cards

## 🔒 Privacidad y legal

- **Cálculos 100% client-side** — no se envían datos a servidor
- **Cookie consent banner** — `analytics_storage: denied` por defecto (Consent Mode v2)
- **Google Analytics 4** — carga async, sin cookies sin consentimiento
- **Google AdSense** — script de verificación de propiedad (`ca-pub-3954825763005364`)
- Páginas legales: [Aviso Legal](/aviso-legal/), [Política de Privacidad](/politica-privacidad/), [Política de Cookies](/politica-cookies/)

## 📁 Estructura principal

```
src/
├── components/
│   ├── calculator/     # Daily, Weekly, Extra, Split, BetweenDates
│   ├── ui/             # ToolCard, Breadcrumbs, CollapsibleExamples, GuideSteps
│   └── layout/         # MobileMenu
├── layouts/
│   └── BaseLayout.astro
├── pages/              # 15 rutas estáticas (index, 5 calc, 5 guías, 3 legal, 404)
├── scripts/            # Adapters: calculator, weekly, splitShift, horasExtra, betweenDates, cookieConsent
├── utils/
│   ├── time/           # parseTime, diffMinutes, applyBreak, dateDiffMinutes, formatResult, etc.
│   ├── validation/     # validateDailyEntry
│   ├── calculateWorkingMinutes.ts
│   ├── formatShiftResult.ts
│   ├── renderResult.ts
│   └── calculateShift.ts
├── styles/
│   └── global.css
└── types/
    └── index.ts
```

## 🌐 Producción

Sitio: **https://miaherramienta.com**