---
name: prototipo-artifact
description: Prototipa un diseño de vduarte.dev como artifact interactivo antes de implementarlo. Úsala SOLO cuando el autor pida explícitamente diseñar o rehacer algo visual en un artifact ("hazme un artifact", "dame opciones para ver"). NO la uses para probar o mostrar cambios ya implementados: para eso se levanta `pnpm dev`. Produce un laboratorio con variantes y controles, lo itera con el autor y deja anotada la decisión antes de implementar.
---

# Prototipo en artifact

> **Cuándo sí y cuándo no.** Los artifacts son para **diseñar**, y solo cuando el autor lo pide explícitamente. Para **probar o mostrar** algo ya implementado no se crean artifacts: se levanta el servidor de desarrollo (`pnpm astro dev --background`, http://localhost:4321) y se le da la URL al autor. Tampoco se publica el sitio como artifact de vista previa.

En este proyecto **nada visual se implementa sin verlo antes**. El autor decide mirando, no leyendo: se le muestra un laboratorio con variantes y controles, elige y ajusta valores, y recién entonces se implementa con el flujo normal (issue → rama → PR).

## 1. Entender qué se decide

- Si el pedido es claro, no preguntes: propón **2 a 4 variantes** distintas de verdad (no la misma idea con otro color).
- Si falta algo esencial (qué sección, qué sensación busca), haz **una ronda** corta de preguntas con opciones concretas. Para direcciones muy abiertas, interroga en rondas (origen, movimiento, formas, color) hasta llegar al concepto.
- Lee `docs/04-diseno/tokens.md` (fuente de verdad del diseño) y las decisiones de `docs/03-decisiones/` que apliquen. Las decisiones del autor pesan más que tus gustos.

## 2. Lenguaje del sitio (no negociable salvo que el autor lo cambie)

- **Fondo negro**, UI monocroma, vidrio esmerilado estilo Tidal en las tarjetas.
- **Arte en puntos de terminal**: todo lo que se dibuja vive en una **grilla fija de celdas** (~6 px); cada celda tiene un punto o nada, en pocos tamaños (· • ●). Nada de halos, destellos ni posiciones al azar. Los puntos son estrellas.
- **Paleta Nebulosa**: `#00d1c1`, `#7a5cff`, `#ff5ca8`. Copia los tokens de `src/styles/global.css`, no inventes colores.
- **Tipografía**: Martian Mono 700 (display), Geist (texto), Geist Mono (utilidad), desde Google Fonts.
- **Movimiento**: tranquilo y con propósito; **no sigue al mouse** salvo pedido explícito; todo respeta `prefers-reduced-motion`; el contenido nunca depende de que termine una animación.
- **Contenido real**: textos de `src/content/*.json`, nunca lorem ipsum.

## 3. Construir el laboratorio

Escribe un HTML autónomo en el scratchpad (`<scratchpad>/<tema>/index.html`):

- Sin `<!doctype>`, `<html>`, `<head>` ni `<body>`: el visor de artifacts los agrega. Arranca con `<title>` (2 a 4 palabras) y `<style>`.
- El visor pinta su propio fondo claro: define `html` y `body` con fondo negro explícito y `color-scheme: dark`.
- Librerías solo desde `cdnjs.cloudflare.com` con versión fija (three.js r128 si hace falta 3D; para shaders de pantalla completa basta WebGL directo).
- **Arriba**, la escena en contexto real (el hero o la sección con su contenido). **Abajo**, el panel:
  - Variantes como tarjetas A/B/C/D con nombre y una línea que explica qué es, en palabras simples.
  - Controles con valores en %: intensidad, velocidad, densidad, escala y los que la idea pida. Botón "Restablecer".
  - `#variante` en la URL abre una variante directo; `localStorage` (con try/catch) recuerda la última.
- Pausa la animación fuera de pantalla (`IntersectionObserver`).

## 4. Revisar una vez y publicar

- Una revisión en Edge headless antes de publicar (no un bucle):
  ```bash
  E="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  # envolver el archivo en <!doctype html><html><head><meta charset="utf-8"></head><body>…</body></html>
  "$E" --headless=new --use-angle=swiftshader --enable-unsafe-swiftshader --hide-scrollbars \
    --enable-logging=stderr --v=0 --window-size=1280,800 --virtual-time-budget=6000 \
    --screenshot=captura.png "file:///…/prueba.html#variante" 2>&1 | grep -iE 'Uncaught|ERROR:CONSOLE|WebGLProgram'
  ```
  Headless no baja de ~500 px: para 390 px, carga la página dentro de un `<iframe>` de 390 px.
- Publica con la herramienta Artifact. **Un artifact por tema**: en cada iteración vuelve a publicar la misma ruta (mismo link) con un `label` corto que diga qué cambió. No crees artifacts nuevos para cada ajuste.

## 5. Iterar y cerrar la decisión

- Cada respuesta: link, qué cambió en 3 a 6 viñetas y qué falta decidir. Si algo no se pudo verificar (movimiento, GPU real, móvil), dilo.
- Cuando el autor elige, pide **variante y valores exactos** y anótalos (memoria y, al implementar, en la decisión o en `tokens.md`).
- Si el autor descarta un artifact, no lo borres sin su confirmación: dile que puede borrarlo con `/artifacts` (tecla `d`).

## 6. Implementar

- Issue → rama `<tipo>/<n>-<slug>` desde `develop` → commits agrupados → PR con `Closes #n` (ver `AGENTS.md`).
- Si el cambio altera la identidad (paleta, lenguaje gráfico, animación principal), registra una decisión nueva en `docs/03-decisiones/` y marca la anterior como _Reemplazada_.
- Para mostrar el sitio real antes de mergear: levanta `pnpm astro dev --background` y dale al autor http://localhost:4321. **No** publiques el sitio como artifact.
