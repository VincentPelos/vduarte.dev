---
tags: [decision, diseno, movimiento]
estado: Aceptada
fecha: 2026-10-11
---

# 020 · Experiencia y Educación con columna de años

## Contexto
El autor sentía que Experiencia y Educación eran texto flotando sobre las estrellas: sin jerarquía, sin vida y a veces difíciles de leer (#134). En un grill fijó qué buscaba: que se entienda al tiro quién es, qué hace y cómo; menos texto con el detalle a pedido; carreras con más peso que las capacitaciones; y una entrada orquestada. También cambió el orden del home: Experiencia → Proyectos → Educación → Skills. En el laboratorio eligió la **dirección 2, columna de años**, con duración de la entrada 100 % y velo 100 %.

## Decisión
- Las dos secciones usan `ui/YearBlock.astro`: el año grande en una columna fija (`sticky`) desde 721px, el más reciente con la paleta. Los datos se agrupan con `groupByYear` (`lib/dates.ts`); sin fecha de inicio, el año sale de `dateNote`.
- **Experiencia** muestra periodo, rol, empresa, una línea (`summary`, campo nuevo de `experience.json`) y 6 tecnologías; los logros quedan en un `<details>` nativo, que funciona sin JS. La línea de tiempo sigue siendo la constelación del cielo ([decisión 009](009-cinematica-constelaciones.md)): el ancla `data-constellation-mode="timeline"` ahora va entre los años y los trabajos, con 104px arriba para el símbolo `>_`.
- **Educación** tiene su línea punteada propia; las capacitaciones de un año se juntan en un bloque compacto.
- Un **velo** (`veil`) oscurece las estrellas detrás de cada entrada.
- La entrada la hace `layout/Trace.astro`: la línea se dibuja y cada estrella enciende su entrada. Sigue las reglas de los reveals: solo anima lo que está bajo la pantalla al cargar y respeta `prefers-reduced-motion`.

## Alternativas consideradas
- **Dirección 1, línea a la izquierda** (como antes, con la nueva jerarquía): el autor prefirió la columna de años.
- **Tarjetas de vidrio, tarjeta destacada o años grandes con todo visible** (primer laboratorio): descartadas por tener mucho texto y verse genéricas.
- **Logros siempre visibles o sacarlos al CV:** el resumen con despliegue baja el texto sin perder información.

## Consecuencias
- `experience.json` gana `summary` y `site.json` los textos del botón de logros.
- Si un año tiene muchas capacitaciones, el bloque crece en filas, no en entradas nuevas en la línea.
- La densidad de estrellas del cielo no cambió: el velo resuelve la legibilidad.
