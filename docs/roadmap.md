# Roadmap

## Objetivo del roadmap

Construir el proyecto de forma progresiva, manteniendo el producto sencillo, útil y técnicamente sólido.

No se deben saltar fases importantes ni desarrollar funcionalidades de forma masiva antes de comprobar que las anteriores funcionan correctamente.

El proyecto debe crecer a partir de necesidades reales, datos de uso y oportunidades verificadas.

---

# Fase 0 — Base del proyecto

## Objetivo

Dejar preparada una base técnica y documental estable antes de empezar a desarrollar funcionalidades.

### Tareas

- [x] Crear proyecto Astro.
- [x] Configurar TypeScript.
- [x] Configurar proyecto para generación estática.
- [x] Crear estructura inicial de carpetas.
- [x] Crear documentación inicial del proyecto.
- [x] Crear `AGENTS.md`.
- [x] Actualizar Astro y dependencias a una versión estable actual.
- [x] Confirmar que `npm run build` funciona correctamente.
- [x] Inicializar Git.
- [x] Crear repositorio remoto cuando corresponda.

### Documentación relacionada

- `docs/vision.md`
- `docs/mvp.md`
- `docs/seo.md`
- `docs/roadmap.md`
- `docs/architecture.md`
- `docs/calculation-spec.md`

---

# Fase 1 — Diseño del producto

## Objetivo

Definir exactamente cómo funcionará la calculadora principal antes de programarla.

### Tareas

- [x] Definir flujo principal de usuario.
- [x] Definir todos los campos de entrada.
- [x] Definir formatos de entrada.
- [x] Definir formato de resultados.
- [x] Definir comportamiento de descansos.
- [x] Definir múltiples tramos.
- [x] Definir jornadas partidas.
- [x] Definir turnos que atraviesan medianoche.
- [x] Definir funcionamiento semanal.
- [x] Definir estados vacíos.
- [x] Definir mensajes de error.
- [x] Definir casos límite.
- [x] Definir comportamiento móvil.
- [x] Definir accesibilidad básica.
- [x] Definir componentes reutilizables.

### Resultado esperado

Antes de pasar a programación debe existir una especificación clara de la calculadora principal que permita implementarla sin tomar decisiones funcionales importantes durante el desarrollo.

---

# Fase 2 — Arquitectura técnica

## Objetivo

Establecer una estructura de código sencilla y reutilizable.

### Tareas

- [x] Confirmar estructura de `src/`.
- [x] Definir organización de componentes.
- [x] Definir organización de utilidades.
- [x] Definir tipos y modelos de datos.
- [x] Definir funciones compartidas para cálculos.
- [x] Definir sistema de estilos.
- [x] Definir layout general.
- [x] Definir sistema básico de SEO.
- [x] Definir estrategia para pruebas.

### Principios

- Mantener la arquitectura sencilla.
- Evitar dependencias innecesarias.
- Separar lógica de cálculo e interfaz.
- Reutilizar componentes.
- Mantener TypeScript estricto.

### Documentación relacionada

- `docs/architecture.md`
- `docs/calculation-spec.md`

---

# Fase 3 — Calculadora principal

## Objetivo

Construir una calculadora de horas trabajadas sólida y fiable.

### Funcionalidades

- [x] Entrada y salida.
- [x] Descansos.
- [x] Cálculo de duración.
- [x] Múltiples tramos.
- [x] Jornadas partidas.
- [x] Cruce de medianoche.
- [x] Horas decimales.
- [x] Resultado en horas y minutos.
- [x] Resultado en minutos.
- [x] Reiniciar cálculo.
- [x] Copiar resultado.
- [x] Validación de entradas.
- [x] Mensajes de error.

### Calidad

- [x] Crear pruebas unitarias de la lógica.
- [x] Probar casos normales.
- [x] Probar casos límite.
- [x] Probar entradas inválidas.
- [x] Probar medianoche.
- [x] Probar jornadas partidas.
- [x] Probar descansos.
- [x] Ejecutar build.
- [x] Comprobar funcionamiento en móvil.

### Regla

No avanzar a la siguiente fase hasta que la calculadora principal sea estable y sus cálculos hayan sido comprobados.

---

# Fase 4 — Modo semanal

## Objetivo

Ampliar la calculadora principal para permitir el cálculo de varias jornadas.

### Funcionalidades

- [x] Añadir días.
- [x] Eliminar días.
- [x] Añadir varios tramos por día.
- [x] Calcular total diario.
- [x] Calcular total semanal.
- [x] Mostrar minutos totales.
- [x] Mostrar horas decimales.
- [x] Mostrar resumen semanal.
- [x] Validar datos de cada jornada.

### Calidad

- [x] Crear pruebas de acumulación.
- [x] Comprobar semanas incompletas.
- [x] Comprobar días sin datos.
- [x] Comprobar múltiples tramos.
- [x] Comprobar combinación de días normales y turnos nocturnos.

---

# Fase 5 — Herramientas secundarias

## Objetivo

Crear herramientas adicionales reutilizando la lógica y los componentes ya existentes.

### Orden inicial

1. [X] Calculadora de tiempo entre horas horas.
2. [X] Sumar y restar horas y minutos.
3. [X] Conversor de horas y minutos a horas decimales.
4. [X] Conversor de horas decimales a horas y minutos.
5. [X] Calculadora de hora de salida.
6. [X] Calculadora de jornada partida.
7. [X] Calculadora básica de turnos.

### Regla

No desarrollar herramientas secundarias mediante código duplicado.

Siempre que sea posible deberán reutilizar:

- tipos;
- funciones de cálculo;
- validaciones;
- componentes;
- estilos.

---

# Fase 6 — Sistema visual y experiencia de usuario

## Objetivo

Crear una experiencia coherente para todas las herramientas.

### Tareas

- [ ] Definir sistema tipográfico.
- [ ] Definir espaciado.
- [ ] Definir tamaños de controles.
- [ ] Crear botones reutilizables.
- [ ] Crear inputs reutilizables.
- [ ] Crear `TimeInput`.
- [ ] Crear mensajes de error.
- [ ] Crear tarjetas de resultado.
- [ ] Crear navegación.
- [ ] Crear footer.
- [ ] Crear layout común.
- [ ] Revisar responsive design.
- [ ] Revisar accesibilidad.

### Principios

La interfaz debe priorizar:

- claridad;
- rapidez;
- simplicidad;
- uso móvil;
- accesibilidad.

---

# Fase 7 — Estructura SEO

## Objetivo

Preparar la web para posicionamiento orgánico sin crear contenido artificial.

### Tareas

- [X] Definir URLs definitivas.
- [X] Definir títulos.
- [X] Definir meta descriptions.
- [X] Definir encabezados.
- [X] Añadir canonical.
- [X] Crear sitemap.
- [X] Crear robots.txt.
- [X] Configurar enlazado interno.
- [X] Revisar indexabilidad.
- [X] Revisar rendimiento.
- [X] Revisar Core Web Vitals cuando haya datos.

### Regla

No crear una página nueva únicamente para cubrir una variante mínima de una keyword.

Cada página debe tener una función clara y aportar valor real.

### Documentación relacionada

- `docs/seo.md`

---

# Fase 8 — Contenido inicial

## Objetivo

Crear contenido útil que complemente las herramientas y responda a preguntas reales.

### Primera tanda orientativa

- [x] Cómo calcular las horas trabajadas.
- [X] Cómo calcular el tiempo entre dos horas.
- [X] Cómo sumar horas y minutos.
- [X] Cómo convertir horas a decimal.
- [X] Cómo convertir horas decimales a horas y minutos.
- [x] Cómo calcular una jornada partida.
- [X] Cómo calcular un turno que termina al día siguiente.
- [X] Otros contenidos determinados por investigación SEO.

### Principios

- No copiar contenido.
- No generar artículos masivos y repetitivos.
- No escribir para una keyword si no existe una necesidad real.
- Complementar las herramientas.
- Utilizar ejemplos claros.

---

# Fase 9 — Revisión integral

## Objetivo

Asegurar que la primera versión está lista para publicarse.

### Funcionalidad

- [x] Probar todas las calculadoras.
- [x] Revisar cálculos.
- [x] Revisar errores.
- [x] Revisar casos límite.
- [x] Revisar medianoche.
- [x] Revisar jornadas partidas.
- [x] Revisar modo semanal.

### UX

- [ ] Revisar móvil.
- [ ] Revisar tablet.
- [ ] Revisar escritorio.
- [ ] Revisar accesibilidad.
- [ ] Revisar navegación.
- [ ] Revisar claridad de resultados.

### Técnica

- [ ] Ejecutar pruebas.
- [ ] Ejecutar `npm run build`.
- [ ] Revisar consola del navegador.
- [ ] Revisar enlaces rotos.
- [ ] Revisar rendimiento.
- [ ] Revisar errores HTML/JS.

### SEO

- [ ] Revisar títulos.
- [ ] Revisar descripciones.
- [ ] Revisar encabezados.
- [ ] Revisar URLs.
- [ ] Revisar sitemap.
- [ ] Revisar robots.txt.
- [ ] Revisar canonical.
- [ ] Revisar enlazado interno.

---

# Fase 10 — Lanzamiento

## Objetivo

Publicar una primera versión funcional y medible.

### Tareas

- [ ] Elegir dominio.
- [ ] Configurar hosting.
- [ ] Configurar HTTPS.
- [ ] Publicar la web.
- [ ] Configurar Google Search Console.
- [ ] Configurar Google Analytics.
- [ ] Comprobar indexación.
- [ ] Comprobar funcionamiento en producción.

No activar AdSense inmediatamente si la web todavía necesita mejoras importantes de contenido, UX o estructura.

---

# Fase 11 — Medición

## Objetivo

Obtener datos reales para decidir qué hacer después.

### Medir

- [ ] Impresiones.
- [ ] Clics.
- [ ] CTR.
- [ ] Posiciones.
- [ ] Consultas.
- [ ] Países.
- [ ] Páginas de entrada.
- [ ] Herramientas utilizadas.
- [ ] Número de cálculos realizados.
- [ ] Uso en móvil y escritorio.

### Fuentes

- Google Search Console.
- Google Analytics.
- Datos propios de uso.

Los datos de terceros utilizados durante la investigación deben seguir tratándose como estimaciones.

---

# Fase 12 — Primera iteración basada en datos

## Objetivo

Mejorar la web utilizando evidencia real obtenida después del lanzamiento.

### Posibles acciones

- [ ] Mejorar herramientas que reciban uso.
- [ ] Mejorar páginas con muchas impresiones pero pocos clics.
- [ ] Crear herramientas para necesidades detectadas.
- [ ] Crear contenidos para consultas relevantes.
- [ ] Mejorar enlazado interno.
- [ ] Optimizar UX de herramientas populares.
- [ ] Eliminar o modificar funcionalidades que no aporten valor.

### Regla

No ampliar la web simplemente para hacerla más grande.

Cada nueva funcionalidad debe estar justificada por:

1. Una necesidad real detectada.
2. Una oportunidad SEO razonable.
3. Datos de uso.
4. Una mejora clara del producto.

---

# Fase 13 — Monetización

## Objetivo

Introducir monetización sin perjudicar la utilidad del producto.

### AdSense

- [ ] Revisar requisitos y políticas actuales.
- [ ] Preparar la web para AdSense.
- [ ] Solicitar revisión cuando corresponda.
- [ ] Integrar anuncios de forma no intrusiva.
- [ ] Medir rendimiento.
- [ ] Revisar impacto sobre UX.

### Posibles fases posteriores

Solo estudiar después de disponer de tráfico suficiente:

- afiliación;
- productos digitales;
- herramientas premium;
- funcionalidades adicionales;
- otras vías de monetización.

No desarrollar estas vías antes de comprobar que existe demanda suficiente.

---

# Fase 14 — Expansión

## Objetivo

Convertir la web en un conjunto más amplio de herramientas relacionadas con tiempo y organización.

La expansión podrá incluir nuevas categorías si los datos demuestran que tienen sentido.

Posibles áreas a estudiar:

- turnos avanzados;
- planificación de jornadas;
- calendarios;
- control de horas;
- conversiones de tiempo;
- herramientas para situaciones específicas.

No asumir que estas categorías serán necesarias.

Cada nueva área deberá pasar por una validación previa.

---

# Reglas generales del roadmap

## No saltarse la validación

No construir una funcionalidad grande basándose únicamente en intuición.

## No escalar demasiado pronto

Primero comprobar que el núcleo funciona.

## No confundir tráfico con negocio

El tráfico por sí solo no demuestra rentabilidad.

## No confundir CPC con ingresos de AdSense

Los datos publicitarios externos son únicamente señales y no equivalen directamente al RPM o ingresos del proyecto.

## No perseguir únicamente keywords grandes

Las oportunidades podrán estar también en búsquedas específicas con competencia asumible.

## Construir para usuarios

La utilidad real tiene prioridad sobre la cantidad de páginas.

## Documentar decisiones

Las decisiones importantes de arquitectura, producto o SEO deben quedar documentadas en los archivos correspondientes.

## Verificar antes de afirmar

No afirmar que una función funciona sin haberla probado.

No afirmar que un dato es real si en realidad es una estimación.

---

# Estado actual

## Fase actual

Fase 5 — Base del proyecto.

## Próximo objetivo

Completar la base documental y técnica y pasar a la Fase 1:

**Diseñar en detalle la calculadora principal antes de implementarla.**