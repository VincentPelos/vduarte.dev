---
tags: [decision, diseno, movimiento]
estado: Aceptada
fecha: 2026-10-11
---

# 021 · Bento de áreas que se arma con los puntos del agujero

Reemplaza en parte a la [decisión 009](009-cinematica-constelaciones.md): Sobre mí deja de tener constelación. Se apoya en la [decisión 018](018-caida-al-agujero.md).

## Contexto
El primer bento tenía mucho texto, se veía genérico y le faltaba vida (#133). En un grill el autor fijó que debía contar su perfil híbrido en cinco segundos, seguir siendo una grilla con más lenguaje de terminal y puntos, y sentirse como la continuación del hero. Sacó las tarjetas de hora, Sonando, Jugando y la constelación. En el laboratorio eligió la dirección de **áreas protagonistas**; después cambió la mini terminal por una cuarta área de agentes de IA, porque está experimentando con ellos. También eligió: botón principal a GitHub, stack solo con logos y armado con duración 100 %, puntos 20 % y desorden 100 %. En celular pidió las tarjetas de a dos para acortar el scroll.

## Decisión
- El bento muestra la frase (`bio`), Estado, cuatro áreas (`bento.areas` en `site.json`), el stack en logos y Encuéntrame. Cada área es un enlace a su prueba: proyectos, el caso Colchagua, la experiencia y `/uso-de-ia`.
- Cada área tiene un dibujo en puntos (`about/bento-art.ts`). El de `~/datos` lee las barras reales del caso en `cases.json`. Se pausa fuera de pantalla y queda quieto con movimiento reducido.
- **Armado** (`about/bento-assemble.ts`): la caída avisa con `hero:fall`, `hero:land` y `hero:landed`. Al empezar, las tarjetas se esconden; cuando la caída termina y el portafolio empieza a subir (`hero:land`), los puntos salen del agujero y las dibujan, sin esperar a que termine de subir (el autor notó que tardaba mucho en empezar). Una vez por visita. Las tarjetas vuelven por temporizador aunque el cuadro se detenga, y a los 4 s si el aterrizaje no llega.
- **Vidrio al 50 %:** las tarjetas del bento llevan la mitad del vidrio de las demás (`--glass` a la mitad, blur 10px) sobre los brillos de siempre. En el laboratorio se probaron fondos en puntos detrás del bento (un teseracto, la biblioteca de Interstellar, una terminal gigante); el autor se quedó con los brillos.
- Sin la tarjeta de la constelación, Sobre mí sale de la cinemática: las estrellas que escapan del agujero van directo a la línea de Experiencia.
- Dos columnas hasta 900px, también en celular; cuatro desde 901px.

## Alternativas consideradas
- **Mini terminal jugable** (como tarjeta grande o chica): gustó, pero el autor prefirió mostrar los agentes de IA.
- **Mantener la constelación «@»** en otra tarjeta: el armado cumple ese papel.
- **Logos con nombre:** el autor eligió solo logos; el nombre queda en el `title` y para lectores de pantalla.

## Consecuencias
- `nowPlaying` y `nowGaming` quedaron sin mostrarse y se eliminaron de `site.json` y del schema (#148).
- `lib/time.ts` y el ícono animado de Sonando se eliminaron.
- Las tarjetas del bento no usan reveal: se animan con el armado o ya están visibles.
