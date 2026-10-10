---
tags: [decision, infra, calidad]
estado: Aceptada
fecha: 2026-10-10
---

# 013 · Lighthouse a mano antes de cada versión menor

## Contexto
Lighthouse CI corría en cada PR: 3 ejecuciones, 4–5 minutos por PR, y los reportes se subían a un almacenamiento público temporal. El autor no quiere actions corriendo en cada PR. La [rúbrica](../01-proyecto/rubrica.md) (A3) pide un Lighthouse alto, así que la medición se mantiene.

## Decisión
- El workflow `lighthouse.yml` se lanza solo a mano (`workflow_dispatch`).
- Se corre una vez sobre `develop` cuando está lista la última versión antes de una versión menor o mayor (por ejemplo, antes de `v0.4.0`): `gh workflow run Lighthouse --ref develop`, o desde la pestaña Actions.
- Lo que quede bajo 90 se corrige antes del release, para llegar a la versión nueva con los puntajes bien. Paso agregado al [release](../05-flujo-git/ramas.md#release).
- Los reportes quedan como artifact del run; ya no se suben a almacenamiento público.
- El CI (`ci.yml`) sigue corriendo en cada PR: verifica lint, formato, tipos, tests, build y la imagen Docker antes de mergear.

## Alternativas consideradas
- **Mantenerlo en cada PR:** atrapa regresiones antes, pero es lo que el autor no quiere.
- **Borrarlo:** se pierde la evidencia de la rúbrica.

## Consecuencias
- Una regresión de rendimiento o accesibilidad se detecta recién al preparar la versión menor, no en el PR que la causó.
- Para medir entre versiones queda la medición local de [rendimiento](../02-arquitectura/rendimiento.md#cómo-medir).
