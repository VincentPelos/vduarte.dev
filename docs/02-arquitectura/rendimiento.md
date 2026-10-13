---
tags: [arquitectura, rendimiento]
actualizado: 2026-10-13
---

# Rendimiento

El sitio tiene dos capas animadas siempre presentes: el agujero negro del hero (WebGL, [008](../03-decisiones/008-agujero-negro-puntos.md)) y el cielo de estrellas de toda la página (canvas 2D, [009](../03-decisiones/009-cinematica-constelaciones.md)). Encima hay tarjetas de vidrio con `backdrop-filter`, que el navegador recalcula cada vez que cambia lo que tienen detrás. Esta nota fija las reglas para que lo que se agregue no lo empeore.

## Reglas

- **Carga diferida:** los scripts de canvas se importan en `requestIdleCallback` (máx. 1,5 s) y nunca bloquean la primera pintura. Si fallan, la página se ve igual sin ellos.
- **Sin animar lo que no se ve:** cada loop se pausa fuera de pantalla (`IntersectionObserver`) y con la pestaña oculta. El hero queda pegado arriba, así que el agujero negro y sus animaciones CSS se pausan cuando la hoja del portafolio lo tapa (`[data-hero-end]`, [decisión 014](../03-decisiones/014-hero-diapositiva.md)). **Todo `IntersectionObserver` de una sección va con `rootMargin: '-1px 0px'`:** en celular Sobre mí empieza justo bajo el hero, y tocar el borde ya cuenta como visible (así `bento-art` se animó sin verse hasta #158). **El borde de la hoja (`[data-hero-end]`, 1 px) se observa con `rootMargin: '-2px 0px 100000px 0px'`** y "visible" = `isIntersecting`: un salto con la nav lo lleva de bajo la pantalla a arriba de ella sin cruzarla, y con el área normal el observador no avisaba; el agujero negro y las animaciones del hero seguían corriendo tapados (#192).
- **~60 fps para lo que se anima solo:** `frameLoop(tick, SCENE_FPS)` se salta cuadros en pantallas de 120/144 Hz. El agujero negro va a ~60 fps; el cielo también mientras orbita el agujero **y el hero se ve**, y con scroll dibuja en cada cuadro para que las constelaciones sigan a las secciones. Los dibujos del bento van a 30 fps: se mueven de a una celda (#192).
- **Nada de trabajo por cuadro que no cambie:** los uniforms constantes del agujero negro se fijan una vez; `hero-fall` solo escribe una variable CSS si cambió.
- **DOM fuera del cuadro por elemento:** en un loop de animación, las lecturas de layout (`getBoundingClientRect`, `scrollY`) se hacen **una vez por cuadro**, nunca por estrella o por partícula.
- **Densidad de píxeles acotada:** los canvas usan `devicePixelRatio` hasta 2.
- **Móvil:** el alto de la ventana cambia al aparecer o esconderse la barra del navegador; eso no debe regenerar escenas, solo reajustar el canvas.
- **`prefers-reduced-motion`:** un cuadro estático; se redibuja solo al hacer scroll o cambiar el tamaño.
- **Sin GPU, sin WebGL:** si WebGL va por software (SwiftShader, llvmpipe, Microsoft Basic Render Driver), el agujero negro no se monta y queda el respaldo (grilla de puntos y texto normal). En la CPU, solo compilar los shaders tardaba ~3 s y cada cuadro trababa la página; en Lighthouse (sin GPU) el bloqueo total llegaba a ~80 s (#109).
- **Animaciones CSS en pausa fuera de pantalla:** `layout/OffscreenPause.astro` marca con `data-offscreen` las secciones que no se ven y sus animaciones decorativas (brillos, ecualizador, pulso) se pausan. Aunque no se vean, piden cuadros todo el tiempo (#109).
- **Velos con `backdrop-filter`** (#167): las entradas de Experiencia y Educación difuminan lo que tienen detrás (6px, máscara radial). Son zonas chicas, pero se recalculan cuando el cielo redibuja: si una medición muestra costo, volver a un degradado tenue. Con el cielo a ~10 fps quieto y los brillos quietos (#192), bajar el blur del bento de 10 a 6 px no cambió nada medible, así que el vidrio se mantiene.
- **Gas pintado una vez** (#172): cada capa de gas se pinta en un canvas aparte al montar o al cambiar el ancho; en cada cuadro solo se copia, movida de a una celda. Los asteroides se recalculan en cada cuadro (unas 600 celdas en total), sin leer el DOM salvo el alto de la página, una vez por segundo.
- **Brillos sin `filter: blur` y quietos:** un elemento difuminado que se anima obliga a difuminar de nuevo en cada cuadro. Los brillos (`Glows`) son degradados radiales (`glow-orb` en `global.css`) con el mismo perfil, y desde #192 no se animan: dentro de un contenedor con `mask-image`, moverlos obligaba a la GPU a recomponer la máscara y a difuminar de nuevo el vidrio de encima en cada cuadro. Era el mayor costo de GPU del sitio.
- **Un `fill` por grupo, no por punto** (#192): en los canvas 2D, cada `beginPath` + `arc` + `fill` es una operación de dibujo aparte. `dotBatch()` (`lib/scene.ts`) junta los puntos por color y opacidad (pasos de 1/20) en un `Path2D` y rellena cada grupo de una vez. El cielo pasó de ~900 `fill` por cuadro a 15–50; lo usan las estrellas, los asteroides y el bento.
- **Lo quieto, pintado una vez:** los puntos del bento que no cambian van a una capa aparte al montar; en cada cuadro se copia la capa y solo se dibujan el cursor, las barras que respiran, los paquetes y los monitos (#192).
- **Animaciones CSS solo de `transform` y `opacity`:** el pulso de "Disponible" animaba `box-shadow`, que se repinta en el hilo principal en cada cuadro dentro de una tarjeta con blur. Ahora es un anillo en `::after` que escala y se apaga (#192).
- **Cuadros solo cuando cambian:** el cielo de estrellas dibuja a 60 fps durante el scroll o mientras orbita el agujero negro; quieto, ~10 fps alcanzan para los destellos.
- **Peso:** el HTML no repite SVG (íconos como sprite, [010](../03-decisiones/010-iconos-sprite.md)) y el sprite va solo en el home, la única página con íconos. Los comentarios de las plantillas van como `{/* */}`: los `<!-- -->` llegan al HTML. Martian Mono solo se importa en latín; Geist conserva sus subsets porque las flechas (→ ↗) están en `symbols2`, y el navegador solo baja los que usa.
- **Fuentes precargadas:** Martian Mono 700 y Geist latín van con `<link rel="preload">` en `BaseLayout`; las escenas esperan las fuentes antes de montarse.
- **Shaders sin bloquear:** se compilan con `createProgramInfoAsync` (`KHR_parallel_shader_compile`); compilarlos en el hilo principal era una tarea larga de ~300 ms en un celular.
- **Compresión:** Nginx sirve con `gzip` ([despliegue](despliegue.md)); sin ella el home pasa de ~180 a ~380 KB transferidos.
- **Precalcular lo que no cambia:** si un cálculo caro no depende del tiempo, se hace una vez y se guarda en una textura ([011](../03-decisiones/011-agujero-precalculado.md)). El precálculo se reparte entre cuadros con un tope de trabajos, porque `gl.finish()` no siempre espera a la GPU.
- **Smooth scroll (Lenis):** solo suaviza la rueda; el touch queda nativo para no pelear con el scroll del celular. La caída al agujero ([decisión 018](../03-decisiones/018-caida-al-agujero.md)) solo intercepta gestos arriba de todo y, durante 1 s, frena la rueda antes de que llegue a Lenis. **No usar `lenis.stop()`:** le pone `overflow: clip` a la página, la barra de scroll desaparece y todo salta de lado. `lib/smooth.ts` comparte la instancia para hacer scroll suave. Las escenas siguen leyendo `scrollY` una vez por cuadro, así que no necesitan saber de Lenis.
- **Lo compartido entre escenas** (tamaño de celda, DPR, paleta, carga diferida, `frameLoop`, `fitCanvas`, `hash`, `dotBatch`) vive en `src/lib/scene.ts`. Todo bucle de cuadros usa `frameLoop`, que limita el paso a 0,05 s.
- **twgl.js** ([decisión 022](../03-decisiones/022-twgl-escenas.md)) suma ~12 KB gzip al chunk diferido del agujero negro (de ~7 a ~19 KB). Sus texturas van con `auto: false`: sin eso intenta generar mipmaps en texturas que no son potencia de 2.

## Estado

| Regla | Estado |
|---|---|
| Carga diferida, DPR ≤ 2, reduced-motion | Cumplida desde v0.3.0 |
| Pausa fuera de pantalla | Cumplida: agujero negro con `IntersectionObserver`; cielo a ~10 fps cuando está quieto (#68) |
| Lecturas de DOM una vez por cuadro | Cumplida (#68) |
| Móvil sin regenerar escenas | Cumplida (#68) |
| Brillos sin blur animado | Cumplida (#68) |
| Íconos en sprite ([010](../03-decisiones/010-iconos-sprite.md)) y precarga de fuentes | Cumplida (#69); sprite solo en el home (#158) |
| Bucles a ~60 fps, `-1px` en los observadores, shaders asíncronos, gzip | Cumplida (#158) |
| Trayectorias del agujero negro precalculadas | Cumplida (#81) |
| Brillos quietos, `fill` por grupo, bento con capa quieta a 30 fps, pulso compositable, borde de la hoja con área extendida | Cumplida (#192) |

## Mediciones

### GPU integrada (#192)

**Las mediciones anteriores usaban la RTX 5060; Edge en esta máquina usa por defecto la Intel Iris Xe integrada**, que es lo que tiene un visitante con laptop. Ahí el home se trababa: GPU al 100 % en Sobre mí, Experiencia y el scroll, con 41–52 fps y cientos de cuadros largos. Lighthouse (97) no lo ve porque mide la carga, no los cuadros.

Banco: Edge con ventana (no headless), producción contra la rama compilada, fases de 4 s, ms de trabajo por segundo de cada hilo (unión de tareas: 1000 = hilo lleno). La GPU integrada varía mucho con la temperatura: se intercalaron corridas y se compararon pares. Las causas se aislaron apagando una capa a la vez en producción:

| Capa apagada | Efecto |
|---|---|
| Animación de los brillos | La GPU baja de ~500 a ~100 en Proyectos, Educación y Contacto; scroll a 60 fps en 2 de 3 corridas |
| `backdrop-filter` (todo) | Experiencia 50 → 58 fps, scroll 42 → 52 |
| Cielo, dibujos del bento o agujero negro, por separado | Ninguno arregla Sobre mí: ahí se suman |
| Lenis o el gas | Sin efecto medible |

Resultado, escritorio 1440 px (GPU, producción → rama):

| Fase | GPU | Hilo principal | fps |
|---|---|---|---|
| Sobre mí | 992 → 483–695 | 506 → 276–312 | 41–58 → **60** |
| Experiencia | 608–1000 → 53–79 | 349 → 53–78 | 50–60 → **60** |
| Educación | 366–538 → 83 | 228 → 55 | 60 |
| Scroll | 709–999 → 508–674 | 497 → 213–264 | 41–60 → **60** |

Celular 390 px con CPU 4× (aquí el cuello es el hilo principal): Sobre mí 31–32 → 49–56 fps, Experiencia 44–57 → 60, scroll 31–44 → 50.

Edge headless con WebGL por software, hilo principal en ms de trabajo por segundo (menos es mejor), 4 s por fase, CPU sin ralentizar. Los valores varían ±30 % entre corridas; sirven para comparar, no como números absolutos.

| Fase (móvil 390 px) | Script antes | Script después (#68) | Trabajo total antes | Trabajo total después |
|---|---|---|---|---|
| Hero quieto | 141 | 14–32 | 348 | 170–257 |
| Sobre mí quieto | 81 | 11–12 | 175 | 112–124 |
| Experiencia quieta | 830 | 21 | 994 | 384–432 |
| Scroll continuo | 185 | 34–54 | 415 | 285–322 |

El mayor costo estaba en la línea de tiempo de Experiencia: `getBoundingClientRect` por estrella y por trabajo, en cada cuadro. El resto del trabajo total es pintura y rasterizado (WebGL, vidrio); hay que medirlo en un dispositivo real con GPU.

### Cielo con gas y asteroides (#172)

`develop` contra la rama, compilados y servidos igual. Edge headless con GPU (pantalla de 144 Hz), 5 corridas intercaladas por versión, mediana de ms de trabajo del hilo principal por segundo en fases de 4 s ([decisión 024](../03-decisiones/024-gas-asteroides.md)).

| Fase | Escritorio 1440 px, antes → después | Celular 390 px con CPU 4×, antes → después |
|---|---|---|
| Hero quieto | 94 → 91 | 398 → 405 |
| Sobre mí quieto | 211 → **182** | 699 → 675 |
| Experiencia quieta | 158 → **132** | 454 → 426 |
| Proyectos quieto | 72 → 64 | 275 → 306 |
| Scroll continuo | 258 → **218** | 651 → 629 |

En escritorio el script baja de 89 a 65 ms/s en Experiencia y de 144 a 113 en el scroll: dibujar 400 estrellas menos ahorra más de lo que cuestan el gas (una copia de imagen por capa) y los asteroides (~600 puntos). En celular todo queda dentro del ruido (±10 %). Los cuadros por segundo no cambian (144). No se midió la GPU: el gas son 6 copias de imagen grandes por cuadro, que van a la GPU.

### Escenas con GPU real (#158)

Lighthouse 13 local con Edge, perfil móvil, con compresión, 5 corridas intercaladas por versión. **El CI no ve esto:** allí WebGL va por software y el agujero negro no se monta; en esta máquina Edge headless usa la GPU (RTX 5060), como el celular de un visitante.

| Home móvil | Antes (#157) | Después (#158) |
|---|---|---|
| Performance con GPU (mediana) | 86 (82–90) | **96** (96–97) |
| TBT con GPU | 359–622 ms | **129–197 ms** |
| JS (bootup) con GPU | 1833 ms | **791 ms** |
| Trabajo del hilo principal con GPU | 6,5 s | **5,0 s** |
| Performance por software, como el CI (mediana) | 97 (92–99) | 96 (94–99), igual dentro del ruido |
| Trabajo del hilo principal por software | 4,5 s | **3,6 s** |

| Página interna | Antes | Después |
|---|---|---|
| `/proyectos/colchagua`: HTML gzip, FCP | 26,6 KB, 1,58 s | **9,7 KB, 1,43 s** |
| `/uso-de-ia`: HTML gzip, FCP | 22,6 KB, 1,58 s | **5,9 KB, 1,43 s** |

Dibujos en 2 s quieto en el hero (pantalla de 144 Hz): cielo 289 → 144, pasadas WebGL 578 → 290, dibujos del bento 1156 → 0. Perfil de CPU del agujero negro (8 s, CPU 4×): 1228 → 648 ms.

Sin compresión (servidor sin `gzip`), el mismo home daba 72: 382 KB transferidos y FCP de 2,7 s.

**Probado y descartado:** medir `Reveal`/`Trace` después de la primera pintura (la pintura real no cambió y el FCP simulado de Lighthouse empeoró de 1,6 a 1,9 s) y pasar el cursor y la flecha del hero a keyframes "compositables" (siguieron recalculando estilo en el hilo principal).

### Peso (#69)

| Archivo | Antes | Después |
|---|---|---|
| `index.html` | 105 KB (30,9 KB gzip) | 94 KB (24,8 KB gzip) |
| CSS | 41 KB (12,8 KB gzip) | 35 KB (8,2 KB gzip) |

### Agujero negro (#81)

fps del hero quieto con la escena animada, en Edge headless (la GPU por software hace visible el costo de la GPU). "Sin escena" es el techo: la misma página con el agujero oculto. El costo propio de la escena es la diferencia con ese techo.

| Ancho | Sin escena | Antes | Después | Costo de la escena por cuadro |
|---|---|---|---|---|
| 390 | 60 fps (tope) | 41 fps | 51–56 fps | ≥10 ms → ≥4 ms |
| 1280 | 32 fps | 16 fps | 23–25 fps | 31 ms → 10 ms (−68 %) |
| 1920 | 15 fps | 9–10 fps | 12–13 fps | 45 ms → 17 ms (−62 %) |

El precálculo tarda 140–450 ms en esa GPU por software, repartido en 8 cuadros o más; en una GPU real, decenas de ms.

## Cómo medir

- **Lighthouse CI** se corre a mano sobre `develop` antes de cada versión menor o mayor (`gh workflow run Lighthouse --ref develop`) y deja los puntajes en el resumen del job (perfil móvil). Ver [decisión 013](../03-decisiones/013-lighthouse-manual.md).
- En local: `pnpm build && pnpm preview`, DevTools → _Performance_ con CPU 4× más lenta, y revisar que el cuadro quede bajo 16 ms al hacer scroll.
- **Cuadros con GPU integrada** (#192): Lighthouse no mide los fps después de cargar. Para eso, Edge **con ventana** (headless no presenta los cuadros igual) por CDP: contar `requestAnimationFrame` por fase y sumar en el trace el tiempo ocupado de `CrRendererMain`, `Compositor` y `CrGpuMain` (unión de tareas, no suma: se anidan). Ver qué GPU usa con `WEBGL_debug_renderer_info`; en una laptop híbrida suele ser la integrada. Para aislar una causa, apagar una capa con CSS inyectado (`display: none`, `animation: none`, `backdrop-filter: none`) y comparar pares intercalados. La ventana debe quedar visible: tapada, el navegador deja de dibujar y la corrida sale vacía.
- **Lighthouse local con y sin GPU:** servir `dist/` **con compresión** (`npx serve dist`; `python -m http.server` no comprime y baja el puntaje ~20 puntos) y correr `npx lighthouse` con `CHROME_PATH` apuntando a Edge o Chrome. Con `--chrome-flags="--headless=new"` usa la GPU; con `--use-angle=swiftshader --use-gl=angle --disable-gpu`, WebGL va por software como en el CI. El TBT varía mucho entre corridas: comparar medianas de varias corridas intercaladas, no una contra una.
