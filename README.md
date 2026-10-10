# vduarte.dev

Portafolio profesional de **Vicente Contreras Duarte**, desarrollador de software con experiencia en soporte e infraestructura TI. Presenta proyectos web, automatización y herramientas internas. Es también la entrega final de **ISI802 Business Intelligence (AIEP)**, que pide publicar el caso de estudio de Colchagua.

[![CI](https://github.com/VincentPelos/vduarte.dev/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/VincentPelos/vduarte.dev/actions/workflows/ci.yml)

- **Producción:** desplegado con Coolify; por ahora en https://preview.vduarte.dev (acceso restringido)
- **Documentación completa:** [`docs/00-index.md`](docs/00-index.md)

## Stack

| Capa       | Herramienta                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Framework  | [Astro](https://astro.build) con TypeScript strict, sin framework de UI ([por qué](docs/03-decisiones/001-astro-sin-framework-ui.md)) |
| Estilos    | Tailwind CSS v4 con tokens propios en `src/styles/global.css`                                                                         |
| Contenido  | Un JSON por sección validado con zod ([por qué](docs/03-decisiones/002-json-por-seccion.md))                                          |
| Animación  | WebGL directo (agujero negro del hero) y canvas 2D (cielo de estrellas); Motion y Lenis llegan en v0.4.0                              |
| Calidad    | ESLint, Prettier, Vitest, `astro check`, commitlint + husky                                                                           |
| CI         | GitHub Actions + Lighthouse CI                                                                                                        |
| Despliegue | Coolify en VPS propio ([por qué](docs/03-decisiones/003-despliegue-coolify.md))                                                       |

Detalle en [`docs/02-arquitectura/stack.md`](docs/02-arquitectura/stack.md).

## Correr el proyecto

Requisitos: **Node 22.12+** (recomendado 24, ver `.nvmrc`) y **pnpm** (se activa con corepack, sin instalación global).

```bash
git clone https://github.com/VincentPelos/vduarte.dev.git
cd vduarte.dev
corepack enable          # activa la versión de pnpm fijada en package.json
pnpm install             # instala dependencias y el hook de commits
pnpm dev                 # http://localhost:4321
```

### Scripts

| Comando                             | Qué hace                                       |
| ----------------------------------- | ---------------------------------------------- |
| `pnpm dev`                          | Servidor de desarrollo con recarga en caliente |
| `pnpm build`                        | Genera el sitio estático en `dist/`            |
| `pnpm preview`                      | Sirve `dist/` como en producción               |
| `pnpm lint`                         | ESLint sobre `.ts` y `.astro`                  |
| `pnpm format` / `pnpm format:check` | Aplica / verifica el formato con Prettier      |
| `pnpm check`                        | Verifica tipos con `astro check`               |
| `pnpm test` / `pnpm test:watch`     | Tests con Vitest                               |

## Estructura

```
src/
├─ components/   layout/ (global) · sections/<seccion>/ (home) · case/ · ui/ (reutilizables)
├─ content/      datos del sitio en JSON
├─ layouts/      BaseLayout.astro
├─ lib/          lógica compartida + tests (*.test.ts al lado)
├─ pages/        rutas
└─ styles/       global.css (tokens de diseño)
```

Cada archivo tiene un solo lugar obvio: ver [`docs/02-arquitectura/estructura.md`](docs/02-arquitectura/estructura.md).

## Agregar contenido

Todo el texto del sitio vive en `src/content/*.json`. Agregar un proyecto, trabajo o skill es agregar un objeto al JSON correspondiente; si falta un campo, `pnpm build` falla y dice cuál. Paso a paso en [`docs/02-arquitectura/contenido.md`](docs/02-arquitectura/contenido.md).

## Flujo de trabajo

```
issue → rama <tipo>/<n>-<slug> → commits convencionales → PR a develop → CI + Lighthouse → merge commit
develop → PR "release: vX.Y.Z" a main → tag + GitHub Release → despliegue a producción
```

- Commits: `tipo(alcance): descripción en español`, validados por commitlint ([convención](docs/05-flujo-git/commits.md)).
- Ramas, PRs y releases: [`docs/05-flujo-git/ramas.md`](docs/05-flujo-git/ramas.md).
- Cambios por versión: [`CHANGELOG.md`](CHANGELOG.md).

## Despliegue

```
PR a develop ──► GitHub Actions: lint · formato · tipos · tests · build · Lighthouse (puntajes en el resumen del run)
             └─► Coolify: preview del PR en una URL temporal
push a main ───► Coolify: Dockerfile (pnpm build → Nginx en puerto 80) → https://vduarte.dev
```

En Coolify, usar el método **Dockerfile** desde el repositorio Git y exponer el puerto interno **80**. Variables de entorno (todas opcionales y disponibles durante el build): `PUBLIC_CONTACT_WEBHOOK`, `PUBLIC_UMAMI_WEBSITE_ID`, `PUBLIC_UMAMI_SRC`. Detalle y estado en [`docs/02-arquitectura/despliegue.md`](docs/02-arquitectura/despliegue.md).

## Uso de IA

Este proyecto se desarrolla con apoyo de **Claude Code** (Anthropic) y **Codex** (OpenAI) para proponer opciones, escribir código, ordenar contenido, redactar documentación y automatizar tareas en GitHub. **Todas las decisiones de producto, diseño, stack y flujo son del autor**, que revisa los cambios antes de integrarlos. Cada sesión queda registrada en la [bitácora](docs/06-bitacora/) con qué se hizo, qué decidió el autor y cómo se verificó. La declaración completa estará en la página `/uso-de-ia`.
