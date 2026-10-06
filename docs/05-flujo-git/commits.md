---
tags: [git, commits]
actualizado: 2026-10-05
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

## Reglas

- **Atómico:** un commit = un cambio con sentido propio. Si la descripción necesita "y", probablemente son dos commits.
- **Presente:** "agrega", "corrige", "ajusta" (no "agregado" ni "agregué").
- **Máximo ~72 caracteres** en la primera línea.
- **Siempre** referenciar el issue (`Refs #N`); el PR es el que lo cierra (`Closes #N`).
