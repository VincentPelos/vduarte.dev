---
tags: [decision, contenido]
estado: Aceptada
fecha: 2026-10-05
---

# 002 · Contenido en un JSON por sección

## Contexto
Agregar contenido (un proyecto, un trabajo, una skill) debe ser trivial y no requerir tocar componentes. La rúbrica valora la separación de datos y UI (A1).

## Decisión
Un archivo JSON por sección en `src/content/` (`site`, `experience`, `projects`, `skills`, `education`), cargado con *content collections* de Astro y validado con **zod**.

## Alternativas consideradas
- **Un JSON por ítem en carpetas:** más archivos y más difícil de ver de un vistazo.
- **CMS headless:** agrega un servicio y pierde la trazabilidad en git.
- **Markdown/MDX para todo:** innecesario para datos estructurados (se reserva para narrativa, como un caso de estudio).

## Consecuencias
- Agregar algo = agregar un objeto a un array.
- El build falla con un mensaje claro si falta un campo.
- Cada cambio de contenido queda en el historial de git.
