---
tags: [arquitectura, despliegue]
actualizado: 2026-10-05
---

# Despliegue

> Estado: **pendiente de configurar** en Coolify. Esta nota describe el pipeline objetivo; se completa con capturas y valores reales cuando esté activo.

## Pipeline

```
issue → rama → PR a develop ──► GitHub Actions (lint · check · test · build · Lighthouse)
                         └────► Coolify: preview del PR en una URL temporal
develop → PR a main (release) ─► merge ─► Coolify: build + deploy a https://vduarte.dev
```

- **Producción:** Coolify despliega automáticamente cada push a `main` mediante su GitHub App.
- **Previews:** cada PR recibe una URL de preview (Coolify *Preview Deployments*). Requisito de "Destacado" en A2.
- **Build:** `pnpm install --frozen-lockfile && pnpm build`; se sirve la carpeta `dist/` como sitio estático.
- **Dominio:** `vduarte.dev` con HTTPS gestionado por Coolify.

## Variables de entorno

| Variable | Uso | Obligatoria |
|---|---|---|
| `PUBLIC_CONTACT_WEBHOOK` | URL del webhook de n8n para el formulario | No (sin ella el formulario muestra solo el correo) |
| `PUBLIC_UMAMI_WEBSITE_ID` | ID del sitio en Umami | No |
| `PUBLIC_UMAMI_SRC` | URL del script de Umami | No |

Ver la justificación en [decisión 003](../03-decisiones/003-despliegue-coolify.md).
