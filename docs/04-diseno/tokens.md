---
tags: [diseno, tokens]
actualizado: 2026-10-10
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

Reemplaza a la paleta Sangre (`#ff0040`, `#9b00ff`, `#ff8a00`) desde la decisión 008. Se usa en: el disco y el cielo del agujero negro, brillos de fondo, portada de *Sonando*, estrellas de gacha, barra de progreso, el `?` de "¿Hablamos?" y los gráficos del caso Colchagua.

## Vidrio y brillos

| Token | Valor |
|---|---|
| `--blur` | `20px` (backdrop-filter de las tarjetas, con `saturate(170%)`) |
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
- Bento "sobre mí": 4 columnas → 2 (≤900px) → en celular (≤460px), sobre mí, un carrusel con hora, estado, sonando, jugando y enlaces (`auto-cols-[42%]`, snap), stack y cielo.
- Celular (≤460px): el texto va al 90 % (`font-size` de `html`).
- Proyectos: los destacados son tarjetas en una fila (2 columnas desde 561px, 3 desde 861px) con imagen de 160 px, relleno compacto (12–13 px) y descripción a 3 líneas; en celular, un carrusel con 1,2 tarjetas a la vista que se detiene en cada una. Los demás van en una lista con miniatura 4:3 (96 px; 72 px en celular).
- Skills: sin tarjetas. Cada grupo es una fila con su título, la cantidad y una línea de puntos, y las herramientas como chips con ícono; 1 columna → 2 desde 901px.
- Educación: línea de vida con estrellas (`--c2`, punteada) y los años de inicio grandes en contorno (`--muted`). Las carreras son estrellas grandes con la paleta; las capacitaciones, estrellas chicas (`--soft`).
- Nav: píldora fija arriba y centrada; resalta la sección que cruza el centro de la pantalla (`aria-current`, fondo `--glass-hi`).

## Movimiento

- **Agujero negro del hero:** celdas de 6 px, velocidad `65%`, escala `160%`, Doppler activado; deambula solo (no sigue al mouse), pausa fuera de pantalla. Las letras cercanas se comban con aberración cromática.
- **Hero como diapositiva:** pantalla completa y pegado arriba; el portafolio sube encima como una hoja (borde redondeado de 28 px, línea `--line-hi`) y el hero se oscurece hasta 25 % ([decisión 014](../03-decisiones/014-hero-diapositiva.md)).
- **Entrada del agujero negro:** al terminar el precálculo, la sombra crece hasta cubrir el hero (520 ms, `ease-in` cúbico), se mantiene 140 ms y se contrae de vuelta al agujero (900 ms, `ease-out` exponencial), con un borde de puntos de la paleta y 40 % de desorden de celdas. El texto queda encima ([decisión 012](../03-decisiones/012-entrada-colapso.md)).
- **Cinemática de constelaciones:** cielo fijo de puntos detrás de la página; en cada sección las estrellas forman su símbolo y viajan en arco al siguiente con el scroll ([decisión 009](../03-decisiones/009-cinematica-constelaciones.md)).
- **Brillos:** `animate-drift`, 18 s alternado, desfasados −6 s y −12 s.
- **Tarjetas:** brillo radial de 320px que sigue al puntero (`spotlight`).
- **Reveals:** subir 38 px + fade, 800 ms, `cubic-bezier(.22,1,.36,1)`, stagger 70 ms entre los que entran juntos. Se marcan con `data-reveal` (títulos de sección, tarjetas de vidrio, trabajos y estudios) y los anima `layout/Reveal.astro`. Solo animan los que están bajo la pantalla al cargar; nunca los que contienen una constelación, porque las estrellas miden su posición.
- **Regla:** nada de contenido oculto esperando una animación; `prefers-reduced-motion` apaga todo.

## Accesibilidad

- Contraste AA mínimo sobre negro (`--muted` sobre `--bg` cumple para texto ≥14px).
- Foco visible: outline de 2px `--fg`.
- HTML semántico: `section`, `article`, `nav`, encabezados en orden.
