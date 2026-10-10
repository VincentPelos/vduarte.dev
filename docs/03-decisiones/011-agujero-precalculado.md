---
tags: [decision, movimiento, rendimiento]
estado: Reemplazada en parte por 012 (entrada por colapso)
fecha: 2026-10-09
---

# 011 · Agujero negro con trayectorias precalculadas

Reemplaza en parte a la [decisión 008](008-agujero-negro-puntos.md): se mantienen la física y el aspecto. Cambian cuándo se integran los rayos y cómo se comporta la escena con `prefers-reduced-motion`.

## Contexto
Con la 008, cada celda integraba hasta 220 pasos del rayo de luz **en cada cuadro**. Pero la trayectoria solo depende de la posición de la celda relativa al agujero (en radios de Schwarzschild): no depende del tiempo ni de dónde esté el agujero en la pantalla. Lo único que cambia con el tiempo es el giro del disco, el gas y el titileo del cielo. Era lo más caro del sitio en GPUs de gama media.

## Decisión
- **Precálculo en la GPU, una vez al montar:** un shader integra un rayo por texel de una tabla de 40 × 40 Rs (unos 2 texels por celda, entre 128 y 512 por lado). El resultado se guarda en 6 texturas RGBA8, con valores de 16 bits empaquetados para no depender de extensiones de float:
  - el **desvío** de la mirada respecto del cielo recto, con codificación raíz cuadrada (más precisión en los desvíos chicos, lejos del agujero);
  - hasta **3 cruces con el disco**: posición en el plano del disco y factor Doppler `g`;
  - cuántos cruces hay y si el rayo cae al agujero.
- **Cada cuadro** solo lee la tabla (lectura directa, sin interpolar) y aplica lo que depende del tiempo con las mismas fórmulas de antes.
- **Sin congelar la página:** el precálculo se reparte en franjas, con un tope de trabajos por cuadro aunque sobre tiempo, porque `gl.finish()` no siempre espera a la GPU.
- **Carga:** mientras se precalcula, un anillo de puntos de la grilla se completa con el avance real (`--hole-progress`) donde va a aparecer el agujero, y después la escena entra con un fundido de 700 ms. El texto real sigue visible durante el fundido. La carga solo existe con WebGL, así que sin JS no queda colgada. _Reemplazado: la escena entra con un colapso de la sombra en vez del fundido, que dejaba la sombra gris un momento ([decisión 012](012-entrada-colapso.md))._
- **`prefers-reduced-motion`:** cuadro estático **detrás del texto real**, sin deformarlo. Antes, WebGL dibujaba el texto también en este modo, y en las pruebas el cuadro mostrado no lo incluía: el hero quedaba sin nombre. Ahora el contenido no depende de WebGL.

## Alternativas consideradas
- **Precálculo en JavaScript (CPU) con un Worker:** no depende de la GPU, pero tarda ~0,5–2 s en móviles y suma más código.
- **Texturas float:** más simples de escribir, pero renderizar a float no está garantizado en WebGL1.
- **Bajar a 30 fps o reducir pasos:** el ahorro es menor, y reducir pasos estropea el anillo de fotones.

## Consecuencias
- En el headless (GPU por software), el costo propio de la escena por cuadro baja ~60–70 % (detalle en [rendimiento](../02-arquitectura/rendimiento.md#mediciones)). En una GPU real, lo que queda es leer texturas y dibujar puntos.
- Frente al cálculo exacto, cambian puntos sueltos que caen justo en el borde de una celda o de un escalón de brillo (~0,2 % de los píxeles del hero); el disco, la sombra y el anillo se ven igual.
- Cambiar `D`, `TILT`, `ROLL`, `RIN`, `ROUT` o `DOPPLER` no requiere nada extra: la tabla se recalcula en cada carga.
