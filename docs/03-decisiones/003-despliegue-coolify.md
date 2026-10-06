---
tags: [decision, infra]
estado: Aceptada
fecha: 2026-10-05
---

# 003 · Despliegue en Coolify

## Contexto
La rúbrica pide despliegue continuo desde GitHub en "Netlify, Vercel u similar" y acepta "otros si cumplen despliegue continuo desde el repo". Para "Destacado" pide previews por PR, dominio y pipeline documentado. El autor tiene un VPS propio con Coolify y el dominio `vduarte.dev`.

## Decisión
Desplegar en **Coolify** conectado al repo con su GitHub App: deploy automático de `main` a producción y **preview deployments** por cada PR.

## Alternativas consideradas
- **Vercel / Netlify:** más simples, pero dependen de un tercero; Coolify demuestra manejo de infraestructura propia.
- **GitHub Pages:** sin previews por PR.

## Consecuencias
- Control total del servidor y del dominio.
- El autor es responsable de la disponibilidad del VPS.
- El pipeline debe quedar documentado en el README y en [despliegue](../02-arquitectura/despliegue.md).
