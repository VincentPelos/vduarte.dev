/**
 * Cinemática de constelaciones (decisión 009): un cielo de estrellas de terminal fijo detrás de
 * la página. En cada sección las estrellas forman su símbolo y, al hacer scroll, viajan en arco
 * al siguiente. Desde el hero, las estrellas de la primera constelación escapan del disco del
 * agujero negro.
 *
 * Marcado que lee en el DOM:
 * - `[data-constellation-section="nombre"]`: secciones, en orden.
 * - `[data-constellation="nombre"]`: dónde se dibuja el símbolo de esa sección.
 *   - Experiencia (`data-constellation-mode="timeline"`): el símbolo arriba y una línea de
 *     estrellas que baja; `[data-constellation-mark]` marca cada trabajo.
 *   - `data-constellation-replace`: el elemento es un carácter del texto que las estrellas
 *     reemplazan (el texto queda transparente pero sigue ahí).
 */
import {
  diskColor,
  evenly,
  mixRgb,
  palette,
  segment,
  smooth,
  type Rgb,
} from '../../lib/constellation';
import { hole } from '../../lib/hole';
import { CELL, fitCanvas, frameLoop, readPalette, SCENE_FPS } from '../../lib/scene';

interface Options {
  reducedMotion: boolean;
}

interface Star {
  i: number;
  /** Posición de reposo, en fracción de la ventana. */
  x: number;
  y: number;
  level: number;
  color: string;
  delay: number;
  swirl: number;
  orbit: number;
  angle: number;
}

interface Target {
  x: number;
  y: number;
  /** Posición dentro del degradado de color (0..1). */
  hue: number;
  line?: boolean;
}

type Point = [number, number];

/** Lo que se lee del DOM, una sola vez por cuadro. */
interface Layout {
  /** Rectángulo de cada ancla de constelación. */
  rects: Map<string, DOMRect>;
  /** Altura (px de la ventana) de la estrella de cada trabajo en la línea de tiempo. */
  markYs: number[];
  /** Índice del trabajo más cerca del centro de la pantalla. */
  active: number;
  /** Scroll en que cada sección queda centrada. */
  centers: number[];
  heroBottom: number;
}

/** Quieto, el cielo solo cambia por los destellos: basta con ~10 cuadros por segundo. */
const IDLE_FRAME_MS = 100;
/**
 * Orbitando el agujero, a SCENE_FPS (con margen para no saltarse cuadros de 60 Hz). Con scroll se
 * dibuja en cada cuadro: las constelaciones siguen a las secciones.
 */
const ORBIT_FRAME_MS = (1000 / SCENE_FPS) * 0.8;
const RADII = [0.9, 1.5, 2.2];
const TIMELINE_GLYPH = 80;

const rand = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const snap = (v: number) => (Math.floor(v / CELL) + 0.5) * CELL;
const css = (c: Rgb) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
const orbitRadius = (s: Star) => 3.6 + s.orbit * 8;

/** Puntos del símbolo, uno por celda de la grilla: contorno completo y relleno ralo. */
function sampleGlyph(text: string, size: number, limit: number): Point[] {
  const S = 240;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  g.fillStyle = '#fff';
  g.strokeStyle = '#fff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  // el # es chico dentro de su caja y pierde sus huecos con trazo grueso
  const font = text === '#' ? 250 : text.length > 2 ? 100 : text.length > 1 ? 130 : 180;
  g.font = `700 ${font}px "Martian Mono", monospace`;
  g.fillText(text, S / 2, S / 2 + 6);
  if (text !== '#') {
    g.lineWidth = 9;
    g.lineJoin = 'round';
    g.strokeText(text, S / 2, S / 2 + 6);
  }
  const data = g.getImageData(0, 0, S, S).data;
  const on = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < S && y < S && data[(Math.round(y) * S + Math.round(x)) * 4 + 3] > 128;
  const step = (CELL * S) / Math.max(size, 1);
  const edges: Point[] = [];
  const fill: Point[] = [];
  for (let y = 0; y < S; y += step) {
    for (let x = 0; x < S; x += step) {
      if (!on(x, y)) continue;
      const edge = !on(x + step, y) || !on(x - step, y) || !on(x, y + step) || !on(x, y - step);
      (edge ? edges : fill).push([x / S - 0.5, y / S - 0.5]);
    }
  }
  const pts = evenly(edges, limit);
  const rest = evenly(fill, Math.max(0, Math.min(fill.length * 0.3, limit - pts.length)));
  // orden mezclado pero estable: cada estrella tiene un destino fijo
  return [...pts, ...rest]
    .map((p, i) => ({ p, k: rand(i, 21) }))
    .sort((a, b) => a.k - b.k)
    .map(({ p }) => p);
}

export function mount(
  canvas: HTMLCanvasElement,
  symbols: Record<string, string>,
  { reducedMotion }: Options,
): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const sections = [...document.querySelectorAll<HTMLElement>('[data-constellation-section]')];
  const names = sections.map((s) => s.dataset.constellationSection ?? '');
  const anchors = new Map<string, HTMLElement>();
  const modes = new Map<string, 'timeline' | 'replace' | 'glyph'>();
  for (const name of names) {
    const el = document.querySelector<HTMLElement>(`[data-constellation="${name}"]`);
    if (!el || !symbols[name]) continue;
    anchors.set(name, el);
    modes.set(
      name,
      el.dataset.constellationMode === 'timeline'
        ? 'timeline'
        : el.hasAttribute('data-constellation-replace')
          ? 'replace'
          : 'glyph',
    );
  }
  const marks = [...document.querySelectorAll<HTMLElement>('[data-constellation-mark]')];
  const replaced = [...document.querySelectorAll<HTMLElement>('[data-constellation-replace]')];
  for (const el of replaced) {
    el.style.color = 'transparent';
    el.style.webkitTextFillColor = 'transparent';
    el.style.background = 'none';
  }

  const colors = readPalette();
  let width = 0,
    height = 0,
    // Alto del cielo: no sigue al de la ventana cuando en móvil aparece o se esconde la barra
    // del navegador, así las estrellas no saltan al hacer scroll.
    skyHeight = 0,
    stars: Star[] = [];
  const shapes = new Map<string, Point[]>();

  const sizeOf = (name: string, r: DOMRect) => {
    if (modes.get(name) === 'timeline') return TIMELINE_GLYPH;
    if (modes.get(name) === 'replace') return r.height * 1.6;
    return Math.min(r.width, r.height) * 1.15;
  };

  const makeStars = () => {
    const density = Math.min(1.4, (width * height) / (1280 * 800));
    const n = Math.round(1100 * density * (skyHeight / height));
    stars = Array.from({ length: n }, (_, i) => {
      const h = rand(i, 1);
      const tint =
        rand(i, 5) > 0.72 ? colors[Math.floor(rand(i, 6) * 3)] : ([237, 237, 237] as Rgb);
      return {
        i,
        x: rand(i, 2),
        y: rand(i, 3),
        level: h > 0.97 ? 2 : h > 0.85 ? 1 : 0,
        color: css(tint),
        delay: rand(i, 7),
        swirl: rand(i, 8) - 0.5,
        orbit: rand(i, 10),
        angle: rand(i, 11) * Math.PI * 2,
      };
    });
  };

  const buildShapes = () => {
    shapes.clear();
    const limit = Math.floor(stars.length * 0.7);
    for (const [name, el] of anchors) {
      shapes.set(name, sampleGlyph(symbols[name], sizeOf(name, el.getBoundingClientRect()), limit));
    }
  };

  const measure = (): Layout => {
    const rects = new Map<string, DOMRect>();
    for (const [name, el] of anchors) rects.set(name, el.getBoundingClientRect());
    let active = -1,
      dist = Infinity;
    const markYs = marks.map((m, i) => {
      const r = m.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - height / 2);
      if (d < dist) [active, dist] = [i, d];
      return r.top + 34;
    });
    let heroBottom = 0,
      previous = -Infinity;
    const centers = sections.map((sec, i) => {
      const r = sec.getBoundingClientRect();
      // El hero queda pegado arriba (decisión 014): su lugar en la página es siempre el inicio,
      // y lo que tapa es la hoja, que empieza con la sección siguiente.
      if (i === 0) {
        heroBottom = sections[1]?.getBoundingClientRect().top ?? r.bottom;
        previous = r.height / 2 - height / 2;
        return previous;
      }
      // Las estrellas llegan cuando su símbolo queda al centro de la pantalla. En una sección
      // alta (Proyectos), el centro de la sección cae lejos del símbolo y este ya no se ve.
      // La línea de tiempo recorre toda la sección, así que usa la sección entera.
      const anchor = rects.get(names[i]);
      const focus = anchor && modes.get(names[i]) !== 'timeline' ? anchor : r;
      const center = focus.top + scrollY + focus.height / 2 - height / 2;
      // Siempre en orden, aunque un símbolo quede por encima del de la sección anterior.
      previous = Math.max(center, previous + 1);
      return previous;
    });
    return { rects, markYs, active, centers, heroBottom };
  };

  /** Dónde va la estrella `s` en la constelación `name`; null si no participa. */
  const target = (name: string, s: Star, layout: Layout): Target | null => {
    const r = layout.rects.get(name),
      pts = shapes.get(name);
    if (!r || !pts) return null;
    const size = sizeOf(name, r);
    if (modes.get(name) === 'timeline') {
      const x = r.left + 30;
      if (s.i < pts.length) {
        const p = pts[s.i];
        return { x: x + p[0] * size, y: r.top + size * 0.6 + p[1] * size, hue: p[0] + 0.5 };
      }
      const y = r.top + size * 1.3 + (s.i - pts.length) * CELL * 2;
      return y > r.bottom ? null : { x, y, hue: (y - r.top) / r.height, line: true };
    }
    if (s.i >= pts.length) return null;
    const p = pts[s.i];
    return {
      x: r.left + r.width / 2 + p[0] * size,
      y: r.top + r.height / 2 + p[1] * size,
      hue: p[0] + 0.5,
    };
  };

  /** Posición de partida desde el hero: orbitando en el disco y escapando en espiral. */
  const fromHole = (s: Star, progress: number): Target | null => {
    if (!hole.ready) return null;
    const r = orbitRadius(s) * hole.px;
    const a = s.angle + hole.time * 1.8 * Math.pow(orbitRadius(s), -1.5) * 4 + progress * 4;
    const out = 1 + smooth(progress * 1.6 - s.delay * 0.4) * 2.2;
    return {
      x: hole.x + Math.cos(a) * r * out,
      y: hole.y + Math.sin(a) * r * 0.16 * out * (1 + progress * 4),
      hue: 0,
    };
  };

  const dot = (x: number, y: number, level: number, color: string, alpha: number) => {
    if (x < -4 || y < -4 || x > width + 4 || y > height + 4 || alpha <= 0) return;
    ctx.globalAlpha = Math.min(1, alpha);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(snap(x), snap(y), RADII[level], 0, Math.PI * 2);
    ctx.fill();
  };

  let time = 0;
  const twinkle = (i: number) =>
    !reducedMotion && rand(i, Math.floor(time * 1.2 + rand(i, 9) * 9)) > 0.88 ? -1 : 0;

  /** Dibuja un cuadro. Devuelve `true` si el siguiente debe dibujarse aunque no haya scroll. */
  const draw = (): boolean => {
    ctx.clearRect(0, 0, width, height);
    const layout = measure();
    const { from, to, progress } = segment(layout.centers, scrollY);
    const a = names[from],
      b = names[to];
    const { heroBottom } = layout;

    for (const s of stars) {
      const home: Target = { x: s.x * width, y: s.y * skyHeight, hue: 0 };
      const tb = target(b, s, layout);
      let ta = target(a, s, layout);
      const leaving = from === 0 && tb !== null;
      if (leaving) ta = fromHole(s, progress) ?? ta;
      const inA = ta !== null,
        inB = tb !== null;
      const pa = ta ?? home,
        pb = tb ?? home;

      let k: number;
      if (reducedMotion) k = progress > 0.5 ? 1 : 0;
      else if (leaving) k = smooth((progress - 0.25 - s.delay * 0.3) / 0.55);
      else k = smooth((progress - s.delay * 0.35) / 0.65);

      // viaje en arco: se curva hacia un lado y vuelve
      const dx = pb.x - pa.x,
        dy = pb.y - pa.y;
      const arc = reducedMotion ? 0 : Math.sin(Math.PI * k) * s.swirl * 0.9;
      const x = pa.x + dx * k - dy * arc,
        y = pa.y + dy * k + dx * arc;
      const inShape = (k < 0.5 ? inA : inB) || leaving;
      // el cielo de fondo no se dibuja sobre el hero: allí está el del agujero negro
      if (!inShape && y < heroBottom) continue;

      let alpha = inShape ? 0.9 : 0.45;
      let level = inShape ? (s.i % 5 === 0 ? 2 : 1) : s.level;
      let color = s.color;
      if (inShape) {
        const ca = inA && !leaving ? palette(colors, pa.hue) : null;
        const cb = inB ? palette(colors, pb.hue) : null;
        let c = (k < 0.5 ? (ca ?? cb) : (cb ?? ca)) ?? colors[1];
        if (ca && cb) c = mixRgb(ca, cb, k);
        // al salir del hero: color del disco → color de la constelación
        if (leaving && cb)
          c = mixRgb(
            diskColor(colors, orbitRadius(s)),
            cb,
            smooth((progress - 0.15 - s.delay * 0.2) / 0.6),
          );
        color = css(c);
      }
      // el "_" del >_ parpadea como un cursor
      const t = k < 0.5 ? (inA ? ta : null) : tb;
      const name = k < 0.5 ? a : b;
      if (t && !t.line && modes.get(name) === 'timeline') {
        const p = shapes.get(name)?.[s.i];
        if (p && p[1] > 0.08 && p[0] > -0.02 && Math.floor(time * 1.6) % 2) alpha *= 0.15;
      }
      // en la línea de tiempo, la estrella a la altura de cada trabajo es más grande
      if (t?.line) {
        alpha = 0.55;
        level = s.i % 5 === 0 ? 2 : 1;
        layout.markYs.forEach((markY, m) => {
          if (Math.abs(y - markY) < CELL) {
            level = 2;
            alpha = m === layout.active ? 1 : 0.8;
          }
        });
      }
      dot(x, y, Math.max(0, Math.min(2, level + twinkle(s.i))), color, alpha);
    }
    ctx.globalAlpha = 1;
    // Desde el hero, las estrellas orbitan el disco del agujero negro aunque no haya scroll.
    return from === 0 && hole.ready;
  };

  const resize = () => {
    const widthChanged = innerWidth !== width;
    width = innerWidth;
    height = innerHeight;
    fitCanvas(canvas, ctx, width, height);
    // Solo un cambio de ancho (o una ventana más alta que el cielo) rehace las estrellas.
    if (widthChanged || height > skyHeight) {
      skyHeight = Math.max(height, widthChanged ? screen.height || height : height);
      makeStars();
      buildShapes();
    }
    draw();
  };

  let lastDraw = -Infinity,
    lastScroll = Number.NaN,
    animating = true;
  const loop = frameLoop((now, dt) => {
    time += dt;
    const wait = animating ? ORBIT_FRAME_MS : IDLE_FRAME_MS;
    if (scrollY !== lastScroll || now - lastDraw >= wait) {
      animating = draw();
      lastDraw = now;
      lastScroll = scrollY;
    }
  });
  const onScroll = () => draw();

  addEventListener('resize', resize);
  document.fonts?.addEventListener('loadingdone', buildShapes);
  resize();
  if (reducedMotion) addEventListener('scroll', onScroll, { passive: true });
  else loop.start();

  return () => {
    loop.stop();
    removeEventListener('resize', resize);
    removeEventListener('scroll', onScroll);
    document.fonts?.removeEventListener('loadingdone', buildShapes);
    for (const el of replaced) el.removeAttribute('style');
    ctx.clearRect(0, 0, width, height);
  };
}
