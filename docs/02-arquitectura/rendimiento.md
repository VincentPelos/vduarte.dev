---
tags: [arquitectura, rendimiento]
actualizado: 2026-10-09
---

# Rendimiento

El sitio tiene dos capas animadas siempre presentes: el agujero negro del hero (WebGL, [008](../03-decisiones/008-agujero-negro-puntos.md)) y el cielo de estrellas de toda la página (canvas 2D, [009](../03-decisiones/009-cinematica-constelaciones.md)). Encima hay tarjetas de vidrio con `backdrop-filter`, que el navegador recalcula cada vez que cambia lo que tienen detrás. Esta nota fija las reglas para que lo que se agregue no lo empeore.

## Reglas

- **Carga diferida:** los scripts de canvas se importan en `requestIdleCallback` (máx. 1,5 s) y nunca bloquean la primera pintura. Si fallan, la página se ve igual sin ellos.
- **Sin animar lo que no se ve:** cada loop se pausa fuera de pantalla (`IntersectionObserver`) y con la pestaña oculta.
- **DOM fuera del cuadro por elemento:** en un loop de animación, las lecturas de layout (`getBoundingClientRect`, `scrollY`) se hacen **una vez por cuadro**, nunca por estrella o por partícula.
- **Densidad de píxeles acotada:** los canvas usan `devicePixelRatio` hasta 2.
- **Móvil:** el alto de la ventana cambia al aparecer o esconderse la barra del navegador; eso no debe regenerar escenas, solo reajustar el canvas.
- **`prefers-reduced-motion`:** un cuadro estático; se redibuja solo al hacer scroll o cambiar el tamaño.
- **Peso:** el HTML no repite SVG (íconos como sprite) y las fuentes solo cargan el subset latino.

## Estado

| Regla | Estado |
|---|---|
| Carga diferida, DPR ≤ 2, reduced-motion | Cumplida desde v0.3.0 |
| Pausa fuera de pantalla | Agujero negro sí; cielo de estrellas pendiente (#68) |
| Lecturas de DOM una vez por cuadro | Pendiente (#68) |
| Móvil sin regenerar escenas | Pendiente (#68) |
| Íconos en sprite y fuentes latinas | Pendiente (#69) |

## Cómo medir

- **Lighthouse CI** corre en cada PR y deja los puntajes en el resumen del job (perfil móvil).
- En local: `pnpm build && pnpm preview`, DevTools → _Performance_ con CPU 4× más lenta, y revisar que el cuadro quede bajo 16 ms al hacer scroll.
