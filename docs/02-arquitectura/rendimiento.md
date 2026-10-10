---
tags: [arquitectura, rendimiento]
actualizado: 2026-10-10
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
- **Brillos sin `filter: blur` animado:** un elemento difuminado que se anima obliga a difuminar de nuevo en cada cuadro. Los brillos (`Glows`) son degradados radiales (`glow-orb` en `global.css`) con el mismo perfil.
- **Cuadros solo cuando cambian:** el cielo de estrellas dibuja a 60 fps durante el scroll o mientras orbita el agujero negro; quieto, ~10 fps alcanzan para los destellos.
- **Peso:** el HTML no repite SVG (íconos como sprite, [010](../03-decisiones/010-iconos-sprite.md)). Martian Mono solo se importa en latín; Geist conserva sus subsets porque las flechas (→ ↗) están en `symbols2`, y el navegador solo baja los que usa.
- **Fuentes precargadas:** Martian Mono 700 y Geist latín van con `<link rel="preload">` en `BaseLayout`; las escenas esperan las fuentes antes de montarse.
- **Precalcular lo que no cambia:** si un cálculo caro no depende del tiempo, se hace una vez y se guarda en una textura ([011](../03-decisiones/011-agujero-precalculado.md)). El precálculo se reparte entre cuadros con un tope de trabajos, porque `gl.finish()` no siempre espera a la GPU.
- **Smooth scroll (Lenis):** solo suaviza la rueda; el touch queda nativo para no pelear con el scroll del celular. Las escenas siguen leyendo `scrollY` una vez por cuadro, así que no necesitan saber de Lenis.
- **Lo compartido entre escenas** (tamaño de celda, DPR, paleta, carga diferida) vive en `src/lib/scene.ts`.

## Estado

| Regla | Estado |
|---|---|
| Carga diferida, DPR ≤ 2, reduced-motion | Cumplida desde v0.3.0 |
| Pausa fuera de pantalla | Cumplida: agujero negro con `IntersectionObserver`; cielo a ~10 fps cuando está quieto (#68) |
| Lecturas de DOM una vez por cuadro | Cumplida (#68) |
| Móvil sin regenerar escenas | Cumplida (#68) |
| Brillos sin blur animado | Cumplida (#68) |
| Íconos en sprite ([010](../03-decisiones/010-iconos-sprite.md)) y precarga de fuentes | Cumplida (#69) |
| Trayectorias del agujero negro precalculadas | Cumplida (#81) |

## Mediciones

Edge headless con WebGL por software, hilo principal en ms de trabajo por segundo (menos es mejor), 4 s por fase, CPU sin ralentizar. Los valores varían ±30 % entre corridas; sirven para comparar, no como números absolutos.

| Fase (móvil 390 px) | Script antes | Script después (#68) | Trabajo total antes | Trabajo total después |
|---|---|---|---|---|
| Hero quieto | 141 | 14–32 | 348 | 170–257 |
| Sobre mí quieto | 81 | 11–12 | 175 | 112–124 |
| Experiencia quieta | 830 | 21 | 994 | 384–432 |
| Scroll continuo | 185 | 34–54 | 415 | 285–322 |

El mayor costo estaba en la línea de tiempo de Experiencia: `getBoundingClientRect` por estrella y por trabajo, en cada cuadro. El resto del trabajo total es pintura y rasterizado (WebGL, vidrio); hay que medirlo en un dispositivo real con GPU.

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
