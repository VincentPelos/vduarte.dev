---
tags: [proyecto, alcance]
actualizado: 2026-10-11
---

# Alcance

## Rutas

| Ruta | Contenido |
|---|---|
| `/` | Home: hero, bento "sobre mí", experiencia, proyectos, educación, skills, contacto |
| `/proyectos/[slug]` | Caso de estudio. El primero: **colchagua** |
| `/uso-de-ia` | Declaración de uso de IA (obligatoria por la rúbrica) |

## Dentro del alcance

- **Hero:** prompt `whoami`, nombre, rol, tagline, botones Correo · GitHub · LinkedIn · Descargar CV, agujero negro de puntos de fondo.
- **Bento "sobre mí":** bio, hora local, disponibilidad, stack principal, *Sonando*, *Jugando*, links.
- **Experiencia, proyectos (bento), educación, skills:** todo desde JSON.
- **Caso Colchagua:** problema, enfoque, datos, capturas del Power BI y gráficos HTML, hallazgos, conclusiones, descarga del `.pbix` y links a notebooks. El Power BI no se incrusta: el autor aceptó esta alternativa (2026-10-11).
- **Contacto:** correo con `mailto:` y botón para copiarlo.
- **Calidad:** ESLint, Prettier, Vitest, `astro check`, Lighthouse CI, commitlint.
- **SEO:** meta, Open Graph, sitemap, favicon.
- **Responsive:** móvil, tablet y escritorio.

## Fuera del alcance (por ahora)

- Blog o posts.
- Multi-idioma (solo español).
- CMS o panel de administración.
- Modo claro (el sitio es oscuro por diseño).
- Formulario de contacto (n8n): descartado el 2026-10-11, basta el `mailto:`.
- Analytics (Umami): descartado el 2026-10-11, no lo pide la rúbrica.
- Integraciones en vivo de *Sonando*/*Jugando* (Last.fm, Steam): candidatas para después de v1.0.0.

## Hitos

Cada hito es un milestone en GitHub y una versión SemVer al mergear `develop → main`.

| Versión | Nombre | Entrega |
|---|---|---|
| v0.1.0 | Fundaciones | Repo, documentación, scaffold Astro, estilos base, lint/tests/CI |
| v0.2.0 | Contenido | Schemas zod y JSON de ejemplo |
| v0.3.0 | Secciones | Layout, componentes UI, cada sección del home y el agujero negro del hero |
| v0.4.0 | Movimiento | Fondo de estrellas de la página, reveals, Lenis, nav activa |
| v0.5.0 | Caso Colchagua | Página del caso, capturas del Power BI y gráficos HTML, descargas, notebooks |
| v0.6.0 | Contacto y extras | `/uso-de-ia`, SEO/OG, mejorar animaciones (#124) |
| v1.0.0 | Entrega | Contenido real, CV, repo público, Lighthouse, README final |
