# Especificación de cálculos de tiempo

## Objetivo

Definir una representación coherente del tiempo para todas las herramientas del proyecto.

La lógica debe producir resultados consistentes independientemente de la interfaz que utilice el usuario.

## Representación interna

Siempre que sea posible, los tiempos se representarán internamente como:

**minutos enteros desde el inicio del día**

Ejemplos:

00:00 = 0 minutos

01:00 = 60 minutos

09:00 = 540 minutos

12:30 = 750 minutos

18:00 = 1080 minutos

23:59 = 1439 minutos

La representación interna no debe utilizar números decimales para almacenar minutos.

## Entrada

El formato principal de entrada será:

`HH:MM`

Ejemplos válidos:

09:00
09:30
17:45
23:59

La interfaz debe evitar formatos ambiguos.

## Duración

Una duración se representa internamente como un número entero de minutos.

Ejemplos:

1 hora = 60

1 hora y 30 minutos = 90

8 horas = 480

## Conversión a horas y minutos

Ejemplo:

480 minutos

→ 8 horas 0 minutos

510 minutos

→ 8 horas 30 minutos

## Conversión decimal

Las horas decimales se calculan:

minutos / 60

Ejemplo:

30 minutos = 0,5 horas

90 minutos = 1,5 horas

450 minutos = 7,5 horas

IMPORTANTE:

7 horas 30 minutos = 7,5 horas

No debe interpretarse como 7,30 horas.

## Redondeo

No redondear resultados internamente.

Los cálculos deben conservar los minutos exactos.

El formato visual podrá mostrar el número de decimales apropiado.

## Duración entre dos horas

Para una jornada que no cruza medianoche:

duración = salida - entrada

Ejemplo:

09:00 → 18:00

1080 - 540 = 540 minutos

Resultado:

9 horas

## Descansos

Cuando exista descanso:

tiempo trabajado = duración total - descanso

Ejemplo:

09:00 → 18:00

Duración total = 540 minutos

Descanso = 60 minutos

Resultado = 480 minutos

## Múltiples tramos

Cada tramo debe calcularse de forma independiente.

Ejemplo:

09:00 → 14:00 = 300 minutos

15:00 → 18:00 = 180 minutos

Total = 480 minutos

## Medianoche

Cuando la salida es anterior a la entrada, no debe considerarse automáticamente un error.

Puede significar que el horario cruza medianoche.

Ejemplo:

22:00 → 06:00

Entrada = 1320

Salida = 360

Como 360 < 1320, se considera que la salida pertenece al día siguiente.

Duración:

(1440 - 1320) + 360 = 480 minutos

Resultado:

8 horas

La interfaz debe dejar claro este comportamiento para evitar confusión.

## Entradas inválidas

Deben rechazarse:

- horas inexistentes;
- minutos fuera de 00–59;
- campos obligatorios vacíos;
- valores no interpretables;
- descansos negativos;
- datos que produzcan una situación ambigua que la herramienta no pueda resolver.

Los mensajes de error deben ser comprensibles.

## Descansos superiores a la duración

Si el descanso introducido es igual o superior al tiempo total de trabajo, la herramienta debe mostrar un error o pedir corrección.

No mostrar un resultado negativo como si fuera válido.

## Horas semanales

El total semanal será la suma de los minutos trabajados de cada jornada.

Ejemplo:

Lunes = 480

Martes = 450

Miércoles = 480

Total = 1410 minutos

1410 / 60 = 23,5 horas

Formato:

23 h 30 min

23,50 horas decimales

## Persistencia

Los cálculos del usuario no se almacenarán en servidor en el MVP.

## Regla fundamental

Toda calculadora relacionada con tiempo debe utilizar las mismas funciones y convenciones definidas en este documento.

No implementar fórmulas independientes que contradigan esta especificación.