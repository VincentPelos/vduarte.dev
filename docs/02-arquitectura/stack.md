---
tags: [arquitectura, stack]
actualizado: 2026-10-07
---

# Stack

| Capa | Herramienta | Para qué | Por qué |
|---|---|---|---|
| Framework | **Astro** | Genera el sitio (HTML estático + islas de JS) | Ideal para contenido, cero JS por defecto, content collections con validación. [Decisión 001](../03-decisiones/001-astro-sin-framework-ui.md) |
| Lenguaje | **TypeScript** (strict) | Tipos en scripts y schemas | Errores en build, no en producción |
| Paquetes | **pnpm** (vía corepack) | Instalar dependencias | Rápido y estricto; sin instalación global |
| Estilos | **Tailwind CSS v4** | Utilidades + tokens con `@theme` | Funciona igual en `.astro` y `.ts`; sin CSS suelto por componente |
| Contenido | **JSON + zod** (content collections) | Datos del sitio | Editar un archivo para agregar contenido; schema falla en build si falta algo. [Decisión 002](../03-decisiones/002-json-por-seccion.md) |
| Animación | **Motion** (API vanilla) + Web Animations API | Entradas, stagger, progreso de scroll | Misma librería que "Framer Motion", sin React. [Decisión 004](../03-decisiones/004-animaciones-vanilla.md) |
| Scroll | **Lenis** | Smooth scroll | ~3 kB; se apaga con reduced-motion |
| 3D | **three.js** (vanilla) | Malla de partículas del hero | Un solo canvas; no justifica React Three Fiber |
| Gráficos | **Chart.js** | Dashboard web del caso Colchagua | Vanilla, conocido, fácil de tematizar. [Decisión 006](../03-decisiones/006-power-bi-descarga.md) |
| Íconos | **@iconify/utils** + `@iconify-json/simple-icons` | Logos de tecnologías | SVG incrustado en build, nada externo ([007](../03-decisiones/007-iconos.md)) |
| Fuentes | **Fontsource** | Martian Mono, Geist, Geist Mono | Self-hosted vía npm, sin archivos sueltos |
| SEO | **@astrojs/sitemap** | Sitemap | Oficial |
| Calidad | **ESLint**, **Prettier**, **Vitest**, `astro check` | Lint, formato, tests, tipos | Suben la nota en A4 |
| Commits | **commitlint** + **husky** | Validar mensajes | Historia limpia y trazable |
| CI | **GitHub Actions** + **Lighthouse CI** | Verificar cada PR | Pipeline reproducible |
| Despliegue | **Coolify** (VPS propio) | Build y publicación | Deploy por push y previews por PR. [Decisión 003](../03-decisiones/003-despliegue-coolify.md) |
| Formulario | **n8n** (webhook) | Recibir mensajes de contacto | Automatización propia, sin servicios de terceros |
| Analytics | **Umami** | Visitas | Self-hosted, sin cookies |

## Lo que no usamos

- **React / Vue / Svelte:** no hay estado complejo que lo justifique. Si aparece, Astro permite agregar una isla sin migrar nada.
- **CMS:** los JSON en el repo cumplen el mismo rol con trazabilidad gratis.
