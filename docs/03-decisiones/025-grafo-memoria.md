---
tags: [decision, contenido, diseno]
estado: Aceptada
fecha: 2026-10-12
---

# 025 · Grafo de la memoria en `/uso-de-ia`, calculado en el build

Respeta el lenguaje de puntos de la [decisión 008](008-agujero-negro-puntos.md) y la regla de contenido como datos de la [002](002-json-por-seccion.md).

## Contexto
`docs/` es la memoria del proyecto: cada decisión, sesión y nota quedó escrita mientras se trabajaba con la IA ([AGENTS.md](../../AGENTS.md#documentación--memoria)). El autor pidió presentarla en `/uso-de-ia` como un grafo (#177).

## Decisión
- **Datos:** las notas `.md` de `docs/` se leen en el build con `import.meta.glob` (`?raw`). Cada nota es un nodo y cada enlace markdown entre dos notas, una arista sin sentido ni repetición. Los enlaces fuera de `docs/`, externos o a archivos que no son notas no cuentan. El grafo crece solo: cada nota o enlace nuevo aparece en el siguiente build.
- **Layout:** de fuerzas (Fruchterman–Reingold), determinista (parte de una espiral, sin azar) y calculado en el build, así el cliente no hace la simulación. Cada nodo cae en la grilla de 6 unidades, sin dos en la misma celda.
- **Dibujo:** las aristas en un SVG (línea punteada `--line-hi`) y cada nota como un `Link` HTML encima, ubicado en porcentaje. Así los puntos miden lo mismo en celular, el foco funciona con teclado y cada uno abre su nota en GitHub. Color por tipo: decisiones `--c2`, bitácoras `--c3`, notas `--c1` y el índice `--fg`; tres tamaños (5, 8 y 12px) según cuántas notas enlaza.
- **Interacción:** al pasar el mouse, enfocar o tocar una nota se encienden ella, sus vecinas y sus enlaces, y arriba se lee su ruta y su título. En celular el primer toque muestra y el segundo abre. Sin JS se ve el grafo y cada punto abre su nota.
- **Animaciones:** al entrar en pantalla, el grafo aparece en onda desde el índice: cada punto espera 220 ms por salto de enlaces más 1,6 ms por unidad de distancia al índice (calculado en el build), aparece con un pulso (escala 0 → 1,8 → 1, 700 ms) y sus líneas se encienden detrás. Después, cada 650 ms viaja una señal (un punto del color de la nota de origen) por una línea al azar y hace latir a la nota de llegada. Con una nota elegida, las señales salen de ella a todas sus vecinas. Las señales se detienen fuera de pantalla o con la pestaña oculta; con `prefers-reduced-motion` no hay entrada ni señales.
- **Dónde vive:** `components/ai-usage/MemoryGraph.astro` y `memory-graph.ts` (con tests); los textos en `ai-usage.json` (`memory`).

## Alternativas consideradas
- **Simular el layout en el navegador** (o con d3-force): costo de CPU al cargar y una dependencia nueva para 44 nodos que no cambian entre builds.
- **Nodos como `<a>` dentro del SVG:** `Link` lleva un `<span>` (el aviso de pestaña nueva), y un `<span>` dentro de `<svg>` cierra el SVG en el parser de HTML. Además, los puntos se achicarían con el `viewBox` en celular.
- **Una colección de contenido con `glob()` sobre `docs/`:** procesaría el markdown de toda la bóveda para usar solo el título y los enlaces.

## Consecuencias
- El HTML de `/uso-de-ia` suma los nodos y las aristas (45 y 159 al crearse); el script es chico y no hay canvas: las señales son círculos SVG animados con la Web Animations API, a lo sumo unas decenas a la vez.
- Las notas de `docs/` no se publican; solo su título y su ruta, que enlaza al repositorio (privado hasta la entrega).
