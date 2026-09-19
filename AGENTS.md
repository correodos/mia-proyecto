# AGENTS.md

## Rol

Este archivo contiene las instrucciones permanentes para cualquier agente de IA que trabaje en este proyecto.

El agente debe utilizar este archivo junto con la documentación de `docs/` antes de realizar cambios importantes.

---

# 1. Contexto del proyecto

Estamos desarrollando una web en español de herramientas online gratuitas para calcular y organizar horas y tiempo, especialmente en situaciones relacionadas con trabajo, jornadas y turnos.

La herramienta principal será una calculadora de horas trabajadas.

El proyecto busca monetizarse inicialmente principalmente mediante Google AdSense.

La web debe ser rápida, sencilla, útil, accesible y especialmente cómoda desde dispositivos móviles.

El mercado inicial es hispanohablante, incluyendo España y Latinoamérica.

---

# 2. Documentación del proyecto

Antes de realizar cambios relacionados con una determinada parte del proyecto, consultar la documentación correspondiente:

- `docs/vision.md` → visión y principios generales.
- `docs/mvp.md` → alcance y funcionalidades del MVP.
- `docs/seo.md` → estrategia SEO.
- `docs/roadmap.md` → fases y orden de desarrollo.

Si existe una contradicción entre documentos, NO asumir una solución automáticamente.

Informar del conflicto antes de implementar cambios importantes.

---

# 3. Principios de desarrollo

## Prioridad

El orden de prioridad es:

1. Corrección funcional.
2. Utilidad para el usuario.
3. Experiencia de usuario.
4. Accesibilidad.
5. Rendimiento.
6. SEO.
7. Mantenibilidad.
8. Complejidad mínima.

El SEO nunca debe justificar una peor experiencia de usuario.

---

# 4. Regla fundamental: entender antes de modificar

Antes de modificar código:

1. Inspeccionar los archivos relacionados.
2. Comprender la arquitectura actual.
3. Revisar la documentación relevante.
4. Identificar posibles dependencias o efectos secundarios.
5. Explicar brevemente qué se va a cambiar cuando el cambio sea relevante.

No modificar archivos innecesariamente.

No crear archivos duplicados si existe una solución razonable utilizando la arquitectura existente.

---

# 5. Cambios progresivos

Realizar cambios pequeños y controlados.

No intentar implementar varias funcionalidades importantes simultáneamente salvo que se indique expresamente.

Después de cada cambio significativo:

1. Ejecutar las comprobaciones apropiadas.
2. Ejecutar el build cuando corresponda.
3. Corregir errores encontrados.
4. Informar de lo realizado.

---

# 6. No asumir decisiones del producto

El agente NO debe decidir unilateralmente:

- nuevas funcionalidades importantes;
- cambios de arquitectura importantes;
- nuevas categorías de herramientas;
- nuevas estrategias de monetización;
- cambios importantes de SEO;
- eliminación de funcionalidades existentes;
- incorporación de servicios externos;
- cambios importantes de dependencias.

Cuando una decisión pueda afectar significativamente al proyecto, debe plantearla antes de ejecutarla.

---

# 7. Código

Priorizar:

- código sencillo;
- componentes reutilizables;
- funciones pequeñas;
- nombres claros;
- TypeScript estricto;
- ausencia de duplicación innecesaria;
- facilidad de mantenimiento.

Evitar:

- abstracciones innecesarias;
- dependencias innecesarias;
- soluciones excesivamente complejas;
- código difícil de mantener;
- librerías externas cuando una solución sencilla propia sea suficiente.

---

# 8. Cálculos

Las funciones matemáticas de las herramientas deben estar separadas de la interfaz siempre que sea razonable.

La lógica de cálculo debe poder probarse independientemente de los componentes visuales.

Los cálculos de tiempo deben contemplar explícitamente:

- minutos;
- horas;
- horas decimales;
- descansos;
- múltiples tramos;
- jornadas partidas;
- medianoche;
- casos inválidos;
- valores límite.

No asumir que un horario que termina antes de la hora de inicio es necesariamente un error.

Debe existir una lógica explícita para determinar cuándo un horario atraviesa medianoche.

---

# 9. Precisión

Nunca redondear resultados sin una razón explícita.

Mantener internamente una representación consistente del tiempo.

Cuando se utilicen horas decimales, documentar claramente la conversión.

Ejemplo:

7 horas 30 minutos = 7,5 horas

No confundir:

7 horas 30 minutos

con

7,30 horas.

---

# 10. Validación y errores

Todas las herramientas deben validar las entradas del usuario.

Los errores deben:

- ser comprensibles;
- explicar qué debe corregirse;
- evitar mensajes técnicos;
- no utilizar lenguaje confuso.

No mostrar resultados aparentemente válidos cuando los datos introducidos sean ambiguos o inválidos.

---

# 11. Privacidad

Siempre que sea posible, los cálculos deben realizarse en el navegador.

No enviar horarios introducidos por el usuario a un servidor salvo que exista una necesidad explícita y justificada.

No almacenar datos personales innecesarios.

No solicitar cuentas de usuario para utilizar las calculadoras.

---

# 12. Diseño y UX

La interfaz debe priorizar:

- simplicidad;
- claridad;
- legibilidad;
- velocidad;
- uso móvil;
- accesibilidad.

Evitar elementos visuales innecesarios.

Una persona debe poder entender una herramienta sin leer una documentación extensa.

Los resultados deben destacar claramente.

---

# 13. Responsive design

Todo componente nuevo debe comprobarse al menos en:

- móvil;
- tablet;
- escritorio.

No diseñar primero pensando exclusivamente en escritorio.

---

# 14. Accesibilidad

Utilizar HTML semántico.

Los controles deben tener:

- etiquetas claras;
- estados accesibles;
- foco visible;
- navegación mediante teclado;
- mensajes de error comprensibles.

No utilizar elementos visuales como sustituto de texto cuando el texto sea necesario para comprender la herramienta.

---

# 15. SEO

El SEO debe formar parte de la arquitectura desde el principio, pero no debe producir contenido artificial.

No crear páginas únicamente para:

- repetir keywords;
- cubrir variantes mínimas de una consulta;
- generar tráfico sin aportar utilidad.

Antes de crear nuevas páginas SEO importantes, comprobar su relación con la intención de búsqueda y la utilidad real.

No inventar:

- volúmenes de búsqueda;
- CPC;
- tráfico;
- datos de usuarios;
- información de competidores.

Cuando se utilicen datos externos, indicar su fuente y distinguir entre datos observados y estimaciones.

---

# 16. Contenido

Todo contenido debe aportar información útil y específica.

No copiar contenido de otras webs.

No generar grandes cantidades de contenido casi idéntico.

No crear artículos únicamente para aumentar el número de URLs.

Las guías deben complementar las herramientas.

---

# 17. Legislación

El proyecto puede tratar situaciones relacionadas con jornadas y trabajo, pero las herramientas matemáticas no deben presentarse como asesoramiento legal.

No introducir afirmaciones legales sin verificar previamente la información.

Cuando una funcionalidad dependa de legislación específica:

- identificar el país;
- verificar la normativa;
- utilizar fuentes oficiales;
- indicar la fecha de referencia;
- evitar generalizaciones.

---

# 18. Dependencias

No instalar una dependencia nueva simplemente porque facilite una pequeña tarea.

Antes de añadir una dependencia:

1. Determinar si realmente es necesaria.
2. Comprobar si puede resolverse con las herramientas existentes.
3. Considerar el impacto en mantenimiento y rendimiento.
4. Informar de la dependencia que se pretende añadir.

No actualizar varias dependencias importantes simultáneamente sin una razón clara.

---

# 19. Pruebas

Toda lógica de cálculo importante debe tener pruebas.

Como mínimo deben probarse:

- casos normales;
- casos límite;
- entradas inválidas;
- medianoche;
- jornadas partidas;
- descansos;
- conversiones entre formatos.

Una herramienta no se considera terminada solamente porque visualmente funcione.

Debe comprobarse que sus resultados son correctos.

---

# 20. Build

Después de cambios importantes ejecutar:

`npm run build`

Si existen pruebas automatizadas, ejecutarlas también.

No considerar terminado un cambio si el proyecto no compila correctamente.

---

# 21. No romper funcionalidades existentes

Antes de modificar código existente, comprobar cómo se utiliza.

Después de modificarlo, comprobar que las funcionalidades relacionadas siguen funcionando.

No eliminar código simplemente porque parezca innecesario sin comprobar sus dependencias.

---

# 22. Seguridad

No introducir:

- claves API directamente en el código;
- contraseñas;
- tokens;
- credenciales;
- datos sensibles.

No ejecutar comandos destructivos sin autorización explícita.

No borrar archivos o carpetas para "limpiar" el proyecto sin confirmar primero que no son necesarios.

---

# 23. Git

Los cambios importantes deben poder identificarse claramente.

Utilizar commits pequeños y descriptivos cuando el proyecto tenga Git configurado.

No mezclar en un mismo cambio funcionalidades no relacionadas.

---

# 24. Comunicación

Cuando se complete una tarea, informar de:

- qué se ha cambiado;
- qué archivos se han modificado;
- qué pruebas se han ejecutado;
- si existen problemas pendientes.

No afirmar que algo funciona si no se ha comprobado.

Si existe incertidumbre, indicarla claramente.

---

# 25. Regla de oro

Antes de añadir algo, responder:

> ¿Esto hace que el producto sea realmente más útil para el usuario?

Si la respuesta es no, no añadirlo.

El objetivo no es crear una web grande.

El objetivo es crear una web útil, rápida, mantenible y capaz de crecer basándose en datos reales.