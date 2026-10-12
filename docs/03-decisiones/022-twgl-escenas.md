---
tags: [decision, arquitectura, movimiento]
estado: Aceptada
fecha: 2026-10-12
---

# 022 · twgl.js para el agujero negro y helpers compartidos para los canvas

Complementa la [decisión 008](008-agujero-negro-puntos.md) (WebGL directo, sin three.js) y la [011](011-agujero-precalculado.md) (tabla precalculada).

## Contexto
Los scripts de las escenas eran los archivos más largos del repo: `black-hole.ts` tenía 680 líneas, `star-sky.ts` 408, `bento-art.ts` 276 y `bento-assemble.ts` 217 (#156). El autor pidió simplificarlos para leerlos rápido y aceptó usar librerías que abstraigan.

En `black-hole.ts`, unas 210 líneas eran los shaders (la física, que no se toca) y unas 150 eran fontanería de WebGL a mano: compilar programas, guardar la ubicación de cada uniform, decenas de `gl.uniform1f`, activar unidades de textura y armar framebuffers. Los canvas 2D repetían entre sí el hash, la paleta en CSS, la lectura de tokens, el ajuste del canvas al DPR y el bucle de `requestAnimationFrame`.

## Decisión
- **twgl.js 7** para el WebGL del agujero negro: `createProgramInfo`, `setUniforms` (asigna solo las unidades de textura), `createFramebufferInfo` y `drawBufferInfo`. Los shaders no cambian: viven en `sections/hero/shaders/` (`.vert`, `.frag`, `.glsl`) y se importan con `?raw` de Vite.
- **Sin librería para los canvas 2D:** `lib/scene.ts` suma `frameLoop` (bucle con tope de 0,05 s por cuadro), `fitCanvas`, `hash`, `cssPalette` y `cssToken`. Todas las escenas, la caída y el precálculo usan `frameLoop`; ya no queda ningún `requestAnimationFrame` a mano.
- Las texturas se crean con `auto: false`: sin eso twgl intenta generar mipmaps en texturas que no son potencia de 2 y WebGL avisa con un error.

## Alternativas consideradas
- **three.js / OGL / regl:** más abstracción de la que hace falta para tres pasadas de pantalla completa; three.js pesa ~530 KB.
- **Un helper propio de WebGL (~60 líneas):** pesa menos, pero es código que hay que mantener y leer. twgl está documentado y es el estándar para WebGL "a mano".
- **Motion** para los tweens (ya aprobado en la [004](004-animaciones-vanilla.md)): solo había un tween (la caída), no justificaba la dependencia.

## Consecuencias
- `black-hole.ts` baja de 680 a ~400 líneas y los shaders se leen como archivos propios, con resaltado.
- El chunk del agujero negro pasa de ~7 KB a ~19 KB gzip: twgl no se poda bien (ni con imports con nombre ni con su versión base). Se carga diferido, después de la primera pintura, así que no mueve el LCP.
- Verificación: capturas con GPU real (Edge headless, ANGLE d3d11) antes y después del hero en 1280 y 390 px, del bento, de Experiencia, de Proyectos y de la caída con el armado: diferencias de 0–0,3 % de los píxeles, todas de fase de la animación.
