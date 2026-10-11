---
tags: [decision, bi, rendimiento]
estado: Aceptada
fecha: 2026-10-10
---

# 017 · Gráficos del caso en HTML, sin Chart.js

Reemplaza en parte a la [decisión 006](006-power-bi-descarga.md): se mantienen la descarga del `.pbix`, las capturas y los enlaces a los notebooks. Cambia cómo se muestran las cifras: ya no hay un dashboard propio con Chart.js.

## Contexto
La 006 planeaba recrear las vistas del Power BI con Chart.js. En el laboratorio de la página del caso, el autor pidió "más datos, menos proceso": las cifras de la investigación como protagonistas, con el Power BI en capturas y su descarga, porque no se puede incrustar sin licencia. Eligió mostrar esas cifras como gráficos de barras.

## Decisión
- **Las cifras de cada hallazgo** (superficie, dependencia por comuna, ranking de amenazas, incidentes, el caso 2023, precio y volumen, proyecciones) viven en `cases.json` (`blocks[].panels[].chart`) y se dibujan con **barras en HTML y CSS** (`components/case/BarChart.astro`).
- **Dos tipos de gráfico:**
  - `bars`: una barra por ítem, desde 0 o con negativos alrededor de un eje;
  - `pairs`: antes y después por ítem.
- Cada fila es texto (nombre y cifra), así que se lee sin JavaScript y con lector de pantalla; la barra es decorativa.
- **Sin dependencias nuevas** y sin JS en la página.

## Alternativas consideradas
- **Chart.js:** gráficos en canvas con tooltips. Suma ~70 kB de JS, un canvas por gráfico y hay que repetir el texto para la accesibilidad. Para barras con cifras visibles no aporta.
- **Tablas completas:** se probaron en el laboratorio; el autor prefirió los gráficos.

## Consecuencias
- La página del caso se genera entera en el build, sin JS propio (A3 y Lighthouse).
- Para agregar o corregir una cifra se edita `cases.json`, y el schema valida cada gráfico.
- Los números del caso vienen del Datamart y de `hallazgos_cereza.md` del repo [colchagua-etl](https://github.com/VincentPelos/colchagua-etl). Si cambian allá, hay que actualizarlos aquí (lo mismo que ya advertía la 006).
