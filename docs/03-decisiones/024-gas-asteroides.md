---
tags: [decision, movimiento, diseno]
estado: Aceptada
fecha: 2026-10-12
---

# 024 · Cielo con gas estelar, asteroides y menos estrellas

Complementa la [decisión 009](009-cinematica-constelaciones.md) (cielo de estrellas y constelaciones) y respeta el lenguaje de puntos de la [008](008-agujero-negro-puntos.md).

## Contexto
El autor sintió el cielo recargado de estrellas y quieto entre constelaciones. Pidió bajar la cantidad de estrellas y sumar movimiento: gas estelar y asteroides "para darle solidez a algunas partes" (#172). Lo vio en `pnpm dev`, sin laboratorio, y pidió que los asteroides también tomaran la paleta.

## Decisión
- **Estrellas:** 700 en vez de 1100 (a 1280 × 800). Las constelaciones se arman con las mismas estrellas y no cambian.
- **Gas estelar:** 3 nubes (2 bajo 720px) de puntos en la grilla de 6px, cada una con un color de la paleta. El ruido se apaga hacia el borde de una elipse y es ralo donde hay poco gas, para que no parezca una trama. Cada nube tiene dos capas que se desplazan de lado (2,4 y 4,2 px/s, de a una celda) y respiran (±18 % de opacidad). Al hacer scroll suben al 6 % de la velocidad de la página. Van detrás de las estrellas.
- **Asteroides:** 6 rocas (3 bajo 720px, al 60 % del tamaño) en los márgenes, de 4 a 8 celdas de radio. Cada una toma un color de la paleta en orden: la cara iluminada mezcla el color con blanco al 40 % y la sombra con negro al 35 %. La luz viene de arriba a la izquierda. Tienen borde irregular y dos cráteres que giran con la roca (0,07 a 0,16 rad/s), flotan ±6px y se mueven con la página al 90 % de su velocidad. Van delante de las estrellas y detrás del contenido.
- **Dónde vive:** `layout/sky-matter.ts`, dibujado por `star-sky.ts` en su mismo canvas y su mismo cuadro. Cada capa de gas se pinta una vez en un canvas aparte y en cada cuadro solo se copia. Nada se dibuja sobre el hero y con `prefers-reduced-motion` queda quieto.

## Alternativas consideradas
- **Un canvas aparte para el gas y los asteroides:** otro bucle de cuadros y otra capa que componer; en el mismo canvas no cuesta más.
- **Gas con degradados o `filter: blur`:** se sale de la grilla de puntos, y el blur animado es lo que la nota de [rendimiento](../02-arquitectura/rendimiento.md) prohíbe.
- **Asteroides grises** (primera versión): el autor pidió la paleta.

## Consecuencias
- El chunk diferido del cielo pasa de 3,0 a 4,4 KB gzip.
- Medido contra `develop` (Edge headless con GPU, mediana de 5 corridas intercaladas, ver [rendimiento](../02-arquitectura/rendimiento.md#cielo-con-gas-y-asteroides-172)): en escritorio el hilo principal trabaja entre 3 y 18 % menos, porque las 400 estrellas que salen ahorran más de lo que cuestan el gas y los asteroides. En celular (CPU 4× más lenta) queda igual dentro del ruido. No se midió el costo en la GPU.
