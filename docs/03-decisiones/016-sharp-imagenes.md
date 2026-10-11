---
tags: [decision, rendimiento, contenido]
estado: Aceptada
fecha: 2026-10-10
---

# 016 · `sharp` para optimizar imágenes

## Contexto
El schema de proyectos ya admitía una imagen (`image`, con `<Image>` de `astro:assets`), pero ningún proyecto tenía una. Colchagua es el primero, con una captura de su Power BI, y la página del caso muestra tres. `<Image>` necesita un servicio de imágenes: sin `sharp`, el build falla (`MissingSharp`).

## Decisión
- Instalar **`sharp`** (0.35.5, la misma versión que Astro ya traía como dependencia opcional en el lockfile).
- Las imágenes del contenido viven en `src/assets/` y salen en WebP, en varios anchos (`widths` y `sizes` en cada `<Image>`).

## Alternativas consideradas
- **Servicio "passthrough" de Astro:** sirve los PNG tal cual, sin dependencia, pero más pesados y sin tamaños por pantalla. Perjudica a Lighthouse.
- **`<img>` con archivos en `public/`:** pierde el hash de caché y la validación del schema.

## Consecuencias
- El build optimiza las imágenes (~1,6 s con las de Colchagua); la imagen Docker (`node:22-slim`, glibc) usa los binarios precompilados de `sharp`.
- Una dependencia nativa más: si una plataforma no tiene binario precompilado, el build falla con un mensaje claro.
