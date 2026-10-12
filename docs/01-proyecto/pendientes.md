---
tags: [proyecto, pendientes]
actualizado: 2026-10-12
---

# Pendientes

Lo que falta para la entrega (v1.0.0), por hito. Cada punto dice si tiene issue y qué necesita del autor. Se actualiza al cerrar cada sesión: lo terminado sale de aquí y queda en la [bitácora](../06-bitacora/) y el [CHANGELOG](../../CHANGELOG.md).

Estado de la rúbrica: [rubrica.md](rubrica.md).

## v0.6.0 · Contacto y extras (publicado el 2026-10-12)

Lo que quedó abierto pasó a v1.0.0 (abajo), incluido #124.

### Pasan a v1.0.0: pedidos del autor (2026-10-11)

| Pendiente | Issue | Necesita del autor |
|---|---|---|
| Animaciones de entrada y fundidos (Experiencia y Educación ya tienen la suya) | #124 | Decidir si falta algo más |
| La "sección de detalles" que el autor quiere ver antes de cerrar | — | Explicar qué es al empezar el chat |
| Stack de Experiencia: aún lista Windows y TCP/IP (Municipalidad) y Redes (práctica) | — | Decidir si salen, como en Skills |
| Caída al agujero y flecha del hero: probar en celular real y Safari | #136, #131 (PR #138) | Probarla en su celular |

### Pasa a v1.0.0: del alcance

| Pendiente | Issue | Necesita del autor |
|---|---|---|
| SEO e imagen para compartir (Open Graph) | — | Nada |

Descartados (2026-10-11): formulario n8n (queda el `mailto:`) y analytics con Umami (#140).

Hechos en este hito: `/uso-de-ia` (#127); quitar dos proyectos (#129); footer sólido (#130); entrada sin pausa (#132); caída y flecha (#136, #131); CV en LaTeX (#142); columna de años (#134); bento de áreas (#133); celular más corto (#146); limpieza de contenido (#148) y skills (#150); orden de componentes (#154), escenas con twgl (#156) y rendimiento (#158). Skills queda como está: el autor descartó la lluvia de estrellas.

## v1.0.0 · Entrega

| Pendiente | Necesita del autor |
|---|---|
| Confirmar los textos del pipeline de cada proyecto (#162): lo hecho en cada etapa | Revisar los de Placilla y Noneto, y los de DAX, mpv y Tailwind CSS; sumar enlaces a los repos cuando sean públicos |
| Stack del bento: hoy no muestra ninguna herramienta de BI (las de Colchagua sí se ven en Proyectos) | Decidir si cambia alguna de `highlightStack` por Power BI o pandas |
| LinkedIn y CV: el CV ya está (`pnpm cv`) y los enlaces funcionan | Actualizar su perfil de LinkedIn; confirmar las fechas de la práctica en AIEP |
| Reducir los textos del caso Colchagua | Más adelante; por ahora quedan así. `/uso-de-ia` la escribe el agente: cuenta lo que hizo la IA |
| Dominio final: de `preview.vduarte.dev` a `vduarte.dev`, sin acceso restringido | Lo hace el autor en Coolify; el agente no lo toca |
| Repo público | Cambiar la visibilidad en GitHub |
| README final: cómo correr, desplegar y el pipeline (rúbrica A2 y A4) | Nada |
| Lighthouse antes del release ([decisión 013](../03-decisiones/013-lighthouse-manual.md)) | Nada |
| Verificar `gzip` en el primer deploy: `curl -sI -H 'Accept-Encoding: gzip' <url>` debe responder `Content-Encoding: gzip` (#158) | Desplegar `main` en Coolify |
| Pasada en celular real (rúbrica: responsivo) | Revisar en su celular Android. **Sin iPhone:** iOS/Safari (WebKit) queda sin verificar: caída con el rebote del scroll, barra que cambia el alto, `animation-timeline` sin soporte (hay respaldo) y rendimiento del WebGL |
| Preparar la defensa: explicar código y decisiones | Leer las decisiones y la bitácora |

Hechos en este hito: skills dentro de Proyectos, con lista y detalle y pipeline; sale la sección Skills (#162, [decisión 023](../03-decisiones/023-skills-en-proyectos.md)); Noneto CLI con su sitio, repo y galería (#168).
