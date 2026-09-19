# Arquitectura técnica

## Objetivo

Mantener una arquitectura sencilla, rápida y fácil de mantener para una web principalmente estática con herramientas interactivas.

La arquitectura debe permitir añadir nuevas calculadoras sin duplicar lógica ni componentes.

## Framework

El proyecto utiliza Astro.

La versión exacta instalada debe quedar reflejada en `package.json` y no debe fijarse manualmente en esta documentación como una versión permanente.

Antes de realizar actualizaciones importantes del framework, comprobar la documentación oficial de Astro.

## Lenguaje

El proyecto utiliza TypeScript con configuración estricta.

La lógica de cálculo debe escribirse en TypeScript siempre que sea razonable.

## Renderizado

La web debe utilizar generación estática de páginas siempre que sea posible.

Las partes interactivas de las calculadoras utilizarán JavaScript/TypeScript en el navegador.

No convertir toda la web en una SPA sin una necesidad concreta.

## Principio de arquitectura

Separar claramente:

1. Presentación.
2. Componentes reutilizables.
3. Lógica de cálculo.
4. Tipos y modelos de datos.
5. Contenido.
6. Configuración.

La lógica matemática no debe depender directamente de componentes visuales.

## Estructura prevista

```text
src/
├── components/
│   ├── calculator/
│   ├── ui/
│   └── layout/
│
├── layouts/
│
├── pages/
│   ├── index.astro
│   ├── calculadora-horas/
│   ├── calculadora-tiempo/
│   ├── horas-decimales/
│   ├── hora-salida/
│   ├── horas-semanales/
│   └── herramientas/
│
├── styles/
│   ├── global.css
│   ├── variables.css
│   └── components/
│
└── utils/
    ├── time/
    ├── validation/
    └── formatting/