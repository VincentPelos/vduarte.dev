# Changelog

Cambios relevantes del proyecto. Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/); versionado [SemVer](https://semver.org/lang/es/) según los [hitos](docs/01-proyecto/alcance.md#hitos).

## [Sin publicar]

## [1.0.0] - 2026-10-13

Hito **Entrega**: el portafolio queda listo para producción en `vduarte.dev` y para la evaluación de ISI802. Lighthouse CI sobre `develop` (2026-10-12, mediana de 3): performance 97 en el home y 100 en el caso y en `/uso-de-ia`; accesibilidad, buenas prácticas y SEO 100.

### Agregado

- Grafo de la memoria del proyecto en `/uso-de-ia`: cada nota de `docs/` es un punto y cada enlace, una línea; se arma en el build, entra en onda desde el índice y por sus líneas viajan señales ([decisión 025](docs/03-decisiones/025-grafo-memoria.md)) (#177).
- Cielo con gas estelar y asteroides, y menos estrellas ([decisión 024](docs/03-decisiones/024-gas-asteroides.md)) (#172).
- Brillos detrás de Experiencia, Proyectos y Educación (#167).
- Noneto CLI con su sitio, repo y galería (#168).
- Favicon propio (un agujero negro de puntos), imagen para compartir (Open Graph y Twitter Card), `sitemap.xml` y `robots.txt` (#185).
- Power BI en el stack del bento (#185).

### Cambiado

- Proyectos en lista y detalle: cada proyecto muestra sus skills como logos y, al elegir una, su pipeline enciende las etapas donde se usó; el cambio de proyecto se anima con View Transitions ([decisión 023](docs/03-decisiones/023-skills-en-proyectos.md)) (#162).
- Cada proyecto abre con una skill elegida y los botones de skill llevan la paleta, para que se note que se pulsan (#180).
- Los logros de Experiencia se abren y se cierran suave (#181).
- El velo de las entradas de Experiencia y Educación difumina en vez de oscurecer (#167).
- Footer sin "Hecho con Astro" (#180).

### Corregido

- Estrellas detrás del bento: Sobre mí se quedaba sin cielo (#164).
- `~/` de la nav no llevaba al inicio y la nav marcaba la sección equivocada al volver (#166).

### Eliminado

- La sección Skills: las skills viven ahora en cada proyecto y el stack en el bento (#162).
- Cóndor de Proyectos, hasta que esté listo (#174).
- "Configuro redes" de Experiencia y del CV (#176).

## [0.6.0] - 2026-10-12

Hito **Contacto y extras**: `/uso-de-ia`, la caída al agujero negro al pasar al portafolio, el bento de áreas, la columna de años, el CV en LaTeX, y una pasada de orden y rendimiento. Lighthouse CI sobre `develop` (mediana de 3): performance 99 en el home y 100 en el caso y en `/uso-de-ia`; accesibilidad, buenas prácticas y SEO 100. Con GPU real (fuera del CI) el home móvil pasó de 86 a 96.

### Agregado

- Página `/uso-de-ia` con la declaración de uso de IA (#127).
- Caída al agujero negro al pasar del hero al portafolio, con la flecha del hero ([decisión 018](docs/03-decisiones/018-caida-al-agujero.md)) (#136, #131); no queda atascada si se interrumpe el aterrizaje (#139).
- CV en LaTeX compatible con ATS, compilado con Tectonic (`pnpm cv`), y enlaces a CV y LinkedIn ([decisión 019](docs/03-decisiones/019-cv-latex.md)) (#142).
- Experiencia y Educación en columna de años, con logros desplegables y la línea de estrellas que se dibuja al entrar ([decisión 020](docs/03-decisiones/020-columna-de-anios.md)) (#134).
- Bento de áreas en puntos (dev, datos, infra y agentes de IA) que se arma con los puntos del agujero al terminar la caída ([decisión 021](docs/03-decisiones/021-bento-agentes-armado.md)) (#133).

### Cambiado

- Footer sólido sobre el cielo de estrellas (#130).
- Entrada del agujero negro sin la pausa de ~1 s al terminar (#132).
- Componentes reutilizables (`Link`, `PageLayout`, `ProfileButtons`, `ProjectLinks`…) y tarjetas del bento que leen su contenido, sin cambios visuales (#154).
- Agujero negro con twgl.js y shaders en archivos; helpers compartidos para los canvas ([decisión 022](docs/03-decisiones/022-twgl-escenas.md)) (#156).
- Rendimiento: escenas a ~60 fps, shaders compilados en paralelo, sprite de íconos solo en el home, comentarios fuera del HTML y `gzip` en Nginx (#158).
- Orden del home: Experiencia, Proyectos, Educación, Skills (#134).
- En celular, tarjetas de a dos y menos espacio: el home es ~600 px más corto en 390 px (#146).
- Vidrio de las tarjetas del bento al 50 % (#133).
- Resumen de Experiencia al grano y cargo "Soporte TI" (#148); skills sin lo básico ni lo que no se usa (#150).

### Corregido

- Los dibujos del bento se animaban sin verse en celular (#158).

### Eliminado

- Panel de Monitoreo TI y Mesa de Ayuda de Proyectos (#129).
- Tarjetas de hora, sonando, jugando y constelación del bento; `nowPlaying` y `nowGaming` (#133, #148).
- Formulario n8n y analytics del alcance (#140).

## [0.5.0] - 2026-10-10

Hito **Caso Colchagua**: el proyecto de BI sobre la cereza en Colchagua, con su página propia, y Proyectos con imágenes. Lighthouse sobre `develop`: performance 99 en el home y en el caso; accesibilidad, buenas prácticas y SEO 100.

### Agregado

- Contenido del caso Colchagua en `cases.json`, con su schema (#114).
- Colchagua en Proyectos y el grupo de competencias Datos y BI en Skills (#118).
- Página `/proyectos/colchagua`: la pregunta, 4 cifras, capturas del Power BI, 5 hallazgos con gráficos, qué hacer, límites y proceso (#115).
- Cifras de la investigación en barras HTML, sin JS ([decisión 017](docs/03-decisiones/017-graficos-html.md)) (#116).
- Descargas del caso: `.pbix`, informe y los 6 notebooks del repo público [colchagua-etl](https://github.com/VincentPelos/colchagua-etl) (#117).
- Mini galería de imágenes en las tarjetas de proyecto (#122).
- Imágenes optimizadas con `sharp` ([decisión 016](docs/03-decisiones/016-sharp-imagenes.md)).

### Cambiado

- Destacados: Colchagua, el sitio de la Municipalidad de Placilla (con capturas) y Noneto; el Panel de Monitoreo pasa a la lista.
- El dashboard del caso se muestra con capturas y descarga en vez de recrearlo con Chart.js (reemplaza en parte a la [decisión 006](docs/03-decisiones/006-power-bi-descarga.md)).

### Corregido

- El cielo de estrellas no calcula `NaN` en páginas sin constelaciones.

## [0.4.0] - 2026-10-10

Hito **Movimiento**: entrada del agujero negro, hero a pantalla completa, reveals, smooth scroll, nav activa y una pasada de UI en celular. Lighthouse sobre `develop`: performance 99, accesibilidad, buenas prácticas y SEO 100.

### Agregado

- La escena del agujero negro entra con un colapso de su sombra en vez de un fundido gris ([decisión 012](docs/03-decisiones/012-entrada-colapso.md)) (#83).
- Reveals de secciones al hacer scroll, sin ocultar contenido visible (#87).
- Smooth scroll con Lenis para la rueda; touch y teclado quedan nativos (#88).
- La nav resalta la sección visible (#89).
- Hero como diapositiva de pantalla completa que el portafolio tapa al bajar ([decisión 014](docs/03-decisiones/014-hero-diapositiva.md)) (#97).

### Cambiado

- La nav pasa de abajo a arriba (#89).
- Lighthouse corre a mano antes de cada versión menor y no en cada PR ([decisión 013](docs/03-decisiones/013-lighthouse-manual.md)) (#85).
- Skills en filas con chips, sin tarjetas (#98).
- Educación como línea de vida con estrellas (#99).
- En celular, Sobre mí y Proyectos se deslizan de lado y el texto va al 90 % (#92).
- Proyectos: destacados en una fila con imagen baja y el resto en una lista con miniatura (#107).

### Rendimiento

- El agujero negro integra los rayos una vez al cargar y no en cada cuadro; mientras tanto, un anillo de puntos muestra el avance ([decisión 011](docs/03-decisiones/011-agujero-precalculado.md)) (#81).
- Sin GPU (WebGL por software), el agujero negro no se monta y queda el respaldo sin WebGL, en vez de trabar la página (#109).
- Las animaciones CSS decorativas se pausan con su sección fuera de pantalla (#109).

### Corregido

- Con `prefers-reduced-motion`, el hero mostraba el agujero negro pero no el nombre ni el texto: ahora el cuadro estático va detrás del texto real (#81).
- Accesibilidad de enlaces: "Correo" usa ↓, los enlaces pendientes reciben foco y anuncian que faltan, y los externos avisan que abren otra pestaña (#90).
- La constelación de Proyectos se forma cuando su símbolo está a la vista (#91).

## [0.3.1] - 2026-10-09

Entre hitos: perfil real, cinemática de constelaciones, optimización de rendimiento e imagen Docker para el primer despliegue en Coolify.

### Agregado

- Skill de proyecto `prototipo-artifact` para decidir cambios visuales en artifacts antes de implementarlos (#59).
- Cinemática de constelaciones: cielo de estrellas detrás de la página y un símbolo por sección que viaja con el scroll, escapando del agujero negro desde el hero ([decisión 009](docs/03-decisiones/009-cinematica-constelaciones.md)) (#61).
- Imagen Docker (Node 22 + Nginx) para desplegar en Coolify y `docker build` en CI (#74).
- Nota de [rendimiento](docs/02-arquitectura/rendimiento.md) con reglas, estado y mediciones (#67).

### Cambiado

- Perfil, experiencia, proyectos, skills y educación reales en lugar del contenido de ejemplo (#63).
- La guía visual queda como histórica; `tokens.md` es la fuente de verdad del diseño (#57).
- `pnpm dev` para probar cambios; los artifacts quedan solo para diseñar (#65).
- La documentación es la memoria del proyecto: se actualiza en cada PR y se lee por necesidad desde el índice (#67).
- Íconos en un sprite SVG en vez de en línea ([decisión 010](docs/03-decisiones/010-iconos-sprite.md)) (#69).
- `getSite()`, `linkAttrs()`, `TechIcon` y `BentoCard` reemplazan código repetido, sin cambios en el HTML generado (#70).

### Rendimiento

- El cielo de estrellas lee el DOM una vez por cuadro (no por estrella), dibuja a ~10 fps cuando está quieto y no salta en móvil al esconderse la barra del navegador (#68).
- Los brillos usan degradados en vez de `filter: blur` animado (#68).
- Precarga de las fuentes del nombre y del texto; Martian Mono solo en latín (#69).

## [0.3.0] - 2026-10-08

Hito **Secciones**: layout, componentes UI, todas las secciones del home y el agujero negro del hero.

### Agregado

- Layout global: nav píldora, footer, SEO básico y "saltar al contenido" (#37).
- Componentes UI: `GlassCard`, `Button`, `Chip`, `SectionHeader`, `Glows`, `Section`, `Period` e `Icon` (#38, #41, #42).
- Hero con prompt, nombre, rol y botones desde `site.json` (#39).
- Bento "Sobre mí" con hora local, estado, stack, _Sonando_ y _Jugando_ (#40).
- Secciones Experiencia y Educación con periodos legibles (#41).
- Secciones Proyectos y Skills, con íconos de Iconify como SVG en el build ([decisión 007](docs/03-decisiones/007-iconos.md)) (#42).
- Sección Contacto con correo copiable; el home reemplaza a la página temporal de tokens (#43).
- Agujero negro en el hero: trazado de rayos real dibujado con puntos de terminal, en WebGL directo ([decisión 008](docs/03-decisiones/008-agujero-negro-puntos.md)) (#53).
- Textos de la nav, el footer y las secciones en `site.json` (#37, #39–#43).

### Cambiado

- `formatPeriod()` se reemplaza por `periodParts()` (#41).
- Paleta Sangre → Nebulosa (#53).

### Corregido

- El bento "Sobre mí" ya no se ve cortado respecto del hero (#51).

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

[Sin publicar]: https://github.com/VincentPelos/vduarte.dev/compare/v1.0.0...develop
[1.0.0]: https://github.com/VincentPelos/vduarte.dev/releases/tag/v1.0.0
[0.6.0]: https://github.com/VincentPelos/vduarte.dev/releases/tag/v0.6.0
[0.5.0]: https://github.com/VincentPelos/vduarte.dev/releases/tag/v0.5.0
[0.4.0]: https://github.com/VincentPelos/vduarte.dev/releases/tag/v0.4.0
[0.3.1]: https://github.com/VincentPelos/vduarte.dev/releases/tag/v0.3.1
[0.3.0]: https://github.com/VincentPelos/vduarte.dev/releases/tag/v0.3.0
[0.2.0]: https://github.com/VincentPelos/vduarte.dev/releases/tag/v0.2.0
[0.1.0]: https://github.com/VincentPelos/vduarte.dev/releases/tag/v0.1.0
