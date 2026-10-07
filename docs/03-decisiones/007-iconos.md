---
tags: [decision, ui]
estado: Aceptada
fecha: 2026-10-07
---

# 007 · Íconos de Iconify como SVG en el build

## Contexto
`skills.json` guarda cada ícono como nombre de Iconify (`"simple-icons:python"`). Los íconos tienen que verse sin JS, sin peticiones a servicios externos y sin sumar peso al navegador ([decisión 001](001-astro-sin-framework-ui.md)).

## Decisión
- **`@iconify-json/simple-icons`**: el set de logos de marcas, como JSON local.
- **`@iconify/utils`**: convierte el ícono a SVG durante el build.
- `src/lib/icons.ts` (`renderIcon()`, con tests) y `components/ui/Icon.astro` los envuelven. Los SVG salen en línea, con `fill="currentColor"` y `aria-hidden`.
- Un nombre inválido rompe el build indicando el nombre exacto.

## Alternativas consideradas
- **astro-icon** (el que preveía [stack](../02-arquitectura/stack.md)): hace lo mismo, pero como integración con más configuración y dependencias de las necesarias.
- **API de Iconify o `<iconify-icon>`:** piden los íconos en el navegador; agregan JS y una dependencia de red.
- **SVG copiados a mano:** sin dependencia, pero hay que mantenerlos y validarlos a mano.

## Consecuencias
- Cero JS de íconos en el navegador.
- Para usar otro set (p. ej. Lucide) hay que instalar su `@iconify-json/<set>` y registrarlo en `src/lib/icons.ts`.
