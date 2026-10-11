/**
 * Dibujos en puntos de las áreas del bento (#133): código (`dev`), las barras de Colchagua
 * (`datos`), una red (`infra`) y monitos que se pasan tareas (`agentes`). Todo en la grilla de
 * celdas de 6px (decisión 008), en un solo bucle que se pausa con el bento fuera de pantalla.
 * Con movimiento reducido se dibuja una vez, quieto.
 */

import { CELL, canvasDpr, readPalette } from '../../../lib/scene';

type Kind = 'dev' | 'datos' | 'infra' | 'agentes';
type Cell = [number, number];

interface Dot {
  x: number;
  y: number;
  color: string;
  size: number;
  alpha: number;
  cursor?: boolean;
  /** Altura relativa dentro de una barra (0 abajo, 1 arriba): la barra respira de abajo arriba. */
  rise?: number;
}

interface Art {
  kind: Kind;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dots: Dot[];
  links: Cell[][];
  agents?: { orch: Cell; workers: Cell[] };
}

/** Monito de 5×5 celdas: `x` cuerpo, `e` ojo. */
const SPRITE = ['..x..', '.xxx.', 'xexex', '.xxx.', '.x.x.'];
/** Ciclo de una tarea de los agentes (ms): baja, trabaja, sube el resultado. */
const TASK_MS = 2600;

const hash = (x: number, y: number) => {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

export function mountArt(section: HTMLElement, { reducedMotion }: { reducedMotion: boolean }) {
  const style = getComputedStyle(document.documentElement);
  const token = (name: string) => style.getPropertyValue(name).trim();
  const fg = token('--color-fg');
  const soft = token('--color-soft');
  const muted = token('--color-muted');
  const palette = readPalette().map(([r, g, b]) => `rgb(${r} ${g} ${b})`);
  const canvases = [...section.querySelectorAll<HTMLCanvasElement>('[data-bento-art]')];
  let arts: Art[] = [];

  const build = (canvas: HTMLCanvasElement): Art | null => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const { width, height } = canvas.getBoundingClientRect();
    const dpr = canvasDpr();
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = Math.floor(width / CELL);
    const rows = Math.floor(height / CELL);
    const kind = canvas.dataset.bentoArt as Kind;
    const dots: Dot[] = [];
    const links: Cell[][] = [];
    const put = (x: number, y: number, color: string, size = 1.1, alpha = 0.8, extra = {}) => {
      if (x >= 0 && y >= 0 && x < cols && y < rows)
        dots.push({ x, y, color, size, alpha, ...extra });
    };
    const art: Art = { kind, canvas, ctx, width, height, dots, links };

    if (kind === 'dev') {
      // Bloques de código: sangría, palabra clave en color, el resto en blanco; cursor al final.
      const lines = [
        [0, 3, 7],
        [2, 4, 10],
        [4, 2, 6],
        [4, 5, 9],
        [6, 3, 12],
        [4, 2, 4],
        [2, 0, 1],
        [2, 4, 8],
        [4, 3, 11],
        [2, 0, 1],
        [0, 0, 1],
      ];
      const step = Math.max(1, Math.floor(rows / (lines.length + 1)));
      lines.forEach(([indent = 0, keyword = 0, rest = 0], i) => {
        const y = 1 + i * step;
        let x = 1 + indent;
        for (let k = 0; k < keyword; k++)
          put(x++, y, i % 3 === 0 ? palette[1] : palette[0], 1.3, 0.95);
        if (keyword) x++;
        for (let k = 0; k < rest && x < cols - 2; k++) put(x++, y, fg, 1, 0.55 + 0.3 * hash(k, i));
        if (i === lines.length - 1)
          for (let k = 0; k < 2; k++) put(x + 1 + k, y, fg, 1.5, 1, { cursor: true });
      });
    } else if (kind === 'datos') {
      // Superficie frutal de Colchagua (cases.json): el cerezo con la paleta, el resto en blanco.
      const values = JSON.parse(canvas.dataset.values ?? '[]') as number[];
      const max = Math.max(1, ...values);
      const barWidth = Math.max(1, Math.floor((cols - 2) / (Math.max(1, values.length) * 2)));
      const base = rows - 2;
      values.forEach((value, i) => {
        const h = Math.max(1, Math.round((value / max) * (rows - 4)));
        const x0 = 1 + i * barWidth * 2;
        for (let y = 0; y < h; y++)
          for (let k = 0; k < barWidth; k++) {
            const color = i === 0 ? palette[Math.min(2, Math.floor((y / h) * 3))] : fg;
            put(x0 + k, base - y, color ?? fg, i === 0 ? 1.4 : 1, i === 0 ? 0.95 : 0.4, {
              rise: y / h,
            });
          }
      });
      for (let x = 0; x < cols; x += 2) put(x, base + 1, muted, 0.8, 0.5);
    } else if (kind === 'infra') {
      // Red: un servidor al centro, equipos alrededor, enlaces punteados y paquetes que viajan.
      const cx = Math.floor(cols / 2);
      const cy = Math.floor(rows / 2);
      const nodes: Cell[] = [
        [cx - Math.floor(cols * 0.36), cy - Math.floor(rows * 0.3)],
        [cx + Math.floor(cols * 0.36), cy - Math.floor(rows * 0.3)],
        [cx - Math.floor(cols * 0.4), cy + Math.floor(rows * 0.28)],
        [cx + Math.floor(cols * 0.4), cy + Math.floor(rows * 0.28)],
        [cx, cy - Math.floor(rows * 0.42)],
      ];
      for (const [nx, ny] of nodes) {
        const n = Math.max(1, Math.abs(nx - cx), Math.abs(ny - cy));
        const path: Cell[] = [];
        for (let s = 0; s <= n; s++) {
          const x = Math.round(cx + ((nx - cx) * s) / n);
          const y = Math.round(cy + ((ny - cy) * s) / n);
          path.push([x, y]);
          if (s % 2 === 0) put(x, y, muted, 0.8, 0.45);
        }
        links.push(path);
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) put(nx + dx, ny + dy, fg, 1.1, 0.85);
      }
      for (let dy = -2; dy <= 2; dy++)
        for (let dx = -2; dx <= 2; dx++)
          put(cx + dx, cy + dy, Math.abs(dy) === 2 ? (palette[2] ?? fg) : fg, 1.3, 0.95);
    } else {
      // Monitos: un orquestador arriba reparte tareas a tres agentes y recibe sus resultados.
      const workers = [0.2, 0.5, 0.8].map((f): Cell => [Math.round(cols * f) - 2, rows - 6]);
      art.agents = { orch: [Math.round(cols / 2) - 2, 0], workers };
    }
    return art;
  };

  const circle = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    ctx.beginPath();
    ctx.arc(x * CELL + CELL / 2, y * CELL + CELL / 2, r, 0, Math.PI * 2);
    ctx.fill();
  };

  const sprite = (
    ctx: CanvasRenderingContext2D,
    [x, y]: Cell,
    body: string,
    eye: string,
    blink: boolean,
  ) => {
    SPRITE.forEach((row, r) =>
      [...row].forEach((ch, c) => {
        if (ch === '.' || (ch === 'e' && blink)) return;
        ctx.globalAlpha = ch === 'e' ? 1 : 0.85;
        ctx.fillStyle = ch === 'e' ? eye : body;
        circle(ctx, x + c, y + r, ch === 'e' ? 1.6 : 1.25);
      }),
    );
  };

  const drawAgents = (art: Art, t: number) => {
    const { ctx, agents } = art;
    if (!agents) return;
    const { orch, workers } = agents;
    const from: Cell = [orch[0] + 2, orch[1] + 5];
    let orchBlink = !reducedMotion && t % 3100 < 140 && Math.floor(t / 3100) % 3 === 0;
    workers.forEach(([wx, wy], i) => {
      const to: Cell = [wx + 2, wy - 1];
      const n = Math.max(1, Math.abs(to[0] - from[0]), Math.abs(to[1] - from[1]));
      const at = (s: number): Cell => [
        Math.round(from[0] + ((to[0] - from[0]) * s) / n),
        Math.round(from[1] + ((to[1] - from[1]) * s) / n),
      ];
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = muted;
      for (let s = 0; s <= n; s += 2) circle(ctx, ...at(s), 0.8);
      const color = palette[i % 3] ?? fg;
      let hop = 0;
      let eyes = color;
      const packet = (k: number, c: string) => {
        ctx.globalAlpha = 1;
        ctx.fillStyle = c;
        circle(ctx, ...at(Math.round(k * n)), 1.9);
      };
      if (!reducedMotion) {
        const u = ((t + i * 860) % TASK_MS) / TASK_MS;
        if (u < 0.35)
          packet(u / 0.35, color); // la tarea baja al agente
        else if (u < 0.6) {
          // trabaja: salta y se le encienden los ojos
          hop = Math.sin(((u - 0.35) / 0.25) * Math.PI * 4) > 0.3 ? -1 : 0;
          eyes = fg;
        } else if (u < 0.9)
          packet(1 - (u - 0.6) / 0.3, fg); // el resultado sube
        else orchBlink ||= u < 0.93;
      }
      sprite(ctx, [wx, wy + hop], soft, eyes, false);
    });
    sprite(ctx, orch, fg, palette[1] ?? fg, orchBlink);
  };

  const draw = (t: number) => {
    for (const art of arts) {
      const { ctx } = art;
      ctx.clearRect(0, 0, art.width, art.height);
      for (const d of art.dots) {
        let alpha = d.alpha;
        if (d.cursor) alpha = reducedMotion || Math.floor(t / 530) % 2 === 0 ? 1 : 0;
        if (d.rise !== undefined && !reducedMotion)
          alpha *= 0.75 + 0.25 * Math.sin(t / 900 - d.rise * 4);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = d.color;
        circle(ctx, d.x, d.y, d.size);
      }
      if (!reducedMotion)
        art.links.forEach((path, i) => {
          const k = Math.floor((t / 90 + i * 7) % (path.length * 1.6));
          const cell = path[k];
          if (!cell) return;
          ctx.globalAlpha = 1;
          ctx.fillStyle = palette[i % 3] ?? fg;
          circle(ctx, cell[0], cell[1], 1.8);
        });
      drawAgents(art, t);
      ctx.globalAlpha = 1;
    }
  };

  const rebuild = () => {
    arts = canvases.map(build).filter((art): art is Art => art !== null);
    draw(performance.now());
  };

  let visible = false;
  let frame = 0;
  const loop = (now: number) => {
    draw(now);
    frame = visible ? requestAnimationFrame(loop) : 0;
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting && !reducedMotion;
    if (visible && !frame) frame = requestAnimationFrame(loop);
  });

  let width = innerWidth;
  const onResize = () => {
    if (innerWidth === width) return;
    width = innerWidth;
    rebuild();
  };

  rebuild();
  observer.observe(section);
  addEventListener('resize', onResize);
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    removeEventListener('resize', onResize);
  };
}
