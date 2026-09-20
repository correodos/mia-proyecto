# Calculadora semanal de horas

## Objetivo

Crear una calculadora web que permita calcular el tiempo trabajado durante una semana completa, de lunes a domingo.

Debe reutilizar la lógica de la calculadora diaria existente siempre que sea posible y mantener separadas la lógica de cálculo y la interfaz.

## Ruta

La página final será:

`/calculadora-semanal-horas/`

## Alcance del MVP

La herramienta tendrá 7 filas, una por cada día:

- Lunes
- Martes
- Miércoles
- Jueves
- Viernes
- Sábado
- Domingo

Cada día tendrá:

- Entrada: `HH:MM`
- Salida: `HH:MM`
- Descanso: minutos

El descanso será un único valor diario.

Si existen varios descansos durante un mismo día, el usuario deberá sumarlos antes de introducir el total.

## Reglas de cálculo

Para cada día:

1. Validar entrada y salida.
2. Calcular el tiempo transcurrido entre entrada y salida.
3. Si la salida es anterior a la entrada, interpretar que la jornada cruza medianoche.
4. Restar el descanso.
5. Obtener los minutos trabajados de ese día.

Después:

- Sumar los minutos trabajados de los 7 días.
- Mostrar el total semanal en horas y minutos.
- Mostrar el total semanal en horas decimales con dos decimales.

La lógica existente de:

- `parseTime`
- `minutesFromTime`
- `diffMinutes`
- `applyBreak`
- `formatResult`
- `validateDailyEntry`

debe reutilizarse cuando sea compatible.

No duplicar lógica matemática existente sin una razón concreta.

## Días vacíos

Un día completamente vacío se considera un día libre. No necesitará aportar valor.

y no debe producir un error.

Un día parcialmente rellenado no se considera vacío y debe validarse.

## Caso 00:00 → 00:00

Debe mantener el comportamiento ya establecido en la calculadora diaria:

- `0 minutos`
- `0 horas`
- `0.00 horas`
- sin error

## Descansos

El descanso se introduce en minutos.

Ejemplo:

- Entrada: `09:00`
- Salida: `17:30`
- Descanso: `60`
- Resultado: `7 h 30 min`

Si hay varias pausas:

`20 + 30 + 15 = 65 minutos`

El usuario introduce `65`.

## Cruce de medianoche

Debe utilizar el mismo criterio que la calculadora diaria.

Ejemplo:

- Entrada: `22:00`
- Salida: `06:00`
- Descanso: `30`
- Resultado: `7 h 30 min`

## Validaciones

Debe rechazarse:

- horas con formato incorrecto
- horas fuera de rango
- descansos negativos
- datos incompletos de un día

El error de un día debe poder identificarse claramente.

Los días correctamente introducidos no deben perder sus datos por un error en otro día.

## Resultados

La calculadora debe mostrar:

- Total semanal en horas y minutos.
- Total semanal en horas decimales.

Si toda la semana está vacía:

- `0 h 0 min`
- `0.00 horas`
- sin error

## Interfaz

Debe mantener la coherencia visual y de comportamiento con `DailyCalculator.astro`.

Debe incluir:

- botón `Calcular`
- botón `Reiniciar`
- diseño responsive
- etiquetas accesibles
- mensajes de validación claros
- zona de resultados accesible

No añadir funcionalidades que no sean necesarias para el MVP.

## Tests

La lógica semanal debe tener tests específicos para:

1. Un día normal.
2. Varios días.
3. Semana completa.
4. Día completamente vacío.
5. Semana completamente vacía.
6. Descansos diferentes por día.
7. Cruce de medianoche.
8. `00:00 → 00:00`.
9. Datos inválidos.
10. Día parcialmente rellenado.
11. Resultado decimal correcto.
12. Suma correcta de todos los días.

Los tests existentes de la calculadora diaria deben continuar pasando.

## Fuera del MVP

No incluir:

- múltiples campos de descanso por día
- cálculo de horas extra
- comparación con una jornada objetivo
- diferencias entre horas planificadas y reales
- turnos rotativos
- festivos
- vacaciones
- cálculo salarial
- almacenamiento de datos
- cuentas de usuario
- backend
- base de datos

Estas funcionalidades podrán estudiarse posteriormente si los datos reales del proyecto justifican incorporarlas.

## Reglas de desarrollo

- Avanzar de forma incremental.
- Antes de modificar código existente, entender la implementación actual.
- Priorizar reutilización sobre duplicación.
- Mantener la lógica matemática separada de la interfaz.
- Mantener el código sencillo y mantenible.
- No cambiar arquitectura estable sin una razón concreta.
- No inventar APIs de Astro.
- Utilizar JavaScript/TypeScript estándar para la interacción.
- Probar los casos límite.
- No considerar una funcionalidad terminada hasta probarla.