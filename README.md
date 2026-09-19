# Mi Proyecto

Proyecto web construido con [Astro](https://astro.build/).

## Características

- ⚡ Rápido por defecto
- 🎯 HTML por defecto
- 🌱 Sin JavaScript por defecto
- 🖼️ Importa imágenes nativamente con soporte para WebP y AVIF

## Configuración Inicial

```bash
npm install
npm run dev
```

## Estructura del Proyecto

```
mia-proyecto/
├── AGENTS.md
├── README.md
├── docs/           # Documentación del proyecto
│   ├── vision.md
│   ├── mvp.md
│   ├── seo.md
│   └── roadmap.md
├── src/            # Código fuente
│   ├── components/ # Componentes reutilizables
│   ├── pages/      # Páginas del sitio
│   ├── layouts/    # Layouts y plantillas
│   ├── styles/     # Estilos CSS/Tailwind
│   └── utils/      # Utilidades
├── public/         # Archivos públicos (imágenes, fuentes)
├── tests/          # Pruebas del proyecto
├── package.json    # Dependencias del proyecto
├── astro.config.mjs # Configuración de Astro
└── tsconfig.json   # Configuración de TypeScript
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye el sitio para producción
- `npm run preview` - Previsualiza la construcción localmente
