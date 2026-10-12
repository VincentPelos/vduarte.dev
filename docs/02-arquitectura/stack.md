---
tags: [arquitectura, stack]
actualizado: 2026-10-12
---

# Stack

Las filas marcadas **(planeado)** aún no están instaladas: se agregan en el hito indicado.

| Capa | Herramienta | Para qué | Por qué |
|---|---|---|---|
| Framework | **Astro** | Genera el sitio (HTML estático + islas de JS) | Ideal para contenido, cero JS por defecto, content collections con validación. [Decisión 001](../03-decisiones/001-astro-sin-framework-ui.md) |
| Lenguaje | **TypeScript** (strict) | Tipos en scripts y schemas | Errores en build, no en producción |
| Paquetes | **pnpm** (vía corepack) | Instalar dependencias | Rápido y estricto; sin instalación global |
| Estilos | **Tailwind CSS v4** | Utilidades + tokens con `@theme` | Funciona igual en `.astro` y `.ts`; sin CSS suelto por componente |
| Contenido | **JSON + zod** (content collections) | Datos del sitio | Editar un archivo para agregar contenido; schema falla en build si falta algo. [Decisión 002](../03-decisiones/002-json-por-seccion.md) |
| Animación | **Web Animations API** (nativa) | Reveals al hacer scroll (`layout/Reveal.astro`) | Sin dependencias. [Decisión 004](../03-decisiones/004-animaciones-vanilla.md) |
| Animación | **Motion** (API vanilla) **(planeado, solo si hace falta)** | Secuencias y progreso de scroll | Misma librería que "Framer Motion", sin React. Hasta ahora bastó la API nativa |
| Scroll | **Lenis** 1.3 | Smooth scroll de la rueda (`layout/SmoothScroll.astro`) | ~5 kB gzip; touch y teclado nativos; no se monta con reduced-motion |
| Gráficos | **WebGL** con **twgl.js** 7 y canvas 2D | Agujero negro del hero ([008](../03-decisiones/008-agujero-negro-puntos.md)), cielo de estrellas ([009](../03-decisiones/009-cinematica-constelaciones.md)) y dibujos del bento | twgl quita la fontanería de WebGL (programas, uniforms, framebuffers) sin tocar los shaders; ~12 KB gzip frente a ~530 KB de three.js. [Decisión 022](../03-decisiones/022-twgl-escenas.md) |
| Gráficos | Barras en **HTML y CSS** | Cifras del caso Colchagua (`components/case/BarChart.astro`) | Sin JS ni dependencias; reemplaza a Chart.js ([decisión 017](../03-decisiones/017-graficos-html.md)) |
| Íconos | **@iconify/utils** + `@iconify-json/simple-icons` | Logos de tecnologías | SVG incrustado en build, nada externo ([007](../03-decisiones/007-iconos.md)) |
| Imágenes | **sharp** (vía `astro:assets`) | Optimizar las imágenes del contenido a WebP en varios anchos | Lo usa `<Image>` de Astro; [decisión 016](../03-decisiones/016-sharp-imagenes.md) |
| Fuentes | **Fontsource** | Martian Mono, Geist, Geist Mono | Self-hosted vía npm, sin archivos sueltos |
| SEO | **@astrojs/sitemap** **(planeado, v0.6.0)** | Sitemap | Oficial |
| CV | **LaTeX** + **Tectonic** 0.17 (fuera de npm) | Compilar `cv/cv.tex` a `public/cv.pdf` con `pnpm cv` | Una columna, texto extraíble, compatible con ATS; un solo binario. [Decisión 019](../03-decisiones/019-cv-latex.md) |
| Calidad | **ESLint**, **Prettier**, **Vitest**, `astro check` | Lint, formato, tests, tipos | Suben la nota en A4 |
| Commits | **commitlint** + **husky** | Validar mensajes | Historia limpia y trazable |
| CI | **GitHub Actions** + **Lighthouse CI** | Verificar cada PR; Lighthouse, a mano antes de cada versión menor | Pipeline reproducible |
| Despliegue | **Coolify** (VPS propio) **(en preparación)** | Build y publicación | Deploy por push y previews por PR. [Decisión 003](../03-decisiones/003-despliegue-coolify.md) |

## Lo que no usamos

- **React / Vue / Svelte:** no hay estado complejo que lo justifique. Si aparece, Astro permite agregar una isla sin migrar nada.
- **Formulario (n8n) y analytics (Umami):** estaban planeados para v0.6.0 y se descartaron el 2026-10-11; el contacto es un `mailto:`.
- **CMS:** los JSON en el repo cumplen el mismo rol con trazabilidad gratis.
