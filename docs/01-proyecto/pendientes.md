---
tags: [proyecto, pendientes]
actualizado: 2026-10-12
---

# Pendientes

Lo que falta para la entrega (v1.0.0), por hito. Cada punto dice si tiene issue y qué necesita del autor. Se actualiza al cerrar cada sesión: lo terminado sale de aquí y queda en la [bitácora](../06-bitacora/) y el [CHANGELOG](../../CHANGELOG.md).

Estado de la rúbrica: [rubrica.md](rubrica.md).

## v0.6.0 · Contacto y extras (publicado el 2026-10-12)

Lo que quedó abierto pasó a v1.0.0 (abajo), incluido #124.

Lo que quedó abierto (#124, la caída en celular real, el stack de Experiencia y SEO/Open Graph) está en la tabla de v1.0.0. La "fase de detalles" que pidió el autor se hizo el 2026-10-12 (#174 a #181).

Descartados (2026-10-11): formulario n8n (queda el `mailto:`) y analytics con Umami (#140).

Hechos en este hito: `/uso-de-ia` (#127); quitar dos proyectos (#129); footer sólido (#130); entrada sin pausa (#132); caída y flecha (#136, #131); CV en LaTeX (#142); columna de años (#134); bento de áreas (#133); celular más corto (#146); limpieza de contenido (#148) y skills (#150); orden de componentes (#154), escenas con twgl (#156) y rendimiento (#158). Skills queda como está: el autor descartó la lluvia de estrellas.

## v1.0.0 · Entrega

### Lo hace el agente (no necesita al autor)

| Pendiente | Issue |
|---|---|
| SEO e imagen para compartir: Open Graph y Twitter Card en `Seo.astro`, `og.png` (1200 × 630), `robots.txt` y `sitemap.xml`. Hoy solo hay `title`, `description` y `canonical` | — |
| README final: cómo correr, desplegar y el pipeline (rúbrica A2 y A4) | — |
| Release: `CHANGELOG.md` con `[1.0.0]`, `package.json` a 1.0.0, PR `develop` → `main` y tag `v1.0.0` | — |

### Necesita al autor

| Pendiente | Necesita del autor |
|---|---|
| Textos del pipeline de cada proyecto (#162) | Revisar los de Placilla y Noneto, y los de DAX, mpv y Tailwind CSS; sumar enlaces a los repos cuando sean públicos |
| Animaciones de entrada y fundidos | Decidir si falta algo o se cierra #124 |
| Stack de Experiencia: aún lista Windows y TCP/IP (Municipalidad) y Redes (práctica) | Decidir si salen |
| Stack del bento: no muestra ninguna herramienta de BI (las de Colchagua sí se ven en Proyectos) | Decidir si cambia alguna de `highlightStack` por Power BI o pandas |
| LinkedIn y CV: el CV está al día (`pnpm cv`) | Actualizar LinkedIn; confirmar las fechas de la práctica en AIEP |
| Dominio final: de `preview.vduarte.dev` a `vduarte.dev`, sin acceso restringido | Lo hace en Coolify; el agente no lo toca |
| Repo público (los puntos del grafo de `/uso-de-ia` y los enlaces a la bitácora llevan a GitHub) | Cambiar la visibilidad en GitHub |
| Verificar `gzip` en el primer deploy: `curl -sI -H 'Accept-Encoding: gzip' <url>` debe responder `Content-Encoding: gzip` (#158) | Desplegar `main` en Coolify |
| Pasada en celular real (rúbrica: responsivo), con la caída al agujero y la flecha del hero (#136, #131) | Revisar en su Android. **Sin iPhone:** iOS/Safari queda sin verificar (rebote del scroll, barra que cambia el alto, `animation-timeline` sin soporte con respaldo, WebGL) |
| Preparar la defensa: explicar código y decisiones | Leer las decisiones y la bitácora |
| Reducir los textos del caso Colchagua | Opcional, más adelante |

Lighthouse sobre `develop` el 2026-10-12, tras la fase de detalles (mediana de 3): home 97, `/proyectos/colchagua` 100 y `/uso-de-ia` 100; accesibilidad, buenas prácticas y SEO 100 en las tres. Se repite antes del release ([decisión 013](../03-decisiones/013-lighthouse-manual.md)).

Hechos en este hito: skills dentro de Proyectos, con lista y detalle y pipeline; sale la sección Skills (#162, [decisión 023](../03-decisiones/023-skills-en-proyectos.md)); Noneto CLI con su sitio, repo y galería (#168); Cóndor sale de Proyectos hasta que esté listo (#174); sale "Configuro redes" de Experiencia y del CV (#176); grafo de la memoria en `/uso-de-ia` (#177, [decisión 025](../03-decisiones/025-grafo-memoria.md)); skill elegida y con color en Proyectos, y footer sin "Hecho con Astro" (#180); logros que se abren suave (#181).
