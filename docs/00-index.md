---
tags: [indice]
actualizado: 2026-10-09
---

# vduarte.dev — Índice de la bóveda

Documentación viva del portafolio de **Vicente Duarte** (Ingeniero de Software & Datos). Esta carpeta está pensada para leerse como una bóveda de Obsidian o directamente en GitHub: es el punto de entrada para cualquier persona o agente que llegue sin contexto.

> **Si eres un agente:** lee esta nota completa, luego [estructura](02-arquitectura/estructura.md) y [flujo git](05-flujo-git/ramas.md) antes de tocar código.

## Estado actual

- **Última versión:** v0.3.0 Secciones (2026-10-08).
- **Hito en curso:** v0.4.0 Movimiento — ver [alcance](01-proyecto/alcance.md#hitos).
- **Repositorio:** `VincentPelos/vduarte.dev` (privado durante el desarrollo, público antes de la entrega).
- **Producción:** `https://vduarte.dev` (pendiente de despliegue).
- **Docker:** imagen de Astro y Nginx preparada para Coolify; falta configurar la aplicación y desplegarla.

## Mapa

### 01 · Proyecto — qué y por qué
- [Visión](01-proyecto/vision.md): objetivo, audiencia y principios.
- [Alcance](01-proyecto/alcance.md): qué entra, qué no y los hitos.
- [Rúbrica ISI802](01-proyecto/rubrica.md): criterios de evaluación y cómo se cumple cada uno.

### 02 · Arquitectura — cómo está construido
- [Stack](02-arquitectura/stack.md): herramientas y su rol.
- [Estructura](02-arquitectura/estructura.md): carpetas y convenciones de nombres.
- [Contenido](02-arquitectura/contenido.md): los JSON y cómo agregar cosas.
- [Despliegue](02-arquitectura/despliegue.md): pipeline GitHub → Coolify.

### 03 · Decisiones — por qué así
- [001 · Astro sin framework de UI](03-decisiones/001-astro-sin-framework-ui.md)
- [002 · Contenido en un JSON por sección](03-decisiones/002-json-por-seccion.md)
- [003 · Despliegue en Coolify](03-decisiones/003-despliegue-coolify.md)
- [004 · Animaciones con librerías vanilla](03-decisiones/004-animaciones-vanilla.md)
- [005 · Flujo git main + develop](03-decisiones/005-flujo-git.md)
- [006 · Power BI: descarga + dashboard web](03-decisiones/006-power-bi-descarga.md)
- [007 · Íconos de Iconify como SVG en el build](03-decisiones/007-iconos.md)
- [008 · Hero: agujero negro real dibujado con puntos de terminal](03-decisiones/008-agujero-negro-puntos.md)

### 04 · Diseño — cómo se ve
- [Tokens](04-diseno/tokens.md): colores, vidrio, tipografía, movimiento.
- [Guía visual](04-diseno/guia.html): mockup interactivo congelado (abrir en el navegador).

### 05 · Flujo git — cómo se trabaja
- [Ramas](05-flujo-git/ramas.md): modelo, nombres, PRs y releases.
- [Commits](05-flujo-git/commits.md): convención y ejemplos.

### 06 · Bitácora — qué pasó y cuándo
- [2026-10-09](06-bitacora/2026-10-09.md): Dockerfile y contexto de build para Coolify.
- [2026-10-08](06-bitacora/2026-10-08.md): laboratorio de animaciones, agujero negro del hero y release v0.3.0.
- [2026-10-07](06-bitacora/2026-10-07.md): release v0.2.0 Contenido y secciones de v0.3.0.
- [2026-10-06](06-bitacora/2026-10-06.md): scaffold Astro, estilos base, lint/tests/CI y README.
- [2026-10-05](06-bitacora/2026-10-05.md): definición del proyecto, guía de diseño y setup del repo.

## Convenciones de la bóveda

- Links **markdown relativos** (`[texto](../carpeta/nota.md)`), no `[[wikilinks]]`: así funcionan en GitHub, en Obsidian y para agentes. En Obsidian, desactivar *Settings → Files and links → Use [[Wikilinks]]*.
- Carpetas numeradas para fijar el orden de lectura.
- Cada nota abre con frontmatter (`tags`, `actualizado`).
- Las decisiones nunca se borran: si cambian, se marca la anterior como *Reemplazada* y se crea una nueva.
- Una nota de bitácora por sesión de trabajo.
