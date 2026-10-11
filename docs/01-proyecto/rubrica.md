---
tags: [proyecto, rubrica]
actualizado: 2026-10-10
---

# Rúbrica ISI802

Documento original: [ISI802_Rubrica_Portafolio_Web.pdf](ISI802_Rubrica_Portafolio_Web.pdf).

**Asignatura:** ISI802 Business Intelligence · Ingeniería en Programación, semestre VIII (AIEP).
**Qué se evalúa:** la construcción y despliegue de un portafolio profesional que expone el trabajo de BI sobre Colchagua. No se reevalúa el análisis, sino cómo se **presenta y publica**.
**Entrega:** URL en producción + repositorio público en GitHub + defensa técnica.

Estados: ⬜ pendiente · 🟨 en curso · ✅ cumplido.

## Admisibilidad (no negociable)

| # | Requisito | Cómo se cumple | Estado |
|---|---|---|---|
| 1 | Framework frontend moderno | Astro ([decisión 001](../03-decisiones/001-astro-sin-framework-ui.md)) | 🟨 |
| 2 | Repo **público** con historial real | Flujo issue → rama → PR ([ramas](../05-flujo-git/ramas.md)); se hace público antes de entregar | 🟨 |
| 3 | Desplegado con CD desde GitHub | Coolify en `vduarte.dev` ([despliegue](../02-arquitectura/despliegue.md)) | ⬜ |
| 4 | Responsivo | Verificación en 390 / 768 / 1280 px en cada PR | ⬜ |
| 5 | Power BI y notebooks reales accesibles | Descarga del `.pbix` + dashboard web + notebooks enlazados ([decisión 006](../03-decisiones/006-power-bi-descarga.md)) | ⬜ |
| 6 | Autoría defendible | Esta bóveda (decisiones + bitácora) + `/uso-de-ia` (hecha, #127) | ✅ |

## A. Desarrollo técnico (70%)

| Criterio | Peso | Qué pide "Destacado" | Cómo lo cubrimos | Estado |
|---|---|---|---|---|
| A1 Framework y arquitectura | 15% | Componentes reutilizables, carpetas claras, datos separados de UI, rutas definidas, elección justificada | [Estructura](../02-arquitectura/estructura.md), contenido en JSON, 3 rutas, decisiones registradas | 🟨 |
| A2 Despliegue continuo | 15% | Deploy por push, builds exitosos, previews por PR, dominio, pipeline documentado en README | Coolify + GitHub App, previews de PR, `vduarte.dev`, README | ⬜ |
| A3 Responsive y UX/UI | 15% | Diseño profesional, perfecto en 3 tamaños, accesible, carga cuidada | [Tokens](../04-diseno/tokens.md), Lighthouse CI, reduced-motion | ⬜ |
| A4 Calidad de código | 15% | Código limpio, sin duplicación, commits atómicos, README completo | ESLint, Prettier, Vitest, commitlint, [commits](../05-flujo-git/commits.md) | 🟨 |
| A5 Power BI y notebooks | 10% | Power BI incrustado y funcional, notebooks con links claros | Descarga + dashboard web Chart.js + links | ⬜ |

## B. Contenido y comunicación de BI (30%)

| Criterio | Peso | Qué pide "Destacado" | Cómo lo cubrimos | Estado |
|---|---|---|---|---|
| B1 Perfil profesional | 10% | Rol, competencias (ETL, DAX, ML, viz), stack, narrativa de analista/ingeniero de datos | Perfil híbrido Software & Datos con competencias BI visibles | ⬜ |
| B2 Caso Colchagua | 10% | Claro para un no técnico: problema, enfoque, datos reales, valor; storytelling con visualizaciones | `/proyectos/colchagua` | ⬜ |
| B3 Conclusiones | 10% | Accionables, respaldadas, honestas (correlación ≠ causalidad) | Sección de conclusiones del caso con advertencias explícitas | ⬜ |

## Suben la nota

- ✅ Dominio propio `.dev` (`vduarte.dev`).
- ⬜ Lighthouse alto (performance / accesibilidad).
- ✅ Tests o CI con lint.
- ✅ Dark mode (el sitio es oscuro por diseño).
- ⬜ Formulario de contacto funcional (n8n).
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

- [ ] Framework moderno, no HTML plano.
- [ ] Repo público con commits atómicos y descriptivos + README (correr y desplegar).
- [ ] Desplegado con deploy automático por push y URL en producción.
- [ ] Responsivo verificado en móvil, tablet y escritorio.
- [ ] Sección de perfil profesional (rol, competencias BI, stack).
- [ ] Power BI de Colchagua incrustado y cargando (o alternativa acordada con el docente: descarga).
- [ ] Enlaces a los notebooks en GitHub, accesibles.
- [ ] Síntesis del caso Colchagua con visualizaciones y storytelling.
- [ ] Conclusiones sobre vulnerabilidad territorial, honestas y respaldadas.
- [x] Declaración de uso de IA (`/uso-de-ia`).
- [ ] Capaz de explicar el código y las decisiones técnicas en la defensa.
