# Changelog

Cambios relevantes del proyecto. Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/); versionado [SemVer](https://semver.org/lang/es/) según los [hitos](docs/01-proyecto/alcance.md#hitos).

## [Sin publicar]

### Agregado

- Layout global: nav píldora, footer, SEO básico y "saltar al contenido" (#37).
- Componentes UI: `GlassCard`, `Button`, `Chip`, `SectionHeader`, `Glows`, `Section`, `Period` e `Icon` (#38, #41, #42).
- Hero con fondo de respaldo y espacio para la animación de v0.4.0 (#39).
- Bento "Sobre mí" con hora local, estado, stack, _Sonando_ y _Jugando_ (#40).
- Secciones Experiencia y Educación con periodos legibles (#41).
- Secciones Proyectos y Skills, con íconos de Iconify como SVG en el build ([decisión 007](docs/03-decisiones/007-iconos.md)) (#42).
- Sección Contacto con correo copiable; el home reemplaza a la página temporal de tokens (#43).
- Textos de la nav, el footer y las secciones en `site.json` (#37, #39–#43).

### Cambiado

- `formatPeriod()` se reemplaza por `periodParts()` (#41).

## [0.2.0] - 2026-10-07

Hito **Contenido**: schemas zod y JSON de ejemplo para cada sección del sitio.

### Agregado

- Schemas zod del contenido en `src/lib/schemas.ts`, conectados a cada JSON en `src/content.config.ts` (#20).
- `site.json` con perfil, contacto, _Sonando_ y _Jugando_ (#21).
- Experiencia y educación de ejemplo, con `sortByRecency()` para ordenarlas (#22).
- Proyectos y skills de ejemplo, con `sortProjects()` (destacados primero) (#23).

### Cambiado

- Commits agrupados por bloques de cambios relacionados (#27).
- Configs de Prettier y commitlint dentro de `package.json`; `lighthouserc.json` en `.github/` (#29).

### Eliminado

- Tablero de GitHub Projects: no aporta frente a los milestones (#1).

## [0.1.0] - 2026-10-06

Hito **Fundaciones**: repositorio, documentación, scaffold, estilos base y tooling de calidad.

### Agregado

- Repositorio con `main` y `develop`, labels, milestones y tablero de GitHub Projects (#1).
- Bóveda de documentación en `docs/`: visión, alcance, rúbrica, arquitectura, decisiones, guía de diseño, flujo git y bitácora (#2).
- Plantillas de issues (funcionalidad y error) y de pull request; issues en blanco desactivados (#8).
- Proyecto Astro con TypeScript strict, pnpm y estructura de carpetas (#3).
- Tailwind CSS v4 con los tokens de diseño, fuentes Martian Mono, Geist y Geist Mono, `BaseLayout` y página temporal de tokens (#4).
- Validación de commits con commitlint y husky (#5).
- ESLint, Prettier, Vitest y `astro check`, con un primer módulo probado en `src/lib/dates.ts` (#6).
- CI en GitHub Actions y Lighthouse CI con los puntajes en el resumen de cada run (#7, #18).
- README, AGENTS.md, CLAUDE.md y este changelog (#9).

[Sin publicar]: https://github.com/VincentPelos/vduarte.dev/compare/v0.2.0...develop
[0.2.0]: https://github.com/VincentPelos/vduarte.dev/releases/tag/v0.2.0
[0.1.0]: https://github.com/VincentPelos/vduarte.dev/releases/tag/v0.1.0
