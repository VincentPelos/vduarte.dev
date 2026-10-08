---
tags: [decision, movimiento, diseno]
estado: Aceptada
fecha: 2026-10-08
---

# 008 · Hero: agujero negro real dibujado con puntos de terminal

Reemplaza en parte a la [decisión 004](004-animaciones-vanilla.md): la malla de partículas con three.js.

## Contexto
La malla de partículas del mockup era provisional. El autor probó en un laboratorio (artifact "Pilares del hero") partículas, pilares 3D, un emblema ASCII, un hero blanco y verde y varias escenas espaciales. Lo que eligió:

- **Arte en base a puntos**, pero dibujados como por una terminal: una grilla fija de celdas, cada una con un punto o nada.
- Un **agujero negro fiel a la física**, no solo a la estética de Interstellar.
- Que se mueva **solo** (sin seguir al mouse) y que, al pasar sobre el nombre, las letras **resistan**: se comban y se separan en colores, pero no se las traga.
- Paleta **Nebulosa**; intensidad 100 %, velocidad 65 %, densidad 100 %, escala 160 %, Doppler activado.

## Decisión
- `src/components/sections/hero/black-hole.ts`, en **WebGL directo** (sin three.js), con la interfaz `mount(section, scene, options) → unmount`.
- **Pasada 1**, una celda de 6 px = un píxel: traza el rayo de luz de cada celda por el espacio curvo de Schwarzschild (aceleración de Binet `a = -3/2·h²·x/r⁵`). Resultado: sombra (~2,6 radios de Schwarzschild), anillo de fotones, disco desde la órbita estable más interna (3 Rs) con temperatura tipo Novikov-Thorne, efecto Doppler (`g⁴`) y la parte de atrás del disco curvada por encima y por debajo.
- **Pasada 2**: dibuja cada celda como punto (cielo · • ●, titileo por escalones) y encima el texto del hero, leído desde una textura con aberración cromática cerca del agujero.
- El texto real queda en el DOM, transparente: sigue siendo accesible y seleccionable.
- Sin WebGL: grilla de puntos en CSS y texto normal. Con `prefers-reduced-motion`: un cuadro estático.

## Alternativas consideradas
- **three.js:** ~530 KB para un solo shader de pantalla completa. WebGL directo pesa ~10 KB.
- **Un rayo por píxel:** ~36 veces más trabajo que un rayo por celda, sin diferencia visible porque cada celda es un solo punto.
- **Partículas, pilares, emblema ASCII, hero blanco y verde:** descartados por el autor en el laboratorio.

## Consecuencias
- La paleta del sitio pasa de Sangre a **Nebulosa** (`--c1 #00d1c1`, `--c2 #7a5cff`, `--c3 #ff5ca8`).
- El lenguaje gráfico del portafolio son **puntos de terminal**: las gráficas nuevas (por ejemplo, el caso Colchagua) deberían seguirlo.
- La escena cuesta GPU: se pausa fuera de pantalla y hay que medirla en móviles de gama media.
- Referencias: Luminet (1979), James et al. 2015 (*Interstellar*), Event Horizon Telescope (M87*) y [Ghostty Blackhole](https://dev.to/solomon_dev/show-hn-physically-accurate-black-hole-shader-you-can-add-to-your-web-project-2kmo), que usa el texto de la terminal como fondo.
