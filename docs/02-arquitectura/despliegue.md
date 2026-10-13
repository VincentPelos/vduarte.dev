---
tags: [arquitectura, despliegue]
actualizado: 2026-10-13
---

# Despliegue

> Estado: **activo**. Coolify despliega `main` en `https://preview.vduarte.dev`; con v1.0.0 el autor lo pasa a `https://vduarte.dev`, sin acceso restringido. El servidor y el dominio los administra el autor.

## Pipeline

```
issue → rama → PR a develop ──► GitHub Actions (lint · check · test · build · docker)
                         └────► Coolify: preview del PR en una URL temporal
develop → PR a main (release) ─► merge ─► Coolify: build + deploy a https://vduarte.dev
```

- **Producción:** Coolify despliega automáticamente cada push a `main` mediante su GitHub App.
- **Previews:** cada PR recibe una URL de preview (Coolify *Preview Deployments*). Requisito de "Destacado" en A2.
- **Build:** el `Dockerfile` instala la versión de pnpm fijada en `package.json`, ejecuta `pnpm install --frozen-lockfile` y `pnpm build`; la imagen final sirve `dist/` con Nginx.
- **Dominio:** `vduarte.dev` con HTTPS gestionado por Coolify.

## Imagen Docker

- `Dockerfile` usa Node 22 para compilar y Nginx para servir el sitio en el puerto interno **80**. Coolify debe usar el repositorio Git, el método de build **Dockerfile** y `Ports Exposes: 80`.
- `.dockerignore` excluye dependencias, salida de build, metadatos de Git y archivos `.env` del contexto. El archivo debe llevar el punto inicial para que Docker lo aplique.
- La configuración de Nginx resuelve las rutas estáticas de Astro, guarda los assets con hash de `/_astro/` durante un año y comprime con `gzip` el HTML, CSS, JS, JSON y SVG (#158; `nginx:alpine` lo trae apagado). Si el proxy de Coolify también comprime, no hay conflicto: no se recomprime lo que ya va comprimido.
- Si se configuran variables `PUBLIC_*` en Coolify, deben estar disponibles **durante el build**: Astro las incorpora a los archivos generados. Cambiar sus valores requiere un nuevo despliegue.
- La imagen puede probarse con `docker build -t vduarte-dev .` y `docker run --rm -p 8080:80 vduarte-dev`; luego abrir `http://localhost:8080`.
- GitHub Actions ejecuta `docker build` en cada PR y en los pushes a `develop` y `main` para verificar la imagen.

El Dockerfile queda en el repositorio; la aplicación en Coolify la configura el autor.

## Variables de entorno

Ninguna. Las que había planeadas (`PUBLIC_CONTACT_WEBHOOK` para n8n y `PUBLIC_UMAMI_*` para analytics) se descartaron el 2026-10-11 junto con esas funciones.

Ver la justificación en [decisión 003](../03-decisiones/003-despliegue-coolify.md).
