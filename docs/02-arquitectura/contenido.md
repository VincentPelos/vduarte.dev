---
tags: [arquitectura, contenido]
actualizado: 2026-10-10
---

# Contenido

Todo lo que se lee en el sitio vive en `src/content/`. Los schemas zod están en `src/lib/schemas.ts` (con tests al lado) y `src/content.config.ts` los conecta a cada JSON: **si un JSON tiene un error, el build falla y dice qué campo falla y por qué**.

## Archivos

| Archivo | Forma | Qué alimenta |
|---|---|---|
| `site.json` | Objeto (`{ "main": { … } }`) | Hero, bento, contacto, SEO, nav y footer |
| `experience.json` | Lista | Sección Experiencia |
| `projects.json` | Lista | Sección Proyectos y rutas `/proyectos/[slug]` |
| `skills.json` | Lista de grupos | Sección Skills |
| `education.json` | Lista | Sección Educación |
| `cases.json` | Lista | Páginas de los casos de estudio (`/proyectos/<id>`) |

Cada ítem de una lista lleva un `id` único en `kebab-case`.

## Campos

**site.json** — `name`, `role`, `tagline`, `bioTitle`, `bio`, `available`, `availabilityNote`, `location`, `timezone`, `email`, `github`, `linkedin?`, `cvPath?`, `highlightStack[]`, `nowPlaying { song, artist, album? }`, `nowGaming { title, hours?, note?, gacha? { game, pity, pityMax? } }` (`pityMax` es 90 si se omite), `nav[] { section, label, ariaLabel? }` (`section` es el `id` de la sección del home, sin `#`), `footerNote`, `prompt { user, command }`, `labels { email, github, linkedin, cv, pending, newTab }` (textos de los botones de contacto; `newTab` es el aviso para lectores de pantalla en los enlaces que abren otra pestaña), `bento { about, clock, status, available, unavailable, stack, playing, gaming, links, constellation }` (etiquetas de las tarjetas; `constellation` titula la ventana de la constelación), `constellations { about, experience, projects, skills, education, contact }` (símbolo de 1 a 3 caracteres que forman las estrellas en cada sección; ver [decisión 009](../03-decisiones/009-cinematica-constelaciones.md)), `sections { current, experience { title, unit, since }, education { title, degree, cert, training, folio }, projects { title, unit, featured, repo, demo, caseStudy }, skills { title, groups, items }, contact { kicker, title, copy, copied } }` (títulos y textos de las secciones; `unit`, `degree`, `cert` y `training` llevan `{ one, other }` para singular y plural). Los enlaces opcionales permanecen visibles como controles deshabilitados hasta que tengan una URL real.

**experience.json** — `id`, `company`, `role`, `start` (`"2023-03"`, `"2023"` o `null`), `end` (`null` si no se conoce o sigue vigente), `dateNote?` (texto visible cuando falta una fecha), `ongoing?` (indica explícitamente si sigue vigente), `location?`, `description`, `highlights[]?`, `stack[]?`, `url?`. Se ordena por fecha automáticamente; un periodo vigente va primero y uno completado sin fechas va al final.

**projects.json** — `id`, `title`, `description`, `tags[]`, `image?`, `repo?`, `demo?`, `year`, `featured?`, `caseStudy?`. Si `featured` es `true`, ocupa doble ancho en el bento. Si tiene `caseStudy`, genera `/proyectos/<caseStudy>`.

**cases.json** — `id` (el `caseStudy` del proyecto), `title`, `subtitle`, `context` (curso y fecha), `question`, `summary`, `stats[] { value, label }` (1 a 4 cifras destacadas), `problem[]` (párrafos), `data { territory, period, sources[] { name, what, url } }`, `approach[] { title, body }`, `findings[] { id, title, body, figure? { value, label } }`, `conclusions { answer, actions[] }`, `limitations[] { title, body }` (al menos uno: la rúbrica pide decir que correlación no es causalidad), `gallery[] { image, alt, caption }` (imágenes en `src/assets/cases/<id>/`), `resources { repo, dashboard, report, notebooks[] { title, href } }`. El caso de Colchagua sale del repo [colchagua-etl](https://github.com/VincentPelos/colchagua-etl): README, `documentacion/hallazgos_cereza.md`, `limitaciones_y_riesgos.md` y el informe. Se lee con `getCase(id)`.

**skills.json** — `id`, `group`, `items[] { name, icon? }`. `icon` es un nombre de Iconify (`"simple-icons:python"`).

**education.json** — `id`, `institution`, `title`, `start`, `end`, `dateNote?`, `ongoing?`, `type` (`"degree"` | `"cert"` | `"training"`), `folio?`, `url?`. `training` se muestra como capacitación y no como certificación profesional.

**Reglas comunes:** fechas conocidas en formato `AAAA-MM-DD`, `AAAA-MM` o solo `AAAA` según la precisión disponible; si falta toda la fecha, se usa `null` con `dateNote` y se evita inventarla. `end` no puede ser anterior a `start`; URLs completas con `https://`; `cvPath` es una ruta de `public/` que empieza con `/`; `timezone` es una zona IANA (`"America/Santiago"`); `featured` es `false` si se omite.

## Cómo agregar algo

1. Crear un issue (`tipo: feat`, `área: contenido`).
2. Rama `feat/<issue>-<slug>`.
3. Agregar el objeto al JSON correspondiente (copiar uno existente como base).
4. Si tiene imagen: ponerla en `src/assets/projects/` y referenciarla con ruta relativa.
5. `pnpm build`: si algo falta, el error lo dice.
6. Commit `feat(contenido): agrega proyecto <nombre>` y PR a `develop`.
