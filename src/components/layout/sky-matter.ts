/**
 * Gas estelar y asteroides del cielo (#172, decisión 024). Los dibuja `star-sky.ts` en su mismo
 * canvas y su mismo cuadro: el gas detrás de las estrellas y los asteroides delante. Todo vive en
 * la grilla de puntos (CELL) con la paleta, como el resto del cielo (decisión 008).
 * - Gas: nubes de puntos tenues que se desplazan de lado, en dos capas a distinta velocidad para
 *   que se revuelvan, y suben un poco con el scroll. Cada capa se pinta una vez en un canvas
 *   aparte y en cada cuadro solo se copia.
 * - Asteroides: rocas de puntos en los márgenes, cada una con un color de la paleta, con luz de un lado y cráteres, que giran lento y
 *   se mueven con la página, algo más lento que el contenido.
 */
import { mixRgb } from '../../lib/constellation';
import { CELL, canvasDpr, hash, type Rgb } from '../../lib/scene';

/** Una celda del gas: su posición en la nube y su densidad (0..1). */
export interface GasCell {
  x: number;
  y: number;
  d: number;
}

/** Una celda de un asteroide, relativa a su centro, y cuánta luz recibe (0..1). */
export interface RockCell {
  x: number;
  y: number;
  light: number;
}

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Ruido de valor suave en celdas: `scale` celdas entre cada nodo de la grilla de ruido. */
function noise(x: number, y: number, seed: number, scale: number): number {
  const gx = x / scale,
    gy = y / scale;
  const x0 = Math.floor(gx),
    y0 = Math.floor(gy);
  const tx = smoothstep(gx - x0),
    ty = smoothstep(gy - y0);
  const v = (i: number, j: number) => hash(x0 + i + seed * 131, y0 + j + seed * 71);
  const top = v(0, 0) + (v(1, 0) - v(0, 0)) * tx;
  const bottom = v(0, 1) + (v(1, 1) - v(0, 1)) * tx;
  return top + (bottom - top) * ty;
}

/**
 * Celdas de una nube de `cols` × `rows` celdas: ruido en dos escalas que se apaga hacia el borde
 * de una elipse. Solo quedan las celdas con densidad sobre `threshold`, y de esas, menos donde
 * la densidad es baja.
 */
export function gasCells(seed: number, cols: number, rows: number, threshold = 0.42): GasCell[] {
  const cells: GasCell[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const ex = (x / (cols - 1)) * 2 - 1,
        ey = (y / (rows - 1)) * 2 - 1;
      const falloff = 1 - Math.min(1, Math.hypot(ex, ey));
      if (falloff <= 0) continue;
      const n = noise(x, y, seed, 9) * 0.65 + noise(x, y, seed + 7, 4) * 0.35;
      const d = n * Math.sqrt(falloff) * 1.35;
      if (d <= threshold) continue;
      const k = Math.min(1, (d - threshold) / (1 - threshold));
      // Ralo y al azar donde hay poco gas: así no parece una trama de impresión.
      if (hash(x + seed * 977, y + seed * 389) > 0.25 + k * 0.6) continue;
      cells.push({ x, y, d: k });
    }
  }
  return cells;
}

/**
 * Celdas de un asteroide de radio `radius` celdas, girado `angle` radianes: un disco con el borde
 * irregular y dos cráteres, que giran con la roca. La luz viene de arriba a la izquierda y no gira.
 */
export function rockCells(seed: number, radius: number, angle: number): RockCell[] {
  const cells: RockCell[] = [];
  const cos = Math.cos(-angle),
    sin = Math.sin(-angle);
  const lump = (a: number) =>
    0.78 + 0.14 * Math.sin(3 * a + seed * 6.1) + 0.08 * Math.sin(5 * a + seed * 2.3);
  const craters = [0, 1].map((k) => ({
    x: (hash(seed, k) - 0.5) * radius,
    y: (hash(seed, k + 5) - 0.5) * radius,
    r: radius * (0.22 + hash(seed, k + 9) * 0.15),
  }));
  const reach = Math.ceil(radius);
  for (let y = -reach; y <= reach; y++) {
    for (let x = -reach; x <= reach; x++) {
      // La forma se mira en las coordenadas de la roca, que gira.
      const px = x * cos - y * sin,
        py = x * sin + y * cos;
      if (Math.hypot(px, py) > radius * lump(Math.atan2(py, px))) continue;
      const lit = (-(x * 0.6) - y * 0.8) / radius;
      let light = Math.max(0, Math.min(1, 0.5 + lit * 0.5));
      if (craters.some((c) => Math.hypot(px - c.x, py - c.y) < c.r)) light *= 0.45;
      cells.push({ x, y, light });
    }
  }
  return cells;
}

interface Cloud {
  /** Posición de reposo, en fracción de la ventana (la esquina superior izquierda). */
  fx: number;
  fy: number;
  layers: { image: HTMLCanvasElement; speed: number }[];
  width: number;
  height: number;
  phase: number;
}

interface Rock {
  /** Lado de la página (-1 izquierda, 1 derecha), dónde dentro del margen y a qué altura. */
  side: -1 | 1;
  inset: number;
  v: number;
  radius: number;
  seed: number;
  spin: number;
  /** Color de la cara iluminada y de la sombra: un color de la paleta, aclarado y oscurecido. */
  lit: string;
  shade: string;
}

/** Cuánto sube el gas por cada px de scroll: mucho menos que la página, así parece lejano. */
const GAS_PARALLAX = 0.06;
/** Los asteroides van un poco más lento que el contenido: quedan detrás, pero cerca. */
const ROCK_PARALLAX = 0.9;
const GAS_RADII = [0.7, 1.1, 1.6];

export function createMatter(colors: [Rgb, Rgb, Rgb], reducedMotion: boolean) {
  let clouds: Cloud[] = [];
  let rocks: Rock[] = [];
  let pageHeight = 0;
  let measuredAt = -Infinity;

  /** Pinta una capa de nube una sola vez en su propio canvas. */
  const paintLayer = (cells: GasCell[], cols: number, rows: number, color: Rgb) => {
    const dpr = canvasDpr();
    const image = document.createElement('canvas');
    image.width = Math.ceil(cols * CELL * dpr);
    image.height = Math.ceil(rows * CELL * dpr);
    const g = image.getContext('2d')!;
    g.scale(dpr, dpr);
    g.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
    for (const c of cells) {
      g.globalAlpha = 0.12 + c.d * 0.33;
      g.beginPath();
      g.arc(
        (c.x + 0.5) * CELL,
        (c.y + 0.5) * CELL,
        GAS_RADII[c.d > 0.66 ? 2 : c.d > 0.33 ? 1 : 0],
        0,
        Math.PI * 2,
      );
      g.fill();
    }
    return image;
  };

  /** Rehace las nubes y los asteroides para un ancho de ventana (al montar y al cambiar el ancho). */
  const build = (width: number) => {
    const narrow = width < 720;
    const specs = [
      { fx: 0.62, fy: 0.08, w: 0.55, color: 1 },
      { fx: -0.05, fy: 0.45, w: 0.5, color: 0 },
      { fx: 0.55, fy: 0.72, w: 0.45, color: 2 },
    ].slice(0, narrow ? 2 : 3);
    clouds = specs.map((s, i) => {
      const cols = Math.round((width * (narrow ? 1.1 : s.w)) / CELL);
      const rows = Math.round(cols * 0.5);
      const color = colors[s.color];
      return {
        fx: s.fx,
        fy: s.fy,
        width: cols * CELL,
        height: rows * CELL,
        phase: i * 2.1,
        // Dos capas con semillas distintas que se desplazan a distinta velocidad.
        layers: [
          { image: paintLayer(gasCells(i * 3 + 1, cols, rows), cols, rows, color), speed: 2.4 },
          {
            image: paintLayer(gasCells(i * 3 + 2, cols, rows, 0.5), cols, rows, color),
            speed: 4.2,
          },
        ],
      };
    });
    const all: Omit<Rock, 'lit' | 'shade'>[] = [
      { side: 1, inset: 0.5, v: 0.2, radius: 7, seed: 1, spin: 0.09 },
      { side: -1, inset: 0.45, v: 0.33, radius: 4.5, seed: 2, spin: -0.14 },
      { side: 1, inset: 0.7, v: 0.47, radius: 5.5, seed: 3, spin: 0.11 },
      { side: -1, inset: 0.6, v: 0.62, radius: 8, seed: 4, spin: -0.07 },
      { side: 1, inset: 0.35, v: 0.76, radius: 4, seed: 5, spin: 0.16 },
      { side: -1, inset: 0.5, v: 0.88, radius: 6, seed: 6, spin: 0.1 },
    ];
    const rgb = (c: Rgb) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
    // Cada roca toma un color de la paleta, en orden (#172).
    const painted = all.map((r, i) => {
      const c = colors[i % 3];
      return {
        ...r,
        lit: rgb(mixRgb(c, [237, 237, 237], 0.4)),
        shade: rgb(mixRgb(c, [0, 0, 0], 0.35)),
      };
    });
    rocks = narrow
      ? painted.filter((_, i) => i % 2 === 0).map((r) => ({ ...r, radius: r.radius * 0.6 }))
      : painted;
    pageHeight = document.documentElement.scrollHeight;
  };

  /** Gas: detrás de las estrellas. `top` es desde dónde se dibuja (bajo el hero). */
  const drawGas = (
    ctx: CanvasRenderingContext2D,
    time: number,
    width: number,
    sky: number,
    top: number,
  ) => {
    const t = reducedMotion ? 0 : time;
    for (const cloud of clouds) {
      const breathe = reducedMotion ? 1 : 0.82 + 0.18 * Math.sin(t * 0.35 + cloud.phase);
      const spanY = sky + cloud.height;
      let y = cloud.fy * sky - scrollY * GAS_PARALLAX;
      y = ((((y + cloud.height) % spanY) + spanY) % spanY) - cloud.height;
      if (y + cloud.height < top) continue;
      for (const layer of cloud.layers) {
        const spanX = width + cloud.width;
        let x = cloud.fx * width + t * layer.speed;
        x = ((((x + cloud.width) % spanX) + spanX) % spanX) - cloud.width;
        // Se mueve de a una celda: el gas sigue en la grilla.
        ctx.globalAlpha = breathe;
        ctx.drawImage(
          layer.image,
          Math.round(x / CELL) * CELL,
          Math.round(y / CELL) * CELL,
          cloud.width,
          cloud.height,
        );
      }
    }
    ctx.globalAlpha = 1;
  };

  /** Asteroides: delante de las estrellas, en los márgenes de la página. */
  const drawRocks = (
    ctx: CanvasRenderingContext2D,
    time: number,
    width: number,
    height: number,
    top: number,
  ) => {
    const t = reducedMotion ? 0 : time;
    // El alto de la página cambia al abrir detalles o logros: se vuelve a leer una vez por segundo.
    if (time - measuredAt > 1 || reducedMotion) {
      pageHeight = document.documentElement.scrollHeight;
      measuredAt = time;
    }
    const gutter = Math.max(16, (width - 1200) / 2 + 40);
    for (const rock of rocks) {
      const r = rock.radius * CELL;
      const cx = rock.side < 0 ? gutter * rock.inset : width - gutter * rock.inset;
      const cy = rock.v * pageHeight - scrollY * ROCK_PARALLAX + Math.sin(t * 0.4 + rock.seed) * 6;
      if (cy + r < Math.max(0, top) || cy - r > height) continue;
      const ox = Math.floor(cx / CELL) * CELL + CELL / 2,
        oy = Math.floor(cy / CELL) * CELL + CELL / 2;
      for (const c of rockCells(rock.seed, rock.radius, rock.seed + t * rock.spin)) {
        const y = oy + c.y * CELL;
        if (y < top) continue;
        ctx.globalAlpha = 0.25 + c.light * 0.65;
        ctx.fillStyle = c.light > 0.55 ? rock.lit : rock.shade;
        ctx.beginPath();
        ctx.arc(ox + c.x * CELL, y, c.light > 0.7 ? 2.2 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  };

  return { build, drawGas, drawRocks };
}
