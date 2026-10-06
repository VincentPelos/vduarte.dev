---
tags: [git, commits]
actualizado: 2026-10-06
---

# Convención de commits

[Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/): **tipo en inglés** (estándar, lo entienden las herramientas) y **descripción en español**. Se valida automáticamente con commitlint en el hook `commit-msg`.

## Formato

```
<tipo>(<alcance>): <descripción en presente, minúscula, sin punto final>

<cuerpo opcional: qué y por qué>

Refs #<issue>
```

## Tipos

| Tipo | Cuándo |
|---|---|
| `feat` | Funcionalidad o contenido nuevo visible |
| `fix` | Corrige un error |
| `style` | Cambios visuales o de diseño (CSS, tokens) sin lógica nueva |
| `refactor` | Reorganiza código sin cambiar lo que hace |
| `docs` | Documentación (bóveda, README) |
| `test` | Agrega o corrige tests |
| `chore` | Configuración, dependencias, scaffolding |
| `ci` | Workflows, hooks, pipeline |
| `perf` | Mejora de rendimiento |
| `release` | Commit de versión (solo en releases) |

## Alcances

`hero`, `bento`, `experiencia`, `proyectos`, `skills`, `educacion`, `contacto`, `nav`, `caso`, `contenido`, `diseno`, `particulas`, `animaciones`, `seo`, `ci`, `deps`, `boveda`, `proyecto`, `arquitectura`, `decisiones`, `git`, `bitacora`.

Se pueden agregar alcances nuevos documentándolos aquí.

## Ejemplos

```
feat(hero): agrega malla de partículas con three.js
fix(bento): corrige desborde horizontal en móvil
style(nav): ajusta blur de la píldora flotante
docs(decisiones): registra uso de Coolify para despliegue
chore(deps): actualiza astro a 5.x
ci: agrega lighthouse en pull requests
```

## Validación automática

- **husky** instala el hook `.husky/commit-msg` al correr `pnpm install` (script `prepare`).
- El hook ejecuta **commitlint** con `commitlint.config.js`, que extiende `@commitlint/config-conventional` y agrega:
  - `type-enum`: solo los tipos de la tabla de arriba (error si no).
  - `header-max-length`: 72 caracteres (error si se pasa).
  - `scope-enum`: los alcances de esta nota (**advertencia**, no bloquea; si se usa uno nuevo, se agrega aquí y en la config).
- Probar un mensaje sin commitear: `echo "feat(hero): agrega algo" | pnpm exec commitlint`.

## Reglas

- **Por bloques:** cada commit agrupa unos **3 cambios relacionados** (p. ej. la config, el script y la nota de una misma herramienta). Un PR suele tener **1–3 commits**; no se parte cada archivo en su propio commit. Lo que no está relacionado va en otro commit.
- **Presente:** "agrega", "corrige", "ajusta" (no "agregado" ni "agregué").
- **Máximo ~72 caracteres** en la primera línea.
- **Siempre** referenciar el issue (`Refs #N`); el PR es el que lo cierra (`Closes #N`).
