---
tags: [arquitectura, contenido]
actualizado: 2026-10-13
---

# Contenido

Todo lo que se lee en el sitio vive en `src/content/`. Los schemas zod están en `src/lib/schemas.ts` (con tests al lado) y `src/content.config.ts` los conecta a cada JSON: **si un JSON tiene un error, el build falla y dice qué campo falla y por qué**.

## Archivos

| Archivo | Forma | Qué alimenta |
|---|---|---|
| `site.json` | Objeto (`{ "main": { … } }`) | Hero, bento, contacto, SEO, nav y footer |
| `experience.json` | Lista | Sección Experiencia |
| `projects.json` | Lista | Sección Proyectos y rutas `/proyectos/[slug]` |
| `skills.json` | Lista de grupos | Catálogo de íconos por nombre: stack del bento y skills de los proyectos |
| `education.json` | Lista | Sección Educación |
| `cases.json` | Lista | Páginas de los casos de estudio (`/proyectos/<id>`) |

Cada ítem de una lista lleva un `id` único en `kebab-case`.

## Campos

**site.json** — `name`, `role`, `tagline`, `bioTitle`, `bio` (la frase corta del bento), `available`, `availabilityNote`, `location`, `timezone`, `email`, `github`, `linkedin?`, `cvPath?`, `share { image, alt }` (imagen para compartir el enlace, Open Graph, #185), `highlightStack[]` (el stack del bento, en una línea; 9 desde #185), `nav[] { section, label, ariaLabel? }` (`section` es el `id` de la sección del home, sin `#`), `footerNote`, `footerLinks[] { label, href }` (enlaces del pie a otras rutas, como `/uso-de-ia`), `scrollCue { label, ariaLabel }` (flecha del hero, #131), `prompt { user, command }`, `labels { email, github, linkedin, cv, pending, newTab }` (textos de los botones de contacto; `newTab` es el aviso para lectores de pantalla en los enlaces que abren otra pestaña), `bento { about, status, available, unavailable, stack, links, areas[4] { art, title, proof, cta, href } }` (etiquetas de las tarjetas y las cuatro áreas: `art` es el dibujo, `dev`, `datos`, `infra` o `agentes`; `href` lleva a la prueba), `constellations { experience, projects, education, contact }` (símbolo de 1 a 3 caracteres que forman las estrellas en cada sección; ver [decisión 009](../03-decisiones/009-cinematica-constelaciones.md)), `sections { current, experience { title, unit, since, highlights { show, hide } }, education { title, degree, cert, training, folio }, projects { title, unit, featured, repo, demo, caseStudy, skills { list, steps, pick, usedIn }, gallery }, contact { kicker, title, copy, copied } }` (títulos y textos de las secciones; `unit`, `degree`, `cert` y `training` llevan `{ one, other }` para singular y plural). Los enlaces opcionales permanecen visibles como controles deshabilitados hasta que tengan una URL real.

**experience.json** — `id`, `company`, `role`, `start` (`"2023-03"`, `"2023"` o `null`), `end` (`null` si no se conoce o sigue vigente), `dateNote?` (texto visible cuando falta una fecha), `ongoing?` (indica explícitamente si sigue vigente), `location?`, `description`, `summary?` (una línea de qué se hace, visible sin desplegar los logros; si falta se muestra `description`), `highlights[]?`, `stack[]?`, `url?`. Se ordena por fecha automáticamente; un periodo vigente va primero y uno completado sin fechas va al final.

**projects.json** — `id`, `title`, `description`, `steps[]` (etapas del proyecto, en orden), `skills[] { name, icon?, uses[] { step, text?, href? } }`, `skill?` (la skill elegida al abrir el proyecto; tiene que estar en `skills`, si falta va la primera, #180), `image?`, `repo?`, `demo?`, `demoLabel?` (texto del enlace a `demo`; si falta, `sections.projects.demo` de site.json), `year`, `featured?`, `caseStudy?`, `gallery[] { image, alt }` (con 2 o más imágenes, la portada abre un visor; las imágenes van en `src/assets/projects/<id>/`). Cada `uses` dice en qué etapa se usó la skill: `step` tiene que estar en `steps` (el build falla si no), `text` es lo que se hizo (sin `text`, la etapa solo se enciende) y `href` un enlace a la prueba, como un notebook. `icon` hace falta solo si la skill no está en `skills.json`. Los destacados van primero y, entre ellos, los que tienen `caseStudy`; el primero viene abierto ([decisión 023](../03-decisiones/023-skills-en-proyectos.md)). Si tiene `caseStudy`, genera `/proyectos/<caseStudy>`.

**cases.json** — `id` (el `caseStudy` del proyecto: genera `/proyectos/<id>`), `title`, `subtitle`, `context` (curso y fecha), `question`, `stats[] { value, label }` (1 a 4 cifras), `dashboard { title, take }`, `gallery[] { image, alt, caption }` (capturas del Power BI en `src/assets/cases/<id>/`), `blocks[] { id, file, title, take, panels[] { title, source, chart } }` (1 o 2 gráficos por hallazgo; `chart` es `bars { min?, max, items[] { label, value, display } }` o `pairs { max, legend[2], items[] { label, before, after, display } }`, ver [decisión 017](../03-decisiones/017-graficos-html.md)), `conclusions { title, answer, actions[] }`, `limitations { title, items[] { title, body } }` (al menos uno: la rúbrica pide decir que correlación no es causalidad), `process { title, text }` (el proceso en una línea), `resources { repo, dashboard, report, notebooks[] { title, href } }` y `labels { back, download, report, repo, notebooks }`. Las cifras de Colchagua salen del Datamart y de `documentacion/hallazgos_cereza.md` del repo [colchagua-etl](https://github.com/VincentPelos/colchagua-etl). Se leen con `getCase(id)` o desde `getStaticPaths`.

**ai-usage.json** — una entrada `main` que genera `/uso-de-ia` (rúbrica: admisibilidad 6): `title`, `subtitle`, `intro`, `tools[] { name, maker, use }`, `memory { file, title, text, kinds, notes, links, hint, repo }` (textos del grafo de `docs/`, [decisión 025](../03-decisiones/025-grafo-memoria.md)), `projects[] { id, file, title, decidedBy, rows[] { task, ai, author } }` (qué hizo la IA y qué decidió una persona en cada tarea), `checks { title, items[] }`, `links[] { label, href }` y `labels { back, ai, links }`. Sale de las bitácoras y de `documentacion/uso_de_ia.md` de colchagua-etl; se lee con `getAiUsage()`. Al usar una herramienta nueva o en una tarea nueva, se agrega aquí.

**skills.json** — `id`, `group`, `items[] { name, icon? }`. `icon` es un nombre de Iconify (`"simple-icons:python"`). Ya no tiene sección propia (#162): es el catálogo de íconos por nombre que usan la tarjeta Stack del bento (`highlightStack`) y las skills de los proyectos. El sprite junta los íconos de aquí y los `icon` de `projects.json` (`getSkillIcons()` en `lib/content.ts`).

**education.json** — `id`, `institution`, `title`, `start`, `end`, `dateNote?`, `ongoing?`, `type` (`"degree"` | `"cert"` | `"training"`), `folio?`, `url?`. `training` se muestra como capacitación y no como certificación profesional.

**Reglas comunes:** fechas conocidas en formato `AAAA-MM-DD`, `AAAA-MM` o solo `AAAA` según la precisión disponible; si falta toda la fecha, se usa `null` con `dateNote` y se evita inventarla. `end` no puede ser anterior a `start`; URLs completas con `https://`; `cvPath` es una ruta de `public/` que empieza con `/`; `timezone` es una zona IANA (`"America/Santiago"`); `featured` es `false` si se omite.

## Cómo agregar algo

1. Crear un issue (`tipo: feat`, `área: contenido`).
2. Rama `feat/<issue>-<slug>`.
3. Agregar el objeto al JSON correspondiente (copiar uno existente como base).
4. Si tiene imagen: ponerla en `src/assets/projects/` y referenciarla con ruta relativa.
5. `pnpm build`: si algo falta, el error lo dice.
6. Commit `feat(contenido): agrega proyecto <nombre>` y PR a `develop`.
