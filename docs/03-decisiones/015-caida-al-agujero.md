---
tags: [decision, movimiento, diseno]
estado: Aceptada
fecha: 2026-10-10
---

# 015 · Hero horizonte con caída al agujero negro

Reemplaza en parte a la [decisión 014](014-hero-diapositiva.md) (la hoja que tapa el hero y su oscurecido) y a la [decisión 008](008-agujero-negro-puntos.md) (el agujero ya no deambula). Se mantienen el hero de pantalla completa, las capas, el precálculo ([011](011-agujero-precalculado.md)) y la entrada por colapso ([012](012-entrada-colapso.md)).

## Contexto
Con el hero como diapositiva, el autor pidió repensar su composición y propuso "un zoom que haga como que entramos al agujero". En el laboratorio del hero eligió la composición **D · Horizonte** y la transición **T1 · Caída**, frente a hoy, centro de gravedad y sesión de terminal (composición) y a la hoja, la caída con estelas y la hoja con zoom (transición).

## Decisión
- **Composición horizonte:** el agujero, quieto y 3,2 veces más grande, tiene su centro bajo la pantalla (112 % del alto; 102 % en pantallas de menos de 760 px). El disco cruza la parte baja como un horizonte. El texto va centrado arriba y el nombre pasa a `clamp(2.2rem, 6.6vw, 5.4rem)`. Abajo, «desliza ↓» (`site.json → scrollCue`).
- **Caída:** entre el hero y el portafolio hay 0,6 pantallas de scroll (`[data-hero-fall]`). En ese tramo, la cámara apunta a un punto 1,5 Rs sobre el centro de la sombra (se entra por encima del disco), lo lleva al centro y acerca el zoom con una curva que acelera. A 90 % del tramo la sombra cubre la pantalla. El zoom final se calcula según el tamaño de la pantalla para que eso pase igual en escritorio y en celular.
- **Mientras cae:**
  - el texto se apaga y sube 70 px en el primer 45 % (el de WebGL con `uTextAlpha`/`uTextRise`; los botones, el cursor y el aviso con `--fall-out`);
  - las estrellas del cielo del agujero se alejan del punto de caída.
- **Llegada:** el portafolio entra con la pantalla ya negra, así que la hoja no tiene borde (`html[data-fall]`). Sin caída (movimiento reducido o sin WebGL), la hoja conserva su borde redondeado.
- **Tabla fina:** de cerca, la tabla de siempre (20 Rs) se vería en bloques. Se precalcula una segunda tabla de 6 Rs con la misma resolución (3,3 veces más detalle), en segundo plano, después de que aparece la escena. Se usa cuando toda la pantalla cae dentro de ella.
- La lente del texto mantiene la escala de antes, porque con el agujero más grande deformaba demasiado el nombre.
- Se quita el oscurecido del hero ligado al scroll de la decisión 014: ahora lo reemplaza la caída.

## Alternativas consideradas
- **Caída con estelas (T2):** las estrellas se estiran en estelas al caer. Se descartó en el laboratorio.
- **Hoja con zoom (T3):** la hoja sube como antes con un zoom suave detrás, sin llegar al negro.
- **Composiciones A, B y C:** texto a la izquierda con el agujero deambulando (hoy), agujero al centro tipo póster, y datos como una sesión de terminal.

## Consecuencias
- El portafolio empieza 1,6 pantallas más abajo; las anclas de la nav saltan directo a cada sección.
- El precálculo dura el doble, pero la escena aparece al terminar la primera tabla, como antes. La tabla fina suma ~6 MB de GPU (6 texturas RGBA de hasta 512²).
- Con movimiento reducido no hay caída ni tabla fina: el cuadro quieto va detrás del texto y la hoja tapa el hero.
- Los valores viven en las constantes `HOLE_*`, `FALL_*` y `FINE_EXTENT` de `black-hole.ts`.
