---
tags: [decision, movimiento, diseno]
estado: Reemplazada en parte por 021 (Sobre mí sin constelación)
fecha: 2026-10-08
---

# 009 · Cinemática de constelaciones por sección

## Contexto
Con el agujero negro del hero ([decisión 008](008-agujero-negro-puntos.md)), el resto de la página quedaba sin el lenguaje de estrellas. El autor pidió que las estrellas recorran el sitio "como una cinemática" y lo decidió sección por sección en el laboratorio "Cinemática de estrellas" con la skill `prototipo-artifact`.

## Decisión
- **Cielo fijo** de estrellas de terminal (grilla de 6 px, niveles · • ●, titileo por escalones) detrás de toda la página. No se dibuja sobre el hero, que tiene el cielo del agujero negro.
- **Constelaciones:** en cada sección las estrellas forman un símbolo y, al hacer scroll, viajan en arco al siguiente (salida escalonada). El color es un degradado de la paleta Nebulosa a lo ancho de cada símbolo.
- **Del hero a Sobre mí:** las estrellas nacen orbitando en el disco del agujero negro con su color y escapan en espiral hasta la `@`, cambiando al color de la constelación.
- **Por sección** (símbolos en `site.json → constellations`):

  | Sección | Símbolo | Dónde |
  |---|---|---|
  | Sobre mí | `@` | Ventana chica de 1 celda en el bento (`~/constelacion`), como detalle |
  | Experiencia | `>_` | Al inicio de una línea de tiempo de estrellas en el margen izquierdo; marca cada trabajo y el `_` parpadea |
  | Proyectos | `</>` | Junto al título; las tarjetas conservan su vidrio |
  | Skills | `#` | Junto al título |
  | Educación | `π` | Al cierre, bajo la lista |
  | Contacto | `?` | Reemplaza el `?` de "¿Hablamos?", más grande que la letra |

- Valores: intensidad, velocidad, densidad y escala al 100 %. **Nada sigue al mouse.**
- Implementación: `components/layout/StarSky.astro` + `star-sky.ts` (canvas 2D, ~6 KB) y funciones puras con tests en `src/lib/constellation.ts`. La posición del agujero se comparte por `src/lib/hole.ts`. Las secciones marcan sus anclas con `data-constellation-section`, `data-constellation` y `data-constellation-mark`.

## Alternativas consideradas
- **Viaje** (avanzar por el espacio con el scroll) y **paralaje** de tres capas: descartados en el laboratorio.
- Para cada sección se probaron 3 ubicaciones (de fondo, al costado, en una ventana o junto al título); ver la bitácora del 2026-10-08.

## Consecuencias
- Es decorativo: sin JS la página se ve igual, y el `?` de Contacto vuelve a ser texto normal.
- Con `prefers-reduced-motion`, las estrellas no titilan ni viajan: saltan a la constelación de la sección visible.
- Las estrellas llegan a cada constelación cuando su símbolo queda al centro de la pantalla (la línea de tiempo de Experiencia usa la sección entera). Al principio se usaba el centro de la sección, y en Proyectos el símbolo ya había salido de la vista al formarse (#91, 2026-10-10).
- Un símbolo necesita al menos ~80 px para leerse en la grilla de 6 px; `π` no existe en Martian Mono y se dibuja con la fuente de respaldo.
