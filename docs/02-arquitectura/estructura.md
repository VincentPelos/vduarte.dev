---
tags: [arquitectura, estructura]
actualizado: 2026-10-11
---

# Estructura de carpetas

Regla de oro: **cada archivo tiene un solo lugar obvio**. Si dudas dónde va algo, esta nota lo decide; si no lo cubre, se actualiza esta nota en el mismo PR.

## Árbol

```
vduarte.dev/
├─ .github/
│  ├─ ISSUE_TEMPLATE/          plantillas de issue (feature, bug)
│  ├─ pull_request_template.md
│  ├─ workflows/               ci.yml, lighthouse.yml
│  └─ lighthouserc.json        umbrales de Lighthouse CI
├─ .claude/skills/             skills de proyecto para agentes (prototipo-artifact)
├─ .husky/                     hooks de git (commit-msg)
├─ cv/                         cv.tex: fuente LaTeX del CV (`pnpm cv` → public/cv.pdf)
├─ docs/                       esta bóveda
├─ .dockerignore                exclusiones del contexto de build de Docker
├─ Dockerfile                   build de Astro y servidor Nginx para Coolify
├─ public/                     archivos servidos tal cual: cv.pdf, favicon.svg, og.png
├─ src/
│  ├─ assets/                  imágenes optimizadas por Astro
│  │  ├─ projects/
│  │  └─ cases/colchagua/     capturas del Power BI del caso (galería de cases.json)
│  ├─ components/
│  │  ├─ layout/               piezas globales: Nav, Footer, Seo, IconSprite, StarSky + star-sky.ts, Reveal, SmoothScroll, OffscreenPause
│  │  ├─ sections/             una carpeta por sección del home
│  │  │  ├─ hero/              Hero.astro + black-hole.ts + hero-fall.ts (caída al portafolio)
│  │  │  ├─ about/             About.astro + BentoCard (marco de cada tarjeta) + cards/
│  │  │  ├─ experience/
│  │  │  ├─ projects/          Projects.astro + ProjectCard (destacados) + ProjectRow (lista) + ProjectGallery (visor)
│  │  │  ├─ skills/
│  │  │  ├─ education/
│  │  │  └─ contact/
│  │  ├─ case/                 piezas de los casos de estudio: CaseHeading, CaseDashboard, CaseBlock, BarChart
│  │  └─ ui/                   piezas reutilizables sin contexto: GlassCard, Button, Chip, SectionHeader, Icon, TechIcon, LinkHint
│  ├─ content/                 datos del sitio (JSON), casos de estudio (cases.json) y uso de IA (ai-usage.json)
│  ├─ layouts/                 BaseLayout.astro, CaseLayout.astro
│  ├─ lib/                     lógica compartida en TS + sus tests (*.test.ts al lado)
│  ├─ pages/                   rutas: index.astro, proyectos/[slug].astro, uso-de-ia.astro
│  ├─ styles/                  global.css (tokens + @theme)
│  └─ content.config.ts        schemas zod de todo el contenido
├─ AGENTS.md                   reglas para agentes de IA
├─ CLAUDE.md                   importa AGENTS.md
├─ README.md
├─ CHANGELOG.md
└─ package.json                dependencias, scripts y config de Prettier y commitlint
```

En la raíz solo quedan las configs que las herramientas exigen ahí (Astro, TypeScript, ESLint, Vitest, pnpm). Prettier y commitlint viven en `package.json`. En VS Code, `.vscode/settings.json` las agrupa bajo `package.json` con *file nesting*.

## Dónde va cada cosa

| Si es… | Va en… |
|---|---|
| Texto, links o datos que se muestran | `src/content/*.json` — nunca en un componente |
| Algo que aparece en todas las páginas | `components/layout/` |
| Una sección del home | `components/sections/<seccion>/` |
| Un script que solo usa una sección | Al lado de su componente (`sections/hero/black-hole.ts`) |
| Un componente que se usa en 2+ lugares | `components/ui/` |
| Lógica usada por 2+ archivos | `src/lib/` |
| Una consulta a las colecciones que usan 2+ componentes (`getSite()`, `getIconNames()`) | `src/lib/content.ts` |
| `target`/`rel` de un enlace | `linkAttrs()` de `src/lib/links.ts`, nunca a mano |
| Algo que comparten las escenas animadas (celda, DPR, paleta, carga diferida) | `src/lib/scene.ts` |
| Estado que comparten dos scripts en cada cuadro (agujero, caída, Lenis) | `src/lib/hole.ts`, `src/lib/fall.ts`, `src/lib/smooth.ts` |
| Una imagen que Astro debe optimizar | `src/assets/` |
| Un archivo que se descarga o sirve tal cual | `public/` |
| El CV | Fuente en `cv/cv.tex`; el PDF generado con `pnpm cv` va a `public/cv.pdf` y se commitea ([decisión 019](../03-decisiones/019-cv-latex.md)) |
| Un test | Al lado del archivo que prueba: `lib/dates.ts` → `lib/dates.test.ts` |
| Un proceso que repiten los agentes | `.claude/skills/<nombre>/SKILL.md` |

## Convenciones de nombres

- **Código en inglés; contenido, docs y commits en español.**
- Componentes `.astro`: `PascalCase` (`GlassCard.astro`).
- Carpetas, scripts `.ts`, JSON y notas: `kebab-case` (`smooth-scroll.ts`, `experience.json`).
- Rutas públicas en español: `/proyectos/colchagua`, `/uso-de-ia`.
- Notas de decisión: `NNN-titulo.md`; bitácora: `AAAA-MM-DD.md`.
