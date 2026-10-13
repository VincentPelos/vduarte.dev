---
tags: [proyecto, pendientes]
actualizado: 2026-10-13
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

El código está listo (#185): Power BI en el bento, favicon, imagen para compartir, `sitemap.xml`, `robots.txt`, README, rúbrica revisada, CHANGELOG y versión 1.0.0. Lo que queda lo hace el autor, en este orden:

| Paso | Qué |
|---|---|
| 1. Release | Mergear el PR `develop` → `main`: Coolify despliega. Después, el tag `v1.0.0` y el GitHub Release (lo puede hacer el agente) |
| 2. Dominio | En Coolify, de `preview.vduarte.dev` a `vduarte.dev`, sin acceso restringido |
| 3. Repo público | Cambiar la visibilidad en GitHub: los puntos del grafo de `/uso-de-ia` y los enlaces a la bitácora dejan de dar 404 |
| 4. Verificar | `curl -sI -H 'Accept-Encoding: gzip' https://vduarte.dev` responde `Content-Encoding: gzip` (#158); compartir el enlace muestra la imagen; pasada en su Android (iOS/Safari queda sin verificar) |
| 5. LinkedIn | Actualizar el perfil; confirmar las fechas de la práctica en AIEP |
| 6. Defensa | Leer las decisiones, la bitácora y la [revisión de la rúbrica](rubrica.md#revisión-antes-de-v100-2026-10-13) |

Decidido por el autor el 2026-10-13: los textos del pipeline quedan como están, las animaciones también (#124 cerrado) y el stack de Experiencia no cambia. Opcional, más adelante: reducir los textos del caso Colchagua.

Hechos en este hito: skills dentro de Proyectos, con lista y detalle y pipeline; sale la sección Skills (#162, [decisión 023](../03-decisiones/023-skills-en-proyectos.md)); Noneto CLI con su sitio, repo y galería (#168); Cóndor sale de Proyectos hasta que esté listo (#174); sale "Configuro redes" de Experiencia y del CV (#176); grafo de la memoria en `/uso-de-ia` (#177, [decisión 025](../03-decisiones/025-grafo-memoria.md)); skill elegida y con color en Proyectos, y footer sin "Hecho con Astro" (#180); logros que se abren suave (#181); Power BI en el bento, favicon, imagen para compartir, sitemap, README y rúbrica (#185).
