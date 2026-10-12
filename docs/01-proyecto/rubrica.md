---
tags: [proyecto, rubrica]
actualizado: 2026-10-11
---

# Rúbrica ISI802

Documento original: [ISI802_Rubrica_Portafolio_Web.pdf](ISI802_Rubrica_Portafolio_Web.pdf).

**Asignatura:** ISI802 Business Intelligence · Ingeniería en Programación, semestre VIII (AIEP).
**Qué se evalúa:** la construcción y despliegue de un portafolio profesional que expone el trabajo de BI sobre Colchagua. No se reevalúa el análisis, sino cómo se **presenta y publica**.
**Entrega:** URL en producción + repositorio público en GitHub + defensa técnica.

Estados: ⬜ pendiente · 🟨 en curso · ✅ cumplido · ❌ descartado.

## Admisibilidad (no negociable)

| # | Requisito | Cómo se cumple | Estado |
|---|---|---|---|
| 1 | Framework frontend moderno | Astro ([decisión 001](../03-decisiones/001-astro-sin-framework-ui.md)) | ✅ |
| 2 | Repo **público** con historial real | Flujo issue → rama → PR ([ramas](../05-flujo-git/ramas.md)); se hace público antes de entregar | 🟨 |
| 3 | Desplegado con CD desde GitHub | Coolify despliega `main` en `preview.vduarte.dev`; falta el dominio final `vduarte.dev` ([despliegue](../02-arquitectura/despliegue.md)) | 🟨 |
| 4 | Responsivo | Verificación en 390 / 768 / 1280 px en cada PR; falta una pasada en celular real | 🟨 |
| 5 | Power BI y notebooks reales accesibles | Descarga del `.pbix`, capturas y gráficos HTML en `/proyectos/colchagua`, 6 notebooks en el repo público `colchagua-etl` ([decisiones 006](../03-decisiones/006-power-bi-descarga.md) y [017](../03-decisiones/017-graficos-html.md)); sin incrustar: el autor aceptó la alternativa (2026-10-11) | ✅ |
| 6 | Autoría defendible | Esta bóveda (decisiones + bitácora) + `/uso-de-ia` (hecha, #127) | ✅ |

## A. Desarrollo técnico (70%)

| Criterio | Peso | Qué pide "Destacado" | Cómo lo cubrimos | Estado |
|---|---|---|---|---|
| A1 Framework y arquitectura | 15% | Componentes reutilizables, carpetas claras, datos separados de UI, rutas definidas, elección justificada | [Estructura](../02-arquitectura/estructura.md), contenido en JSON, 3 rutas, decisiones registradas | 🟨 |
| A2 Despliegue continuo | 15% | Deploy por push, builds exitosos, previews por PR, dominio, pipeline documentado en README | Coolify + GitHub App, previews de PR, `vduarte.dev`, README | 🟨 |
| A3 Responsive y UX/UI | 15% | Diseño profesional, perfecto en 3 tamaños, accesible, carga cuidada | [Tokens](../04-diseno/tokens.md), Lighthouse (performance 99, el resto 100 en v0.5.0), reduced-motion | 🟨 |
| A4 Calidad de código | 15% | Código limpio, sin duplicación, commits atómicos, README completo | ESLint, Prettier, Vitest, commitlint, [commits](../05-flujo-git/commits.md) | 🟨 |
| A5 Power BI y notebooks | 10% | Power BI incrustado y funcional, notebooks con links claros | Capturas + descarga del `.pbix` + gráficos HTML + links a los notebooks; sin incrustar, alternativa aceptada (2026-10-11) | ✅ |

## B. Contenido y comunicación de BI (30%)

| Criterio | Peso | Qué pide "Destacado" | Cómo lo cubrimos | Estado |
|---|---|---|---|---|
| B1 Perfil profesional | 10% | Rol, competencias (ETL, DAX, ML, viz), stack, narrativa de analista/ingeniero de datos | Perfil híbrido Software & Datos; grupo Datos y BI en Skills y Colchagua destacado | ✅ |
| B2 Caso Colchagua | 10% | Claro para un no técnico: problema, enfoque, datos reales, valor; storytelling con visualizaciones | `/proyectos/colchagua`: pregunta, cifras, Power BI, 5 hallazgos con gráficos | ✅ |
| B3 Conclusiones | 10% | Accionables, respaldadas, honestas (correlación ≠ causalidad) | "Qué hacer" y "Límites" en el caso, con correlación ≠ causalidad explícito | ✅ |

## Suben la nota

- ✅ Dominio propio `.dev` (`vduarte.dev`).
- ✅ Lighthouse alto (v0.5.0: performance 99; accesibilidad, buenas prácticas y SEO 100).
- ✅ Tests o CI con lint.
- ✅ Dark mode (el sitio es oscuro por diseño).
- ❌ Formulario de contacto funcional (n8n): descartado el 2026-10-11; el contacto es un `mailto:`.
- 🟨 Historial de commits que muestra el proceso.
- 🟨 README ejemplar.

## Bajan la nota (evitar)

- Sitio "plantilla" sin adaptar → diseño propio ([guía](../04-diseno/guia.html)).
- Framework como HTML glorificado → componentes por sección y por rol.
- Power BI que no carga → descarga + dashboard web propio.
- Repo con un único commit → flujo por issues.
- No responsivo → verificación por PR.
- Afirmar causalidad → revisión explícita de las conclusiones.

## Checklist del estudiante (pág. 8)

- [x] Framework moderno, no HTML plano.
- [ ] Repo público con commits atómicos y descriptivos + README (correr y desplegar).
- [ ] Desplegado con deploy automático por push y URL en producción.
- [ ] Responsivo verificado en móvil, tablet y escritorio.
- [x] Sección de perfil profesional (rol, competencias BI, stack).
- [x] Power BI de Colchagua incrustado y cargando (o alternativa: capturas, gráficos y descarga, aceptada el 2026-10-11).
- [x] Enlaces a los notebooks en GitHub, accesibles.
- [x] Síntesis del caso Colchagua con visualizaciones y storytelling.
- [x] Conclusiones sobre vulnerabilidad territorial, honestas y respaldadas.
- [x] Declaración de uso de IA (`/uso-de-ia`).
- [ ] Capaz de explicar el código y las decisiones técnicas en la defensa.
