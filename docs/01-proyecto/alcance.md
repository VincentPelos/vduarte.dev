---
tags: [proyecto, alcance]
actualizado: 2026-10-08
---

# Alcance

## Rutas

| Ruta | Contenido |
|---|---|
| `/` | Home: hero, bento "sobre mí", experiencia, proyectos, skills, educación, contacto |
| `/proyectos/[slug]` | Caso de estudio. El primero: **colchagua** |
| `/uso-de-ia` | Declaración de uso de IA (obligatoria por la rúbrica) |

## Dentro del alcance

- **Hero:** prompt `whoami`, nombre, rol, tagline, botones Correo · GitHub · LinkedIn · Descargar CV, agujero negro de puntos de fondo.
- **Bento "sobre mí":** bio, hora local, disponibilidad, stack principal, *Sonando*, *Jugando*, links.
- **Experiencia, proyectos (bento), skills, educación:** todo desde JSON.
- **Caso Colchagua:** problema, enfoque, datos, dashboard web con Chart.js, hallazgos, conclusiones, descarga del `.pbix` y links a notebooks.
- **Contacto:** formulario funcional hacia un webhook de n8n + correo copiable.
- **Calidad:** ESLint, Prettier, Vitest, `astro check`, Lighthouse CI, commitlint.
- **SEO:** meta, Open Graph, sitemap, favicon; analytics con Umami.
- **Responsive:** móvil, tablet y escritorio.

## Fuera del alcance (por ahora)

- Blog o posts.
- Multi-idioma (solo español).
- CMS o panel de administración.
- Modo claro (el sitio es oscuro por diseño).
- Integraciones en vivo de *Sonando*/*Jugando* (Last.fm, Steam): candidatas para después de v1.0.0.

## Hitos

Cada hito es un milestone en GitHub y una versión SemVer al mergear `develop → main`.

| Versión | Nombre | Entrega |
|---|---|---|
| v0.1.0 | Fundaciones | Repo, documentación, scaffold Astro, estilos base, lint/tests/CI |
| v0.2.0 | Contenido | Schemas zod y JSON de ejemplo |
| v0.3.0 | Secciones | Layout, componentes UI y cada sección del home |
| v0.4.0 | Movimiento | Agujero negro del hero, reveals, Lenis, nav activa |
| v0.5.0 | Caso Colchagua | Página del caso, dashboard Chart.js, descargas, notebooks |
| v0.6.0 | Contacto y extras | Formulario n8n, `/uso-de-ia`, SEO/OG, analytics |
| v1.0.0 | Entrega | Contenido real, CV, repo público, Lighthouse, README final |
