---
tags: [arquitectura, estructura]
actualizado: 2026-10-12
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
│  │  ├─ layout/               piezas globales: Nav, Footer, Seo, IconSprite, StarSky + star-sky.ts + sky-matter.ts (gas y asteroides), Reveal, Trace (entrada de las líneas de tiempo), SmoothScroll, OffscreenPause
│  │  ├─ sections/             una carpeta por sección del home
│  │  │  ├─ hero/              Hero.astro + black-hole.ts (orquesta las pasadas con twgl) + shaders/ (GLSL) + hero-fall.ts (caída al portafolio)
│  │  │  ├─ about/             About.astro (solo la grilla) + cards/ (BentoCard es el marco; cada tarjeta lee su contenido) + bento-art.ts (dibujos de las áreas) + bento-assemble.ts (armado al terminar la caída)
│  │  │  ├─ experience/
│  │  │  ├─ projects/          Projects.astro (lista) + ProjectDetail (detalle) + ProjectPipeline (etapas) + projects.ts (elegir y animar) + ProjectLinks (sus enlaces) + ProjectGallery (visor)
│  │  │  ├─ education/
│  │  │  └─ contact/
│  │  ├─ case/                 piezas de los casos de estudio: CaseDashboard, CaseBlock, BarChart
│  │  ├─ ai-usage/             piezas de /uso-de-ia: MemoryGraph + memory-graph.ts (grafo de docs/, decisión 025)
│  │  └─ ui/                   piezas reutilizables: Link (todo enlace), PillLink, Button, ProfileButtons (GitHub/LinkedIn/CV), GlassCard, Chip, MarkList, Section, SectionHeader, FileHeading (`$ cat …`), Period, YearBlock (columna de años), Glows, Icon, LinkHint
│  ├─ content/                 datos del sitio (JSON), casos de estudio (cases.json) y uso de IA (ai-usage.json)
│  ├─ layouts/                 BaseLayout.astro (todas las páginas), PageLayout.astro (páginas internas: caso y uso de IA)
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
| Una consulta a las colecciones que usan 2+ componentes (`getSite()`, `getSkillIcons()`, `getIconNames()`) | `src/lib/content.ts` |
| Un enlace | `ui/Link.astro` (pone `target`/`rel` con `linkAttrs()` y avisa la pestaña nueva), nunca un `<a>` externo a mano |
| Una página fuera del home | `layouts/PageLayout.astro` (volver, título, bajada y frase) |
| Texto de `site.json` que usa un solo componente | Lo lee el componente con `getSite()`; no se pasa por props desde el padre |
| Algo que comparten las escenas animadas (celda, DPR, paleta, carga diferida, bucle de cuadros) | `src/lib/scene.ts` |
| Un shader | `.vert`/`.frag` (o `.glsl` si se comparte) en `shaders/` junto a su escena, importado con `?raw` |
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
- Comentarios en plantillas `.astro`: `{/* … */}`, no `<!-- … -->`, que llega al HTML publicado (#158).
