---
tags: [indice]
actualizado: 2026-10-09
---

# vduarte.dev — Índice de la bóveda

Documentación viva del portafolio de **Vicente Contreras Duarte** (Desarrollador de Software | Soporte e Infraestructura TI). Es la **memoria del proyecto**: se lee como bóveda de Obsidian, en GitHub o por agentes que llegan sin contexto.

> **Cómo leerla:** este índice siempre; el resto, solo la nota cuya columna _Leer cuando_ calce con tu tarea. No hace falta cargar la bóveda completa. Si cambias algo, actualiza su nota en el mismo PR ([reglas](../AGENTS.md#documentación--memoria)).

## Estado actual

- **Última versión:** v0.3.0 Secciones (2026-10-08).
- **En curso:** optimización previa a v0.4.0 — documentación (#67), rendimiento de canvas (#68), peso de la página (#69) y duplicación en componentes (#70).
- **Hito siguiente:** v0.4.0 Movimiento — ver [alcance](01-proyecto/alcance.md#hitos).
- **Repositorio:** `VincentPelos/vduarte.dev` (privado durante el desarrollo, público antes de la entrega).
- **Producción:** `https://vduarte.dev` (VPS en preparación, aún sin desplegar).

## Mapa

### 01 · Proyecto — qué y por qué

| Nota | Contiene | Leer cuando |
|---|---|---|
| [Visión](01-proyecto/vision.md) | Objetivo, audiencia, principios | Decides tono, contenido o prioridades |
| [Alcance](01-proyecto/alcance.md) | Rutas, qué entra y qué no, hitos | Empiezas un hito o dudas si algo corresponde |
| [Rúbrica ISI802](01-proyecto/rubrica.md) | Criterios de evaluación y su estado | El cambio impacta la nota (label `rúbrica`) |

### 02 · Arquitectura — cómo está construido

| Nota | Contiene | Leer cuando |
|---|---|---|
| [Stack](02-arquitectura/stack.md) | Herramientas instaladas y planeadas | Agregas o cambias una dependencia |
| [Estructura](02-arquitectura/estructura.md) | Carpetas y nombres | **Siempre que crees o muevas un archivo** |
| [Contenido](02-arquitectura/contenido.md) | Los JSON y sus schemas | Tocas `src/content/` o `lib/schemas.ts` |
| [Rendimiento](02-arquitectura/rendimiento.md) | Presupuesto y reglas de canvas, scroll y peso | Tocas animaciones, canvas, fuentes, íconos o scripts |
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
| [009](03-decisiones/009-cinematica-constelaciones.md) | Cinemática de constelaciones por sección | Movimiento |
| [010](03-decisiones/010-iconos-sprite.md) | Íconos en un sprite SVG (reemplaza en parte a 007) | UI |

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
