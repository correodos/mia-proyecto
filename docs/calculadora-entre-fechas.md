# IMPLEMENTAR: Calculadora de tiempo entre fechas

## RUTA

`/calculadora-entre-fechas/`

## OBJETIVO

Crear una calculadora que permita calcular el tiempo total transcurrido entre una fecha y hora inicial y una fecha y hora final.

Debe contar **todo el tiempo transcurrido**, no solamente horas de trabajo.

Debe permitir diferencias de varias horas, varios días, cambios de mes y cambios de año.

## EJEMPLO

Fecha inicial:

`21/09/2026 09:00`

Fecha final:

`23/09/2026 17:30`

Resultado:

* Tiempo transcurrido: `2 días, 8h 30m`
* Total de horas: `56,50 horas`

## ENTRADAS

Fecha inicial:

* Fecha
* Hora

Fecha final:

* Fecha
* Hora

Las horas deben funcionar como las calculadoras actuales:

* Mostrar inicialmente `--:--`.
* Escribir `0900` → `09:00`.
* Formato válido: `00:00–23:59`.

Las fechas deben utilizar un formato claro y coherente con el sitio.

No establecer valores iniciales automáticamente.

## CÁLCULO

Calcular:

`fecha/hora final - fecha/hora inicial`

El resultado debe representar el tiempo real transcurrido.

Mostrar:

* Días, horas y minutos.
* Total de horas.
* Horas decimales.

### Ejemplo

`21/09/2026 09:00 → 23/09/2026 17:30`

Debe devolver:

`2 días, 8h 30m`

`56,50 horas`

Las horas decimales deben utilizar coma como separador decimal en la presentación.

Ejemplos:

* `8h 30m` → `8,50 horas`
* `24h 00m` → `24,00 horas`
* `56h 30m` → `56,50 horas`

No mostrar resultados duplicados.

## CASOS ESPECIALES

### Misma fecha y misma hora

`21/09/2026 00:00 → 21/09/2026 00:00`

Resultado:

* `0 días, 0h 00m`
* `0,00 horas`

No debe producir ningún error.

### Cambio de mes

Ejemplo:

`30/09/2026 23:00 → 01/10/2026 01:00`

Resultado:

`2h 00m`

### Cambio de año

Ejemplo:

`31/12/2026 23:00 → 01/01/2027 01:00`

Resultado:

`2h 00m`

### Diferencia de varios días

Debe calcular correctamente cualquier diferencia válida de varios días.

## VALIDACIONES

Los cuatro campos son obligatorios:

* Fecha inicial
* Hora inicial
* Fecha final
* Hora final

Debe detectar:

* Campos vacíos.
* Fechas inválidas.
* Horas inválidas.
* Fecha/hora final anterior a la inicial.

Si la fecha/hora final es anterior a la inicial:

* Mostrar un mensaje de error claro.
* No mostrar un resultado negativo.
* No realizar el cálculo.

No calcular si existe cualquier error de validación.

## BOTONES

Debe incluir:

* Calcular
* Reiniciar

## REINICIAR

Debe:

* Vaciar fecha inicial.
* Vaciar hora inicial.
* Vaciar fecha final.
* Vaciar hora final.
* Volver las horas a `--:--`.
* Limpiar resultados.
* Limpiar mensajes de error.

## TESTS MÍNIMOS

Crear tests específicos para esta calculadora.

Como mínimo:

1. Mismo día.
2. Varios días.
3. Mismo día y misma hora = `0`.
4. Cambio de mes.
5. Cambio de año.
6. Cálculo correcto de horas decimales.
7. Campos vacíos.
8. Fecha inválida.
9. Hora inválida.
10. Fecha/hora final anterior a la inicial.

Los tests deben comprobar los resultados esperados y las validaciones.

## ARQUITECTURA Y AISLAMIENTO

MUY IMPORTANTE:

Esta calculadora debe ser independiente de las calculadoras existentes.

Puede consultar los archivos de las calculadoras actuales para entender:

* estructura
* estilos
* patrones de interacción
* formato de las horas
* validaciones
* organización del proyecto

PERO NO DEBE CONECTAR ESTA CALCULADORA A LAS OTRAS.

La nueva calculadora debe tener sus propios archivos y su propia lógica.

No reutilizar directamente componentes, páginas ni documentos de contenido de otras calculadoras si eso crea una dependencia entre ellas.

Se pueden reutilizar únicamente utilidades matemáticas realmente genéricas cuando no creen dependencia de una calculadora concreta.

## CONTENIDO Y SEO

La página debe tener contenido propio y específico para esta calculadora.

Debe incluir:

* `title`
* `meta description`
* Un único `H1`
* Contenido explicativo
* Ejemplos
* FAQ específica
* Canonical
* Accesibilidad básica
* Estructura semántica correcta

La página debe estar orientada a búsquedas relacionadas con:

* tiempo entre fechas
* calcular tiempo entre dos fechas
* diferencia entre fechas
* calcular días entre fechas
* calcular horas entre fechas

### Contenido

Si necesita una sección como:

"Cómo calcular el tiempo entre dos fechas"

debe crear contenido NUEVO y específico para esta calculadora.

No modificar ni reutilizar documentos de contenido de otras calculadoras.

Los documentos existentes pueden consultarse únicamente como referencia de estilo y estructura.

## IMPORTANTE

* Antes de modificar nada, inspecciona el proyecto.
* Consulta las calculadoras existentes solo como referencia.
* Mantén esta calculadora aislada.
* No cambies las calculadoras que ya funcionan.
* Reutiliza únicamente utilidades matemáticas genéricas existentes cuando no creen una dependencia de una calculadora concreta.
* No cambies arquitectura estable sin necesidad.
* No añadas funcionalidades no especificadas.
* No elimines ni modifiques funcionalidades existentes.

## DISEÑO VISUAL

La nueva calculadora debe respetar el diseño general y la identidad visual de las calculadoras existentes.

Puede consultar las calculadoras actuales para reproducir:

* estructura visual
* tipografías
* tamaños
* espaciados
* botones
* campos de entrada
* colores
* tarjetas/resultados
* estados de error
* comportamiento responsive

La apariencia debe sentirse como parte del mismo sitio web.

IMPORTANTE:

* Reutilizar el diseño y los patrones visuales.
* NO reutilizar componentes, páginas o documentos de contenido que creen dependencia funcional.
* La calculadora debe tener sus propios archivos y su propia lógica de interfaz.
* No modificar el diseño de las calculadoras existentes para adaptarlo a esta nueva calculadora.

## RESPONSIVE

Debe funcionar correctamente en:

* móvil
* tablet
* escritorio

Especialmente alrededor de `320–375 px`.

No debe producir scroll horizontal.

Los campos y botones deben seguir siendo cómodos de utilizar en pantallas pequeñas.

## AL FINAL

Ejecuta:

`npm.cmd run test:run`

y después:

`npm.cmd run build`

Si algo falla, diagnostica primero y corrige después.

No modifiques otras calculadoras para solucionar un problema específico de esta calculadora.
