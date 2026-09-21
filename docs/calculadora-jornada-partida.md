IMPLEMENTAR: Calculadora de jornada partida

RUTA
/calculadora-jornada-partida/

OBJETIVO
Crear una calculadora para jornadas con horario partido en dos tramos.

EJEMPLO
Primer tramo:
09:00 → 14:00

Segundo tramo:
16:00 → 19:00

Resultado:
- Primer tramo: 5h 00m
- Segundo tramo: 3h 00m
- Descanso entre turnos: 2h 00m
- Total trabajado: 8h 00m
- Horas decimales: 8.00h

ENTRADAS
Primer tramo:
- Entrada
- Salida

Segundo tramo:
- Entrada
- Salida

Las horas deben funcionar como las calculadoras actuales:
- Mostrar inicialmente --:--
- Escribir 0900 → 09:00

CÁLCULO
- Calcular cada tramo independientemente.
- Calcular el tiempo entre la salida del primer tramo y la entrada del segundo.
- Sumar ambos tramos para obtener el total trabajado.
- Mostrar también horas decimales.
- Si un tramo cruza medianoche, detectarlo correctamente.
- Nunca mostrar resultados negativos.

CASO ESPECIAL
00:00 → 00:00 en cualquiera de los tramos = 0 minutos y sin error.

VALIDACIONES
- Las cuatro horas son obligatorias.
- Formato válido: 00:00–23:59.
- Detectar horas inválidas.
- Detectar tramos solapados cuando corresponda.
- Mostrar mensajes de error claros.
- No calcular si existe un error de validación.

BOTONES
- Calcular
- Reiniciar

REINICIAR
Debe:
- Vaciar las cuatro horas.
- Volver a mostrar --:--.
- Limpiar resultados.
- Limpiar errores.

TESTS MÍNIMOS
1. 09:00–14:00 + 16:00–19:00 = 8h
2. 08:00–13:00 + 14:00–18:00 = 9h
3. Calcular correctamente el descanso entre tramos.
4. Primer tramo cruzando medianoche.
5. Segundo tramo cruzando medianoche.
6. 00:00–00:00 = 0.
7. Campos vacíos.
8. Formato inválido.
9. Hora fuera de rango.
10. Tramos solapados.

ARQUITECTURA Y AISLAMIENTO

MUY IMPORTANTE:

Esta calculadora debe ser independiente de las calculadoras existentes.

OpenCode puede consultar los archivos de las calculadoras actuales para entender:
- estructura
- estilos
- patrones de interacción
- formato de las horas
- validaciones
- organización del proyecto

PERO NO DEBE CONECTAR ESTA CALCULADORA A LAS OTRAS.

No reutilizar directamente componentes, páginas ni documentos de contenido de otras calculadoras si eso crea dependencia entre ellas.

La nueva calculadora debe tener sus propios archivos necesarios y funcionar de forma independiente.

CONTENIDO Y SEO

No enlazar ni reutilizar documentos ya creados para otras calculadoras como contenido de esta página.

Por ejemplo, si necesita una sección:
"Cómo calcular una jornada partida"

debe crear un archivo/documento NUEVO y específico para esta calculadora.

No modificar ni reutilizar el documento "Cómo calcular horas trabajadas" ni otros contenidos existentes para esta nueva página.

Puede consultar esos documentos únicamente como referencia de estilo y estructura.

La nueva página debe tener su propio contenido, ejemplos y FAQ relacionados específicamente con jornadas partidas.

IMPORTANTE
- Antes de modificar nada, inspecciona el proyecto.
- Consulta las calculadoras existentes solo como referencia.
- Mantén esta calculadora aislada.
- No cambies las calculadoras que ya funcionan.
- Reutiliza únicamente utilidades matemáticas genéricas existentes cuando no creen una dependencia de una calculadora concreta.
- No cambies arquitectura estable sin necesidad.
- No añadas funcionalidades no especificadas.

DISEÑO VISUAL

La nueva calculadora debe respetar el diseño general y la identidad visual de las calculadoras existentes.

Puede consultar las calculadoras actuales para reproducir:
- estructura visual
- tipografías
- tamaños
- espaciados
- botones
- campos de entrada
- colores
- tarjetas/resultados
- estados de error
- comportamiento responsive

La apariencia debe sentirse como parte del mismo sitio web.

IMPORTANTE:
- Reutilizar el diseño y los patrones visuales.
- NO reutilizar componentes, páginas o documentos de contenido que creen dependencia funcional.
- La calculadora debe tener sus propios archivos y su propia lógica de interfaz.
- No modificar el diseño de las calculadoras existentes para adaptarlo a esta nueva calculadora.

RESPONSIVE
Debe funcionar correctamente en móvil, especialmente alrededor de 320–375 px, sin scroll horizontal.

AL FINAL
Ejecuta:

npm.cmd run test:run
npm.cmd run build

Si algo falla, diagnostica primero y corrige después.