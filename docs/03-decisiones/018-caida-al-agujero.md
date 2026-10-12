---
tags: [decision, movimiento, diseno]
estado: Aceptada
fecha: 2026-10-11
---

# 018 · Caída al agujero negro al pasar al portafolio

Reemplaza en parte a la [decisión 014](014-hero-diapositiva.md): el hero sigue siendo una diapositiva de pantalla completa que la hoja del portafolio tapa. Cambia cómo se pasa del hero al portafolio.

## Contexto
El autor pidió que pasar del hero al contenido fuera un zoom hacia el agujero negro, en la posición donde esté (#136), y una flecha que indique cómo bajar (#131). En el laboratorio comparó tres transiciones: **A** caída ligada al scroll (con una pantalla extra de scroll), **B** zoom bajo la hoja mientras sube, y **C** salto automático. También comparó tres flechas: **F1** píldora, **F2** comando de terminal y **F3** flecha en puntos. Eligió **C con F1**, con los valores por defecto: profundidad 100 %, apagado del texto 60 % y flecha al 100 %.

## Decisión
- **Salto automático:** arriba de todo, el primer gesto hacia abajo no hace scroll. Puede ser rueda, deslizar el dedo, ↓, Av Pág, espacio o la flecha. Ese gesto dispara la caída: en 1 s la cámara se acerca al agujero, en su posición, hasta que la sombra llena la pantalla. Recién después el portafolio sube con scroll suave.
- **Vuelta:** al subir, por cualquier vía, la cámara retrocede siguiendo el scroll. Cuando la hoja termina de bajar, el hero está como al principio.
- **Nada depende de que termine el scroll suave.** Si el aterrizaje se interrumpe arriba de todo, la cámara retrocede sola a los 1,2 s. Un gesto hacia arriba también la hace retroceder (rueda, deslizar, ↑, Re Pág o Inicio).
- **Zoom en el shader:** `uZoom` escala la vista alrededor del agujero, de forma exponencial (1× a lo que cubre la esquina más lejana) y con aceleración y frenado cúbicos. Cada estrella sigue siendo un punto de la grilla que se aleja, no un bloque. No agrega pasadas ni canvas.
- **El texto del hero se apaga** en la primera mitad de la caída: el de WebGL con `uTextFade`, los botones con `--fall-text`.
- **Flecha F1:** una píldora de vidrio abajo al centro, «portafolio ↓», con la flecha subiendo y bajando suave. Es un ancla a `#sobre-mi`, así que sin JS o sin escena baja normal. Con teclado, el foco queda en Sobre mí.
- **Nada queda atrapado:** la barra de scroll, la nav y las anclas siguen funcionando. La caída acompaña al scroll (`max(caída, (scrollY / alto)²)`), así el hero nunca queda a medias.
- **Sin escena no se intercepta nada.** Sin escena significa sin WebGL o con WebGL por software. Con `prefers-reduced-motion` tampoco se monta y queda la hoja de la 014.
- Código: `sections/hero/hero-fall.ts` (gestos y avance), `lib/fall.ts` (estado compartido y cálculos con tests) y `lib/smooth.ts` (Lenis compartido para el scroll suave tras la caída). Durante la caída la rueda se frena antes de llegar a Lenis, sin `lenis.stop()`: ese método esconde la barra de scroll y la página salta de lado.

## Alternativas consideradas
- **A, caída ligada al scroll:** suma una pantalla de scroll solo para la transición.
- **B, zoom bajo la hoja:** más sutil, pero la hoja tapa la mayor parte del zoom.
- La 014 había descartado el salto (H1) porque secuestrar el scroll pelea con Lenis y el teclado. Aquí se resuelve así: se intercepta solo arriba de todo, la rueda se frena antes de llegar a Lenis durante la caída y teclado, toque y anclas tienen su propio camino.

## Consecuencias
- Desde el hero, el primer gesto tarda ~1 s más en llevar al portafolio.
- El costo por cuadro es el mismo: la escena ya se dibujaba en cada cuadro mientras el hero está a la vista.
- Al fondo de la caída la sombra no queda negra del todo: la banda del disco cruza la pantalla, como en el laboratorio.
