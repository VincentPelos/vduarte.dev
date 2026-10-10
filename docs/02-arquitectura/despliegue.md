---
tags: [arquitectura, despliegue]
actualizado: 2026-10-10
---

# Despliegue

> Estado: **pendiente de configurar** en Coolify. Esta nota describe el pipeline objetivo; se completa con capturas y valores reales cuando esté activo.

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
- La configuración de Nginx resuelve las rutas estáticas de Astro y guarda los assets con hash de `/_astro/` durante un año.
- Si se configuran variables `PUBLIC_*` en Coolify, deben estar disponibles **durante el build**: Astro las incorpora a los archivos generados. Cambiar sus valores requiere un nuevo despliegue.
- La imagen puede probarse con `docker build -t vduarte-dev .` y `docker run --rm -p 8080:80 vduarte-dev`; luego abrir `http://localhost:8080`.
- GitHub Actions ejecuta `docker build` en cada PR y en los pushes a `develop` y `main` para verificar la imagen.

El Dockerfile queda en el repositorio; la configuración de la aplicación en Coolify y el primer despliegue siguen pendientes.

## Variables de entorno

| Variable | Uso | Obligatoria |
|---|---|---|
| `PUBLIC_CONTACT_WEBHOOK` | URL del webhook de n8n para el formulario | No (sin ella el formulario muestra solo el correo) |
| `PUBLIC_UMAMI_WEBSITE_ID` | ID del sitio en Umami | No |
| `PUBLIC_UMAMI_SRC` | URL del script de Umami | No |

Ver la justificación en [decisión 003](../03-decisiones/003-despliegue-coolify.md).
