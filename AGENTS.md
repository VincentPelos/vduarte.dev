# AGENTS.md

Reglas para agentes de IA que trabajen en este repo. **Antes de tocar código, lee [`docs/00-index.md`](docs/00-index.md)** y, desde ahí, solo las notas que tu tarea necesita.

## Documentación = memoria

`docs/` es la memoria del proyecto, para los agentes y para el autor. Lo que no está ahí se pierde entre sesiones.

- **Leer por necesidad:** el índice dice _cuándo_ leer cada nota. No cargues la bóveda completa ni bitácoras antiguas: de la bitácora, solo la más reciente si te falta contexto.
- **Escribir siempre:** todo cambio de código, estructura, stack, contenido, diseño o flujo actualiza su nota **en el mismo PR** (y su `actualizado:`). Si no hay nota que lo cubra, se crea y se agrega al índice.
- **Lo planeado se marca como planeado:** nunca documentes como hecho algo que aún no está en el código.
- **Índice al día:** al cerrar una sesión, actualiza _Estado actual_ en `docs/00-index.md` y agrega o actualiza `docs/06-bitacora/AAAA-MM-DD.md`, incluyendo el uso de IA.
- **Decisiones:** nunca se borran; si cambian, se marcan _Reemplazada_ y se crea una nueva.

## Reglas de código

- **Idioma:** código en inglés; contenido, docs, commits y PRs en español.
- **Contenido como datos:** texto, links y datos van en `src/content/*.json`, nunca en un componente.
- **Un lugar por archivo:** sigue [`docs/02-arquitectura/estructura.md`](docs/02-arquitectura/estructura.md); si algo no está cubierto, actualiza esa nota en el mismo PR.
- **Sin frameworks de UI** (React, Vue, Svelte) ni dependencias nuevas sin una decisión registrada en `docs/03-decisiones/`.
- **Estilos:** utilidades de Tailwind y tokens de `src/styles/global.css`; nada de colores ni fuentes fuera de [`docs/04-diseno/tokens.md`](docs/04-diseno/tokens.md).
- **Animaciones:** el contenido nunca depende de que una animación termine; todo respeta `prefers-reduced-motion`. Ver [rendimiento](docs/02-arquitectura/rendimiento.md) antes de tocar canvas o scroll.
- **Flujo:** issue → rama `<tipo>/<n>-<slug>` desde `develop` → commits [convencionales](docs/05-flujo-git/commits.md) que agrupan ~3 cambios relacionados (1–3 por PR), con `Refs #n` → PR a `develop` con `Closes #n` → merge commit. Nunca commits directos a `develop` ni `main`.
- **Antes de abrir un PR:** `pnpm lint && pnpm format:check && pnpm check && pnpm test && pnpm build`.
- **Cambios visuales:** para probarlos y mostrarlos, `pnpm dev` (no artifacts); revisar en 390, 768 y 1280 px. Solo si el autor pide explícitamente diseñar o rehacer algo en un artifact, usar la skill [`prototipo-artifact`](.claude/skills/prototipo-artifact/SKILL.md).

## Comandos

```bash
pnpm install    # dependencias + hook commit-msg
pnpm dev        # http://localhost:4321 (en segundo plano: pnpm astro dev --background)
pnpm build      # dist/
pnpm lint | pnpm format | pnpm check | pnpm test
```

Documentación de Astro: https://docs.astro.build
