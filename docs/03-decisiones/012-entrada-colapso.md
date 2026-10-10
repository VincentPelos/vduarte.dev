---
tags: [decision, movimiento]
estado: Aceptada
fecha: 2026-10-10
---

# 012 · Entrada del agujero negro por colapso

Reemplaza en parte a la [decisión 011](011-agujero-precalculado.md): se mantienen el precálculo y el anillo de carga. Cambia cómo entra la escena cuando termina el precálculo.

## Contexto
Con la 011, la escena entraba con un fundido de 700 ms: el canvas pasaba de opacidad 0 a 1 sobre la grilla de respaldo. A media opacidad, la sombra del agujero se veía gris un momento (#83). El autor pidió una animación de inicio que tapara esa transición y la eligió en un laboratorio entre cuatro variantes: ignición por celdas, colapso, arranque de terminal y contador en puntos.

## Decisión
- **Colapso:** al terminar el precálculo, la sombra crece desde su radio (2,6 Rs) hasta cubrir el hero en 520 ms (`ease-in` cúbico), se mantiene 140 ms y se contrae de vuelta al agujero en 900 ms (`ease-out` exponencial), con la escena ya entera detrás.
- **Sin opacidades intermedias:** cada celda es sombra, escena o transparente, nunca una mezcla. El borde es una fila de puntos de la paleta según el ángulo, con un 40 % de desorden por celda (hasta 5 celdas).
- **Se dibuja en el shader de pantalla** (`uCover`, `uCoverOnly`, `uEdge`): no agrega elementos al DOM ni otro canvas.
- **El texto nunca se tapa:** desde el inicio del colapso, WebGL dibuja el texto del hero (`.is-lensing`), también encima de la sombra. Los botones quedan sobre el canvas.
- **Con el hero cubierto** se quitan la grilla de respaldo y la carga (`.has-scene`, sin `.is-loading`), así el cambio no se ve.
- **`prefers-reduced-motion`:** sin colapso; el cuadro estático aparece de una vez detrás del texto real.

## Alternativas consideradas
- **Ignición por celdas:** la escena aparece celda por celda desde el agujero. También evita el gris, pero el autor prefirió el colapso.
- **Arranque de terminal y contador en puntos:** pantallas completas que tapan todo el sitio mientras carga. Chocan con la regla de que el contenido no depende de una animación.

## Consecuencias
- La entrada dura ~1,56 s después del precálculo, en vez de 0,7 s. El texto se puede leer todo el tiempo.
- El colapso avanza con el reloj: si el hero está fuera de pantalla al terminar el precálculo, al volver la escena ya está entera.
- Cambiar duraciones o borde = cambiar las constantes `COLLAPSE_*` de `black-hole.ts`.
