---
tags: [decision, movimiento, diseno]
estado: Aceptada
fecha: 2026-10-10
---

# 014 · Hero como diapositiva que el portafolio tapa

## Contexto
El hero medía lo que su texto y la escena del agujero negro se cortaba en su borde inferior, a media pantalla, al empezar Sobre mí. El autor lo notó como un corte feo y pidió separar el hero del resto, como una diapositiva. Eligió la variante H2 en el laboratorio de UI en celular (#92), frente a H1 (un scroll salta directo al portafolio).

## Decisión
- **El hero ocupa la pantalla entera** (`min-h-svh`) y queda pegado arriba (`sticky`). El portafolio es una **hoja** que sube encima: borde superior redondeado (28 px), línea `--line-hi` y sombra.
- **Capas** (en `pages/index.astro`): hero `z-1` < fondo de la hoja `z-2` < cielo de estrellas `z-3` < contenido `z-4`. `main` no tiene z-index propio para que se ordenen entre sí; así las estrellas se ven sobre la hoja y nunca sobre el hero.
- **Se oscurece** hasta 25 % de opacidad mientras la hoja lo tapa, con una animación ligada al scroll (`animation-timeline: scroll()`), sin JS. Donde no hay soporte o con movimiento reducido, solo queda tapado.
- **`[data-hero-end]`** marca el borde de la hoja. Lo usan el agujero negro (se pausa cuando el borde pasa arriba de la pantalla) y la nav (`~/` está activo mientras el borde está bajo el centro).
- La cinemática de constelaciones toma el inicio de la página como lugar del hero y el borde de la hoja como fin de su cielo.
- Aplica a todos los tamaños.

## Alternativas consideradas
- **H1, diapositiva con salto:** un scroll lleva directo al portafolio. Se descartó en el laboratorio; además, secuestrar el scroll pelea con Lenis y con el teclado.
- **Dejar el hero como estaba y difuminar su borde inferior:** sigue cortando la escena.

## Consecuencias
- El primer pantallazo es solo el hero; el portafolio empieza una pantalla más abajo.
- Con el hero tapado, el agujero negro no dibuja: el costo es el mismo que con el hero fuera de pantalla.
- Una página nueva con hero tiene que repetir la hoja y las capas; las páginas sin hero necesitan su contenido en `z-4` para quedar sobre el cielo.
