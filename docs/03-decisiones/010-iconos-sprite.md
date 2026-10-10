---
tags: [decision, ui, rendimiento]
estado: Aceptada
fecha: 2026-10-09
---

# 010 · Íconos en un sprite SVG

Reemplaza en parte a la [decisión 007](007-iconos.md): se mantiene Iconify en el build y cambia cómo salen los SVG.

## Contexto
Con la 007, cada `<Icon>` incrustaba el SVG completo. Los íconos del stack aparecen en el bento y en Skills, así que se repetían: 29 SVG en el HTML, 6 duplicados (13,5 KB sin comprimir).

## Decisión
- `components/layout/IconSprite.astro` dibuja una sola vez, como `<symbol>`, cada ícono que usa el sitio, al inicio de `<body>`.
- `components/ui/Icon.astro` solo referencia el símbolo con `<svg><use href="#icon-…"/></svg>`, con su tamaño a 1em de alto.
- La lista sale de `skills.json` (`getIconNames()` en `src/lib/content.ts`). Si un `<Icon>` pide uno que no está, el build falla y lo dice.
- `src/lib/icons.ts` expone `iconSymbol()` (con tests) en vez de `renderIcon()`.

## Alternativas consideradas
- **Seguir en línea:** más simple, pero el peso crece con cada ícono repetido.
- **Sprite como archivo aparte en `public/`:** una petición más y no se puede validar en el build con el mismo código.

## Consecuencias
- HTML de 105 KB a 94 KB (de 30,9 a 24,8 KB con gzip), junto con las fuentes de [rendimiento](../02-arquitectura/rendimiento.md).
- Un ícono nuevo que no venga de `skills.json` requiere sumarlo a `getIconNames()`.
