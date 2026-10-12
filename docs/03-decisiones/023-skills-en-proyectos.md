---
tags: [decision, diseno, movimiento, contenido]
estado: Aceptada
fecha: 2026-10-12
---

# 023 · Skills dentro de Proyectos: lista y detalle con pipeline

Reemplaza en parte a la [decisión 009](009-cinematica-constelaciones.md): sale la sección Skills y con ella su constelación `#`.

## Contexto
La sección Skills listaba unas 50 herramientas en 8 grupos, sin decir dónde se usó cada una. El autor vio una idea en YouTube y la propuso: mostrar las skills dentro de cada proyecto y, al hacer clic en una, ver en qué parte del proyecto se usó. Así se ahorra la sección y el espacio va a lo que aporta valor (#162).

La rúbrica (B1) pide "competencias y stack visibles" y una "sección de perfil profesional (rol, competencias BI, stack)", pero no fija el formato. El stack principal ya está en el bento (tarjeta Stack) y las competencias de BI (Python, pandas, scikit-learn, Power BI, DAX, Jupyter) se ven en Colchagua, que es el primer proyecto y viene abierto.

Se decidió en el laboratorio "Skills en Proyectos" con la skill `prototipo-artifact`, en tres rondas: cómo mostrar dónde se usó, la forma de la tarjeta y las animaciones.

## Decisión
- **Pipeline:** cada proyecto declara sus etapas (`steps`) y cada skill las etapas donde se usó (`uses`), con lo que se hizo y, si hay, un enlace (los notebooks y el `.pbix` de Colchagua). Las etapas se dibujan como una línea de puntos; al elegir una skill se encienden las suyas con la paleta y se abre el texto de cada una.
- **Lista y detalle:** a la izquierda, la lista de proyectos con miniatura, título, año y los logos de sus skills; a la derecha, el proyecto elegido con portada, texto, skills y pipeline. Desde 861 px el detalle queda fijo (`sticky`) mientras se recorre la lista; en celular se abre bajo su proyecto, como un acordeón.
- **Skills solo con logo** (simple-icons, como el resto del sitio). El nombre va en `title` y para lectores de pantalla. Las que no tienen logo (DAX, Textual, OAuth 2.0, LoRa, Wi-Fi Direct, redes mesh) muestran su nombre.
- **Animación al cambiar de proyecto, "Transformar":** View Transitions del navegador. La miniatura del proyecto elegido crece hasta ser la portada del detalle y la anterior vuelve a la lista; el resaltado de la lista se desliza al elegido y el texto entra 130 ms después. 520 ms, `ease-out-expo`.
- **Animación al elegir una skill, "Señal":** un punto baja por la línea de puntos con la curva `cubic-bezier(.45, 0, .2, 1)` y enciende cada etapa cuando pasa por ella (el punto crece a 2,2× y vuelve a 1,45×, 420 ms). Al llegar, se abren los textos uno tras otro (55 ms entre cada uno). Dura 420 ms como mínimo y unos 8,5 ms por píxel de recorrido.
- Valores de los ajustes del laboratorio: velocidad, retraso entre etapas y color del resaltado al 100 %.
- Los proyectos con caso de estudio van primero entre los destacados: Colchagua es el que viene abierto.
- `skills.json` queda como catálogo de íconos por nombre: lo usan la tarjeta Stack del bento y las skills de los proyectos. Una skill que no está ahí trae su `icon` en `projects.json`.

## Alternativas consideradas
- **Cómo mostrar dónde se usó:** un desplegable bajo los chips (A) y una terminal que hace `grep` de la skill y tapa la tarjeta (B). El autor eligió el pipeline (C) porque cuenta el proceso.
- **Forma de la tarjeta:** cada proyecto en una fila ancha con el pipeline como tercera columna, que ocupaba mucho alto, y tarjetas compactas que se abren a lo ancho. El autor eligió lista y detalle con solo logos, la más compacta.
- **Animaciones:** "Deslizar" y "Fundido" para el cambio de proyecto; "Cascada" y "Juntas" para el pipeline.
- **Dejar la sección Skills:** descartado por el autor; la rúbrica no exige una sección propia.

## Consecuencias
- `projects.json` cambia `tags` por `steps` y `skills[] { name, icon?, uses[] { step, text?, href? } }`. El schema valida que cada `step` de una skill esté en `steps`.
- Sale la sección Skills: su componente, el enlace de la nav, la constelación `#` y sus textos de `site.json`. Las herramientas que no están en ningún proyecto (Microsoft 365, Linux, Windows Server y el grupo "En aprendizaje") ya no aparecen en el home, salvo las del stack del bento y las de Experiencia.
- Sin View Transitions (Firefox antes de la 144 y navegadores viejos), el detalle cambia sin animación; con `prefers-reduced-motion` no se anima nada. El contenido nunca espera a la animación: los estados se aplican al tiro.
- Sin JS se ve el primer proyecto abierto y las etapas de cada pipeline, sin poder elegir otro.
- Los textos de cada etapa salieron de las descripciones y los notebooks. Los de Placilla y Noneto, y los de DAX, mpv y Tailwind, los confirma el autor.
