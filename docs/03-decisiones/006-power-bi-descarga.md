---
tags: [decision, bi]
estado: Reemplazada en parte por 017 (gráficos en HTML)
fecha: 2026-10-05
---

# 006 · Power BI: descarga + dashboard web

## Contexto
La rúbrica pide el Power BI de Colchagua incrustado y funcionando (A5). Incrustarlo requiere una licencia que no está disponible; el docente indicó en clase que, en ese caso, se deje para descarga. Los notebooks y el `.pbix` viven en un repositorio propio del proyecto Colchagua.

## Decisión
1. **Descarga** del `.pbix` enlazando al repositorio de Colchagua (única fuente de verdad).
2. **Dashboard web propio** con Chart.js que recrea las vistas clave del Power BI con los mismos datos, en la paleta del sitio. _Reemplazado: las cifras de cada hallazgo se muestran como barras en HTML, sin Chart.js ([decisión 017](017-graficos-html.md))._
3. Capturas de las páginas del Power BI como apoyo visual.
4. Enlaces directos a los notebooks en GitHub.
5. Si se consigue licencia o *Publish to web*, se agrega el embed sin quitar lo anterior.

## Consecuencias
- El criterio se cumple aunque el embed oficial no esté disponible.
- El dashboard web suma creatividad y funciona en móvil, donde un iframe de Power BI se ve mal.
- Hay que mantener sincronizados los datos del dashboard con los del repo de Colchagua.
