---
tags: [diseno, tokens]
actualizado: 2026-10-07
---

# Tokens de diseño

Valores congelados a partir de la [guía visual](guia.html) (abrir en el navegador). Los ajustes finos se hacen durante el desarrollo y se reflejan aquí en el mismo PR.

**Dirección:** negro puro con UI monocroma, al estilo de Tidal y Vercel. El color vive solo en las partículas, en los brillos difuminados detrás del vidrio y en los degradados. Tiene un toque terminal (prompt `whoami`, rutas `src/content/*.json` como etiquetas).

## Color

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#000` | Fondo |
| `--fg` | `#ededed` | Texto principal, botón primario |
| `--muted` | `#8f8f8f` | Texto secundario, labels |
| `--line` | `rgba(255,255,255,.09)` | Bordes finos |
| `--line-hi` | `rgba(255,255,255,.22)` | Bordes en hover |
| `--glass` | `rgba(255,255,255,.045)` | Fondo de tarjetas de vidrio |
| `--glass-hi` | `rgba(255,255,255,.06)` | Vidrio en hover |
| `--ok` | `#3ddc84` | Estado "disponible", trabajo actual |
| `--nav` | `rgba(10,10,10,.6)` | Fondo de la nav píldora (con blur 32px) |

### Paleta "Sangre"

| Token | Valor |
|---|---|
| `--c1` | `#ff0040` |
| `--c2` | `#9b00ff` |
| `--c3` | `#ff8a00` |

Se usa en: partículas (degradado de 3 tonos que se desplaza), brillos de fondo, portada de *Sonando*, estrellas de gacha, barra de progreso, el `?` de "¿Hablamos?" y los gráficos del caso Colchagua.

## Vidrio y brillos

| Token | Valor |
|---|---|
| `--blur` | `20px` (backdrop-filter de las tarjetas, con `saturate(170%)`) |
| `--glow` | `0.2` (multiplica la opacidad de los brillos difuminados) |
| Radio de tarjeta | `18px` |
| Radio de botones, chips, nav | `999px` (píldora) |

## Tipografía

| Rol | Fuente | Uso |
|---|---|---|
| Display | **Martian Mono** 700 | Nombre, títulos de sección, títulos de proyecto |
| Texto | **Geist** 300–700 | Párrafos, botones |
| Utilidad | **Geist Mono** 400–500 | Labels, fechas, chips, nav |

Escala clave: nombre `clamp(2.5rem, 10.5vw, 7.5rem)`, títulos de sección `clamp(2.1rem, 6.5vw, 4.2rem)`, "¿Hablamos?" `clamp(3rem, 13vw, 10rem)`, interletrado negativo (`-0.04em`) en display.

## Layout

- Contenedor máximo `1200px` con gutter `clamp(16px, 4vw, 40px)`.
- Bento "sobre mí": 4 columnas → 2 (≤900px) → 1 (≤460px).
- Proyectos: 3 columnas con `grid-auto-flow: dense`; `featured` ocupa 2.
- Nav: píldora fija abajo y centrada; resalta la sección activa.

## Movimiento

- **Partículas:** malla 150×80 (70×46 en móvil), ondas suaves + onda donde está el mouse, intensidad `100%`, DPR máximo 1.5, pausa fuera de pantalla.
- **Entrada del hero:** nombre letra a letra (stagger 35 ms) y luego rol, tagline y botones.
- **Reveals:** subir 36–40px + fade, 800 ms, `cubic-bezier(.22,1,.36,1)`, stagger 70 ms.
- **Regla:** nada de contenido oculto esperando una animación; `prefers-reduced-motion` apaga todo.

## Accesibilidad

- Contraste AA mínimo sobre negro (`--muted` sobre `--bg` cumple para texto ≥14px).
- Foco visible: outline de 2px `--fg`.
- HTML semántico: `section`, `article`, `nav`, encabezados en orden.
