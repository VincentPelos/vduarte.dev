---
tags: [diseno, tokens]
actualizado: 2026-10-13
---

# Tokens de diseño

**Esta nota es la fuente de verdad del diseño.** Nació de la [guía visual](guia.html), que hoy es histórica: el hero y la paleta cambiaron con la [decisión 008](../03-decisiones/008-agujero-negro-puntos.md). Los ajustes se reflejan aquí en el mismo PR.

**Dirección:** negro puro con UI monocroma, al estilo de Tidal y Vercel. El color vive solo en el agujero negro del hero, en los brillos difuminados detrás del vidrio y en los degradados. Tiene un toque terminal (prompt `whoami`, rutas `src/content/*.json` como etiquetas).

**Lenguaje gráfico: puntos de terminal.** Todo lo que se dibuja (cielo, disco, futuras gráficas) es una grilla fija de celdas con un punto o nada, en pocos tamaños (· • ●). Nada de halos ni posiciones al azar ([decisión 008](../03-decisiones/008-agujero-negro-puntos.md)).

## Color

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#000` | Fondo |
| `--fg` | `#ededed` | Texto principal, botón primario |
| `--muted` | `#8f8f8f` | Texto secundario, labels |
| `--soft` | `#c7c7c7` | Párrafos dentro de experiencia y proyectos |
| `--line` | `rgba(255,255,255,.09)` | Bordes finos |
| `--line-hi` | `rgba(255,255,255,.22)` | Bordes en hover |
| `--glass` | `rgba(255,255,255,.045)` | Fondo de tarjetas de vidrio |
| `--glass-hi` | `rgba(255,255,255,.06)` | Vidrio en hover |
| `--ok` | `#3ddc84` | Estado "disponible", trabajo actual |
| `--nav` | `rgba(10,10,10,.6)` | Fondo de la nav píldora (con blur 32px) |
| `--spot` | `rgba(255,255,255,.07)` | Brillo que sigue al puntero en las tarjetas |

### Paleta "Nebulosa"

| Token | Valor |
|---|---|
| `--c1` | `#00d1c1` |
| `--c2` | `#7a5cff` |
| `--c3` | `#ff5ca8` |

Reemplaza a la paleta Sangre (`#ff0040`, `#9b00ff`, `#ff8a00`) desde la decisión 008. Se usa en: el disco y el cielo del agujero negro, brillos de fondo, los dibujos del bento, el `?` de "¿Hablamos?" y los gráficos del caso Colchagua.

## Vidrio y brillos

| Token | Valor |
|---|---|
| `--blur` | `20px` (backdrop-filter de las tarjetas, con `saturate(170%)`). El bento usa el vidrio al 50 %: `--glass` a la mitad sobre un velo de `--bg` al 15 %, blur `10px` y `saturate(135%)` |
| `--glow` | `0.2` (multiplica la opacidad de los brillos difuminados) |
| Radio de tarjeta | `18px` |
| Radio de botones, chips, nav | `999px` (píldora) |

## Tipografía

| Rol | Fuente | Uso |
|---|---|---|
| Display | **Martian Mono** 700 | Nombre, títulos de sección, títulos de proyecto |
| Texto | **Geist** 300–700 | Párrafos, botones |
| Utilidad | **Geist Mono** 400–500 | Labels, fechas, chips, nav |

Escala clave: nombre `clamp(2.5rem, 10.5vw, 7.5rem)`, títulos de sección `clamp(2.1rem, 6.5vw, 4.2rem)`, "¿Hablamos?" `clamp(3rem, 13vw, 10rem)`, interletrado negativo (`-0.04em`) en display.

## Layout

- Contenedor máximo `1200px` con gutter `clamp(16px, 4vw, 40px)`.
- Espacio vertical de cada sección: `clamp(48px, 12vw, 140px)` arriba y abajo (48px en celular, #146).
- Bento "sobre mí" (#133, [decisión 021](../03-decisiones/021-bento-agentes-armado.md)): la frase con los botones GitHub y Descargar CV, Estado, las cuatro áreas (`~/dev` en `--c1`, `~/datos` en `--c2`, `~/infra` en `--c3`, `~/agentes` en `--fg`), el stack solo con logos (gris `--muted`, `--fg` al pasar el mouse; 9 en una línea desde 621px, a `1.5rem`, y 5 + 4 en celular, #185) y Encuéntrame. 4 columnas desde 901px; 2 columnas hasta 900px, también en celular, para acortar el scroll: ahí el dibujo baja a 84px y la prueba de cada área se esconde.
- Dibujos de las áreas (`about/bento-art.ts`): puntos en la grilla de 6px. Código con cursor (530 ms), las barras de la superficie frutal de Colchagua (el cerezo con la paleta, respira en 900 ms), una red con paquetes que viajan y monitos de 5×5 celdas: un orquestador reparte tareas a tres agentes cada 2,6 s.
- Celular (≤460px): el texto va al 90 % (`font-size` de `html`).
- Proyectos: **lista y detalle** ([decisión 023](../03-decisiones/023-skills-en-proyectos.md)). Desde 861px, la lista a la izquierda (5/12) y el detalle a la derecha (7/12), fijo (`sticky`, 96px); en celular el detalle se abre bajo su proyecto. Cada fila de la lista: miniatura 4:3 de 64px, título (Martian Mono `1.02rem`), año y los logos de sus skills (`--muted`); la elegida con fondo `--glass-hi`. El detalle es vidrio: portada 16:6, año y "★ destacado", título `clamp(1.35rem, 2.6vw, 1.7rem)`, descripción completa, skills como botones redondos de 30px solo con logo (los sin logo, con su nombre), cada uno con un color de la paleta en orden (`--c1`, `--c2`, `--c3`: logo del color, borde al 40 % y fondo al 8 %; elegida: fondo del color y logo `--bg`). Cada proyecto abre con una skill elegida (`skill` en `projects.json`, si falta la primera) y su señal se repite la primera vez que se ve y al cambiar de proyecto, para que se note que se pulsan (#180) y el pipeline en una columna a la derecha desde 561px. Con 2 o más imágenes, la portada lleva "⧉ n" y abre un visor (`<dialog>`): imagen grande, anterior y siguiente, miniaturas, flechas del teclado y Esc.
- Pipeline: las etapas como una línea de puntos (`--line-hi`, punteada); el punto de cada etapa mide 7px. Con una skill elegida, sus etapas se encienden con la paleta (`--c1`, `--c2`, `--c3` en orden) a 1,45× y en `--fg`; las demás se apagan al 55 % de `--muted`.
- Orden del home: hero, sobre mí, Experiencia, Proyectos, Educación, Contacto (#134; Skills salió en #162).
- Experiencia y Educación: **columna de años** (`ui/YearBlock.astro`, [decisión 020](../03-decisiones/020-columna-de-anios.md)). Desde 721px el año va en una columna de `10rem`, fijo (`sticky`, 96px) mientras pasan sus entradas; el más reciente con `text-grad` y los demás en contorno (`--muted`), `clamp(2.2rem, 6vw, 3.4rem)`. En celular el año va arriba de sus entradas. La línea queda 31px a la izquierda de las entradas.
  - Experiencia: la línea es la constelación del cielo (decisión 009). De cada trabajo se ve periodo, rol (Martian Mono; `clamp(1.35rem, 3.2vw, 2rem)` si está vigente), empresa, `summary` y 6 tecnologías más "+n" (4 en celular, #146); los logros van en un `<details>` ("ver logros") que se abre y se cierra suave: alto y opacidad en 420 ms con `ease-out` (#181).
  - Educación: línea punteada propia (`--c2`). Las carreras son estrellas grandes con la paleta y el periodo en `text-grad`; las capacitaciones de un año van juntas en un bloque compacto con una estrella chica (`--soft`): día y mes, título y folio. Hasta 560px son tarjetas chicas de vidrio de a 2 (#146).
- **Brillos** (`ui/Glows.astro`): detrás de Sobre mí (55 %), Experiencia, Proyectos y Educación (45 %, #167) y Contacto (35 %). En Experiencia y Educación van espejados (`-scale-x-100`) para alternar el lado del color; en las tres nuevas cubren una franja de 900px desde el inicio de la sección, detrás del trabajo actual, la lista y el detalle, y las carreras.
- **Velo** (`veil`): detrás de cada entrada de Experiencia y Educación, un difuminado (`backdrop-filter: blur(6px)`) con máscara radial, para que las estrellas no compitan con el texto. Hasta #167 era un degradado negro al 100 %, que sobre los brillos dejaba manchas oscuras.
- **Grafo de la memoria** (`/uso-de-ia`, [decisión 025](../03-decisiones/025-grafo-memoria.md)): vidrio con el grafo en una caja `1000 / 640`. Aristas punteadas (`--line-hi`, `1 4`); puntos de 5, 8 y 12px por cantidad de enlaces, decisiones en `--c2`, bitácoras en `--c3`, notas en `--c1` y el índice en `--fg`. Con una nota elegida, ella crece a 1,6×, sus enlaces se vuelven línea continua `--fg` y el resto baja al 20 % (aristas al 15 %), en 300 ms. Entra en onda desde el índice y por las líneas viajan señales de la paleta; con una nota elegida, salen de ella hacia sus vecinas.
- Nav: píldora fija arriba y centrada; resalta la sección que cruza el centro de la pantalla (`aria-current`, fondo `--glass-hi`).

## Movimiento

- **Agujero negro del hero:** celdas de 6 px, velocidad `65%`, escala `160%`, Doppler activado; deambula solo (no sigue al mouse), pausa fuera de pantalla. Las letras cercanas se comban con aberración cromática.
- **Hero como diapositiva:** pantalla completa y pegado arriba; el portafolio sube encima como una hoja (borde redondeado de 28 px, línea `--line-hi`) y el hero se oscurece hasta 25 % ([decisión 014](../03-decisiones/014-hero-diapositiva.md)).
- **Entrada del agujero negro:** al terminar el precálculo, la sombra crece hasta cubrir el hero (520 ms, `ease-in` cúbico), se mantiene 140 ms y se contrae de vuelta al agujero (900 ms, `ease-out` exponencial), con un borde de puntos de la paleta y 40 % de desorden de celdas. El texto queda encima ([decisión 012](../03-decisiones/012-entrada-colapso.md)).
- **Cinemática de constelaciones:** cielo fijo de puntos detrás de la página; en cada sección las estrellas forman su símbolo y viajan en arco al siguiente con el scroll ([decisión 009](../03-decisiones/009-cinematica-constelaciones.md)).
- **Armado del bento** (`about/bento-assemble.ts`): al aterrizar la caída, los puntos salen del agujero arriba al centro y viajan en curva (`ease-out` exponencial) a los bordes y al relleno de cada tarjeta, que aparece cuando le llegan. Empieza cuando termina la caída, mientras el portafolio sube (`hero:land`). Duración 1500 ms, 20 % de los puntos (la mitad en celular), desorden 100 %. Una vez por visita.
- **Flecha del hero:** `animate-bob`, 1,8 s, baja 5 px y vuelve (solo con `motion-safe`).
- **Gas estelar y asteroides** ([decisión 024](../03-decisiones/024-gas-asteroides.md), #172): en el canvas del cielo, que tiene 700 estrellas. Nubes de puntos de la paleta que se desplazan de lado a 2,4 y 4,2 px/s, respiran ±18 % y suben al 6 % del scroll. Las rocas tienen 4 a 8 celdas de radio, cada una con un color de la paleta (luz: +40 % de blanco; sombra: +35 % de negro); giran a 0,07–0,16 rad/s, flotan ±6px y van al 90 % del scroll, en los márgenes.
- **Brillos:** quietos desde #192, cada uno en un punto del antiguo `drift` (desplazado hasta 6 %/−8 % y escalado hasta 1,15). Animados, la GPU recomponía la máscara y el vidrio de encima en cada cuadro ([rendimiento](../02-arquitectura/rendimiento.md)).
- **Tarjetas:** brillo radial de 320px que sigue al puntero (`spotlight`).
- **Entrada de las líneas de tiempo** (`layout/Trace.astro`, #134): en Experiencia y Educación la línea se dibuja de arriba abajo en 1100 ms y cada entrada aparece cuando le llega: su estrella crece hasta 1,8× y vuelve (520 ms) y el texto entra desde 10 px a la izquierda (640 ms, `cubic-bezier(.22,1,.36,1)`). Mismas reglas que los reveals.
- **Cambio de proyecto, "Transformar"** (#162): View Transitions de 520 ms, `ease-out-expo`. La miniatura elegida crece hasta ser la portada del detalle y la anterior vuelve a la lista; el resaltado se desliza y el texto entra 130 ms después (sube 10px). Sin View Transitions o con movimiento reducido, cambia al tiro.
- **Pipeline, "Señal"** (#162): un punto `--fg` baja por la línea (`cubic-bezier(.45,0,.2,1)`, mín. 420 ms, ~8,5 ms por px) y enciende cada etapa al pasar: su punto crece de 0 a 2,2× y queda en 1,45× (420 ms). Al llegar, los textos se abren de alto 0 al real uno tras otro (55 ms entre cada uno).
- **Reveals:** subir 38 px + fade, 800 ms, `cubic-bezier(.22,1,.36,1)`, stagger 70 ms entre los que entran juntos. Se marcan con `data-reveal` (títulos de sección y tarjetas de vidrio) y los anima `layout/Reveal.astro`. Solo animan los que están bajo la pantalla al cargar; nunca los que contienen una constelación, porque las estrellas miden su posición.
- **Regla:** nada de contenido oculto esperando una animación; `prefers-reduced-motion` apaga todo.

## Accesibilidad

- Contraste AA mínimo sobre negro (`--muted` sobre `--bg` cumple para texto ≥14px).
- Foco visible: outline de 2px `--fg`.
- HTML semántico: `section`, `article`, `nav`, encabezados en orden.

## Marca (#185)

- **Favicon:** un agujero negro de puntos en la grilla: fondo `--bg` con radio 7/32, anillo de puntos entre 6 y 14 unidades del centro (viewBox 32) con la paleta por ángulo (`--c1` → `--c2` → `--c3`), puntos más grandes y brillantes en el borde interno (anillo de fotones) y un lado más brillante (Doppler). Se generó una vez y está en `public/`: `favicon.svg`, `favicon.ico` (PNG de 32 px) y `apple-touch-icon.png` (180 px, sin radio: iOS lo pone).
- **Imagen para compartir** (`public/og.png`, 1200 × 630): fondo `--bg` con la grilla de puntos tenue, `$ whoami` (Geist Mono, `$` en `--ok`), el nombre en Martian Mono 700 a 68px, rol (Geist 23px, `--soft`), la frase (`--muted`) y `vduarte.dev` con el degradado de la paleta; a la derecha, el mismo agujero en grande. Si cambian el nombre, el rol o la frase en `site.json`, hay que regenerarla.

