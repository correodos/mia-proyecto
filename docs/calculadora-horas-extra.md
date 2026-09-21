# Calculadora de horas extra

## 1. Objetivo

Crear una calculadora web gratuita que permita calcular las horas trabajadas y determinar cuántas horas extra se han realizado respecto a una jornada laboral prevista.

La calculadora debe ser sencilla de utilizar, funcionar correctamente en navegador y reutilizar las utilidades de tiempo existentes en el proyecto.

---

## 2. Entradas

La calculadora tendrá los siguientes campos:

### Hora de entrada

Hora a la que comienza la jornada laboral.

Formato obligatorio:

`HH:MM`

Ejemplos:

- `08:00`
- `09:30`
- `22:00`

### Hora de salida

Hora a la que termina la jornada laboral.

Formato obligatorio:

`HH:MM`

Ejemplos:

- `17:00`
- `18:30`
- `06:00`

### Descanso

Tiempo total de descanso realizado durante la jornada.

Se expresará en horas y minutos.

Ejemplos:

- `00:30`
- `01:00`
- `01:30`

El descanso se restará del tiempo transcurrido entre entrada y salida.

### Jornada prevista

Duración de la jornada laboral que debe cumplirse.

Se expresará en horas y minutos.

Ejemplos:

- `08:00`
- `07:30`
- `06:00`

---

## 3. Cálculos

### 3.1 Tiempo transcurrido

Se calculará la diferencia entre la hora de salida y la hora de entrada.

Si la hora de salida es anterior a la hora de entrada, se considerará que la jornada cruza la medianoche.

Ejemplo:

`22:00 → 06:00`

Resultado:

`8 horas`

### 3.2 Tiempo trabajado

Al tiempo transcurrido se le restará el descanso.

Fórmula:

`Tiempo trabajado = Tiempo transcurrido - Descanso`

Ejemplo:

- Entrada: `08:00`
- Salida: `17:00`
- Descanso: `01:00`

Resultado:

`8 horas`

### 3.3 Horas extra

Las horas extra serán la diferencia positiva entre el tiempo trabajado y la jornada prevista.

Fórmula:

`Horas extra = Tiempo trabajado - Jornada prevista`

Si el resultado es negativo, las horas extra serán:

`0 horas`

Ejemplo:

- Tiempo trabajado: `09:00`
- Jornada prevista: `08:00`

Horas extra:

`1 hora`

Otro ejemplo:

- Tiempo trabajado: `07:30`
- Jornada prevista: `08:00`

Horas extra:

`0 horas`

La calculadora no mostrará horas extra negativas.

---

## 4. Resultados

La calculadora mostrará como mínimo:

### Horas trabajadas

Resultado en formato:

`X horas y Y minutos`

### Horas trabajadas en decimal

Resultado con dos decimales.

Ejemplo:

`8.50 horas`

### Horas extra

Resultado en formato:

`X horas y Y minutos`

### Horas extra en decimal

Resultado con dos decimales.

Ejemplo:

`1.50 horas`

---

## 5. Validaciones

Los campos de hora deberán utilizar valores válidos en formato `HH:MM`.

Se deberán validar:

- Hora de entrada obligatoria.
- Hora de salida obligatoria.
- Formato correcto de las horas.
- Descanso válido.
- Jornada prevista válida.
- Valores no negativos.
- Minutos entre `00` y `59`.

Los errores deberán mostrarse de forma clara al usuario.

La calculadora no deberá realizar cálculos con datos inválidos.

---

## 6. Cruce de medianoche

La calculadora deberá admitir jornadas que comiencen un día y terminen al día siguiente.

Ejemplo:

- Entrada: `22:00`
- Salida: `06:00`
- Descanso: `00:30`
- Jornada prevista: `08:00`

Tiempo transcurrido:

`8:00`

Tiempo trabajado:

`7:30`

Horas extra:

`0:00`

---

## 7. Caso `00:00 → 00:00`

Cuando la entrada y la salida sean exactamente:

`00:00 → 00:00`

se considerará una jornada de duración cero.

Debe devolver:

- Tiempo trabajado: `0:00`
- Horas trabajadas en decimal: `0.00`
- Horas extra: `0:00`
- Horas extra en decimal: `0.00`

No debe producir ningún error únicamente por tratarse de `00:00 → 00:00`.

Este comportamiento deberá estar cubierto por un test específico.

---

## 8. Casos límite

La implementación deberá contemplar como mínimo:

### Jornada exactamente cumplida

Entrada:

`08:00`

Salida:

`16:00`

Descanso:

`00:00`

Jornada prevista:

`08:00`

Resultado:

`0:00` horas extra.

### Jornada superior a la prevista

Entrada:

`08:00`

Salida:

`17:00`

Descanso:

`00:00`

Jornada prevista:

`08:00`

Resultado:

`1:00` horas extra.

### Jornada inferior a la prevista

Entrada:

`08:00`

Salida:

`15:00`

Descanso:

`00:00`

Jornada prevista:

`08:00`

Resultado:

`0:00` horas extra.

### Jornada con descanso

Entrada:

`08:00`

Salida:

`17:00`

Descanso:

`01:00`

Jornada prevista:

`08:00`

Resultado:

`8:00` horas trabajadas y `0:00` horas extra.

### Jornada nocturna

Entrada:

`22:00`

Salida:

`06:00`

Descanso:

`00:00`

Jornada prevista:

`08:00`

Resultado:

`8:00` horas trabajadas y `0:00` horas extra.

### Jornada nocturna con horas extra

Entrada:

`22:00`

Salida:

`07:00`

Descanso:

`00:00`

Jornada prevista:

`08:00`

Resultado:

`9:00` horas trabajadas y `1:00` hora extra.

---

## 9. Botón Calcular

El botón `Calcular` deberá:

1. Validar los datos introducidos.
2. Detener el cálculo si existen errores.
3. Calcular el tiempo trabajado.
4. Calcular las horas extra.
5. Mostrar los resultados.
6. Actualizar los resultados sin recargar la página.

---

## 10. Botón Reiniciar

El botón `Reiniciar` deberá:

- Vaciar los campos.
- Eliminar mensajes de error.
- Ocultar o limpiar los resultados.
- Devolver la calculadora a su estado inicial.

No deberá recargar la página.

---

## 11. Arquitectura técnica

La lógica matemática deberá mantenerse separada de la interfaz.

Se deberán reutilizar las utilidades existentes del proyecto siempre que sean adecuadas.

No se deberá duplicar innecesariamente lógica ya existente para:

- interpretar horas;
- convertir horas a minutos;
- calcular diferencias;
- aplicar descansos;
- formatear resultados;
- validar entradas.

La interfaz deberá limitarse a gestionar entradas, mostrar errores y presentar los resultados calculados.

---

## 12. Tests

Antes de considerar terminada la calculadora deberán existir tests para:

- jornada normal;
- jornada exactamente cumplida;
- jornada con horas extra;
- jornada inferior a la prevista;
- descanso;
- cruce de medianoche;
- cruce de medianoche con descanso;
- `00:00 → 00:00`;
- conversión a horas decimales;
- valores inválidos;
- valores negativos cuando corresponda;
- reinicio de la calculadora, si la interacción se prueba mediante tests de interfaz.

Todos los tests existentes del proyecto deberán continuar pasando.

---

## 13. Responsive y accesibilidad

La calculadora deberá funcionar correctamente en:

- ordenador;
- tablet;
- móvil.

Los campos deberán tener etiquetas claras.

Los mensajes de error deberán ser comprensibles.

Los botones deberán ser accesibles mediante teclado.

No se deberá depender únicamente del color para comunicar errores o resultados.

---

## 14. SEO básico

La página deberá incluir:

- `title` descriptivo;
- `meta description`;
- un único `H1`;
- encabezados `H2` cuando sean necesarios;
- contenido explicativo útil;
- ejemplos de uso;
- preguntas frecuentes si aportan valor;
- canonical;
- Open Graph;
- enlaces internos hacia otras calculadoras relacionadas.

Título orientativo:

`Calculadora de horas extra - Calcula tus horas extra`

Descripción orientativa:

`Calcula las horas trabajadas y las horas extra de tu jornada con esta calculadora online gratuita. Incluye descansos y jornadas que cruzan la medianoche.`

La URL prevista será:

`/calculadora-horas-extra/`

---

## 15. Criterio de finalización

La calculadora se considerará terminada únicamente cuando:

1. La lógica esté implementada.
2. Los casos límite estén cubiertos.
3. Los tests pasen.
4. El comportamiento en navegador haya sido comprobado.
5. El botón Calcular funcione correctamente.
6. El botón Reiniciar funcione correctamente.
7. El cruce de medianoche funcione.
8. `00:00 → 00:00` devuelva cero sin error.
9. El build de Astro sea correcto.
10. La página tenga la estructura SEO prevista.
11. No se haya introducido regresión en las calculadoras existentes.