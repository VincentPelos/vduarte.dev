---
tags: [arquitectura, contenido]
actualizado: 2026-10-07
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
| `cases/colchagua/` | Por definir con el repo de Colchagua | Página del caso |

Cada ítem de una lista lleva un `id` único en `kebab-case`.

## Campos

**site.json** — `name`, `role`, `tagline`, `bio`, `available`, `availabilityNote`, `location`, `timezone`, `email`, `github`, `linkedin`, `cvPath`, `highlightStack[]`, `nowPlaying { song, artist, album? }`, `nowGaming { title, hours?, note?, gacha? { game, pity } }`, `nav[] { section, label, ariaLabel? }` (`section` es el `id` de la sección del home, sin `#`), `footerNote`, `prompt { user, command }`, `labels { email, github, linkedin, cv }` (textos de los botones de contacto).

**experience.json** — `id`, `company`, `role`, `start` (`"2023-03"`), `end` (`null` = actual), `location?`, `description`, `highlights[]?`, `stack[]?`, `url?`. Se ordena por fecha automáticamente.

**projects.json** — `id`, `title`, `description`, `tags[]`, `image?`, `repo?`, `demo?`, `year`, `featured?`, `caseStudy?`. Si `featured` es `true`, ocupa doble ancho en el bento. Si tiene `caseStudy`, genera `/proyectos/<caseStudy>`.

**skills.json** — `id`, `group`, `items[] { name, icon? }`. `icon` es un nombre de Iconify (`"simple-icons:python"`).

**education.json** — `id`, `institution`, `title`, `start`, `end` (`null` = en curso), `type` (`"degree"` | `"cert"`), `url?`.

**Reglas comunes:** fechas en formato `AAAA-MM`; `end` no puede ser anterior a `start`; URLs completas con `https://`; `cvPath` es una ruta de `public/` que empieza con `/`; `timezone` es una zona IANA (`"America/Santiago"`); `featured` es `false` si se omite.

## Cómo agregar algo

1. Crear un issue (`tipo: feat`, `área: contenido`).
2. Rama `feat/<issue>-<slug>`.
3. Agregar el objeto al JSON correspondiente (copiar uno existente como base).
4. Si tiene imagen: ponerla en `src/assets/projects/` y referenciarla con ruta relativa.
5. `pnpm build`: si algo falta, el error lo dice.
6. Commit `feat(contenido): agrega proyecto <nombre>` y PR a `develop`.
