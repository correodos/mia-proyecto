# Especificación funcional — Calculadora de horas trabajadas

## 1. Objetivo

Crear una herramienta online gratuita que permita calcular de forma rápida y clara el tiempo trabajado a partir de horarios de entrada, salida y descansos.

La calculadora debe resolver como mínimo:

- jornadas continuas;
- jornadas partidas;
- varios tramos de trabajo;
- turnos que atraviesan medianoche;
- varios días;
- conversión a horas decimales.

La herramienta debe ser sencilla para cualquier usuario, incluso sin conocimientos técnicos.

---

## 2. Principio general

El flujo principal debe ser:

introducir horarios → calcular → mostrar resultado

El usuario no necesita:

- registrarse;
- crear una cuenta;
- instalar software;
- configurar opciones complejas.

Los cálculos deben realizarse en el navegador.

Los horarios introducidos por el usuario no deben enviarse ni almacenarse en un servidor durante el MVP.

---

## 3. Casos de uso principales

### Caso 1 — Jornada simple

Entrada: 09:00  
Salida: 18:00  
Descanso: 60 minutos

Resultado:

8 h 00 min  
480 minutos  
8,00 horas decimales

### Caso 2 — Sin descanso

Entrada: 09:00  
Salida: 17:00  
Descanso: 0 minutos

Resultado:

8 h 00 min

### Caso 3 — Jornada partida

Tramo 1:

09:00 → 14:00

Tramo 2:

15:00 → 18:00

Resultado:

8 h 00 min

### Caso 4 — Turno que cruza medianoche

Entrada: 22:00  
Salida: 06:00

Resultado:

8 h 00 min

### Caso 5 — Varios días

El usuario puede introducir jornadas de varios días y obtener el total acumulado.

---

## 4. Interfaz principal

La herramienta debe aparecer dentro de un contenedor claramente identificado.

### Cabecera

Título:

Calculadora de horas trabajadas

Descripción breve:

Calcula tus horas trabajadas a partir de tus horarios de entrada, salida y descansos.

---

## 5. Entrada de una jornada

Cada jornada debe permitir introducir:

- hora de entrada;
- hora de salida;
- descanso.

Diseño conceptual:

Entrada: [09:00]  
Salida: [18:00]  
Descanso: [60 min]

El formato principal de las horas será:

HH:MM

Ejemplos válidos:

08:30  
09:00  
17:45  
22:15

Se utilizará formato de 24 horas.

---

## 6. Descanso

El descanso se introducirá en minutos.

Ejemplos:

0  
30  
60  
90

Debe ser un número entero igual o superior a cero.

El descanso se resta del tiempo total.

No se aplicarán automáticamente normas laborales para determinar la duración del descanso.

---

## 7. Múltiples tramos

El usuario debe poder añadir tramos adicionales dentro del mismo día.

Ejemplo:

Tramo 1:

09:00 → 14:00

Tramo 2:

15:00 → 18:00

Debe existir un botón:

+ Añadir tramo

Cada tramo tendrá:

- entrada;
- salida.

Los tramos adicionales podrán eliminarse.

---

## 8. Cómo tratar los descansos

En una jornada simple:

entrada → salida

se calcula primero la duración total.

Después:

duración total - descanso = tiempo trabajado

Ejemplo:

09:00 → 18:00

Duración total:

9 h

Descanso:

60 min

Tiempo trabajado:

8 h

---

## 9. Jornadas partidas

Una jornada partida se calcula sumando los distintos tramos.

Ejemplo:

09:00 → 14:00  
15:00 → 18:00

Primer tramo:

5 h

Segundo tramo:

3 h

Total:

8 h

No se debe restar además una hora de descanso si ese periodo ya está representado mediante dos tramos separados.

La interfaz debe evitar que el usuario pueda descontar accidentalmente dos veces el mismo periodo.

---

## 10. Medianoche

Cuando la hora de salida sea anterior a la hora de entrada, se considerará que el horario puede continuar al día siguiente.

Ejemplo:

Entrada: 22:00  
Salida: 06:00

Resultado:

8 h

La aplicación debe identificar este caso automáticamente.

Debe existir una indicación visual o textual:

El horario termina al día siguiente.

---

## 11. Casos ambiguos

Ejemplo:

22:00 → 21:00

Este intervalo podría representar casi 23 horas de trabajo o ser un error de entrada.

Para el MVP se establece:

Máximo permitido por tramo: 24 horas.

Si existe una situación ambigua, la aplicación debe comunicarla claramente al usuario.

No mostrar un resultado aparentemente válido si existe una interpretación claramente dudosa.

---

## 12. Modo semanal

La herramienta principal debe poder utilizarse en dos modos:

- Día
- Semana

En modo semana aparecerán:

- lunes;
- martes;
- miércoles;
- jueves;
- viernes;
- sábado;
- domingo.

Cada día podrá contener uno o varios tramos.

Los días sin datos podrán permanecer vacíos.

---

## 13. Cálculo diario

Para cada día con datos debe mostrarse:

- tiempo trabajado.

Opcionalmente podrá mostrarse también el tiempo total de presencia si aporta valor a la experiencia.

El resultado principal siempre será el tiempo trabajado.

Ejemplo:

Lunes

09:00 → 18:00  
Descanso: 60 min

Trabajado:

8 h 00 min

---

## 14. Cálculo semanal

El total semanal será la suma de todos los minutos trabajados durante los días introducidos.

Ejemplo:

Lunes: 8 h  
Martes: 8 h  
Miércoles: 7 h 30 min  
Jueves: 8 h  
Viernes: 8 h

Total:

39 h 30 min

También:

39,50 horas decimales

---

## 15. Formato de resultados

El resultado principal debe mostrarse como:

X h Y min

Ejemplos:

8 h 00 min  
7 h 30 min  
42 h 15 min

Cuando sea útil también se mostrarán:

- total en minutos;
- horas decimales.

Ejemplo:

8 h 30 min  
510 minutos  
8,50 horas decimales

En español se utilizará coma como separador decimal.

---

## 16. Conversión decimal

La conversión decimal se basa en minutos.

Fórmula:

horas decimales = minutos / 60

Ejemplos:

30 minutos = 0,50 horas  
45 minutos = 0,75 horas  
90 minutos = 1,50 horas  
150 minutos = 2,50 horas

Importante:

7 h 30 min = 7,50 horas

No debe interpretarse como 7,30 horas.

---

## 17. Entrada inválida

La herramienta debe detectar como mínimo:

- entrada vacía;
- salida vacía;
- hora inexistente;
- minutos superiores a 59;
- descanso negativo;
- valores no numéricos;
- resultado inválido;
- descanso igual o superior al tiempo disponible cuando produzca un resultado negativo.

Nunca mostrar resultados negativos como si fueran válidos.

---

## 18. Mensajes de error

Los mensajes deben ser claros y comprensibles.

Ejemplos:

Introduce una hora de entrada.

Introduce una hora de salida.

El descanso no puede ser negativo.

Revisa la hora introducida.

El descanso es mayor que el tiempo disponible.

No mostrar mensajes técnicos como:

NaN  
undefined  
Invalid Date

---

## 19. Resultado vacío

Antes de realizar un cálculo no debe aparecer un resultado engañoso.

El resultado puede permanecer oculto hasta que el usuario pulse:

Calcular

Después del cálculo debe mostrarse claramente.

---

## 20. Botones

La calculadora principal tendrá como mínimo:

- Calcular
- Reiniciar
- + Añadir tramo

En el modo semanal también habrá controles para:

- añadir tramos;
- eliminar tramos.

Opcionalmente:

- Copiar resultado.

El texto copiado debe ser comprensible.

Ejemplo:

Horas trabajadas: 8 h 30 min (8,50 horas)

---

## 21. Estados de la calculadora

Debe contemplar:

### Estado inicial

Sin datos introducidos.

### Estado con datos

El usuario ha introducido datos.

### Estado de cálculo

El cálculo se ha realizado correctamente.

### Estado de error

Existe algún dato incorrecto o insuficiente.

### Estado reiniciado

La calculadora vuelve al estado inicial.

---

## 22. Comportamiento móvil

La calculadora debe diseñarse primero para pantallas pequeñas.

En móvil puede utilizar una disposición vertical:

Entrada  
[09:00]

Salida  
[18:00]

Descanso  
[60]

[CALCULAR]

En pantallas mayores podrá utilizarse una disposición horizontal.

Los controles deben ser suficientemente grandes para utilizarse cómodamente con los dedos.

---

## 23. Accesibilidad

Cada campo debe tener una etiqueta explícita.

Ejemplo:

Hora de entrada  
[09:00]

No depender únicamente de placeholders.

Los mensajes de error deben ser accesibles para lectores de pantalla.

Los controles deben poder utilizarse mediante teclado.

Debe existir un estado de foco visible.

Los colores no deben ser el único medio para comunicar un error o estado.

---

## 24. Lógica interna

La lógica de cálculo debe estar separada de la interfaz.

Se prevén funciones reutilizables conceptualmente como:

parseTime()  
formatTime()  
durationBetween()  
addDurations()  
subtractDurations()  
minutesToDecimal()  
decimalToMinutes()  
crossesMidnight()  
validateTime()

La implementación concreta puede cambiar si existe una arquitectura mejor.

Todas las calculadoras deben compartir la misma lógica de cálculo.

---

## 25. Representación interna

Los horarios se representarán internamente como minutos desde medianoche.

Ejemplos:

00:00 = 0  
01:00 = 60  
09:00 = 540  
12:30 = 750  
18:00 = 1080  
23:59 = 1439

Las duraciones también se expresarán en minutos.

Esto evita errores derivados de tratar las horas como números decimales.

---

## 26. Pruebas mínimas

Antes de considerar terminada la calculadora deben existir pruebas para como mínimo:

### Prueba 1

09:00 → 18:00

Resultado:

540 minutos

### Prueba 2

09:00 → 18:00

Descanso: 60

Resultado:

480 minutos

### Prueba 3

09:00 → 14:00  
15:00 → 18:00

Resultado:

480 minutos

### Prueba 4

22:00 → 06:00

Resultado:

480 minutos

### Prueba 5

09:30 → 17:15

Resultado:

465 minutos

### Prueba 6

7 h 30 min → decimal

Resultado:

7,5

### Prueba 7

450 minutos → decimal

Resultado:

7,5

### Prueba 8

Descanso superior al tiempo trabajado

Resultado:

error

### Prueba 9

Campo vacío

Resultado:

error comprensible

### Prueba 10

Minutos iguales o superiores a 60

Resultado:

error

---

## 27. Casos límite adicionales

También deben comprobarse:

- 00:00 → 00:00;
- 00:00 → 23:59;
- 23:59 → 00:00;
- 23:30 → 00:30;
- 12:00 → 12:01;
- varios días;
- varios tramos en un mismo día;
- días vacíos;
- descanso de 0 minutos;
- descanso igual a la duración;
- horarios cercanos a medianoche.

---

## 28. Qué NO debe hacer la calculadora

No debe:

- calcular nóminas;
- calcular IRPF;
- determinar horas extraordinarias legales;
- determinar derechos laborales;
- decidir qué descansos exige la ley;
- ofrecer asesoramiento jurídico;
- almacenar horarios en un servidor;
- exigir registro.

El MVP es una herramienta de cálculo de tiempo.

---

## 29. SEO de la página

La calculadora debe tener una página indexable con contenido útil.

La página deberá incluir:

- título claro;
- H1;
- explicación breve;
- calculadora;
- explicación del funcionamiento;
- ejemplos;
- preguntas frecuentes cuando aporten valor;
- enlaces a herramientas relacionadas.

La herramienta debe seguir siendo completamente funcional si el usuario llega directamente desde Google.

---

## 30. Regla para el desarrollo

La implementación debe seguir esta especificación.

Si durante el desarrollo aparece una decisión funcional que no está definida aquí:

1. identificar la decisión;
2. no inventar una regla importante;
3. proponer una solución;
4. documentar la decisión;
5. después implementarla.

No introducir nuevas funcionalidades importantes sin revisar previamente el alcance del MVP.

---

## 31. Criterio de finalización

La calculadora principal se considera terminada cuando:

- todos los casos principales funcionan;
- los casos límite han sido comprobados;
- existen pruebas automatizadas para la lógica principal;
- las validaciones funcionan;
- la interfaz funciona en móvil y escritorio;
- es accesible;
- el resultado es claro;
- el proyecto compila correctamente;
- no existen errores relevantes en consola;
- la lógica de cálculo está separada de la interfaz.

---

## 32. Próximo desarrollo

Una vez aprobada esta especificación:

1. Diseñar la estructura de componentes.
2. Diseñar los tipos de datos.
3. Diseñar las funciones de cálculo.
4. Crear las pruebas de la lógica.
5. Implementar la interfaz.
6. Integrar la lógica.
7. Probar la calculadora completa.
8. Revisar UX y responsive.
9. Ejecutar el build.
10. Pasar a las siguientes herramientas del MVP.