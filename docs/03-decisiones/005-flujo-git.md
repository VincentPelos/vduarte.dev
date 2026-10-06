---
tags: [decision, git]
estado: Aceptada
fecha: 2026-10-05
---

# 005 · Flujo git main + develop

## Contexto
La rúbrica penaliza un repo con un único commit y premia un historial que muestre el proceso. Se necesita trazabilidad de cada cambio.

## Decisión
- Ramas `main` (producción) y `develop` (integración); una rama por issue.
- Ciclo: issue → rama → commits Conventional Commits → PR a `develop` con `Closes #N` → **merge commit**.
- Release: PR `develop → main`, tag SemVer, GitHub Release y `CHANGELOG.md`.
- Detalle en [ramas](../05-flujo-git/ramas.md) y [commits](../05-flujo-git/commits.md).

## Alternativas consideradas
- **GitHub Flow (solo main):** más simple, pero cada merge iría directo a producción.
- **Squash merge:** historia más corta, pero oculta los pasos intermedios que la rúbrica quiere ver.

## Consecuencias
- Cada línea de código se rastrea hasta su issue.
- Algo más de ceremonia por cambio, compensada con plantillas y automatización.
