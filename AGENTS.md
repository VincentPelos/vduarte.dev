# AGENTS.md

Reglas para agentes de IA que trabajen en este repo. **Antes de tocar código, lee [`docs/00-index.md`](docs/00-index.md)**, luego [estructura](docs/02-arquitectura/estructura.md) y [flujo git](docs/05-flujo-git/ramas.md).

## Reglas

- **Idioma:** código en inglés; contenido, docs, commits y PRs en español.
- **Contenido como datos:** texto, links y datos van en `src/content/*.json`, nunca en un componente.
- **Un lugar por archivo:** sigue [`docs/02-arquitectura/estructura.md`](docs/02-arquitectura/estructura.md); si algo no está cubierto, actualiza esa nota en el mismo PR.
- **Sin frameworks de UI** (React, Vue, Svelte) ni dependencias nuevas sin una decisión registrada en `docs/03-decisiones/`.
- **Estilos:** utilidades de Tailwind y tokens de `src/styles/global.css`; nada de colores ni fuentes fuera de [`docs/04-diseno/tokens.md`](docs/04-diseno/tokens.md).
- **Animaciones:** el contenido nunca depende de que una animación termine; todo respeta `prefers-reduced-motion`.
- **Flujo:** issue → rama `<tipo>/<n>-<slug>` desde `develop` → commits [convencionales](docs/05-flujo-git/commits.md) que agrupan ~3 cambios relacionados (1–3 por PR), con `Refs #n` → PR a `develop` con `Closes #n` → merge commit. Nunca commits directos a `develop` ni `main`.
- **Antes de abrir un PR:** `pnpm lint && pnpm format:check && pnpm check && pnpm test && pnpm build`.
- **Cambios visuales:** para probarlos y mostrarlos, `pnpm dev` (no artifacts); revisar en 390, 768 y 1280 px. Solo si el autor pide explícitamente diseñar o rehacer algo en un artifact, usar la skill [`prototipo-artifact`](.claude/skills/prototipo-artifact/SKILL.md).
- **Bitácora:** al cerrar una sesión, agrega o actualiza `docs/06-bitacora/AAAA-MM-DD.md`, incluyendo el uso de IA.
- **Decisiones:** nunca se borran; si cambian, se marcan _Reemplazada_ y se crea una nueva.

## Comandos

```bash
pnpm install    # dependencias + hook commit-msg
pnpm dev        # http://localhost:4321 (en segundo plano: pnpm astro dev --background)
pnpm build      # dist/
pnpm lint | pnpm format | pnpm check | pnpm test
```

Documentación de Astro: https://docs.astro.build
