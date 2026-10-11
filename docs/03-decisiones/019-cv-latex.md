---
tags: [decision, contenido]
estado: Aceptada
fecha: 2026-10-11
---

# 019 · CV en LaTeX compilado con Tectonic

## Contexto
El hero, el bento y el contacto tenían el botón "Descargar CV" deshabilitado porque faltaba el PDF. El autor pidió un CV que pase bien los filtros de ATS e IA que leen los postulantes, y que se pueda versionar junto al sitio.

## Decisión
- El CV se escribe en **LaTeX** (`cv/cv.tex`), en español y en una página: una columna, sin tablas, íconos ni gráficos, títulos estándar (Perfil, Experiencia, Proyectos, Habilidades, Educación) y las URLs escritas como texto. Fuente TeX Gyre Heros, texto alineado a la izquierda y sin cortes de palabra para que las palabras clave se extraigan completas.
- Se compila con **Tectonic** 0.17 (`pnpm cv` → `public/cv.pdf`). Es un binario suelto, fuera de npm, que baja los paquetes de LaTeX que necesita. El PDF se commitea: el build y el Dockerfile no dependen de Tectonic.
- Los datos salen de los JSON de `src/content/`, pero el `.tex` es independiente: un cambio de experiencia, proyectos o skills debe repetirse a mano en el CV y recompilarlo.

## Alternativas consideradas
- **Word (.docx):** algunos ATS lo leen igual de bien, pero no se versiona como texto y es más difícil mantenerlo prolijo.
- **Generar el CV desde los JSON** (plantilla y script): evita la duplicación, pero el CV necesita textos más cortos y ordenados distinto que el sitio; no vale la complejidad para una página.
- **Overleaf:** no requiere instalar nada, pero deja la compilación fuera del repositorio.
- **TeX Live o MiKTeX:** varios GB; Tectonic hace lo mismo con un binario.

## Consecuencias
- Para regenerar el PDF hace falta Tectonic en el PATH (en Windows: el `.zip` de su release en GitHub).
- El CV puede quedar desfasado del sitio si se olvida actualizarlo; la nota de [estructura](../02-arquitectura/estructura.md) lo recuerda.
