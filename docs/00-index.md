---
tags: [indice]
actualizado: 2026-10-13
---

# vduarte.dev — Índice de la bóveda

Documentación viva del portafolio de **Vicente Contreras Duarte** (Desarrollador de Software | Soporte e Infraestructura TI). Es la **memoria del proyecto**: se lee como bóveda de Obsidian, en GitHub o por agentes que llegan sin contexto.

> **Cómo leerla:** este índice siempre; el resto, solo la nota cuya columna _Leer cuando_ calce con tu tarea. No hace falta cargar la bóveda completa. Si cambias algo, actualiza su nota en el mismo PR ([reglas](../AGENTS.md#documentación--memoria)).

## Estado actual

- **Última versión:** v1.0.0 (2026-10-13) Entrega: grafo de la memoria en `/uso-de-ia`, skills dentro de Proyectos, cielo con gas y asteroides, favicon, imagen para compartir y sitemap. En producción en `https://vduarte.dev` desde el 2026-10-13, con [GitHub Release](https://github.com/VincentPelos/vduarte.dev/releases/tag/v1.0.0). Ver [CHANGELOG](../CHANGELOG.md) y [bitácora 2026-10-13](06-bitacora/2026-10-13.md).
- **Hito en curso:** ninguno: v1.0.0 Entrega está publicada y el repo es público. En revisión: rendimiento con GPU integrada (#192, [rendimiento](02-arquitectura/rendimiento.md#gpu-integrada-192)): brillos quietos, puntos en grupos, bento con capa quieta y el agujero que ya no dibuja tapado.
- **Hecho después de v0.6.0:** skills dentro de Proyectos (#162, [decisión 023](03-decisiones/023-skills-en-proyectos.md)), estrellas detrás del bento (#164), `~/` de la nav (#166), brillos y velo que difumina (#167), Noneto publicado (#168), gas estelar y asteroides (#172, [decisión 024](03-decisiones/024-gas-asteroides.md)) el grafo de la memoria en `/uso-de-ia` (#177, [decisión 025](03-decisiones/025-grafo-memoria.md)) y la fase de detalles: sin Cóndor (#174), sin "Configuro redes" (#176), skill elegida con color en Proyectos y footer (#180), logros que se abren suave (#181). Lighthouse sobre `develop`: home 97 y páginas internas 100.
- **Siguiente:** repo público, LinkedIn y la defensa ([pendientes](01-proyecto/pendientes.md#v100--entrega)). Al usar `pnpm dev`, detener el servidor antes de cambiar de rama.
- **Qué falta:** [pendientes](01-proyecto/pendientes.md), por hito y con lo que necesita del autor.
- **Repositorio:** `VincentPelos/vduarte.dev`, público desde la entrega.
- **Producción:** desplegado con Coolify desde `main` (Dockerfile, deploy automático por push), detrás de Cloudflare, en `https://vduarte.dev`.

## Mapa

### 01 · Proyecto — qué y por qué

| Nota | Contiene | Leer cuando |
|---|---|---|
| [Visión](01-proyecto/vision.md) | Objetivo, audiencia, principios | Decides tono, contenido o prioridades |
| [Alcance](01-proyecto/alcance.md) | Rutas, qué entra y qué no, hitos | Empiezas un hito o dudas si algo corresponde |
| [Rúbrica ISI802](01-proyecto/rubrica.md) | Criterios de evaluación y su estado | El cambio impacta la nota (label `rúbrica`) |
| [Pendientes](01-proyecto/pendientes.md) | Qué falta por hito y qué necesita del autor | Empiezas una sesión o cierras un pendiente |

### 02 · Arquitectura — cómo está construido

| Nota | Contiene | Leer cuando |
|---|---|---|
| [Stack](02-arquitectura/stack.md) | Herramientas instaladas y planeadas | Agregas o cambias una dependencia |
| [Estructura](02-arquitectura/estructura.md) | Carpetas y nombres | **Siempre que crees o muevas un archivo** |
| [Contenido](02-arquitectura/contenido.md) | Los JSON y sus schemas | Tocas `src/content/` o `lib/schemas.ts` |
| [Rendimiento](02-arquitectura/rendimiento.md) | Presupuesto, reglas de canvas, scroll y peso, y cómo medir con GPU integrada | Tocas animaciones, canvas, fuentes, íconos o scripts |
| [Despliegue](02-arquitectura/despliegue.md) | Pipeline GitHub → Coolify y variables | Tocas CI/CD o el servidor |

### 03 · Decisiones — por qué así

Leer la decisión solo si tu cambio la toca o la contradice. Las reemplazadas siguen aquí como historia.

| # | Decisión | Área |
|---|---|---|
| [001](03-decisiones/001-astro-sin-framework-ui.md) | Astro sin framework de UI | Arquitectura |
| [002](03-decisiones/002-json-por-seccion.md) | Contenido en un JSON por sección | Contenido |
| [003](03-decisiones/003-despliegue-coolify.md) | Despliegue en Coolify | Infra |
| [004](03-decisiones/004-animaciones-vanilla.md) | Animaciones con librerías vanilla | Movimiento |
| [005](03-decisiones/005-flujo-git.md) | Flujo git main + develop | Git |
| [006](03-decisiones/006-power-bi-descarga.md) | Power BI: descarga + dashboard web | BI |
| [007](03-decisiones/007-iconos.md) | Íconos de Iconify como SVG en el build | UI |
| [008](03-decisiones/008-agujero-negro-puntos.md) | Hero: agujero negro con puntos de terminal | Movimiento |
| [009](03-decisiones/009-cinematica-constelaciones.md) | Cinemática de constelaciones por sección (reemplazada en parte por 021 y 023) | Movimiento |
| [010](03-decisiones/010-iconos-sprite.md) | Íconos en un sprite SVG (reemplaza en parte a 007) | UI |
| [011](03-decisiones/011-agujero-precalculado.md) | Agujero negro con trayectorias precalculadas (reemplaza en parte a 008) | Movimiento |
| [012](03-decisiones/012-entrada-colapso.md) | Entrada del agujero negro por colapso (reemplaza en parte a 011) | Movimiento |
| [013](03-decisiones/013-lighthouse-manual.md) | Lighthouse a mano antes de cada versión menor | Calidad |
| [014](03-decisiones/014-hero-diapositiva.md) | Hero como diapositiva que el portafolio tapa | Movimiento |
| [016](03-decisiones/016-sharp-imagenes.md) | `sharp` para optimizar imágenes | Contenido |
| [017](03-decisiones/017-graficos-html.md) | Gráficos del caso en HTML, sin Chart.js (reemplaza en parte a 006) | BI |
| [018](03-decisiones/018-caida-al-agujero.md) | Caída al agujero negro al pasar al portafolio (reemplaza en parte a 014) | Movimiento |
| [019](03-decisiones/019-cv-latex.md) | CV en LaTeX compilado con Tectonic | Contenido |
| [020](03-decisiones/020-columna-de-anios.md) | Experiencia y Educación con columna de años | Diseño |
| [021](03-decisiones/021-bento-agentes-armado.md) | Bento de áreas que se arma con los puntos del agujero (reemplaza en parte a 009) | Movimiento |
| [022](03-decisiones/022-twgl-escenas.md) | twgl.js para el agujero negro y helpers compartidos para los canvas | Arquitectura |
| [023](03-decisiones/023-skills-en-proyectos.md) | Skills dentro de Proyectos: lista y detalle con pipeline (reemplaza en parte a 009) | Diseño |
| [024](03-decisiones/024-gas-asteroides.md) | Cielo con gas estelar, asteroides y menos estrellas | Movimiento |
| [025](03-decisiones/025-grafo-memoria.md) | Grafo de la memoria en `/uso-de-ia`, calculado en el build | Contenido |

### 04 · Diseño — cómo se ve

| Nota | Contiene | Leer cuando |
|---|---|---|
| [Tokens](04-diseno/tokens.md) | Colores, vidrio, tipografía, movimiento | Cualquier cambio visual |
| [Guía visual](04-diseno/guia.html) | Mockup **histórico** del 2026-10-05 | Solo para contexto histórico (reemplazado por [008](03-decisiones/008-agujero-negro-puntos.md)) |

### 05 · Flujo git — cómo se trabaja

| Nota | Contiene | Leer cuando |
|---|---|---|
| [Ramas](05-flujo-git/ramas.md) | Modelo, nombres, PRs y releases | Abres rama, PR o release |
| [Commits](05-flujo-git/commits.md) | Convención, tipos y alcances | Vas a commitear |

### 06 · Bitácora — qué pasó y cuándo

Una nota por sesión. Leer solo la más reciente si falta contexto; las anteriores, únicamente para buscar algo puntual.

- [2026-10-13](06-bitacora/2026-10-13.md): cierre de v1.0.0: Power BI en el bento, favicon, imagen para compartir, sitemap, README, rúbrica y release; rendimiento con GPU integrada (#192).
- [2026-10-12](06-bitacora/2026-10-12.md): fase de detalles (Cóndor, redes, grafo de la memoria, skill elegida, logros suaves), gas y asteroides (#172), brillos, nav y Noneto, skills dentro de Proyectos (#162), orden de componentes con KISS (Link, PageLayout, tarjetas del bento autónomas) escenas animadas con twgl.js y helpers compartidos, y análisis y arreglos de rendimiento.
- [2026-10-11](06-bitacora/2026-10-11.md): bento de áreas, Experiencia y Educación en columna de años, CV en LaTeX y limpieza de contenido.
- [2026-10-10](06-bitacora/2026-10-10.md): hito Movimiento, laboratorios de UI y Proyectos, hero descartado, Lighthouse y release v0.4.0.
- [2026-10-09](06-bitacora/2026-10-09.md): auditoría y optimización previa a v0.4.0; imagen Docker para Coolify.
- [2026-10-08](06-bitacora/2026-10-08.md): laboratorio de animaciones, release v0.3.0 y contenido personal.
- [2026-10-07](06-bitacora/2026-10-07.md): release v0.2.0 Contenido y secciones de v0.3.0.
- [2026-10-06](06-bitacora/2026-10-06.md): scaffold Astro, estilos base, lint/tests/CI y README.
- [2026-10-05](06-bitacora/2026-10-05.md): definición del proyecto, guía de diseño y setup del repo.

## Convenciones de la bóveda

- Links **markdown relativos** (`[texto](../carpeta/nota.md)`), no `[[wikilinks]]`: así funcionan en GitHub, en Obsidian y para agentes. En Obsidian, desactivar *Settings → Files and links → Use [[Wikilinks]]*.
- Carpetas numeradas para fijar el orden de lectura.
- Cada nota abre con frontmatter (`tags`, `actualizado`).
- Notas cortas y de un solo tema: si una crece demasiado, se parte y se agrega al índice.
- Las decisiones nunca se borran: si cambian, se marca la anterior como *Reemplazada* y se crea una nueva.
- Una nota de bitácora por sesión de trabajo, la más nueva arriba en este índice.
