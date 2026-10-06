---
tags: [git, flujo]
actualizado: 2026-10-06
---

# Ramas y pull requests

Decisión de origen: [005 · Flujo git](../03-decisiones/005-flujo-git.md).

## Modelo

```
main      ●──────────────────────●  v0.1.0  ← producción (Coolify despliega aquí)
           \                    /
develop     ●──●──────●───────●              ← integración (rama por defecto)
                \    /  \     /
docs/2-…         ●──●    \   /
chore/3-…                 ●─●
```

| Rama | Rol | Se escribe directo |
|---|---|---|
| `main` | Producción. Solo recibe releases desde `develop` | ❌ |
| `develop` | Integración. Rama por defecto del repo | ❌ |
| `<tipo>/<issue>-<slug>` | Un issue = una rama | ✅ |

## Nombres de rama

`<tipo>/<número de issue>-<slug-en-español>`

- `feat/12-hero-particulas`
- `fix/18-bento-desborde-movil`
- `docs/2-boveda-documentacion`

Tipos: los mismos que en [commits](commits.md) (`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`).

## Ciclo de un cambio

1. **Issue** con plantilla, labels (`tipo:` y `área:`) y milestone.
2. **Rama** desde `develop` actualizado: `git switch develop && git pull && git switch -c feat/12-hero-particulas`.
3. **Commits** por bloques de cambios relacionados (1–3 por PR) con la [convención](commits.md); cada uno con `Refs #12` en el cuerpo.
4. **PR** a `develop` con la plantilla, `Closes #12`, capturas si hay cambios visuales.
5. **CI en verde** (lint, check, test, build, Lighthouse) y preview de Coolify revisado.
6. **Merge commit** (nunca squash ni rebase). La rama se borra sola.

## Release

1. Todos los issues del milestone cerrados.
2. PR `develop → main` titulado `release: vX.Y.Z`.
3. Actualizar `CHANGELOG.md` en ese PR.
4. Merge → tag `vX.Y.Z` → GitHub Release con el resumen → cerrar el milestone.
5. Coolify despliega `main` a producción.

## Versionado (SemVer)

- `0.x.0`: cada hito del [alcance](../01-proyecto/alcance.md#hitos).
- `0.x.y`: correcciones entre hitos.
- `1.0.0`: entrega de la rúbrica.
