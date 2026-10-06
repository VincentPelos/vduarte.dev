---
tags: [decision, movimiento]
estado: Aceptada
fecha: 2026-10-05
---

# 004 · Animaciones con librerías vanilla

## Contexto
El diseño pide animaciones llamativas: entrada del nombre letra a letra, reveals al hacer scroll, smooth scroll y una malla de partículas 3D. Sin framework de UI ([decisión 001](001-astro-sin-framework-ui.md)).

## Decisión
- **Motion** (API vanilla, la misma librería detrás de Framer Motion) para secuencias y progreso de scroll.
- **Web Animations API** nativa para los reveals.
- **Lenis** para smooth scroll.
- **three.js** vanilla para las partículas.
- Todo se desactiva con `prefers-reduced-motion`.

## Regla aprendida en el mockup
El contenido **nunca** debe depender de que una animación termine para ser visible. En el mockup, los reveals basados en `IntersectionObserver` dejaban secciones invisibles dentro del visor; se reemplazaron por un chequeo de posición en scroll y un `finish()` de seguridad.

## Alternativas consideradas
- **GSAP:** muy potente, pero más de lo necesario.
- **React Three Fiber:** obliga a usar React por una sola escena.

## Consecuencias
- Poco JS y sin dependencias de framework.
- La escena 3D baja la cantidad de puntos en móvil y se pausa fuera de pantalla.
