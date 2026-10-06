---
tags: [decision]
estado: Aceptada
fecha: 2026-10-05
---

# 001 · Astro sin framework de UI

## Contexto
La rúbrica exige un framework frontend moderno. El sitio es mayormente contenido (una página + casos de estudio) con animaciones y una escena 3D. El autor prioriza KISS y encuentra poco legible el JSX de React.

## Decisión
Usar **Astro** con componentes `.astro` y **sin React, Vue ni Svelte**. La interactividad (animaciones, partículas, formulario, gráficos) se resuelve con scripts TypeScript y librerías vanilla.

## Alternativas consideradas
- **React + Vite / Next.js:** más demandados, pero envían JS innecesario a un sitio de contenido y el JSX no le acomoda al autor.
- **Astro + islas de React o Vue:** se evaluó; no hay estado complejo que lo justifique.
- **HTML plano:** descartado por la rúbrica.

## Consecuencias
- HTML estático, carga rápida y buen Lighthouse.
- Componentes con sintaxis cercana a HTML, fáciles de explicar en la defensa.
- Si aparece una necesidad de estado complejo, se agrega una isla sin migrar nada.
